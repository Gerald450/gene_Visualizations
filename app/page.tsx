'use client';

import { useState, useEffect } from "react";
import Section from "@/components/Section";
import { visuals } from "./data/visuals";
import { DataProvider } from "@/components/DataProvider";
import StoryCard from "@/components/StoryCard";
import BarChart from "@/components/BarChart";
import Matrix from "@/components/Matrix";
import GeneProfiles from "@/components/GeneProfiles";
import Heatmap from "@/components/visualizations/Heatmap";
import CooccurrenceNetwork from "@/components/visualizations/CooccurrenceNetwork";
import SpeciesBarChart from "@/components/visualizations/SpeciesBarChart";
import FunctionPie from "@/components/visualizations/FunctionPie";
import Sunburst from "@/components/visualizations/Sunburst";
import Sankey from "@/components/visualizations/Sankey";

export default function Home() {
  const [topN, setTopN] = useState(20);
  const [showPercent, setShowPercent] = useState(false);

  // Handle hash links when navigating from other pages
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  return (
    <>
      {/* HERO SECTION */}
      <section id="hero" className="text-center py-40 bg-gray-50 dark:bg-gray-900 scroll-mt-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold leading-tight mb-6 text-gray-900 dark:text-gray-100">
            Data. Genes. Insights.
            <br />
            <span className="text-blue-600 dark:text-blue-400">
              All in one interactive dashboard.
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto mb-10">
            Explore patterns in <em>Campylobacter jejuni</em> and{" "}
            <em>Campylobacter coli </em>
            through clear, data-driven storytelling.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/visualizations"
              className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition"
            >
              Interactive Visualizations
            </a>
            <a
              href="#visuals"
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-full text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              View Storylines
            </a>
            <a
              href="/campylobacter.xlsx"
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-full text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Download Excel File
            </a>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <Section
        id="features"
        title="What You Can Do"
        subtitle="Our platform helps you analyze and visualize virulence data intuitively."
      >
        <div className="flex flex-wrap justify-center gap-6">
          {["Compare", "Analyze", "Visualize", "Discover", "Collaborate"].map(
            (f) => (
              <div
                key={f}
                className="px-6 py-3 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-full text-gray-700 dark:text-gray-300 font-medium"
              >
                {f}
              </div>
            )
          )}
        </div>
      </Section>

      {/* VISUALS SECTION */}
      <DataProvider>
        <Section
          id="visuals"
          title="Visual Storylines"
          subtitle="Explore key questions about virulence genes through interactive data narratives."
        >
          <div className="flex flex-col gap-8">
            {/* Bar Chart */}
            <StoryCard
              title="Gene Prevalence by Host"
              desc="Compare the prevalence (%) of major virulence genes across different host associations (Poultry, Cattle, Swine, Human, Multiple)."
            >
              <BarChart />
            </StoryCard>

            {/* Species Matrix */}
            <StoryCard
              title="Presence/Absence Matrix"
              desc="Visual representation of which genes are present or absent in Campylobacter jejuni versus Campylobacter coli."
            >
              <Matrix />
            </StoryCard>

            {/* Gene Profiles */}
            <StoryCard
              title="Gene Profiles by Process"
              desc="Explore virulence genes grouped by their functional processes (adhesion, invasion, mobility, toxin, etc.). Click to expand each category."
            >
              <GeneProfiles />
            </StoryCard>

            {/* Heatmap */}
            <StoryCard
              title="Gene Prevalence Heatmap"
              desc="Heatmap showing prevalence percentage of each gene across different host associations. Rows represent genes (sorted alphabetically), columns represent hosts. Click on a gene to view its details."
            >
              <Heatmap />
            </StoryCard>

            {/* Co-occurrence Network */}
            <StoryCard
              title="Gene Co-Occurrence Network"
              desc="This network visualization shows which virulence genes tend to appear together in the same bacterial isolates. Each circle (node) represents a gene - larger circles mean the gene appears more frequently. Lines (links) connect genes that co-occur - thicker lines mean those genes are found together more often. Genes are color-coded by function: red (toxin), blue (adhesion), green (invasion), orange (motility). Hover over nodes to see details, or click to explore specific genes."
            >
              <CooccurrenceNetwork />
            </StoryCard>

            {/* Species Bar Chart */}
            <StoryCard
              title="Species-Specific Gene Distribution"
              desc={`Comparison of gene counts/percentages between C. jejuni and C. coli for the top ${topN} genes. Shows absolute counts or percentages for each species.`}
            >
              <div className="mb-4 flex gap-4 items-center">
                <label className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100">
                  <span>Top N:</span>
                  <select
                    value={topN}
                    onChange={(e) => setTopN(Number(e.target.value))}
                    className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                    <option value={50}>50</option>
                  </select>
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100">
                  <input
                    type="checkbox"
                    checked={showPercent}
                    onChange={(e) => setShowPercent(e.target.checked)}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                  <span>Show Percentages</span>
                </label>
              </div>
              <SpeciesBarChart topN={topN} showPercent={showPercent} />
            </StoryCard>

            {/* Function Pie Chart */}
            <StoryCard
              title="Gene Function Distribution"
              desc="Distribution of genes by functional category (Adhesion, Invasion, Toxin, Motility, Iron uptake, Stress response, Other). Hover to see counts and percentages."
            >
              <FunctionPie />
            </StoryCard>

            {/* Sunburst */}
            <StoryCard
              title="Hierarchical View: Species → Host → Gene Count"
              desc="Sunburst diagram showing the hierarchy from all isolates, down to species (C. jejuni, C. coli), then hosts (Poultry, Human, etc.), with gene counts at each level."
            >
              <Sunburst />
            </StoryCard>

            {/* Sankey Diagram */}
            <StoryCard
              title="Host to Gene Flow"
              desc={`Sankey diagram showing the flow from host categories to the top ${topN} genes. Link thickness represents the number of isolates containing each gene for that host.`}
            >
              <Sankey topK={topN} />
            </StoryCard>

            {/* Hidden Tableau Visuals - commented out for now */}
            {false && visuals.map((v, i) => (
              <div
                key={v.title}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition p-10"
              >
                <div className="text-left mb-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    {v.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{v.desc}</p>
                </div>
                <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50">
                  <iframe
                    src={v.tableauSrc}
                    title={v.title}
                    loading="lazy"
                    className="w-full border-none"
                    style={{
                      minHeight: `${v.height}px`,
                      overflow: "visible",
                      transform: "scale(1.02)",
                      transformOrigin: "top center",
                    }}
                  ></iframe>
                  <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-gray-50/90 to-transparent pointer-events-none"></div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </DataProvider>

      {/* ABOUT SECTION */}
      <Section
        id="about"
        title="About This Project"
        subtitle="Turning complex virulence gene data into simple insights."
      >
        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">
          Virulence Insights is a student-led data storytelling project that
          visualizes patterns in *Campylobacter jejuni* and *Campylobacter coli*
          virulence factors. Built with Next.js, it integrates interactive
          visualizations for exploration.
        </p>
      </Section>
      {/* TEAM SECTION */}
      <Section id="team" title="Our Team">
        <p className="text-gray-700 dark:text-gray-300 mb-8">
          Developed by a group of research enthusiasts exploring data-driven
          biology.
        </p>

        <div className="flex flex-col md:flex-row justify-center items-center gap-10">
          {/* Member 1 */}
          <div className="flex flex-col items-center text-center">
            <img
              src="images/Headshots/Gerald.jpeg"
              alt="Team member 1"
              className="w-32 h-32 object-cover rounded-full shadow-md border-2 border-gray-200"
            />
            <h4 className="mt-4 text-lg font-semibold text-gray-900">
              Gerald Shimo
            </h4>
            <p className="text-gray-600 text-sm">Full-Stack Developer</p>
          </div>

          {/* Member 2 */}
          <div className="flex flex-col items-center text-center">
            <img
              src="images/Headshots/Hawu.jpeg"
              alt="Team member 2"
              className="w-32 h-32 object-cover rounded-full shadow-md border-2 border-gray-200"
            />
            <h4 className="mt-4 text-lg font-semibold text-gray-900">
              Hawulethu Ndlovu
            </h4>
            <p className="text-gray-600 text-sm">
              Product Manager and Data Analyst
            </p>
          </div>

          {/* Member 3 */}
          <div className="flex flex-col items-center text-center">
            <img
              src="images/Headshots/Praise.jpeg"
              alt="Team member 3"
              className="w-32 h-32 object-cover rounded-full shadow-md border-2 border-gray-200"
            />
            <h4 className="mt-4 text-lg font-semibold text-gray-900">
              Praise Fabiyi
            </h4>
            <p className="text-gray-600 text-sm">BioInformatics Engineer</p>
          </div>
        </div>
      </Section>
    </>
  );
}

