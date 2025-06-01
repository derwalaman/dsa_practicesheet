"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaStar } from "react-icons/fa";

export default function TopicPage() {
    const { topic } = useParams();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedCompany, setSelectedCompany] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const questionsPerPage = 10;

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                toast.loading(`Fetching ${topic} questions...`);
                const res = await fetch(`https://dsa-practicesheet.onrender.com/api/questions/${topic}`);
                const data = await res.json();

                if (res.ok) {
                    setQuestions(data.questions);
                    toast.dismiss();
                    toast.success(`${topic} questions loaded`);
                } else {
                    throw new Error(data.message || "Failed to fetch questions");
                }
            } catch (err) {
                console.error(err);
                toast.dismiss();
                toast.error("Failed to load questions");
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [topic]);

    const toggleRevision = async (id) => {
        try {
            const res = await fetch(`https://dsa-practicesheet.onrender.com/api/questions/toggle-revision/${id}`, {
                method: "PATCH",
            });
            const data = await res.json();

            if (res.ok) {
                toast.success("Revision status updated");
                setQuestions((prev) =>
                    prev.map((q) =>
                        q._id === id ? { ...q, revision: data.revision } : q
                    )
                );
            } else {
                toast.error(data.message || "Failed to update revision");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error updating revision");
        }
    };

    const filteredQuestions = questions.filter((q) => {
        const matchesSearch = q.title.toLowerCase().includes(search.toLowerCase());
        const matchesCompany =
            selectedCompany === "" || q.companies.some((c) => c.name === selectedCompany);
        const matchesLevel = selectedLevel === "" || q.level === selectedLevel;

        return matchesSearch && matchesCompany && matchesLevel;
    });

    const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
    const paginatedQuestions = filteredQuestions.slice(
        (currentPage - 1) * questionsPerPage,
        currentPage * questionsPerPage
    );

    return (
        <div className="flex flex-col min-h-screen bg-[#0f0e17] text-white">
            <Toaster position="top-center" />
            <Navbar />

            <main className="flex-1 px-4 md:px-10 py-16 max-w-7xl mx-auto w-full">
                <div className="flex flex-row items-center justify-between mb-8 mt-10">
                    <h1 className="w-[30%] text-3xl md:text-4xl font-bold mb-6 capitalize text-left">
                        {topic.replace(/-/g, " ")} Questions
                    </h1>

                    <div className="w-[65%] flex flex-col md:flex-row md:items-center gap-4 mb-8">
                        <input
                            type="text"
                            placeholder="Search by title..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-[#1a1830] text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#7f5af0]"
                        />

                        <select
                            value={selectedCompany}
                            onChange={(e) => setSelectedCompany(e.target.value)}
                            className="w-full md:w-1/3 px-4 py-2 rounded-lg bg-[#1a1830] text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#7f5af0]"
                        >
                            <option value="">All Companies</option>
                            {[...new Set(questions.flatMap((q) => q.companies.map((c) => c.name)))].map(
                                (company, idx) => (
                                    <option key={idx} value={company}>
                                        {company}
                                    </option>
                                )
                            )}
                        </select>

                        <select
                            value={selectedLevel}
                            onChange={(e) => setSelectedLevel(e.target.value)}
                            className="w-full md:w-1/4 px-4 py-2 rounded-lg bg-[#1a1830] text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#7f5af0]"
                        >
                            <option value="">All Levels</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <p className="text-center text-gray-400">Loading...</p>
                ) : (
                    <>
                        <div className="overflow-auto rounded-xl max-w-full">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-[#1a1830] text-[#7f5af0]">
                                    <tr>
                                        <th className="py-3 px-4">ID</th>
                                        <th className="py-3 px-4">Title</th>
                                        <th className="py-3 px-4">Level</th>
                                        <th className="py-3 px-4">Platform</th>
                                        <th className="py-3 px-4">Companies</th>
                                        <th className="py-3 px-4">Revision</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedQuestions.map((q, idx) => (
                                        <tr
                                            key={q._id}
                                            className="hover:bg-[#1a1830]/50 transition-all cursor-pointer"
                                            onClick={() => {
                                                toast.success(`Opening "${q.title}"...`);
                                                window.location.href = `../../question/${q._id}`;
                                            }}
                                        >
                                            <td className="py-3 px-4 text-gray-300">{(currentPage - 1) * questionsPerPage + idx + 1}</td>
                                            <td className="py-3 px-4 text-white font-medium">
                                                {q.title}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-yellow-400">
                                                {q.level}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex gap-2 flex-wrap">
                                                    {q.platform.map((pf, i) => {
                                                        const plat_form = pf?.toLowerCase?.();
                                                        return plat_form ? (
                                                            <img
                                                                key={i}
                                                                src={`/platform/${plat_form}.png`}
                                                                alt={pf.name}
                                                                title={pf.name}
                                                                className="w-6 h-6 bg-white rounded-full object-contain border border-white/20"
                                                            />
                                                        ) : null;
                                                    })}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex gap-2 flex-wrap">
                                                    {q.companies.map((company, i) => {
                                                        const name = company?.toLowerCase?.();
                                                        return name ? (
                                                            <img
                                                                key={i}
                                                                src={`/companies/${name}.png`}
                                                                alt={company.name}
                                                                title={company.name}
                                                                className="w-6 h-6 bg-white rounded-full object-contain border border-white/20"
                                                            />
                                                        ) : null;
                                                    })}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <FaStar
                                                    className={`text-xl cursor-pointer transition ${q.revision
                                                        ? "text-yellow-400"
                                                        : "text-gray-500"
                                                        }`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleRevision(q._id);
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="mt-6 flex justify-center gap-2 flex-wrap">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`px-4 py-2 rounded-lg text-sm transition font-medium ${currentPage === 1
                                        ? "bg-[#1a1830] text-gray-500 cursor-not-allowed"
                                        : "bg-[#1a1830] text-white hover:bg-[#7f5af0]/20"
                                        }`}
                                >
                                    &laquo; Prev
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`px-4 py-2 rounded-lg text-sm transition font-medium ${currentPage === i + 1
                                            ? "bg-[#7f5af0] text-white"
                                            : "bg-[#1a1830] text-white hover:bg-[#7f5af0]/20"
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className={`px-4 py-2 rounded-lg text-sm transition font-medium ${currentPage === totalPages
                                        ? "bg-[#1a1830] text-gray-500 cursor-not-allowed"
                                        : "bg-[#1a1830] text-white hover:bg-[#7f5af0]/20"
                                        }`}
                                >
                                    Next &raquo;
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
}
