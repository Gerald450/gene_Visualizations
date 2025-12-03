import Section from "@/components/Section";
import { visuals } from "./data/visuals";
import { DataProvider } from "@/components/DataProvider";
import StoryCard from "@/components/StoryCard";
import BarChart from "@/components/BarChart";
import Matrix from "@/components/Matrix";
import GeneProfiles from "@/components/GeneProfiles";

export default function Home() {
  return (
    <>
      {/* HERO SECTION */}
      <section id="hero" className="text-center py-40 bg-gray-50 scroll-mt-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold leading-tight mb-6">
            Data. Genes. Insights.
            <br />
            <span className="text-blue-600">
              All in one interactive dashboard.
            </span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-10">
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
              className="px-6 py-3 border border-gray-300 rounded-full text-gray-800 hover:bg-gray-100 transition"
            >
              View Storylines
            </a>
            <a
              href="/campylobacter.xlsx"
              className="px-6 py-3 border border-gray-300 rounded-full text-gray-800 hover:bg-gray-100 transition"
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
                className="px-6 py-3 bg-white shadow-sm border border-gray-100 rounded-full text-gray-700 font-medium"
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
        <p className="text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto">
          Virulence Insights is a student-led data storytelling project that
          visualizes patterns in *Campylobacter jejuni* and *Campylobacter coli*
          virulence factors. Built with Next.js, it integrates interactive
          visualizations for exploration.
        </p>
      </Section>
      {/* TEAM SECTION */}
      <Section id="team" title="Our Team">
        <p className="text-gray-700 mb-8">
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

