export default function StoryCard({ 
  title, 
  desc, 
  children 
}: { 
  title: string; 
  desc: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 text-left shadow-sm hover:shadow-lg hover:border-gray-300 transition">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed mb-4">{desc}</p>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
