const visuals: Record<string, { title: string; desc: string }> = {
  "gene-frequency": { title: "Common Virulence Genes", desc: "Compare gene frequency across jejuni vs coli." },
  "role-distribution": { title: "Virulence Roles by Species", desc: "See how gene roles differ between species." },
  "chromosome-map": { title: "Gene Locations", desc: "Explore chromosomal positioning of virulence genes." },
  "host-function": { title: "Host–Function Relationship", desc: "Examine host and function interactions." },
  "universal-genes": { title: "Universal Virulence Genes", desc: "Discover genes found in all host types." },
};

export default function VisualPage({ params }: { params: { id: string } }) {
  const visual = visuals[params.id];
  if (!visual) return <p className="text-center mt-10 text-red-500">Visualization not found.</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 text-center">
      <h1 className="text-3xl font-semibold mb-4">{visual.title}</h1>
      <p className="text-gray-600 mb-8">{visual.desc}</p>

      {/* Placeholder for Tableau Embed */}
      <div className="bg-gray-200 rounded-xl h-[500px] flex items-center justify-center text-gray-500 italic">
        Tableau visualization will go here
      </div>
    </div>
  );
}
