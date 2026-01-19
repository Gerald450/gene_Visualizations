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
import VariabilityPlot from "@/components/visualizations/VariabilityPlot";

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
      <section id="hero" className="text-center py-20 md:py-40 bg-gray-50 dark:bg-gray-900 scroll-mt-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4 md:mb-6 text-gray-900 dark:text-gray-100">
            Data. Genes. Insights.
            <br />
            <span className="text-blue-600 dark:text-blue-400">
              All in one interactive dashboard.
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg max-w-2xl mx-auto mb-6 md:mb-10">
            Explore patterns in <em>Campylobacter jejuni</em> and{" "}
            <em>Campylobacter coli </em>
            through clear, data-driven storytelling.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 items-center">
            <a
              href="/visualizations"
              className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition text-sm sm:text-base w-full sm:w-auto"
            >
              Interactive Visualizations
            </a>
            <a
              href="#visuals"
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-full text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-sm sm:text-base w-full sm:w-auto"
            >
              View Storylines
            </a>
            <a
              href="/campylobacter.xlsx"
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-full text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-sm sm:text-base w-full sm:w-auto"
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
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6">
          {["Compare", "Analyze", "Visualize", "Discover", "Collaborate"].map(
            (f) => (
              <div
                key={f}
                className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-full text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base"
              >
                {f}
              </div>
            )
          )}
        </div>
      </Section>

      {/* INTRODUCTION SECTION */}
      <section className="pt-6 sm:pt-8 md:pt-10 pb-6 sm:pb-8 md:pb-10 px-4 sm:px-6 bg-gray-50 dark:bg-gray-900 scroll-mt-20">
        <div className="max-w-3xl mx-auto text-left">
          <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
            <em>Campylobacter jejuni</em> and <em>Campylobacter coli</em> are leading causes of bacterial gastroenteritis worldwide and are commonly studied for their virulence-associated genes. These genes play roles in bacterial survival, host interaction, and environmental persistence.
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
            Understanding how such genes vary across species and hosts is important for identifying broader patterns rather than individual biological outcomes. This dashboard focuses on visualizing those patterns in a clear and interactive way.
          </p>
        </div>
      </section>

      {/* VISUALS SECTION */}
      <DataProvider>
        <Section
          id="visuals"
          title="Visual Storylines"
          subtitle="Explore key questions about virulence genes through interactive data narratives."
        >
          <div className="flex flex-col gap-6 sm:gap-8">
            {/* Bar Chart */}
            <StoryCard
              title="Virulence Gene Prevalence Across Hosts"
              desc="Compare human vs multi-host prevalence and hover to see gene roles and prevalence gaps."
            >
              <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                This chart shows the prevalence of key virulence genes across different host environments, revealing which genes are conserved across hosts versus those that are host-specific. Bars represent prevalence percentages, allowing you to quickly identify patterns of gene distribution.
              </p>
              <BarChart />
            </StoryCard>

            {/* Species Matrix */}
            <StoryCard
              title="Presence and Absence of Virulence Genes Across Species"
              desc="This table shows whether selected virulence-associated genes are present or absent in Campylobacter jejuni compared with Campylobacter coli, based on the project dataset."
            >
              <Matrix />
            </StoryCard>

            {/* Gene Profiles */}
            <StoryCard
              title="Gene Profiles by function"
              desc="Explore virulence genes grouped by their functional processes (adhesion, invasion, mobility, toxin, etc.). Click to expand each category."
            >
              <GeneProfiles />
            </StoryCard>

            {/* Heatmap */}
            <StoryCard
              title="Gene Prevalence Heatmap"
              desc="Prevalence shows what percentage of bacterial isolates from each host contain a specific gene. Each row represents a gene, each column represents a host association (Poultry, Cattle, Swine, Human, etc.). The color intensity indicates the prevalence percentage—brighter colors mean higher prevalence (the gene appears in more isolates), while darker colors mean lower or absent prevalence. This helps identify conserved (core) genes versus host-specific genes. Click on a gene cell to view its details."
            >
              <Heatmap />
            </StoryCard>

            {/* Variability Plot */}
            <StoryCard
              title="Gene Prevalence Variability (Stability)"
              desc="This visualization shows how stable or variable each virulence gene's prevalence is across hosts and species. Low variability (small error bars) indicates core, conserved virulence genes that are consistently present. High variability (large error bars) indicates host- or species-specific genes that are adaptive. Dots represent mean prevalence, error bars show the min-max range, and colors indicate functional categories."
            >
              <VariabilityPlot />
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
              <div className="mb-4 flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
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
            {false && visuals.map((v) => (
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
        <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto px-4">
          Virulence Insights is a student-led data storytelling project that
          visualizes patterns in *Campylobacter jejuni* and *Campylobacter coli*
          virulence factors. Built with Next.js, it integrates interactive
          visualizations for exploration.
        </p>
      </Section>
      {/* TEAM SECTION */}
      <Section id="team" title="Our Team">
        <p className="text-gray-700 dark:text-gray-300 mb-6 sm:mb-8 text-sm sm:text-base px-4">
          Developed by a group of research enthusiasts exploring data-driven
          biology.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-8 md:gap-10 px-4">
          {/* Member 1 */}
          <div className="flex flex-col items-center text-center">
            <img
              src="images/Headshots/Gerald.jpeg"
              alt="Team member 1"
              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover rounded-full shadow-md border-2 border-gray-200"
            />
            <h4 className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
              Gerald Shimo
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Full-Stack Developer</p>
          </div>

          {/* Member 2 */}
          <div className="flex flex-col items-center text-center">
            <img
              src="images/Headshots/Hawu.jpeg"
              alt="Team member 2"
              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover rounded-full shadow-md border-2 border-gray-200"
            />
            <h4 className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
              Hawulethu Ndlovu
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
              Product Manager and Data Analyst
            </p>
          </div>

          {/* Member 3 */}
          <div className="flex flex-col items-center text-center">
            <img
              src="images/Headshots/Praise.jpeg"
              alt="Team member 3"
              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover rounded-full shadow-md border-2 border-gray-200"
            />
            <h4 className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
              Praise Fabiyi
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">BioInformatics Engineer</p>
          </div>

          {/* Member 4 */}
          <div className="flex flex-col items-center text-center">
            <img
              src="images/Headshots/raj-214x300.jpg"
              alt="Dr. Raj"
              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover rounded-full shadow-md border-2 border-gray-200"
            />
            <h4 className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
              Dr. Raj
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Faculty Advisor</p>
          </div>
        </div>
      </Section>
    </>
  );
}

