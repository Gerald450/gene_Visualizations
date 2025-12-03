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

interface ProcessedData {
  genes: GeneData[];
  hostStats: Record<string, Record<string, number> & { totalIsolates: number }>;
  speciesMatrix: Record<string, { jejuni: boolean; coli: boolean }>;
  processes: Record<string, string[]>;
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
    const genes: GeneData[] = [];
    const hostStats: Record<string, Record<string, number> & { totalIsolates: number }> = {};
    const speciesMatrix: Record<string, { jejuni: boolean; coli: boolean }> = {};
    const processes: Record<string, string[]> = {};

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

      // Update host stats (count occurrences per host)
      hosts.forEach((host: string) => {
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

    // Calculate prevalence percentages for hostStats
    const hostStatsWithPrevalence: Record<string, any> = {};
    Object.keys(hostStats).forEach(host => {
      const stats = hostStats[host];
      const total = stats.totalIsolates;
      hostStatsWithPrevalence[host] = {
        totalIsolates: total,
        genes: {} as Record<string, number>,
      };
      Object.keys(stats).forEach(key => {
        if (key !== 'totalIsolates') {
          hostStatsWithPrevalence[host].genes[key] = total > 0 
            ? Math.round((stats[key] / total) * 100 * 100) / 100 // Round to 2 decimals
            : 0;
        }
      });
    });

    const result: ProcessedData = {
      genes,
      hostStats: hostStatsWithPrevalence,
      speciesMatrix,
      processes,
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

