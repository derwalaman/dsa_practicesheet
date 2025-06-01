"use client";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import clsx from "clsx";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={clsx(
        "w-full fixed top-0 z-50 backdrop-blur-md transition-all duration-300",
        scrolled ? "bg-[#1f1d2b]/90 shadow-md" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#7f5af0]">DSA Sheet</h1>
        <nav className="hidden md:flex space-x-6 text-sm">
          <a href="/" className="text-gray-300 hover:text-white">Home</a>
          {/* <a href="#" className="text-gray-300 hover:text-white">Topics</a> */}
          <a href="/add-question" className="text-gray-300 hover:text-white">Add Question</a>
        </nav>
        <button className="md:hidden text-gray-100" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-[#1f1d2b] px-4 pb-4">
          <a href="/" className="block text-gray-300 py-2">Home</a>
          <a href="/add-question" className="block text-gray-300 py-2">Add Question</a>
        </div>
      )}
    </header>
  );
}