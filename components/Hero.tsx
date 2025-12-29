"use client";


/**
 * Hero Section Component
 * Modern dark gradient layout with service categories and infinite marquee
 */
export default function Hero() {
  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToServices = () => {
    const servicesSection = document.getElementById("services");
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const automationTools = [
    { name: "n8n", logo: "/n8n_pink+white_logo.png" },
    { name: "Zapier", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Zapier_logo.svg" },
    { name: "Make", logo: "https://cdn.worldvectorlogo.com/logos/make-logo-rgb-3.svg" },
    { name: "OpenAI", logo: "https://cdn.worldvectorlogo.com/logos/openai-2.svg" },
    { name: "Claude", logo: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Claude_AI_logo.svg" },
    { name: "Gemini", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Google_Gemini_logo_2025.svg/640px-Google_Gemini_logo_2025.svg.png" },
    { name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Meta_Platforms_Inc._logo_%28cropped%29.svg/640px-Meta_Platforms_Inc._logo_%28cropped%29.svg.png" },
    { name: "Hugging Face", logo: "https://cdn.worldvectorlogo.com/logos/huggingface-1.svg" },
    { name: "LangChain", logo: "https://cdn.worldvectorlogo.com/logos/langchain-1.svg" },
    { name: "Airtable", logo: "https://cdn.worldvectorlogo.com/logos/airtable-1.svg" },
  ];

  return (
    <section id="home" className="relative min-h-screen bg-gradient-to-b from-black via-gray-900 to-primary-dark overflow-hidden flex flex-col">
      {/* Main Content */}
      <div className="relative mx-auto max-w-7xl px-4 pt-12 pb-4 sm:px-6 sm:pt-16 sm:pb-6 lg:px-8 lg:pt-20 lg:pb-8 flex-1 flex items-center">
        <div className="max-w-4xl mx-auto text-center w-full mb-12 sm:mb-16">
          {/* Bold Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-4 sm:mb-6 leading-tight tracking-tight">
            Where Innovation
            <br />
            <span className="text-white">Becomes Execution</span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-gray-300 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
            We create intelligent automation solutions that help businesses move faster and convert better. Your business deserves more than just automation. It needs results.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <button
              onClick={scrollToContact}
              className="group relative overflow-hidden rounded-lg bg-primary px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white shadow-xl shadow-primary/30 transition-all duration-300 hover:bg-primary-dark hover:shadow-2xl hover:shadow-primary/40"
            >
              Start a Project
            </button>
            <button
              onClick={scrollToServices}
              className="group relative overflow-hidden rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white transition-all duration-300 hover:bg-white/20"
            >
              See Work
            </button>
          </div>
        </div>
      </div>

      {/* Infinite Marquee - Bottom */}
      <div className="absolute bottom-0 left-0 right-0 py-4 sm:py-6 lg:py-8 bg-primary-dark/50 backdrop-blur-sm border-t border-white/10">
        <div className="overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...automationTools, ...automationTools, ...automationTools, ...automationTools].map((tool, index) => (
              <div
                key={`bottom-${tool.name}-${index}`}
                className="flex items-center justify-center gap-2 sm:gap-3 mx-4 sm:mx-6 lg:mx-8 text-white flex-shrink-0 group"
              >
                {tool.logo ? (
                  <img
                    src={tool.logo}
                    alt={tool.name}
                    className="h-6 sm:h-8 w-auto object-contain opacity-20 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      if (target.nextElementSibling) {
                        (target.nextElementSibling as HTMLElement).style.display = 'block';
                      }
                    }}
                  />
                ) : null}
                <span className="text-xs sm:text-sm font-medium opacity-20 group-hover:opacity-100 transition-opacity duration-300" style={{ display: tool.logo ? 'none' : 'block' }}>
                  {tool.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

