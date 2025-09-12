
"use client";

import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react'

const NavbarPublic = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const scrollToTop = (e: React.MouseEvent) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        setIsMenuOpen(false);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when clicking/tapping outside of it.
    // Use click/touchend and composedPath for more reliable detection and to avoid
    // racing with the button's click handler.
    useEffect(() => {
        const handleOutsideClick = (e: Event) => {
            if (!isMenuOpen) return;
            const ev: any = e;
            const path: EventTarget[] = ev.composedPath ? ev.composedPath() : (ev.path || []);
            // If composedPath is not available, fall back to target containment checks
            if (path && path.length) {
                if (menuRef.current && path.includes(menuRef.current)) return;
                if (buttonRef.current && path.includes(buttonRef.current)) return;
                setIsMenuOpen(false);
                return;
            }

            const target = e.target as Node | null;
            if (!target) return;
            if (menuRef.current && menuRef.current.contains(target)) return;
            if (buttonRef.current && buttonRef.current.contains(target)) return;
            setIsMenuOpen(false);
        };

        document.addEventListener('click', handleOutsideClick);
        document.addEventListener('touchend', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
            document.removeEventListener('touchend', handleOutsideClick);
        };
    }, [isMenuOpen]);

    return (
        <nav className="fixed left-1/2 -translate-x-1/2 flex flex-col justify-center w-[calc(100%-2rem)] md:w-[calc(100%-10rem)] max-w-7xl top-5 rounded-4xl overflow-hidden">
            {/* Desktop and Mobile Navbar */}
            <div className={` backdrop-blur-sm flex h-16 w-full items-center justify-between px-8 md:px-10 transition-all duration-300 z-50 
                ${isScrolled 
                    ? 'bg-black md:bg-black/60' 
                    : 'bg-black md:bg-transparent'
                }
                ${!isMenuOpen && "rounded-4xl"}`}>

                <Link href="/" className="flex items-center" onClick={scrollToTop}>
                    <img src="/logowhite.svg" alt="Logo" className="h-4" />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/" className="hover:text-gray-300 transition-colors" onClick={scrollToTop}>
                        Home
                    </Link>
                    <Link href="/collabs" className=" hover:text-gray-300 transition-colors">
                        Collab
                    </Link>
                    <Link href="/about" className=" hover:text-gray-300 transition-colors">
                        About
                    </Link>
                    <Link href="/login" className=" hover:text-gray-300 transition-colors border-1 rounded-2xl px-8 py-1.5">
                        Log in
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button 
                    ref={buttonRef}
                    aria-expanded={isMenuOpen}
                    aria-controls="mobile-menu"
                    className="md:hidden p-2 relative w-10 h-10 text-white"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        setIsMenuOpen(prev => !prev);
                    }}
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => e.stopPropagation()}
                >
                    <div className=" w-6 h-4 transform transition-all duration-300 ">
                        <span className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${isMenuOpen ? 'rotate-45 translate-y-2.5' : 'translate-y-0'}`} />
                        <span className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out translate-y-2 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
                        <span className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${isMenuOpen ? '-rotate-45 translate-y-2.5' : 'translate-y-4'}`} />
                    </div>
                </button>

                {/* Mobile Menu Dropdown */}
                
            </div>
                <div>
                <div id="mobile-menu" ref={menuRef} className={`left-0 w-full bg-black transition-transform duration-300 ease-in-out z-40 md:hidden rounded-b-4xl
                    ${isMenuOpen ? 'transform translate-y-0' : 'transform -translate-y-full'}`}>
                    <div className="flex flex-col items-center py-4 space-y-4">
                        <Link 
                            href="/" 
                            className="hover:text-gray-300 transition-colors w-full text-center py-2"
                            onClick={(e) => {
                                scrollToTop(e);
                                setIsMenuOpen(false);
                            }}
                        >
                            Home
                        </Link>
                        <Link 
                            href="/collabs" 
                            className=" hover:text-gray-300 transition-colors w-full text-center py-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Collab
                        </Link>
                        <Link 
                            href="/about" 
                            className=" hover:text-gray-300 transition-colors w-full text-center py-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            About
                        </Link>
                        <Link 
                            href="/login" 
                            className=" hover:text-gray-300 border-1 w-25 rounded-2xl transition-colors text-center py-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Log in
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default NavbarPublic