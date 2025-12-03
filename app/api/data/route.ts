import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

// Types for the processed data
interface GeneData {
  geneName: string;
  cluster?: string;
  function: string;
  species: string[];
  hosts: string[];
  notes?: string;
}

interface CooccurrenceNode {
  id: string;
  count: number;
}

interface CooccurrenceLink {
  source: string;
  target: string;
  count: number;
}

interface SunburstNode {
  name: string;
  children?: SunburstNode[];
  value?: number;
}

interface SankeyNode {
  label: string;
}

interface SankeyLink {
  source: number;
  target: number;
  value: number;
}

interface ProcessedData {
  genes: GeneData[];
  hostStats: Record<string, Record<string, number> & { totalIsolates: number }>;
  hostTotals: Record<string, number>;
  hostPrevalence: Record<string, Record<string, number>>;
  speciesMatrix: Record<string, { jejuni: boolean; coli: boolean }>;
  processes: Record<string, string[]>;
  cooccurrence: {
    nodes: CooccurrenceNode[];
    links: CooccurrenceLink[];
  };
  sunburstHierarchy: SunburstNode;
  sankeyData: {
    nodes: SankeyNode[];
    links: SankeyLink[];
  };
}

// Helper: Map process categories from function names
function categorizeProcess(functionName: string): string {
  const func = functionName.toLowerCase();
  if (func.includes('adhesion') || func.includes('adhere')) return 'adhesion';
  if (func.includes('invasion') || func.includes('invade')) return 'invasion';
  if (func.includes('flagella') || func.includes('fla') || func.includes('motility') || func.includes('mobility')) return 'mobility';
  if (func.includes('toxin') || func.includes('cdt')) return 'toxin';
  if (func.includes('colonization')) return 'colonization';
  if (func.includes('survival')) return 'survival';
  return 'other';
}

// Helper: Normalize host names
function normalizeHost(host: string): string {
  const h = host.toLowerCase().trim();
  if (h.includes('poultry') || h.includes('chicken')) return 'Poultry';
  if (h.includes('cattle') || h.includes('cow') || h.includes('beef')) return 'Cattle';
  if (h.includes('swine') || h.includes('pig')) return 'Swine';
  if (h.includes('human')) return 'Human';
  if (h.includes('multiple') || h.includes('mixed')) return 'Multiple';
  return host || 'Unknown';
}

