import Link from "next/link";
import { Facebook } from 'lucide-react';
import { Instagram } from 'lucide-react';
import { Twitter } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-slate-800 text-white mt-20">
            <div className="container py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo & Description */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold">Call for Blood</h3>
                        <p className="text-white/80">
                            Connecting donors with those in need since 2021. Every drop counts.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold">Quick Links</h4>
                        <ul className="space-y-2">
                            {['Home', 'About Us', 'Donation Process', 'Contact'].map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-white/80 hover:text-white transition-colors">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold">Contact Us</h4>
                        <ul className="space-y-2 text-white/80">
                            <li>Address: Metropolitan University, Bangladesh</li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold">Follow Us</h4>
                        <ul className="space-y-2 text-white/80 flex gap-2 items-center">
                            <li>
                                <Link href="/">
                                    <Facebook />
                                </Link>
                            </li>
                            <li>
                                <Link href="/">
                                    <Instagram />
                                </Link>
                            </li>
                            <li>
                                <Link href="/">
                                    <Twitter />
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    )
}
