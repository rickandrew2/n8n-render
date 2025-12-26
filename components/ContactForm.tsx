"use client";

import { useState, FormEvent } from "react";
import {
  validateContactForm,
  formatContactPayload,
  type ContactFormData,
} from "@/lib/utils";

// Constants for form behavior
const SUCCESS_MESSAGE_DURATION = 5000; // milliseconds
const DEFAULT_API_ENDPOINT = "/api/contact";

// Error messages for form submission
const FORM_ERROR_MESSAGES = {
  SUBMIT_FAILED: "Failed to submit form. Please try again.",
  GENERIC_ERROR: "An error occurred. Please try again later.",
  SUCCESS: "Thank you! Your message has been sent. We'll get back to you soon.",
} as const;

/**
 * ContactForm Component
 * Handles user inquiries with client-side validation and submission
 *
 * Automation Flow:
 * 1. User submits form → Client validates input
 * 2. Form data formatted with metadata (source, timestamp)
 * 3. POST request sent to /api/contact endpoint
 * 4. API route receives data and prepares for n8n webhook
 * 5. n8n workflow triggered → Processes inquiry
 * 6. AI response generation → Automated reply sent to user
 *
 * The payload structure is designed for easy consumption by n8n webhooks,
 * which will then trigger AI-powered response generation workflows.
 */

interface FormErrors {
  name?: string;
  email?: string;
  interest?: string;
  message?: string;
  submit?: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    interest: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: ContactFormData) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev: FormErrors) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setIsSuccess(false);

    // Client-side validation
    const validation = validateContactForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Format payload with metadata for automation tracking
      // This structure is optimized for n8n webhook consumption
      const payload = formatContactPayload(formData);

      // Determine API endpoint - can be overridden via environment variable
      // for direct n8n webhook integration in production
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_ENDPOINT;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || FORM_ERROR_MESSAGES.SUBMIT_FAILED
        );
      }

      // Success - form will be reset and success message shown
      setIsSuccess(true);
      setFormData({ name: "", email: "", interest: "", message: "" });

      // Reset success message after configured duration
      setTimeout(() => {
        setIsSuccess(false);
      }, SUCCESS_MESSAGE_DURATION);
    } catch (error) {
      setErrors({
        submit:
          error instanceof Error
            ? error.message
            : FORM_ERROR_MESSAGES.GENERIC_ERROR,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative bg-gradient-to-b from-black via-gray-900 to-primary-dark py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Subtle texture overlay for speckled effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>
      
      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left side - SAY HELLO section */}
          <div className="text-white">
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              SAY HELLO!
            </h2>
            <p className="text-lg sm:text-xl text-white leading-relaxed">
              Have a project in mind? Let's discuss how we can help automate and optimize your business processes with AI-powered solutions. We're here to transform your ideas into reality.
            </p>
          </div>

          {/* Right side - Contact Form */}
          <div className="bg-transparent">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="block w-full bg-transparent border-0 border-b border-gray-600 pb-3 text-white placeholder:text-gray-500 focus:border-primary focus:outline-none transition-colors text-base"
                  placeholder="Your name here"
                />
                {errors.name && (
                  <p className="text-sm text-red-400">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="block w-full bg-transparent border-0 border-b border-gray-600 pb-3 text-white placeholder:text-gray-500 focus:border-primary focus:outline-none transition-colors text-base"
                  placeholder="Your email here"
                />
                {errors.email && (
                  <p className="text-sm text-red-400">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <select
                  name="interest"
                  id="interest"
                  value={formData.interest}
                  onChange={handleChange}
                  required
                  className="block w-full bg-transparent border-0 border-b border-gray-600 pb-3 text-white focus:border-primary focus:outline-none transition-colors text-base appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2314B8A6' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0 center',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2rem'
                  }}
                >
                  <option value="" className="bg-black text-gray-500">What are you interested in?</option>
                  <option value="ai-automation" className="bg-black text-white">AI Automation</option>
                  <option value="workflow-optimization" className="bg-black text-white">Workflow Optimization</option>
                  <option value="digital-marketing" className="bg-black text-white">Digital Marketing</option>
                  <option value="custom-integrations" className="bg-black text-white">Custom Integrations</option>
                  <option value="consulting" className="bg-black text-white">Consulting</option>
                </select>
                {errors.interest && (
                  <p className="text-sm text-red-400">{errors.interest}</p>
                )}
              </div>

              <div className="space-y-2">
                <textarea
                  name="message"
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="block w-full bg-transparent border-0 border-b border-gray-600 pb-3 text-white placeholder:text-gray-500 focus:border-primary focus:outline-none transition-colors resize-none text-base"
                  placeholder="Resume it in a few words"
                />
                {errors.message && (
                  <p className="text-sm text-red-400">{errors.message}</p>
                )}
              </div>

              {errors.submit && (
                <div className="rounded-xl bg-red-900/50 p-4">
                  <p className="text-sm text-red-300">{errors.submit}</p>
                </div>
              )}

              {isSuccess && (
                <div className="rounded-xl bg-primary/20 p-4">
                  <p className="text-sm text-primary-light">
                    {FORM_ERROR_MESSAGES.SUCCESS}
                  </p>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg border border-primary bg-black px-6 py-3 text-base font-medium text-white transition-all hover:bg-primary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