export async function GET() {
  try {
    // Read Excel file from public directory
    const filePath = path.join(process.cwd(), 'public', 'data', 'campylobacter.xlsx');
    
    // Fallback to alternative path if primary doesn't exist
    let workbook: XLSX.WorkBook;
    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    } else {
      // Try alternative path
      const altPath = path.join(process.cwd(), 'public', 'data', 'campylobacter (1).xlsx');
      if (!fs.existsSync(altPath)) {
        return NextResponse.json(
          { error: 'Excel file not found' },
          { status: 404 }
        );
      }
      const fileBuffer = fs.readFileSync(altPath);
      workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    }

    // Get the first sheet
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[];

    if (data.length === 0) {
      return NextResponse.json(
        { error: 'Excel file is empty' },
        { status: 400 }
      );
    }

    // Extract header row (assuming first row contains headers)
    const headers = (data[0] as string[]).map(h => (h || '').toString().toLowerCase().trim());
    
    // Find column indices
    const geneNameCol = headers.findIndex(h => h.includes('gene') || h.includes('name'));
    const clusterCol = headers.findIndex(h => h.includes('cluster'));
    const functionCol = headers.findIndex(h => h.includes('function') || h.includes('role'));
    const speciesCol = headers.findIndex(h => h.includes('species'));
    const hostCol = headers.findIndex(h => h.includes('host'));
    const notesCol = headers.findIndex(h => h.includes('note') || h.includes('comment'));

    // Process rows (skip header)
    // Track isolates as unique host+species combinations for co-occurrence
    const isolateMap: Record<string, Set<string>> = {}; // key: host+species, value: set of genes
    const genes: GeneData[] = [];
    const hostStats: Record<string, Record<string, number> & { totalIsolates: number }> = {};
    const speciesMatrix: Record<string, { jejuni: boolean; coli: boolean }> = {};
    const processes: Record<string, string[]> = {};
    const geneCounts: Record<string, number> = {}; // Total occurrences per gene

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row || row.length === 0) continue;

      const geneName = (row[geneNameCol] || '').toString().trim();
      if (!geneName) continue;

      const cluster = clusterCol >= 0 ? (row[clusterCol] || '').toString().trim() : undefined;
      const functionName = functionCol >= 0 ? (row[functionCol] || '').toString().trim() : 'Unknown';
      const speciesStr = speciesCol >= 0 ? (row[speciesCol] || '').toString().trim() : '';
      const hostStr = hostCol >= 0 ? (row[hostCol] || '').toString().trim() : '';
      const notes = notesCol >= 0 ? (row[notesCol] || '').toString().trim() : undefined;

      // Parse species (could be comma-separated or single)
      const species = speciesStr
        .split(/[,;]/)
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0)
        .map((s: string) => s.toLowerCase().includes('jejuni') ? 'jejuni' : s.toLowerCase().includes('coli') ? 'coli' : s);

      // Parse hosts (could be comma-separated)
      const hosts = hostStr
        .split(/[,;]/)
        .map((h: string) => normalizeHost(h))
        .filter((h: string) => h.length > 0 && h !== 'Unknown');

      // Store gene data
      genes.push({
        geneName,
        cluster,
        function: functionName,
        species,
        hosts,
        notes,
      });

      // Track gene counts
      geneCounts[geneName] = (geneCounts[geneName] || 0) + 1;

      // Track co-occurrence: create isolate keys from host+species combinations
      const primarySpecies = species.includes('jejuni') ? 'jejuni' : species.includes('coli') ? 'coli' : 'other';
      hosts.forEach((host: string) => {
        const isolateKey = `${host}::${primarySpecies}`;
        if (!isolateMap[isolateKey]) {
          isolateMap[isolateKey] = new Set();
        }
        isolateMap[isolateKey].add(geneName);

        // Update host stats (count occurrences per host)
        if (!hostStats[host]) {
          hostStats[host] = { totalIsolates: 0 };
        }
        hostStats[host][geneName] = (hostStats[host][geneName] || 0) + 1;
        hostStats[host].totalIsolates++;
      });

      // Update species matrix
      if (!speciesMatrix[geneName]) {
        speciesMatrix[geneName] = { jejuni: false, coli: false };
      }
      if (species.includes('jejuni')) {
        speciesMatrix[geneName].jejuni = true;
      }
      if (species.includes('coli')) {
        speciesMatrix[geneName].coli = true;
      }

      // Update processes
      const processName = categorizeProcess(functionName);
      if (!processes[processName]) {
        processes[processName] = [];
      }
      if (!processes[processName].includes(geneName)) {
        processes[processName].push(geneName);
      }
    }

    // Calculate hostTotals and hostPrevalence
    const hostTotals: Record<string, number> = {};
    const hostPrevalence: Record<string, Record<string, number>> = {};
    const hostStatsWithPrevalence: Record<string, any> = {};
    
    Object.keys(hostStats).forEach(host => {
      const stats = hostStats[host];
      const total = stats.totalIsolates;
      hostTotals[host] = total;
      hostPrevalence[host] = {};
      hostStatsWithPrevalence[host] = {
        totalIsolates: total,
        genes: {} as Record<string, number>,
      };
      Object.keys(stats).forEach(key => {
        if (key !== 'totalIsolates') {
          const prevalence = total > 0 
            ? Math.round((stats[key] / total) * 100 * 100) / 100 // Round to 2 decimals
            : 0;
          hostStatsWithPrevalence[host].genes[key] = prevalence;
          hostPrevalence[host][key] = prevalence;
        }
      });
    });

    // Compute co-occurrence (gene pairs that appear together in isolates)
    const cooccurrenceCounts: Record<string, Record<string, number>> = {};
    const minOccurrenceThreshold = 3; // Exclude genes appearing in < 3 isolates
    
    // Filter genes by threshold
    const filteredGenes = Object.keys(geneCounts).filter(gene => geneCounts[gene] >= minOccurrenceThreshold);
    
    // Initialize co-occurrence counts
    filteredGenes.forEach(gene => {
      cooccurrenceCounts[gene] = {};
    });

    // Count co-occurrences
    Object.values(isolateMap).forEach(geneSet => {
      const geneArray = Array.from(geneSet).filter(g => filteredGenes.includes(g));
      for (let i = 0; i < geneArray.length; i++) {
        for (let j = i + 1; j < geneArray.length; j++) {
          const gene1 = geneArray[i];
          const gene2 = geneArray[j];
          cooccurrenceCounts[gene1][gene2] = (cooccurrenceCounts[gene1][gene2] || 0) + 1;
          cooccurrenceCounts[gene2][gene1] = (cooccurrenceCounts[gene2][gene1] || 0) + 1;
        }
      }
    });

    // Build co-occurrence nodes and links
    const cooccurrenceNodes: CooccurrenceNode[] = filteredGenes.map(gene => ({
      id: gene,
      count: geneCounts[gene],
    }));

    const cooccurrenceLinks: CooccurrenceLink[] = [];
    const processedPairs = new Set<string>();
    filteredGenes.forEach(gene1 => {
      Object.keys(cooccurrenceCounts[gene1] || {}).forEach(gene2 => {
        if (filteredGenes.includes(gene2) && gene1 < gene2) {
          const pairKey = `${gene1}::${gene2}`;
          if (!processedPairs.has(pairKey)) {
            processedPairs.add(pairKey);
            const count = cooccurrenceCounts[gene1][gene2] || 0;
            if (count > 0) {
              cooccurrenceLinks.push({
                source: gene1,
                target: gene2,
                count,
              });
            }
          }
        }
      });
    });

    // Build sunburst hierarchy: All isolates -> Species -> Host -> Gene count
    const sunburstData: Record<string, Record<string, number>> = {};
    Object.keys(isolateMap).forEach(isolateKey => {
      const [host, species] = isolateKey.split('::');
      const normalizedSpecies = species === 'jejuni' ? 'C. jejuni' : species === 'coli' ? 'C. coli' : 'Other';
      if (!sunburstData[normalizedSpecies]) {
        sunburstData[normalizedSpecies] = {};
      }
      if (!sunburstData[normalizedSpecies][host]) {
        sunburstData[normalizedSpecies][host] = 0;
      }
      sunburstData[normalizedSpecies][host] += isolateMap[isolateKey].size;
    });

    const sunburstHierarchy: SunburstNode = {
      name: 'All isolates',
      children: Object.keys(sunburstData).map(species => ({
        name: species,
        children: Object.keys(sunburstData[species]).map(host => ({
          name: host,
          value: sunburstData[species][host],
        })),
      })),
    };

    // Build Sankey diagram data: Host -> Top K genes
    const topK = 20;
    const allGeneHostCounts: Array<{ gene: string; total: number }> = [];
    Object.keys(geneCounts).forEach(gene => {
      let total = 0;
      Object.keys(hostStats).forEach(host => {
        total += hostStats[host][gene] || 0;
      });
      allGeneHostCounts.push({ gene, total });
    });
    allGeneHostCounts.sort((a, b) => b.total - a.total);
    const topGenes = allGeneHostCounts.slice(0, topK).map(item => item.gene);

    const sankeyNodes: SankeyNode[] = [];
    const hostIndexMap: Record<string, number> = {};
    const geneIndexMap: Record<string, number> = {};
    
    // Add host nodes
    Object.keys(hostStats).forEach((host, idx) => {
      hostIndexMap[host] = idx;
      sankeyNodes.push({ label: host });
    });
    
    // Add gene nodes
    const geneStartIndex = sankeyNodes.length;
    topGenes.forEach((gene, idx) => {
      geneIndexMap[gene] = geneStartIndex + idx;
      sankeyNodes.push({ label: gene });
    });

    // Build Sankey links
    const sankeyLinks: SankeyLink[] = [];
    Object.keys(hostStats).forEach(host => {
      const hostIdx = hostIndexMap[host];
      topGenes.forEach(gene => {
        const count = hostStats[host][gene] || 0;
        if (count > 0) {
          const geneIdx = geneIndexMap[gene];
          sankeyLinks.push({
            source: hostIdx,
            target: geneIdx,
            value: count,
          });
        }
      });
    });

    const result: ProcessedData = {
      genes,
      hostStats: hostStatsWithPrevalence,
      hostTotals,
      hostPrevalence,
      speciesMatrix,
      processes,
      cooccurrence: {
        nodes: cooccurrenceNodes,
        links: cooccurrenceLinks,
      },
      sunburstHierarchy,
      sankeyData: {
        nodes: sankeyNodes,
        links: sankeyLinks,
      },
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing Excel file:', error);
    return NextResponse.json(
      { error: 'Failed to process Excel file', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

