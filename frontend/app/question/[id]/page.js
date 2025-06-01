'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { ArrowLeft } from "lucide-react";

export default function QuestionDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                toast.loading("Fetching question...");
                const res = await fetch(`http://localhost:5001/api/questions/single/${id}`);
                const data = await res.json();

                if (res.ok) {
                    setQuestion(data.question);
                    toast.dismiss();
                    toast.success("Question loaded successfully");
                } else {
                    throw new Error(data.message || "Error fetching question");
                }
            } catch (err) {
                toast.dismiss();
                toast.error("Error loading question");
            } finally {
                setLoading(false);
            }
        };

        fetchQuestion();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0f0e17] text-white">
                <p className="text-xl font-medium animate-pulse">Loading...</p>
            </div>
        );
    }

    if (!question) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0f0e17] text-white">
                <p className="text-lg">Question not found</p>
            </div>
        );
    }

    return (
        <div className="bg-[#0f0e17] text-white min-h-screen flex flex-col">
            <Toaster position="top-center" />
            <Navbar />

            <main className="w-full px-4 md:px-6 py-8 flex-grow">
                <div className="mb-6 max-w-screen-2xl mx-auto mt-15">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-400 hover:text-[#7f5af0] transition"
                    >
                        <ArrowLeft size={20} />
                        <span>Back to Questions</span>
                    </button>
                </div>

                <div className="max-w-screen-2xl mx-auto w-full flex flex-col lg:flex-row gap-8">
                    {/* Left Section - Question Info (40%) */}
                    <section className="lg:w-[40%] bg-[#181825] rounded-2xl p-6 border border-[#2a2a40] shadow-xl">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#7f5af0] to-[#00c6ff] mb-4">
                            {question.title}
                        </h1>

                        <p className="text-gray-300 text-base sm:text-lg leading-relaxed whitespace-pre-line mb-4">
                            {question.description}
                        </p>

                        {question.example && (
                            <div className="mb-4 bg-[#23233b] p-4 rounded-xl">
                                <h2 className="text-lg font-semibold text-[#ffd369] mb-2">Example:</h2>
                                <pre className="text-gray-100 whitespace-pre-wrap">{question.example}</pre>
                            </div>
                        )}

                        {question.explanation && (
                            <div className="mb-4 bg-[#23233b] p-4 rounded-xl">
                                <h2 className="text-lg font-semibold text-[#7fffd4] mb-2">Explanation:</h2>
                                <pre className="text-gray-100 whitespace-pre-wrap">{question.explanation}</pre>
                            </div>
                        )}

                        {question.note && (
                            <div className="mt-4 bg-[#23233b] border-l-4 border-green-400 p-4 rounded">
                                <p className="text-green-300 font-semibold">Note:</p>
                                <p className="text-gray-200">{question.noteText}</p>
                            </div>
                        )}
                    </section>

                    {/* Right Section - Code (60%) */}
                    <section className="lg:w-[60%] bg-[#181825] p-6 rounded-2xl border border-[#2a2a40] shadow-xl flex flex-col gap-6">
                        <div>
                            <h2 className="text-xl font-bold text-yellow-300 mb-2">Answer Code:</h2>
                            <div className="overflow-auto max-h-[600px] rounded-md border border-[#3a3a55]">
                                <SyntaxHighlighter
                                    language="javascript"
                                    style={oneDark}
                                    wrapLongLines
                                    customStyle={{ margin: 0, padding: '1rem', fontSize: '1rem' }}
                                >
                                    {question.answerCode}
                                </SyntaxHighlighter>
                            </div>
                        </div>

                        {question.companies?.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-green-400 mb-1">Asked in:</h3>
                                <div className="flex flex-wrap gap-3">
                                    {question.companies.map((company, i) => (
                                        <img
                                            key={i}
                                            src={`/companies/${company.toLowerCase()}.png`}
                                            alt={company}
                                            title={company}
                                            onError={(e) => (e.currentTarget.src = "/companies/default.png")}
                                            className="h-10 w-10 rounded bg-white p-1 shadow"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {question.platform?.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-blue-400 mb-1">Practice on:</h3>
                                <div className="flex flex-wrap gap-3">
                                    {question.platform.map((pf, i) => (
                                        <img
                                            key={i}
                                            src={`/platform/${pf.toLowerCase()}.png`}
                                            alt={pf}
                                            title={pf}
                                            onError={(e) => (e.currentTarget.src = "/platform/default.png")}
                                            className="h-10 w-10 rounded bg-white p-1 shadow"
                                            onClick={() => window.open(``, '_blank')}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
