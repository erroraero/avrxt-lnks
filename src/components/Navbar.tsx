'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '@/app/actions/auth';

export default function Navbar() {
    const pathname = usePathname();

    return (
        <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl">
            <nav className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
                <Link href="/" className="transition-opacity hover:opacity-70">
                    <img src="https://cdn.avrxt.in/assets/logo.png" alt="avrxt" className="h-10 md:h-12 w-auto" />
                </Link>

                <div className="flex items-center gap-4">
                    {pathname === '/admin' && (
                        <button
                            onClick={() => logout()}
                            className="text-[12px] font-bold tracking-widest text-zinc-500 hover:text-white transition-colors uppercase"
                        >
                            Log Out
                        </button>
                    )}
                </div>
            </nav>
        </header>
    );
}
