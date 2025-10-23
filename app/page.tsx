import Link from "next/link";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center text-center mt-20">
      <h1 className="text-4xl font-bold text-blue-700 mb-4">
        Welcome to Virulence Insights
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mb-6">
        Explore key patterns and relationships in <em>Campylobacter jejuni</em> and
        <em> Campylobacter coli</em> virulence genes through data-driven stories.
      </p>
      <Link
        href="/visuals"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
      >
        Explore Visualizations
      </Link>
    </section>
  );
}
