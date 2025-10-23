export default function Footer() {
  return (
    <footer className="py-10 text-center text-sm text-gray-500 border-t border-gray-100">
      © {new Date().getFullYear()} Virulence Insights — Built with Next.js & Tailwind CSS.
    </footer>
  );
}
