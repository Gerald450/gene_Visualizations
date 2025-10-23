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
      className="block bg-white p-6 rounded-xl shadow hover:shadow-lg transition duration-200"
    >
      <h2 className="text-lg font-semibold text-blue-700 mb-2">{title}</h2>
      <p className="text-gray-600 text-sm">{desc}</p>
    </Link>
  );
}
