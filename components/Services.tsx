"use client";

import { useState } from "react";
import { ArrowRight, Zap, Link2, Brain, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Services Section Component
 * Modern expandable accordion with numbered sections
 */

interface Service {
  title: string;
  subCategories: string[];
  description: string;
  icon: React.ReactNode;
}

const services: Service[] = [
  {
    title: "Precision Workflow Automation",
    subCategories: ["n8n Workflows", "Zapier Integration", "Make Automation"],
    description:
      "Forget the frustration of manual processes. With our automation solutions, your workflows run perfectly the first time, every time. We create automated workflows using n8n, Zapier, and Make to streamline your business operations and eliminate repetitive tasks.",
    icon: <Zap className="w-5 h-5" />,
  },
  {
    title: "Seamless Integration Development",
    subCategories: ["API Integration", "Database Connections", "Platform Sync"],
    description:
      "Easily connect and integrate your tools. Watch your systems work together like a well-orchestrated symphony. Our team builds custom integrations between your existing platforms, APIs, and databases to create a unified workflow ecosystem.",
    icon: <Link2 className="w-5 h-5" />,
  },
  {
    title: "Personalized AI Solutions",
    subCategories: ["GPT Agents", "Claude Integration", "Gemini Automation"],
    description:
      "We offer a selection of specialized AI agents, each designed to excel in specific automation and business tasks. Harness advanced AI models like GPT, Claude, and Gemini for insightful, tailored interactions that drive creativity and solutions.",
    icon: <Brain className="w-5 h-5" />,
  },
  {
    title: "Custom Development & Consulting",
    subCategories: ["Strategy Planning", "Technical Consulting", "Implementation Support"],
    description:
      "Get expert guidance and custom development solutions tailored to your specific needs. From initial strategy to full implementation, we provide comprehensive support to ensure your automation projects succeed.",
    icon: <Wrench className="w-5 h-5" />,
  },
];

export default function Services() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);

  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSectionClick = (index: number) => {
    if (clickedIndex === index) {
      setClickedIndex(null);
    } else {
      setClickedIndex(index);
    }
  };

  const handleMouseEnter = (index: number) => {
    if (clickedIndex === null) {
      setExpandedIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (clickedIndex === null) {
      setExpandedIndex(null);
    }
  };

  return (
    <section id="services" className="bg-muted/30 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-accent text-accent-foreground text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary" />
            Our Expertise
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
            How We Help You
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Our team of experts is dedicated to helping you achieve your automation goals.
          </p>
        </div>

        {/* Services Accordion */}
        <div className="space-y-2 sm:space-y-3">
          {services.map((service, index) => {
            const isExpanded = expandedIndex === index || clickedIndex === index;
            const serviceNumber = String(index + 1).padStart(2, "0");

            return (
              <div
                key={index}
                className={cn(
                  "relative rounded-xl sm:rounded-2xl transition-all duration-700 ease-in-out cursor-pointer overflow-hidden group",
                  "border bg-card",
                  isExpanded
                    ? "border-primary/30 shadow-xl shadow-primary/10"
                    : "border-border hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
                )}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleSectionClick(index)}
              >
                {/* Gradient accent line */}
                <div
                  className={cn(
                    "absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-primary-dark transition-opacity duration-500 ease-in-out",
                    isExpanded ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                  )}
                />

                <div className="p-4 sm:p-6 lg:p-8">
                  <div className="flex items-start gap-3 sm:gap-5">
                    {/* Service Number & Icon */}
                    <div className="flex-shrink-0 flex flex-col items-center gap-2">
                      <div
                        className={cn(
                          "w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-500 ease-in-out",
                          isExpanded
                            ? "bg-primary text-white shadow-lg shadow-primary/30"
                            : "bg-muted text-muted-foreground group-hover:bg-accent group-hover:text-accent-foreground"
                        )}
                      >
                        {service.icon}
                      </div>
                      <span
                        className={cn(
                          "text-xs font-bold transition-colors duration-500 ease-in-out",
                          isExpanded ? "text-primary" : "text-muted-foreground"
                        )}
                      >
                        {serviceNumber}
                      </span>
                    </div>

                    {/* Service Content */}
                    <div className="flex-1 min-w-0">
                      {/* Title */}
                      <h3
                        className={cn(
                          "text-lg sm:text-xl lg:text-2xl font-bold mb-2 transition-colors duration-300",
                          isExpanded ? "text-foreground" : "text-foreground"
                        )}
                      >
                        {service.title}
                      </h3>

                      {/* Sub-categories */}
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                        {service.subCategories.map((cat, i) => (
                          <span
                            key={i}
                            className={cn(
                              "px-2 sm:px-3 py-1 rounded-full text-xs font-medium transition-all duration-500 ease-in-out",
                              isExpanded
                                ? "bg-primary/10 text-primary"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {cat}
                          </span>
                        ))}
                      </div>

                      {/* Description - Only visible when expanded */}
                      <div
                        className={cn(
                          "overflow-hidden transition-all duration-700 ease-in-out",
                          isExpanded
                            ? "max-h-96 opacity-100 mt-4"
                            : "max-h-0 opacity-0 mt-0"
                        )}
                      >
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4 sm:mb-6">
                          {service.description}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            scrollToContact();
                          }}
                          className="group/btn inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-primary text-white font-medium text-xs sm:text-sm transition-all duration-300 hover:bg-primary-dark shadow-md shadow-primary/30 hover:shadow-lg hover:shadow-primary/40"
                        >
                          Discuss Project
                          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                        </button>
                      </div>
                    </div>

                    {/* Expand indicator */}
                    <div className="flex-shrink-0 hidden lg:block">
                      <div
                        className={cn(
                          "w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-500 ease-in-out",
                          isExpanded
                            ? "bg-primary text-white rotate-90"
                            : "bg-muted text-muted-foreground group-hover:bg-accent"
                        )}
                      >
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
