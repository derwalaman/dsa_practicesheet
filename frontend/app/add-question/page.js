'use client';

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Initial form state
const initialFormState = {
    title: "",
    level: "Easy",
    topic: "",
    companies: "",
    revision: false,
    platform: "",
    platformLink: "",
    description: "",
    example: "",
    explanation: "",
    answerCode: "",
    note: false,
    noteText: "",
};

export default function AddQuestionPage() {
    const [authenticated, setAuthenticated] = useState(false);
    const [adminId, setAdminId] = useState("");
    const [adminPass, setAdminPass] = useState("");
    const [loggingIn, setLoggingIn] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState(initialFormState);

    // Utility for updating form fields
    const handleChange = (field) => (e) =>
        setForm({ ...form, [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

    // Admin Login
    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setLoggingIn(true);
        try {
            const res = await fetch("http://localhost:5001/api/admins/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ adminId, password: adminPass }),
            });

            const data = await res.json();
            if (res.ok) {
                setAuthenticated(true);
                toast.success("Admin authenticated");
            } else {
                throw new Error(data.message || "Invalid Admin credentials");
            }
        } catch (err) {
            toast.error(err.message || "Failed to authenticate admin");
        } finally {
            setLoggingIn(false);
        }
    };

    // Question Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch("http://localhost:5001/api/questions/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    companies: form.companies
                        ? form.companies.split(",").map((c) => c.trim())
                        : [],
                    platform: form.platform
                        ? form.platform.split(",").map((p) => p.trim())
                        : [],
                    platformLink: form.platformLink
                        ? form.platformLink.split(",").map((pl) => pl.trim())
                        : [],
                }),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success("Question added successfully!");
                setForm(initialFormState);
            } else {
                throw new Error(data.message || "Failed to add question");
            }
        } catch (err) {
            toast.error(err.message || "An error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    // Admin Login UI
    if (!authenticated) {
        return (
            <div>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center bg-[#0f0e17] text-white px-4">
                    <div className="bg-[#1a1830] w-full max-w-md p-8 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-bold mb-6">Admin Login</h2>
                        <input
                            type="text"
                            className="w-full p-3 mb-4 rounded-md bg-[#2a273f] border border-gray-700 text-white"
                            placeholder="Admin ID"
                            value={adminId}
                            onChange={(e) => setAdminId(e.target.value)}
                        />
                        <input
                            type="password"
                            className="w-full p-3 mb-4 rounded-md bg-[#2a273f] border border-gray-700 text-white"
                            placeholder="Password"
                            value={adminPass}
                            onChange={(e) => setAdminPass(e.target.value)}
                        />
                        <button
                            onClick={handleAdminLogin}
                            disabled={loggingIn}
                            className="w-full py-3 bg-[#7f5af0] hover:bg-[#9d8ef5] text-white rounded-md transition flex justify-center items-center"
                        >
                            {loggingIn ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                "Login"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Main Form UI
    return (
        <div className="min-h-screen bg-[#0f0e17] text-white py-12 px-4">
            <Navbar />
            <Toaster position="top-center" />
            <div className="max-w-5xl w-full mx-auto bg-[#1a1830] p-10 rounded-2xl shadow-xl mt-10">
                <h1 className="text-3xl font-bold text-[#7f5af0] mb-8">Add New Question</h1>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input className="form-input p-3 border border-[#7f5af0] rounded-2xl" placeholder="Title" value={form.title} onChange={handleChange("title")} />
                    <select className="form-input p-3 border border-[#7f5af0] rounded-2xl" value={form.level} onChange={handleChange("level")}>
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>
                    </select>
                    <input className="form-input p-3 border border-[#7f5af0] rounded-2xl" placeholder="Topic" value={form.topic} onChange={handleChange("topic")} />
                    <input className="form-input p-3 border border-[#7f5af0] rounded-2xl" placeholder="Companies (comma-separated)" value={form.companies} onChange={handleChange("companies")} />
                    <input className="form-input p-3 border border-[#7f5af0] rounded-2xl" placeholder="Platform (comma-separated)" value={form.platform} onChange={handleChange("platform")} />
                    <input className="form-input p-3 border border-[#7f5af0] rounded-2xl" placeholder="Platform Links (comma-separated and in same order)" value={form.platformLink} onChange={handleChange("platformLink")} />
                    <label className="flex items-center space-x-3 p-3 border border-[#7f5af0] rounded-2xl">
                        <input type="checkbox" checked={form.revision} onChange={handleChange("revision")} />
                        <span>Revision Needed</span>
                    </label>
                    <textarea className="form-input md:col-span-2 p-3 border border-[#7f5af0] rounded-2xl" placeholder="Description" value={form.description} onChange={handleChange("description")} />
                    <textarea className="form-input md:col-span-2 p-3 border border-[#7f5af0] rounded-2xl" placeholder="Example" value={form.example} onChange={handleChange("example")} />
                    <textarea className="form-input md:col-span-2 p-3 border border-[#7f5af0] rounded-2xl" placeholder="Explanation" value={form.explanation} onChange={handleChange("explanation")} />
                    <textarea className="form-input md:col-span-2 p-3 border border-[#7f5af0] rounded-2xl" placeholder="Answer Code" value={form.answerCode} onChange={handleChange("answerCode")} />
                    <label className="flex items-center space-x-3 md:col-span-2 p-3 border border-[#7f5af0] rounded-2xl">
                        <input type="checkbox" checked={form.note} onChange={handleChange("note")} />
                        <span>Include Note</span>
                    </label>
                    {form.note && (
                        <textarea className="form-input md:col-span-2 p-3 border border-[#7f5af0] rounded-2xl" placeholder="Note Text" value={form.noteText} onChange={handleChange("noteText")} />
                    )}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="md:col-span-2 w-full py-3 bg-[#7f5af0] hover:bg-[#9d8ef5] text-white font-semibold rounded-md transition flex justify-center items-center"
                    >
                        {submitting ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            "Submit Question"
                        )}
                    </button>
                </form>
            </div>
            <Footer />
        </div>
    );
}
