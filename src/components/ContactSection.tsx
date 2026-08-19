import { useState } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { Send, Mail, Phone, Linkedin, Star, MessageSquare, ExternalLink, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const ContactSection = () => {
  const { data } = usePortfolio();
  const { contact, personal } = data;
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setFeedbackMsg("");

    try {
      let sentSuccessfully = false;

      // 1. Send to Formspree if configured or fallback to default Formspree endpoint
      const formspreeEndpoint =
        contact.formspreeUrl ||
        (contact.formspreeId ? `https://formspree.io/f/${contact.formspreeId}` : "https://formspree.io/f/xdenyeaj");
      const web3FormsKey = contact.web3FormsKey;

      if (formspreeEndpoint) {
        const res = await fetch(formspreeEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            message: form.message,
            _subject: `Portfolio Contact from ${form.name}`,
          }),
        });
        if (res.ok) {
          sentSuccessfully = true;
        } else {
          const data = await res.json().catch(() => ({}));
          if (data && data.errors && data.errors.length > 0) {
            const errDetail = data.errors.map((err: { message?: string }) => err.message).filter(Boolean).join(", ");
            if (errDetail) throw new Error(errDetail);
          }
        }
      } else if (web3FormsKey) {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: web3FormsKey,
            name: form.name,
            email: form.email,
            message: form.message,
            subject: `Portfolio Contact from ${form.name}`,
          }),
        });
        if (res.ok) sentSuccessfully = true;
      }

      // 2. Also save to MongoDB Atlas via backend API
      try {
        await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            message: form.message,
          }),
        });
        sentSuccessfully = true;
      } catch (err) {
        console.warn("Backend API log skipped:", err);
      }

      // 3. Fallback to mailto if no third-party keys are configured and backend unreachable
      if (!sentSuccessfully) {
        const mailto = `mailto:${personal.email}?subject=Portfolio Contact from ${encodeURIComponent(form.name)}&body=${encodeURIComponent(form.message)}%0A%0AFrom: ${encodeURIComponent(form.name)} (${encodeURIComponent(form.email)})`;
        window.open(mailto);
      }

      setStatus("success");
      setFeedbackMsg("🎉 Message sent successfully! I will reply to your email soon.");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 6000);
    } catch (error) {
      console.error("Form submission error:", error);
      setStatus("error");
      setFeedbackMsg("Could not send directly. Opening email client instead...");
      const mailto = `mailto:${personal.email}?subject=Portfolio Contact from ${encodeURIComponent(form.name)}&body=${encodeURIComponent(form.message)}`;
      window.open(mailto);
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const linkedinUrl = personal.linkedin || personal.socials?.linkedin || "https://www.linkedin.com/in/swaraj-vecha";
  const displayLinkedin = linkedinUrl.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "").replace(/\/$/, "");

  return (
    <section id="contact" className="py-20 sm:py-32 bg-foreground relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-8 right-8 animate-spin-slow hidden sm:block z-0 pointer-events-none">
        <Star className="h-16 w-16 stroke-white fill-neo-secondary neo-shadow-white" strokeWidth={2} />
      </div>
      
      <div className="absolute bottom-16 left-6 animate-float-y hidden sm:block z-0 pointer-events-none">
        <div className="p-3 bg-neo-accent neo-border-thin neo-shadow-white rotate-12">
          <Send className="h-8 w-8 text-black" />
        </div>
      </div>

      <div className="absolute top-1/3 left-4 animate-wiggle hidden lg:block z-0 pointer-events-none">
        <div className="p-2 bg-neo-muted neo-border-thin neo-shadow-white -rotate-6">
          <Mail className="h-8 w-8 text-black" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="mb-12">
          <span className="inline-block neo-border bg-neo-accent px-4 py-2 font-black text-sm uppercase tracking-widest rotate-1 border-card"
            style={{ boxShadow: "8px 8px 0px 0px #fff" }}>
            {contact.title}
          </span>
        </div>

        <p className="font-bold text-xl text-card mb-10 max-w-xl">{contact.copy}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Contact Message Form */}
          <form onSubmit={handleSubmit} className="flex flex-col justify-between h-full space-y-4">
            <div className="space-y-4 flex-1 flex flex-col">
              <input
                type="text"
                placeholder="Your Name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full neo-border bg-card px-5 py-3.5 font-bold text-base placeholder:text-foreground/40 focus:bg-neo-secondary focus:outline-none transition-colors duration-100 text-black shadow-[4px_4px_0px_0px_#fff]"
              />
              <input
                type="email"
                placeholder="Your Email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full neo-border bg-card px-5 py-3.5 font-bold text-base placeholder:text-foreground/40 focus:bg-neo-secondary focus:outline-none transition-colors duration-100 text-black shadow-[4px_4px_0px_0px_#fff]"
              />
              <textarea
                placeholder="Your Message..."
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full flex-1 neo-border bg-card px-5 py-3.5 font-bold text-base placeholder:text-foreground/40 focus:bg-neo-secondary focus:outline-none transition-colors duration-100 resize-none text-black shadow-[4px_4px_0px_0px_#fff] min-h-[120px]"
              />
            </div>

            {/* Status notification banner */}
            {status === "success" && (
              <div className="neo-border bg-yellow-200 border-2 border-black p-3 text-black font-black text-xs sm:text-sm flex items-center gap-2 shadow-[3px_3px_0px_0px_#000]">
                <CheckCircle2 className="h-5 w-5 text-green-700 flex-shrink-0" />
                <span>{feedbackMsg}</span>
              </div>
            )}

            {status === "error" && (
              <div className="neo-border bg-red-200 border-2 border-black p-3 text-black font-black text-xs sm:text-sm flex items-center gap-2 shadow-[3px_3px_0px_0px_#000]">
                <AlertCircle className="h-5 w-5 text-red-700 flex-shrink-0" />
                <span>{feedbackMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full neo-border bg-neo-accent hover:bg-red-400 disabled:opacity-75 px-6 py-3.5 font-black text-base uppercase tracking-wide neo-btn-press flex items-center justify-center gap-3 text-black transition-colors cursor-pointer"
              style={{ boxShadow: "5px 5px 0px 0px #fff" }}
            >
              {status === "sending" ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Sending Message...</span>
                </>
              ) : (
                <>
                  <span>{contact.submitLabel || "Send Message"}</span>
                  <Send strokeWidth={3} className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Right: Contact Information Cards & Socials */}
          <div className="flex flex-col justify-between h-full space-y-4">
            {/* EMAIL BOX */}
            <a
              href={`mailto:${personal.email}`}
              className="block neo-border bg-card p-4 neo-card-hover group cursor-pointer"
              style={{ boxShadow: "5px 5px 0px 0px #fff" }}
            >
              <div className="flex items-center gap-3">
                <div className="neo-border bg-neo-secondary p-2 shadow-[2px_2px_0px_0px_#000]">
                  <Mail strokeWidth={3} className="h-4 w-4 text-black" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-[11px] uppercase tracking-widest text-black/60">Email</p>
                  <p className="font-bold text-sm text-black break-all group-hover:text-red-600 transition-colors">
                    {personal.email}
                  </p>
                </div>
              </div>
            </a>

            {/* MOBILE BOX */}
            <a
              href={`tel:${personal.phone.replace(/\s+/g, "")}`}
              className="block neo-border bg-card p-4 neo-card-hover group cursor-pointer"
              style={{ boxShadow: "5px 5px 0px 0px #fff" }}
            >
              <div className="flex items-center gap-3">
                <div className="neo-border bg-neo-accent p-2 shadow-[2px_2px_0px_0px_#000]">
                  <Phone strokeWidth={3} className="h-4 w-4 text-black" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-[11px] uppercase tracking-widest text-black/60">Mobile</p>
                  <p className="font-bold text-sm text-black break-all group-hover:text-red-600 transition-colors">
                    {personal.phone}
                  </p>
                </div>
              </div>
            </a>

            {/* LINKEDIN BOX */}
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block neo-border bg-card p-4 neo-card-hover group cursor-pointer"
              style={{ boxShadow: "5px 5px 0px 0px #fff" }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="neo-border bg-neo-muted p-2 shadow-[2px_2px_0px_0px_#000]">
                    <Linkedin strokeWidth={3} className="h-4 w-4 text-black" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-[11px] uppercase tracking-widest text-black/60">LinkedIn</p>
                    <p className="font-bold text-sm text-black truncate group-hover:text-blue-600 transition-colors">
                      {displayLinkedin || "swaraj-vecha"}
                    </p>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-black/50 group-hover:text-black group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </div>
            </a>

            {/* Dynamic Social & Developer Buttons Row */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              {(personal.github || personal.socials?.github) && (
                <a
                  href={personal.github || personal.socials?.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neo-border bg-neo-secondary hover:bg-yellow-300 px-4 py-3 font-black text-xs uppercase tracking-wider text-center neo-btn-press text-black"
                  style={{ boxShadow: "4px 4px 0px 0px #fff" }}
                >
                  GitHub
                </a>
              )}

              {personal.socials?.leetcode ? (
                <a
                  href={personal.socials.leetcode}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neo-border bg-[#FFA116] hover:bg-orange-400 text-black px-4 py-3 font-black text-xs uppercase tracking-wider text-center neo-btn-press"
                  style={{ boxShadow: "4px 4px 0px 0px #fff" }}
                >
                  LeetCode
                </a>
              ) : (
                <a
                  href={`mailto:${personal.email}`}
                  className="neo-border bg-neo-accent hover:bg-red-400 px-4 py-3 font-black text-xs uppercase tracking-wider text-center neo-btn-press text-black"
                  style={{ boxShadow: "4px 4px 0px 0px #fff" }}
                >
                  Direct Mail
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
