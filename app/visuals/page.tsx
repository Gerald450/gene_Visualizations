import StoryCard from "@/components/StoryCard";

const visuals = [
  { id: "gene-frequency", title: "Common Virulence Genes", desc: "Compare gene frequency across jejuni vs coli." },
  { id: "role-distribution", title: "Virulence Roles by Species", desc: "Functional roles of virulence genes." },
  { id: "chromosome-map", title: "Gene Locations", desc: "Where virulence genes lie along the chromosome." },
  { id: "host-function", title: "Host–Function Relationship", desc: "Link hosts to virulence traits." },
  { id: "universal-genes", title: "Universal Virulence Genes", desc: "Genes present across all hosts." },
];

export default function VisualsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 mt-16">
      <h1 className="text-4xl font-semibold text-center mb-10">Explore Visual Storylines</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {visuals.map((v) => (
          <StoryCard key={v.id} {...v} href={`/visuals/${v.id}`} />
        ))}
      </div>
    </div>
  );
}
