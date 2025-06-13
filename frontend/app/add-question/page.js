'use client';

import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, Minus, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const timelineSteps = ['Admin Login', 'Question Info', 'Companies', 'Platforms', 'Answer & Note'];

export default function AddQuestionPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [authenticated, setAuthenticated] = useState(false);
    const [adminId, setAdminId] = useState('');
    const [adminPass, setAdminPass] = useState('');
    const [loggingIn, setLoggingIn] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        title: '',
        level: 'Easy',
        topic: '',
        companies: [''],
        revision: false,
        platforms: [{ name: '', link: '' }],
        description: '',
        example: '',
        explanation: '',
        answerCode: '',
        note: false,
        noteText: '',
    });

    const handleChange = (field) => (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setLoggingIn(true);
        try {
            const res = await fetch("https://dsa-practicesheet.onrender.com/api/admins/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ adminId, password: adminPass }),
            });
            const data = await res.json();
            if (res.ok) {
                setAuthenticated(true);
                toast.success('Admin authenticated');
                setCurrentStep(1);
            } else throw new Error(data.message || 'Invalid Admin credentials');
        } catch (err) {
            toast.error(err.message || 'Failed to authenticate admin');
        } finally {
            setLoggingIn(false);
        }
    };

    const nextStep = () => {
        if (currentStep === 1) {
            const { title, topic, description } = form;
            if (!title.trim() || !topic.trim() || !description.trim()) {
                toast.error("Please fill in Title, Topic, and Description before proceeding.");
                return;
            }
        }
        setCurrentStep((prev) => Math.min(prev + 1, 4));
    };

    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

    const handleSubmit = async (e) => {
        toast.success(currentStep)
        if (currentStep === 4) {
            const { answerCode } = form;
            if (!answerCode.trim()) {
                toast.error("Please provide the Answer Code before submitting.");
                return;
            }
        }
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch("https://dsa-practicesheet.onrender.com/api/questions/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    companies: form.companies.filter((c) => c.trim() !== ''),
                    platform: form.platforms.map((p) => p.name),
                    platformLink: form.platforms.map((p) => p.link),
                }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Question added successfully!');
                setForm({
                    title: '', level: 'Easy', topic: '', companies: [''], revision: false,
                    platforms: [{ name: '', link: '' }], description: '', example: '', explanation: '',
                    answerCode: '', note: false, noteText: '',
                });
                setCurrentStep(1);
            } else throw new Error(data.message || 'Failed to add question');
        } catch (err) {
            toast.error(err.message || 'An error occurred');
        } finally {
            setSubmitting(false);
        }
    };

    const inputClass = "w-full rounded-md px-4 py-2 bg-[#24233b] text-white border border-[#39385e] focus:outline-none focus:ring-2 focus:ring-[#7f5af0]";

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4">
                        <div className="flex flex-row gap-4 items-center">
                            <input placeholder="Topic" className={inputClass} value={form.topic} onChange={handleChange('topic')} />
                            <input placeholder="Title" className={inputClass} value={form.title} onChange={handleChange('title')} />
                        </div>
                        <div className="flex flex-row gap-4 items-center">
                            <select className={inputClass} value={form.level} onChange={handleChange('level')}>
                                <option>Easy</option><option>Medium</option><option>Hard</option>
                            </select>
                            <label className={inputClass}>
                                <input type="checkbox" checked={form.revision} onChange={handleChange("revision")} />
                                <span> Revision Needed</span>
                            </label>
                        </div>
                        <textarea placeholder="Description" className={inputClass} value={form.description} onChange={handleChange('description')} />
                        <textarea placeholder="Example" className={inputClass} value={form.example} onChange={handleChange('example')} />
                        <textarea placeholder="Explanation" className={inputClass} value={form.explanation} onChange={handleChange('explanation')} />
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-3">
                        {form.companies.map((company, i) => (
                            <div key={i} className="flex gap-2">
                                <input className={`${inputClass} flex-1`} placeholder={`Company ${i + 1}`} value={company} onChange={(e) => {
                                    const companies = [...form.companies];
                                    companies[i] = e.target.value;
                                    setForm({ ...form, companies });
                                }} />
                                <button onClick={() => {
                                    const companies = [...form.companies];
                                    companies.splice(i, 1);
                                    setForm({ ...form, companies });
                                }}><Minus className="text-red-500" /></button>
                            </div>
                        ))}
                        <button className="btn-primary" onClick={() => setForm({ ...form, companies: [...form.companies, ''] })}><Plus className="inline-block" /> Add Company</button>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-3">
                        {form.platforms.map((p, i) => (
                            <div key={i} className="flex flex-col md:flex-row gap-2">
                                <input className={`${inputClass} flex-1`} placeholder="Platform" value={p.name} onChange={(e) => {
                                    const platforms = [...form.platforms];
                                    platforms[i].name = e.target.value;
                                    setForm({ ...form, platforms });
                                }} />
                                <input className={`${inputClass} flex-1`} placeholder="Link" value={p.link} onChange={(e) => {
                                    const platforms = [...form.platforms];
                                    platforms[i].link = e.target.value;
                                    setForm({ ...form, platforms });
                                }} />
                                <button onClick={() => {
                                    const platforms = [...form.platforms];
                                    platforms.splice(i, 1);
                                    setForm({ ...form, platforms });
                                }}><Minus className="text-red-500" /></button>
                            </div>
                        ))}
                        <button className="btn-primary" onClick={() => setForm({ ...form, platforms: [...form.platforms, { name: '', link: '' }] })}><Plus className="inline-block" /> Add Platform</button>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-4">
                        <textarea placeholder="Answer Code" className={inputClass} value={form.answerCode} onChange={handleChange('answerCode')} />
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={form.note} onChange={handleChange('note')} /> Add Note
                        </label>
                        {form.note && <textarea placeholder="Note Text" className={inputClass} value={form.noteText} onChange={handleChange('noteText')} />}
                        <button className="btn-primary mt-4" onClick={handleSubmit} disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Question'}</button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#0f0e17] text-white">
            <Navbar />
            <Toaster />
            <div className="max-w-4xl w-full mx-auto px-4 py-6 flex-grow mt-20">
                <div className="flex items-center justify-between gap-2 mb-8">
                    {timelineSteps.map((step, idx) => (
                        <div key={idx} className={`flex-1 text-center ${currentStep === idx ? 'text-[#7f5af0]' : 'text-gray-400'}`}>
                            <div className={`text-sm ${currentStep === idx ? 'font-bold' : ''}`}>{step}</div>
                            {currentStep > idx && <CheckCircle className="mx-auto mt-3 text-green-500" size={20} />}
                            {currentStep === idx && <div className="h-1 bg-[#7f5af0] mt-1 rounded-full" />}
                        </div>
                    ))}
                </div>

                {!authenticated ? (
                    <div className="bg-[#1a1830] max-w-md mx-auto p-6 rounded-xl shadow-xl">
                        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
                        <input type="text" className={`${inputClass} mb-3`} placeholder="Admin ID" value={adminId} onChange={(e) => setAdminId(e.target.value)} />
                        <input type="password" className={`${inputClass} mb-3`} placeholder="Password" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} />
                        <button className="btn-primary w-full" onClick={handleAdminLogin} disabled={loggingIn}>{loggingIn ? 'Logging in...' : 'Login'}</button>
                    </div>
                ) : (
                    <div className="bg-[#1a1830] p-8 rounded-2xl shadow-2xl">
                        {renderStep()}
                        <div className="flex justify-between mt-8">
                            {currentStep > 1 && <button className="btn-primary" onClick={prevStep}>Back</button>}
                            {currentStep < 4 && <button className="btn-primary" onClick={nextStep}>Next</button>}
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
