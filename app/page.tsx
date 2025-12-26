import Hero from "@/components/Hero";
import Services from "@/components/Services";
import ContactForm from "@/components/ContactForm";
import Navbar from "@/components/Navbar";

/**
 * Main Landing Page
 * Composes Navbar, Hero, Services, and Contact sections
 * Clean, modern layout optimized for conversions
 */
export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Services />
      <ContactForm />
    </main>
  );
}

