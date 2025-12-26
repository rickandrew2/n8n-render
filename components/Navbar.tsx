"use client";

import { useState, useEffect } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Floating Navigation Bar Component
 * Modern glassmorphism style with centered pill navigation
 */
export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll detection for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Active section detection using Intersection Observer
  useEffect(() => {
    const sections = ["home", "services", "contact"];
    const observers: IntersectionObserver[] = [];

    sections.forEach((sectionId) => {
      const section = document.getElementById(sectionId);
      if (section) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveSection(sectionId);
              }
            });
          },
          {
            threshold: 0.3,
            rootMargin: "-100px 0px -100px 0px",
          }
        );
        observer.observe(section);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { id: "home", label: "Home" },
    { id: "services", label: "Services" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <>
      <nav
        className={cn(
          "fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out",
          isScrolled
            ? "w-[calc(100%-2rem)] max-w-5xl"
            : "w-[calc(100%-3rem)] max-w-6xl"
        )}
      >
        <div
          className={cn(
            "relative flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-500",
            activeSection === "home" && !isScrolled
              ? "bg-transparent backdrop-blur-sm border-transparent"
              : "bg-white/80 backdrop-blur-xl border border-gray-200",
            isScrolled
              ? "shadow-lg shadow-primary/10"
              : "shadow-md shadow-primary/5"
          )}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

          {/* Logo - Left Side */}
          <button
            onClick={() => scrollToSection("home")}
            className="flex items-center gap-2.5 group"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-shadow duration-300">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -inset-1 rounded-xl bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className={cn(
              "text-lg font-bold tracking-tight hidden sm:block transition-colors duration-500",
              activeSection === "home" && !isScrolled ? "text-white" : "text-gray-900"
            )}>
              IAutomate
            </span>
          </button>

          {/* Center Navigation - Pill Style */}
          <div className="hidden md:flex items-center">
            <div className={cn(
              "flex items-center rounded-full p-1 gap-1 transition-all duration-500",
              activeSection === "home" && !isScrolled
                ? "bg-white/10 backdrop-blur-sm"
                : "bg-gray-100/50"
            )}>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    "relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300",
                    activeSection === item.id
                      ? "text-white"
                      : activeSection === "home" && !isScrolled
                      ? "text-white/80 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  {activeSection === item.id && (
                    <span className="absolute inset-0 bg-primary rounded-full shadow-md shadow-primary/30 animate-in fade-in zoom-in-95 duration-300" />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Side - Actions */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scrollToSection("contact")}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                activeSection === "home" && !isScrolled
                  ? "text-white/80 hover:text-white hover:bg-white/10"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/70"
              )}
            >
              Sign in
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="group relative px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-primary overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/40"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary-dark to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center gap-1.5">
                Get started
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              "md:hidden p-2 rounded-xl transition-colors",
              activeSection === "home" && !isScrolled
                ? "text-white hover:bg-white/10"
                : "text-gray-900 hover:bg-gray-100/70"
            )}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile menu - Dropdown */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-out",
            isMobileMenuOpen
              ? "max-h-80 opacity-100 mt-2"
              : "max-h-0 opacity-0"
          )}
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200 p-3 shadow-xl shadow-primary/10">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    "text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    activeSection === item.id
                      ? "text-white bg-primary shadow-md shadow-primary/30"
                      : "text-gray-900 hover:bg-gray-100/70"
                  )}
                >
                  {item.label}
                </button>
              ))}
              
              <div className="h-px bg-gray-200 my-2" />
              
              <button
                onClick={() => scrollToSection("contact")}
                className="text-left px-4 py-3 rounded-xl text-sm font-medium text-white-900 hover:bg-gray-100/70 transition-all duration-200"
              >
                Sign in
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="px-4 py-3 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-dark transition-all duration-200 shadow-md shadow-primary/30"
              >
                Get started
              </button>
            </div>
          </div>
        </div>
      </nav>

    </>
  );
}
