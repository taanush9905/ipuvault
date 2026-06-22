import { motion } from "framer-motion";
import { HoverButton } from "@/components/ui/hover-button";
import { HoverLink } from "@/components/ui/hover-link";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-4 sm:py-6 md:py-8">

      {/* ── Live 3D Blur Background Orbs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Primary warm orb — top right */}
        <div className="hero-orb-1 absolute -top-20 right-[10%] h-[320px] w-[320px] rounded-full bg-[#F4C542]/15 blur-[100px]" />
        {/* Secondary orb — bottom left */}
        <div className="hero-orb-2 absolute bottom-[-60px] left-[5%] h-[260px] w-[260px] rounded-full bg-[#F4C542]/8 blur-[80px]" />
        {/* Tertiary cool orb — center */}
        <div className="hero-orb-3 absolute top-[30%] left-[40%] h-[200px] w-[200px] rounded-full bg-[#2A4A7F]/20 blur-[90px]" />
        {/* Desk warm glow — bottom */}
        <div className="desk-glow absolute bottom-0 left-[15%] right-[15%] h-[120px] bg-gradient-to-t from-[#F4C542]/8 via-[#F4C542]/3 to-transparent blur-[40px]" />
      </div>

      <div className="relative grid md:grid-cols-12 gap-8 md:gap-4 items-center z-10">

        {/* ── Left Column: Text Content ── */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0)" }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="md:col-span-6 space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/25 bg-primary/5 text-xs text-primary font-bold tracking-wide uppercase">
            <Sparkles className="h-3 w-3" /> IPU Vault · Academic Platform
          </div>

          <h1 className="hero-title-3d text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
            Every previous year paper, <br />
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              in one clean vault.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed">
            Pick your semester and branch — reach papers, datesheets, and most-repeated topics with a premium experience.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <HoverButton
              onClick={() => {
                const element = document.getElementById("catalog-finder");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="rounded-2xl shadow-lg shadow-primary/10 h-12 text-xs font-semibold"
            >
              Explore Papers <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </HoverButton>
            <HoverLink
              to="/about"
              variant="outline"
              className="rounded-2xl h-12 border-white/10 hover:border-primary/40 text-xs font-semibold text-white hover:text-white"
            >
              About the Vault
            </HoverLink>
          </div>
        </motion.div>

        {/* ── Right Column: Cinematic Floating Scene ── */}
        <motion.div
          initial={{ opacity: 0, y: 50, filter: "blur(12px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0)" }}
          transition={{ duration: 1, delay: 0.25 }}
          viewport={{ once: true }}
          className="md:col-span-6 flex justify-center items-center relative"
          style={{ perspective: "1200px" }}
        >
          {/* Cinematic composition container — NO visible box */}
          <div className="relative w-full max-w-[420px] aspect-square">

            {/* ── Warm desk light glow underneath ── */}
            <div className="absolute bottom-[-20px] left-[10%] right-[10%] h-[60px] bg-gradient-to-t from-[#F4C542]/12 to-transparent rounded-full blur-[30px] desk-glow" />

            {/* ── Notebook underneath (SVG) ── */}
            <div className="absolute bottom-[8%] left-[5%] w-[75%] hero-notebook-float">
              <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                {/* Notebook cover */}
                <rect x="20" y="10" width="280" height="200" rx="8" fill="#1A2332" stroke="#2A3A4F" strokeWidth="1" />
                {/* Spine */}
                <rect x="20" y="10" width="24" height="200" rx="4" fill="#151E2B" />
                {/* Spiral rings */}
                {[30, 55, 80, 105, 130, 155, 180].map((y) => (
                  <g key={y}>
                    <circle cx="44" cy={y} r="6" fill="none" stroke="#3A4A5F" strokeWidth="1.5" />
                    <circle cx="44" cy={y} r="2" fill="#2A3A4F" />
                  </g>
                ))}
                {/* Page lines */}
                <line x1="70" y1="50" x2="270" y2="50" stroke="#2A3A4F" strokeWidth="0.8" opacity="0.5" />
                <line x1="70" y1="75" x2="250" y2="75" stroke="#2A3A4F" strokeWidth="0.8" opacity="0.4" />
                <line x1="70" y1="100" x2="260" y2="100" stroke="#2A3A4F" strokeWidth="0.8" opacity="0.4" />
                <line x1="70" y1="125" x2="230" y2="125" stroke="#2A3A4F" strokeWidth="0.8" opacity="0.3" />
                <line x1="70" y1="150" x2="270" y2="150" stroke="#2A3A4F" strokeWidth="0.8" opacity="0.3" />
                <line x1="70" y1="175" x2="200" y2="175" stroke="#2A3A4F" strokeWidth="0.8" opacity="0.2" />
              </svg>
            </div>

            {/* ── Floating Question Paper (the star) ── */}
            <motion.div
              whileHover={{
                rotateX: 6,
                rotateY: -10,
                scale: 1.04,
              }}
              transition={{ type: "spring", stiffness: 250, damping: 18 }}
              className="absolute top-[5%] left-[12%] w-[72%] hero-paper-float cursor-grab active:cursor-grabbing"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Reflective shine sweep */}


              {/* Bottom cinematic fade — blends paper into scene */}
              <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none" />
            </motion.div>

            {/* ── Pen beside (SVG) ── */}
            <div className="absolute bottom-[12%] right-[2%] w-[18%] hero-pen-rock origin-bottom-left">
              <svg viewBox="0 0 30 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{ transform: "rotate(35deg)" }}>
                {/* Pen barrel */}
                <rect x="8" y="10" width="14" height="120" rx="3" fill="url(#penGrad)" />
                {/* Pen clip */}
                <rect x="22" y="15" width="3" height="35" rx="1.5" fill="#C89F18" />
                {/* Pen tip */}
                <path d="M8 130L15 155L22 130Z" fill="#E8D5A0" />
                <path d="M13 145L15 155L17 145Z" fill="#2A2A2A" />
                {/* Cap ring */}
                <rect x="6" y="8" width="18" height="5" rx="2" fill="#C89F18" />
                <defs>
                  <linearGradient id="penGrad" x1="8" y1="10" x2="22" y2="130" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#1A1A2E" />
                    <stop offset="0.5" stopColor="#16213E" />
                    <stop offset="1" stopColor="#1A1A2E" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* ── Small floating badge — no card container ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              viewport={{ once: true }}
              className="absolute bottom-[2%] left-[20%] flex items-center gap-2.5 bg-black/30 backdrop-blur-xl rounded-full px-4 py-2 z-20"
              style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
            >
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold text-white/80 tracking-wide">Official GGSIPU Papers</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
