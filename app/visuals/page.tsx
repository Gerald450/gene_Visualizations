import StoryCard from "@/components/StoryCard";

const visuals = [
  { id: "gene-frequency", title: "Common Virulence Genes", desc: "Compare gene frequency across jejuni vs coli" },
  { id: "role-distribution", title: "Virulence Roles by Species", desc: "Functional roles of virulence genes by type" },
  { id: "chromosome-map", title: "Gene Locations", desc: "Where virulence genes are located on the chromosome" },
  { id: "host-function", title: "Host–Function Relationship", desc: "Link between host species and virulence functions" },
  { id: "universal-genes", title: "Universal Virulence Genes", desc: "Genes consistently present across multiple hosts" },
];

export default function VisualsPage() {
  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h1 className="text-3xl font-bold text-center mb-8">Visual Storylines</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visuals.map((v) => (
          <StoryCard key={v.id} title={v.title} desc={v.desc} href={`/visuals/${v.id}`} />
        ))}
      </div>
    </div>
  );
}
