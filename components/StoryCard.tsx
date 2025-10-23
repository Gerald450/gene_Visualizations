import Link from "next/link";

export default function StoryCard({
  title,
  desc,
  href,
}: {
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block bg-white border border-gray-200 rounded-2xl p-6 text-left shadow-sm hover:shadow-lg hover:border-gray-300 transition"
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
    </Link>
  );
}
