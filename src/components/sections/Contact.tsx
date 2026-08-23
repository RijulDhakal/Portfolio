"use client";

import { useState, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { ApiError, publicApi, type SocialLinkDto } from "@/lib/api";
import { useTypographyResolver } from "@/components/typography/TypographyProvider";
import { useSiteCopy } from "@/components/sitecopy/SiteCopyProvider";
import { DEFAULT_CONTACT_EMAIL } from "@/lib/contentDefaults";

interface ContactProps {
  socialLinks?: SocialLinkDto[];
}

export default function Contact({ socialLinks }: ContactProps) {
  const typography = useTypographyResolver();
  const copy = useSiteCopy();
  const containerRef = useRef<HTMLElement>(null);
  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const emailLink =
    socialLinks?.find((l) => l.platform.toLowerCase() === "email")?.url ??
    DEFAULT_CONTACT_EMAIL;
  const displayEmail = emailLink.replace(/^mailto:/, "");
  const phoneHref = `tel:+${copy.contact.phoneNumber.replace(/\D/g, "")}`;

  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.from(".contact-line", {
      y: 100,
      opacity: 0,
      stagger: 0.1,
      duration: 1.5,
      ease: "power4.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
      }
    });

  }, { scope: containerRef });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("loading");
    setErrorMessage(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    try {
      await publicApi.submitContact({ name, email, message });
      form.reset();
      setFormState("success");
    } catch (err) {
      setFormState("error");
      setErrorMessage(
        err instanceof ApiError
          ? err.message
          : copy.contact.errorFallback
      );
    }
  };

  return (
    <section id="contact" ref={containerRef} className="w-full py-32 md:py-48 px-4 md:px-12 lg:px-24 bg-background text-foreground overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-16">
          <span className="text-electric font-bold tracking-widest text-sm" style={typography("contact.number")}>{copy.contact.number}</span>
          <span className="tracking-[0.2em] uppercase text-xs font-bold text-secondary" style={typography("contact.label")}>{copy.contact.label}</span>
        </div>

        {/* Huge Typography */}
        <div className="flex flex-col font-display font-bold text-4xl sm:text-6xl md:text-[8rem] lg:text-[9rem] leading-[0.85] tracking-tighter uppercase mb-24 md:mb-32 break-words" style={typography("contact.heading")}>
          <div className="overflow-hidden pb-4">
            <span className="contact-line block">{copy.contact.headingLine1}</span>
          </div>
          <div className="overflow-hidden pb-4">
            <span className="contact-line block">{copy.contact.headingLine2}</span>
          </div>
          <div className="overflow-hidden pb-4">
            <span className="contact-line block text-electric">{copy.contact.headingLine3}</span>
          </div>
        </div>

        {/* Content & Form */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left Info */}
          <div className="w-full lg:w-1/3 flex flex-col gap-12">
            <p className="text-xl md:text-2xl text-secondary leading-relaxed" style={typography("contact.body")}>
              {copy.contact.body}
            </p>

            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold tracking-widest text-secondary uppercase" style={typography("contact.fieldLabel")}>{copy.contact.emailLabel}</span>
                <a href={emailLink} className="text-xl font-medium hover:text-electric transition-colors" data-cursor={copy.globalUi.cursorOpen} style={typography("contact.fieldValue")}>
                  {displayEmail}
                </a>
              </div>
              
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold tracking-widest text-secondary uppercase" style={typography("contact.fieldLabel")}>{copy.contact.phoneLabel}</span>
                <a href={phoneHref} className="text-xl font-medium hover:text-electric transition-colors" style={typography("contact.fieldValue")}>
                  {copy.contact.phoneNumber}
                </a>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="w-full lg:w-2/3">
            {formState === "success" ? (
              <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center gap-6 bg-surface border border-border p-8 md:p-16 text-center animate-in fade-in duration-500">
                <div className="w-16 h-16 rounded-full bg-electric/20 text-electric flex items-center justify-center mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="font-display text-3xl font-bold" style={typography("contact.successTitle")}>{copy.contact.successTitle}</h3>
                <p className="text-secondary text-lg" style={typography("contact.successBody")}>{copy.contact.successBody}</p>
                <button 
                  onClick={() => setFormState("idle")}
                  className="mt-4 px-6 py-2 rounded-full border border-border hover:bg-surface transition-colors font-bold text-sm" style={typography("contact.buttonLabel")}
                >
                  {copy.contact.sendAnotherLabel}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="w-full flex flex-col gap-2">
                    <label htmlFor="name" className="text-xs font-bold tracking-widest text-secondary uppercase">{copy.contact.formNameLabel}</label>
                    <input 
                      type="text" 
                      id="name"
                      name="name"
                      required
                      className="w-full bg-transparent border-b border-border py-4 focus:outline-none focus:border-electric transition-colors text-lg"
                      placeholder={copy.contact.namePlaceholder}
                    />
                  </div>
                  <div className="w-full flex flex-col gap-2">
                    <label htmlFor="email" className="text-xs font-bold tracking-widest text-secondary uppercase">{copy.contact.formEmailLabel}</label>
                    <input 
                      type="email" 
                      id="email"
                      name="email"
                      required
                      className="w-full bg-transparent border-b border-border py-4 focus:outline-none focus:border-electric transition-colors text-lg"
                      placeholder={copy.contact.emailPlaceholder}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-xs font-bold tracking-widest text-secondary uppercase">{copy.contact.formMessageLabel}</label>
                  <textarea 
                    id="message"
                    name="message"
                    required
                    rows={4}
                    className="w-full bg-transparent border-b border-border py-4 focus:outline-none focus:border-electric transition-colors text-lg resize-none"
                    placeholder={copy.contact.messagePlaceholder}
                  />
                </div>

                {formState === "error" && errorMessage && (
                  <p className="text-sm text-red-400 border border-red-500/30 bg-red-500/10 rounded-lg px-4 py-3" style={typography("contact.errorText")}>
                    {errorMessage}
                  </p>
                )}

                <div className="flex justify-end mt-4">
                  <button 
                    type="submit"
                    disabled={formState === "loading"}
                    className="px-10 py-4 bg-foreground text-background font-bold tracking-widest text-sm hover:bg-electric transition-colors rounded-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-4" style={typography("contact.buttonLabel")}
                  >
                    {formState === "loading" ? copy.contact.sendingLabel : copy.contact.submitLabel}
                    {formState !== "loading" && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
          
        </div>
      </div>
    </section>
  );
}
