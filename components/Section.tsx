export default function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="py-24 px-6 text-center bg-gray-50 scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold mb-4">{title}</h2>
        {subtitle && <p className="text-gray-600 text-lg mb-10">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}
