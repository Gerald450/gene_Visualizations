'use client';

import { useState } from 'react';
import { DataProvider } from '@/components/DataProvider';
import Heatmap from '@/components/visualizations/Heatmap';
import CooccurrenceNetwork from '@/components/visualizations/CooccurrenceNetwork';
import SpeciesBarChart from '@/components/visualizations/SpeciesBarChart';
import FunctionPie from '@/components/visualizations/FunctionPie';
import Sunburst from '@/components/visualizations/Sunburst';
import Sankey from '@/components/visualizations/Sankey';
import ControlPanel from '@/components/visualizations/ControlPanel';
import StoryCard from '@/components/StoryCard';

export default function VisualizationsPage() {
  const [topN, setTopN] = useState(20);
  const [showPercent, setShowPercent] = useState(false);
  const [selectedGene, setSelectedGene] = useState<string | null>(null);

  const handleGeneClick = (geneName: string) => {
    setSelectedGene(geneName);
    // Scroll to gene profiles or highlight gene
    const element = document.getElementById('gene-profiles');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetFilters = () => {
    setTopN(20);
    setShowPercent(false);
    setSelectedGene(null);
  };

  return (
    <DataProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Campylobacter Virulence Gene Visualizations
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Explore interactive visualizations of virulence gene data across hosts and species
            </p>
          </div>

          {/* Control Panel */}
          <ControlPanel
            topN={topN}
            showPercent={showPercent}
            onTopNChange={setTopN}
            onShowPercentChange={setShowPercent}
            onResetFilters={handleResetFilters}
          />

          {/* Visualizations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Heatmap */}
            <div className="lg:col-span-2">
              <StoryCard
                title="Gene Prevalence Heatmap"
                desc="Prevalence shows what percentage of bacterial isolates from each host contain a specific gene. Each row represents a gene, each column represents a host association (Poultry, Cattle, Swine, Human, etc.). The color intensity indicates the prevalence percentage, with brighter colors meaning higher prevalence (the gene appears in more isolates), while darker colors mean lower or absent prevalence. This helps identify conserved (core) genes versus host-specific genes. Click on a gene cell to view its profile."
              >
                <Heatmap onGeneClick={handleGeneClick} />
              </StoryCard>
            </div>

            {/* Co-occurrence Network */}
            <div className="lg:col-span-2">
              <StoryCard
                title="Gene Co-Occurrence Network"
                desc="This network visualization shows which virulence genes tend to appear together in the same bacterial isolates. Each circle (node) represents a gene. Larger circles mean the gene appears more frequently. Lines (links) connect genes that co-occur. Thicker lines mean those genes are found together more often. Genes are color-coded by function: red (toxin), blue (adhesion), green (invasion), orange (motility). Hover over nodes to see details, or click to explore specific genes."
              >
                <CooccurrenceNetwork onNodeClick={handleGeneClick} />
              </StoryCard>
            </div>

            {/* Species Bar Chart */}
            <div className="lg:col-span-2">
              <StoryCard
                title="Comparison of Virulence Gene Presence Between Species"
                desc="This chart compares the presence of selected virulence-associated genes between Campylobacter jejuni and Campylobacter coli. Bars indicate whether a gene is present for each species among the selected top genes."
              >
                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed mb-4">
                  A value of 1 indicates gene presence; 0 indicates absence. When percentages are enabled, values represent prevalence.
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed mb-4">
                  This view highlights genes that are shared across species versus those that appear species-specific in the dataset.
                </p>
                <SpeciesBarChart topN={topN} showPercent={showPercent} />
              </StoryCard>
            </div>

            {/* Function Pie Chart */}
            <div>
              <StoryCard
                title="Gene Function Distribution"
                desc="Distribution of genes by functional category (Adhesion, Invasion, Toxin, Motility, etc.)"
              >
                <FunctionPie />
              </StoryCard>
            </div>

            {/* Sunburst */}
            <div>
              <StoryCard
                title="Hierarchical View: Species → Host → Gene Count"
                desc="This visualization shows how gene counts are distributed across all isolates, first by species and then by host category. Segment size reflects the relative gene count, and color indicates species."
              >
                <Sunburst />
              </StoryCard>
            </div>

            {/* Sankey Diagram */}
            <div className="lg:col-span-2">
              <StoryCard
                title="Host to Gene Flow"
                desc={`Sankey diagram showing the flow from host categories to the top ${topN} genes. Link thickness represents the number of isolates.`}
              >
                <Sankey topK={topN} onGeneClick={handleGeneClick} />
              </StoryCard>
            </div>
          </div>

          {/* Selected Gene Info */}
          {selectedGene && (
            <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">
                Selected Gene: {selectedGene}
              </h3>
              <p className="text-blue-700 dark:text-blue-400">
                Gene information and profiles are available in the main dashboard.
              </p>
            </div>
          )}
        </div>
      </div>
    </DataProvider>
  );
}

