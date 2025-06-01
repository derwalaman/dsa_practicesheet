export default function Footer() {
  return (
    <footer className="bg-[#1f1d2b] text-center py-6 mt-24 border-t border-white/10">
      <p className="text-sm text-gray-500">
        © {new Date().getFullYear()} DSA Sheet — Built with 💡 by You.
      </p>
    </footer>
  );
}