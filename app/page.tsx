export default function Home() {
  return (
    <section className="text-center py-28 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight text-gray-900 mb-6">
          Data. Genes. Insights.  
          <br />
          <span className="text-blue-600">All in one interactive platform.</span>
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
          Explore virulence gene patterns across <em>Campylobacter jejuni</em> and <em>Campylobacter coli</em> 
          — simplified through clear, data-driven visuals.
        </p>

        <div className="flex justify-center gap-4 mb-16">
          <button className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition">
            Explore Visuals
          </button>
          <button className="px-6 py-3 border border-gray-300 text-gray-800 rounded-full font-medium hover:bg-gray-100 transition">
            Learn More
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-gray-700">
          {["Compare", "Analyze", "Visualize", "Discover", "Collaborate"].map((tag) => (
            <div
              key={tag}
              className="px-4 py-2 bg-white shadow-sm border border-gray-100 rounded-full"
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
