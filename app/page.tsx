"use client";

import { useState } from 'react';
import { useRouter } from "next/navigation";
import Image from 'next/image';
import * as http from "node:http";

// --- SVG Icon Components ---

const MessageSquareIcon = ({ className }: { className: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
);

const ShieldCheckIcon = ({ className }: { className: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <path d="m9 12 2 2 4-4"></path>
    </svg>
);

const UsersIcon = ({ className }: { className: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
);

const CloudIcon = ({ className }: { className: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
    </svg>
);

const MenuIcon = ({ className }: { className: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
);

const XIcon = ({ className }: { className: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);


// --- Main Homepage Component ---

export default function HomePage() {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const goToLogin = () => {
        router.push("/login");
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, sectionId: string) => {
        e.preventDefault();
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        if(isMenuOpen) {
            setIsMenuOpen(false);
        }
    };

    return (
        <>
            <div className="bg-gray-50 min-h-screen text-gray-800 font-sans">
                {/* --- Mobile Menu --- */}
                {isMenuOpen && (
                    <div className="md:hidden fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center">
                        <button onClick={toggleMenu} className="absolute top-6 right-6" aria-label="Close menu">
                            <XIcon className="h-8 w-8 text-gray-700" />
                        </button>
                        <nav className="flex flex-col items-center space-y-8 text-2xl">
                            <a href="#features" onClick={(e) => handleNavLinkClick(e, 'features')} className="text-gray-600 hover:text-indigo-600 transition-colors">Features</a>
                            <a href="#pricing" onClick={(e) => handleNavLinkClick(e, 'pricing')} className="text-gray-600 hover:text-indigo-600 transition-colors">Pricing</a>
                            <a href="#contact" onClick={(e) => handleNavLinkClick(e, 'contact')} className="text-gray-600 hover:text-indigo-600 transition-colors">Contact</a>
                            <button onClick={goToLogin} className="mt-4 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition">Login</button>
                        </nav>
                    </div>
                )}

                {/* --- Header --- */}
                <header className="fixed top-0 left-0 right-0 bg-white bg-opacity-80 backdrop-blur-md shadow-sm z-50">
                    <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900 tracking-wider">Letter</h1>
                        <nav className="hidden md:flex items-center space-x-8">
                            <a href="#features" onClick={(e) => handleNavLinkClick(e, 'features')} className="text-gray-600 hover:text-indigo-600 transition-colors">Features</a>
                            <a href="#pricing" onClick={(e) => handleNavLinkClick(e, 'pricing')} className="text-gray-600 hover:text-indigo-600 transition-colors">Pricing</a>
                            <a href="#contact" onClick={(e) => handleNavLinkClick(e, 'contact')} className="text-gray-600 hover:text-indigo-600 transition-colors">Contact</a>
                        </nav>
                        <div className="hidden md:flex items-center gap-4">
                            <button onClick={goToLogin} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition">
                                Login
                            </button>
                            <button disabled className="px-6 py-2 bg-gray-300 text-gray-500 font-semibold rounded-lg cursor-not-allowed relative">
                                Register
                                <span className="absolute -top-2 -right-2 bg-yellow-400 text-gray-800 text-xs font-bold px-1.5 py-0.5 rounded-full transform rotate-12 shadow-sm">
                      SOON
                  </span>
                            </button>
                        </div>
                        <button className="md:hidden" onClick={toggleMenu} aria-label="Open menu">
                            <MenuIcon className="h-6 w-6 text-gray-700" />
                        </button>
                    </div>
                </header>

                <main>
                    {/* --- Hero Section --- */}
                    <section className="pt-32 pb-20 md:pt-40 md:pb-28">
                        <div className="container mx-auto px-6 text-center">
                            <div className="max-w-3xl mx-auto">
                                <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                                    Connect Instantly.
                                    <br />
                                    <span className="text-indigo-600">Chat Seamlessly.</span>
                                </h2>
                                <p className="text-lg md:text-xl text-gray-500 mb-10">
                                    Welcome to Letter, the next generation of messaging. Fast, secure, and designed for modern conversations.
                                </p>
                                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                                    <button onClick={goToLogin} className="w-full sm:w-auto bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-indigo-700 transition-all transform hover:scale-105">
                                        Get Started for Free
                                    </button>
                                    <button onClick={(e) => handleNavLinkClick(e, 'features')} className="w-full sm:w-auto bg-white text-gray-700 font-semibold px-8 py-4 rounded-xl shadow-md hover:bg-gray-100 transition-all transform hover:scale-105">
                                        Learn More
                                    </button>
                                </div>
                            </div>

                        </div>
                    </section>

                    {/* --- Features Section --- */}
                    <section id="features" className="py-20 bg-white">
                        <div className="container mx-auto px-6">
                            <div className="text-center mb-16">
                                <h3 className="text-3xl md:text-4xl font-bold text-gray-900">Why you&#39;ll love Letter</h3>
                                <p className="text-lg text-gray-500 mt-4 max-w-2xl mx-auto">
                                    We&#39;ve packed Letter with features to make your communication faster, safer, and more enjoyable.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                <div className="bg-gray-50 p-8 rounded-2xl text-center hover:shadow-xl hover:-translate-y-2 transition-all">
                                    <div className="bg-indigo-100 text-indigo-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                                        <MessageSquareIcon className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-xl font-semibold mb-2">Real-time Chat</h4>
                                    <p className="text-gray-500">Experience lightning-fast message delivery. No delays, no waiting.</p>
                                </div>
                                <div className="bg-gray-50 p-8 rounded-2xl text-center hover:shadow-xl hover:-translate-y-2 transition-all">
                                    <div className="bg-indigo-100 text-indigo-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                                        <ShieldCheckIcon className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-xl font-semibold mb-2">End-to-End Encryption</h4>
                                    <p className="text-gray-500">Your privacy is our priority. All conversations are secured and private.</p>
                                </div>
                                <div className="bg-gray-50 p-8 rounded-2xl text-center hover:shadow-xl hover:-translate-y-2 transition-all">
                                    <div className="bg-indigo-100 text-indigo-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                                        <UsersIcon className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-xl font-semibold mb-2">Group Conversations</h4>
                                    <p className="text-gray-500">Easily create and manage groups for your family, friends, or team.</p>
                                </div>
                                <div className="bg-gray-50 p-8 rounded-2xl text-center hover:shadow-xl hover:-translate-y-2 transition-all">
                                    <div className="bg-indigo-100 text-indigo-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                                        <CloudIcon className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-xl font-semibold mb-2">Cloud Sync</h4>
                                    <p className="text-gray-500">Keep your chats synced across all your devices, seamlessly.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* --- Call to Action Section --- */}
                    <section id="pricing" className="bg-indigo-600 text-white">
                        <div className="container mx-auto px-6 py-20 text-center">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Chatting?</h2>
                            <p className="text-lg md:text-xl text-indigo-200 mb-8 max-w-2xl mx-auto">
                                Join thousands of users who are already enjoying a better messaging experience with Letter.
                            </p>
                            <button onClick={goToLogin} className="bg-white text-indigo-600 font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-gray-100 transition-all transform hover:scale-105">
                                Download the App Now
                            </button>
                        </div>
                    </section>
                </main>

                {/* --- Footer --- */}
                <footer id="contact" className="bg-gray-900 text-gray-400">
                    <div className="container mx-auto px-6 py-12">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div className="col-span-2 md:col-span-1">
                                <h2 className="text-2xl font-bold text-white mb-2">Letter</h2>
                                <p>The future of messaging.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-white mb-4">Product</h3>
                                <ul>
                                    <li className="my-2"><a href="#features" onClick={(e) => handleNavLinkClick(e, 'features')} className="hover:text-white">Features</a></li>
                                    <li className="my-2"><a href="#" className="hover:text-white">Security</a></li>
                                    <li className="my-2"><a href="#pricing" onClick={(e) => handleNavLinkClick(e, 'pricing')} className="hover:text-white">Pricing</a></li>
                                    <li className="my-2"><a href="#" className="hover:text-white">Download</a></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-white mb-4">Company</h3>
                                <ul>
                                    <li className="my-2"><a href="#" className="hover:text-white">About Us</a></li>
                                    <li className="my-2"><a href="#" className="hover:text-white">Careers</a></li>
                                    <li className="my-2"><a href="#" className="hover:text-white">Blog</a></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-white mb-4">Support</h3>
                                <ul>
                                    <li className="my-2"><a href="#" className="hover:text-white">Help Center</a></li>
                                    <li className="my-2"><a href="#contact" onClick={(e) => handleNavLinkClick(e, 'contact')} className="hover:text-white">Contact Us</a></li>
                                    <li className="my-2"><a href="#" className="hover:text-white">Privacy Policy</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm">

                            <p>&copy; {new Date().getFullYear()} Letter Inc. All rights reserved.Made by <a href="https://www.linkedin.com/in/sourav-kumar-nayak" className="mr-4 text-white hover:text-blue-600">@Sourav</a></p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

