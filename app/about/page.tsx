export default function About() {
  return (
    <section className="max-w-3xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-4">About This Project</h1>
      <p className="text-gray-700 mb-4">
        This project visualizes patterns in virulence genes between *Campylobacter jejuni* and *Campylobacter coli*.
        It aims to make complex genomic data more understandable for researchers and the public.
      </p>
      <p className="text-gray-700">
        Built with Next.js for performance and modularity. Tableau visualizations will be integrated in future updates.
      </p>
    </section>
  );
}
