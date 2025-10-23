import Section from "@/components/Section";
import StoryCard from "@/components/StoryCard";

export default function Home() {
 const visuals = [
  { title: "Common Virulence Genes", desc: "Compare gene frequency across jejuni vs coli." },
  { title: "Virulence Roles by Species", desc: "Functional roles of virulence genes." },
  { title: "Gene Locations", desc: "Where virulence genes lie along the chromosome." },
  { title: "Host–Function Relationship", desc: "Link hosts to virulence traits." },
  { title: "Universal Virulence Genes", desc: "Genes present across all hosts." },
];

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
            <em>Campylobacter coli</em>
            through clear, data-driven storytelling.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="#visuals"
              className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition"
            >
              Explore Visuals
            </a>
            <a
              href="#about"
              className="px-6 py-3 border border-gray-300 rounded-full text-gray-800 hover:bg-gray-100 transition"
            >
              Learn More
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
      <Section
        id="visuals"
        title="Visual Storylines"
        subtitle="Explore key questions about virulence genes through interactive data narratives."
      >
        <div className="flex flex-col gap-16">
          {visuals.map((v, i) => (
            <div
              key={v.title}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition p-10 flex flex-col md:flex-row items-center gap-8"
            >
              {/* Left side: text */}
              <div className="md:w-1/2 text-left">
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  {v.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">{v.desc}</p>
                <button className="mt-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition">
                  View Visualization
                </button>
              </div>

              {/* Right side: placeholder visual */}
              <div className="md:w-1/2 bg-gray-100 rounded-xl h-64 w-full flex items-center justify-center text-gray-500 italic">
                Tableau embed will go here
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ABOUT SECTION */}
      <Section
        id="about"
        title="About This Project"
        subtitle="Turning complex virulence gene data into simple insights."
      >
        <p className="text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto">
          Virulence Insights is a student-led data storytelling project that
          visualizes patterns in *Campylobacter jejuni* and *Campylobacter coli*
          virulence factors. Built with Next.js, it will integrate Tableau
          dashboards for interactive exploration.
        </p>
      </Section>

      {/* TEAM SECTION */}
      <Section id="team" title="Our Team">
        <p className="text-gray-700">
          Developed by a group of research enthusiasts exploring data-driven
          biology.
        </p>
      </Section>
    </>
  );
}
