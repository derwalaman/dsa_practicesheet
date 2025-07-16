"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function HomePage() {
  const router = useRouter();

  const topics = [
    "Arrays",
    "Strings",
    "Linked Lists",
    "Trees",
    "Graphs",
    "Dynamic Programming",
    "Backtracking",
  ];

  const handleCardClick = (topic) => {
    toast.success(`Loading ${topic} questions...`);
    router.push(`/topics/${topic.toLowerCase().replace(/\s+/g, "-")}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0f0e17] text-white">
      <Toaster position="top-center" />
      <Navbar />

      <main className="flex-1 px-6 lg:px-12 py-16 max-w-7xl mx-auto mt-10">
        <section className="text-center mb-24">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#7f5af0] to-[#2cb67d]">
            Crack DSA Like a Pro
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-xl mx-auto">
            Your personalized path to mastering DSA by solving questions asked in top MNCs and tech companies.
          </p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {topics.map((topic, index) => (
            <div
              key={index}
              onClick={() => {
                if (topic === "Dynamic Programming") {
                  topic = "Dynamic-Programming";
                } else if (topic === "Linked Lists") {
                  topic = "Linked-Lists";
                }
                handleCardClick(topic)
              }
              }
              className="rounded-2xl bg-[#1a1830] p-6 border border-[#2cb67d]/10 hover:shadow-xl hover:shadow-[#2cb67d]/30 transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <h2 className="text-xl font-bold text-[#7f5af0]">{topic}</h2>
              <p className="text-sm text-gray-400 mt-3">
                Dive into curated {topic} problems.
              </p>
            </div>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
