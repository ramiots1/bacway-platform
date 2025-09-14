
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from '@/i18n/TranslationProvider';
import LanguageSwitcher from '@/i18n/LanguageSwitcher';

const NavbarPublic = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const { t } = useTranslation();
    const pathname = usePathname();

    const scrollToTop = (e: React.MouseEvent) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        setIsMenuOpen(false);
    };

    // Smart navigation handler for logo
    const handleLogoClick = (e: React.MouseEvent) => {
        if (pathname === '/') {
            // On landing page - scroll to top
            scrollToTop(e);
        } else {
            // On other pages - navigate to home
            setIsMenuOpen(false);
        }
    };

    // Smart navigation handler for nav links
    const handleNavClick = (targetPath: string, e: React.MouseEvent) => {
        if (pathname === targetPath) {
            // Same page - scroll to top
            scrollToTop(e);
        } else {
            // Different page - allow normal navigation
            setIsMenuOpen(false);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
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
            const ev = e as Event & { composedPath?: () => EventTarget[], path?: EventTarget[] };
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
        <nav className="fixed left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] md:w-[calc(100%-5rem)] max-w-7xl top-5 z-100">
            {/* Desktop and Mobile Navbar - Stretches down when menu opens */}
            <div className={`relative backdrop-blur-sm w-full transition-all duration-500 ease-out z-100 overflow-hidden
                ${isScrolled 
                    ? 'bg-black md:bg-black/60' 
                    : 'bg-black md:bg-transparent'
                }
                ${isMenuOpen 
                    ? 'rounded-4xl' // Fully rounded when menu is open (top and bottom)
                    : 'rounded-4xl h-16' // Full rounded when menu is closed
                }
            `}>
                
                {/* Top navbar section */}
                <div className="flex h-16 w-full items-center justify-between px-8 md:px-10">
                    <div className='flex items-center gap-4'>
                        <Link href="/" className="flex items-center" onClick={handleLogoClick}>
                        <Image src="/bacwayLogoWhite.svg" alt="Logo" width={80} height={18} className="h-4.5" />
                        </Link>
                        <div className="hidden md:block">
                        <LanguageSwitcher />
                    </div>
                    </div>
                    
                    
                    <div className="md:hidden">
                        <LanguageSwitcher />
                    </div>
                
                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/" className="hover:text-gray-300 transition-colors" onClick={(e) => handleNavClick('/', e)}>
                            <span suppressHydrationWarning>{t('nav.home')}</span>
                        </Link>
                        <Link href="/collabs" className=" hover:text-gray-300 transition-colors" onClick={(e) => handleNavClick('/collabs', e)}>
                            <span suppressHydrationWarning>{t('nav.collab')}</span>
                        </Link>
                        <Link href="/about" className=" hover:text-gray-300 transition-colors" onClick={(e) => handleNavClick('/about', e)}>
                            <span suppressHydrationWarning>{t('nav.about')}</span>
                        </Link>
                        <Link href="/login" className=" hover:text-gray-300 transition-colors border-1 rounded-2xl px-6 py-1" onClick={(e) => handleNavClick('/login', e)}>
                            <span suppressHydrationWarning>{t('nav.login')}</span>
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
                </div>

                {/* Mobile Menu - Integrated as part of navbar stretch */}
                <div id="mobile-menu" ref={menuRef} className={`transition-all duration-600 ease-in-out md:hidden transform origin-top overflow-hidden
                    ${isMenuOpen 
                        ? 'max-h-80 opacity-100 pointer-events-auto scale-y-100' 
                        : 'max-h-0 opacity-0 pointer-events-none scale-y-95'
                    }`}>
                    <div className={`flex flex-col items-center py-4 space-y-4 transition-all duration-500 ease-in-out
                        ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'}
                    `}>
                        <Link 
                            href="/" 
                            className="hover:text-gray-300 transition-colors w-full text-center py-2"
                            onClick={(e) => handleNavClick('/', e)}
                        >
                            <span suppressHydrationWarning>{t('nav.home')}</span>
                        </Link>
                        <Link 
                            href="/collabs" 
                            className=" hover:text-gray-300 transition-colors w-full text-center py-2"
                            onClick={(e) => handleNavClick('/collabs', e)}
                        >
                            <span suppressHydrationWarning>{t('nav.collab')}</span>
                        </Link>
                        <Link 
                            href="/about" 
                            className=" hover:text-gray-300 transition-colors w-full text-center py-2"
                            onClick={(e) => handleNavClick('/about', e)}
                        >
                            <span suppressHydrationWarning>{t('nav.about')}</span>
                        </Link>
                        <Link 
                            href="/login" 
                            className=" hover:text-gray-300 border-1 w-35 rounded-2xl transition-colors text-center py-1"
                            onClick={(e) => handleNavClick('/login', e)}
                        >
                            <span suppressHydrationWarning>{t('nav.login')}</span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default NavbarPublic