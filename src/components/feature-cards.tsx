import { motion } from "framer-motion";

export function FeatureCards() {
  const features = [
    {
      title: "Previous Year Papers",
      desc: "Unlock official question paper vaults organized by branch and semester.",
      // 3D Layered Document Stack SVG Icon
      icon: (
        <svg viewBox="0 0 48 48" className="h-12 w-12 drop-shadow-[0_4px_10px_rgba(244,197,66,0.3)]" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Layer 1: Back document */}
          <path d="M12 8C12 6.89543 12.8954 6 14 6H34C35.1046 6 36 6.89543 36 8V38C36 39.1046 35.1046 40 34 40H14C12.8954 40 12 39.1046 12 38V8Z" fill="url(#goldGrad1)" opacity="0.2"/>
          {/* Layer 2: Middle document (offset) */}
          <path d="M10 11C10 9.89543 10.8954 9 12 9H32C33.1046 9 34 9.89543 34 11V41C34 42.1046 33.1046 43 32 43H12C10.8954 43 10 42.1046 10 41V11Z" fill="url(#goldGrad1)" opacity="0.5"/>
          {/* Layer 3: Front document */}
          <path d="M8 14C8 12.8954 8.89543 12 10 12H30C31.1046 12 32 12.8954 32 14V44C32 45.1046 31.1046 46 30 46H10C8.89543 46 8 45.1046 8 44V14Z" fill="#0B1220" stroke="url(#goldGrad1)" strokeWidth="1.5"/>
          {/* Internal lines for writing */}
          <line x1="13" y1="20" x2="27" y2="20" stroke="url(#goldGrad1)" strokeWidth="2" strokeLinecap="round"/>
          <line x1="13" y1="26" x2="23" y2="26" stroke="url(#goldGrad1)" strokeWidth="2" strokeLinecap="round"/>
          <line x1="13" y1="32" x2="27" y2="32" stroke="url(#goldGrad1)" strokeWidth="2" strokeLinecap="round"/>
          <line x1="13" y1="38" x2="19" y2="38" stroke="url(#goldGrad1)" strokeWidth="2" strokeLinecap="round"/>
          <defs>
            <linearGradient id="goldGrad1" x1="8" y1="12" x2="32" y2="46" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F4C542"/>
              <stop offset="1" stopColor="#B89010"/>
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      title: "Exam Datesheets",
      desc: "Stay prepared with live exam calendars and real-time countdown modules.",
      // 3D Layered Calendar / Clock SVG Icon
      icon: (
        <svg viewBox="0 0 48 48" className="h-12 w-12 drop-shadow-[0_4px_10px_rgba(244,197,66,0.3)]" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Calendar base plate */}
          <rect x="8" y="12" width="32" height="30" rx="4" fill="#0B1220" stroke="url(#goldGrad2)" strokeWidth="1.5"/>
          {/* Header plate */}
          <rect x="8" y="12" width="32" height="8" rx="2" fill="url(#goldGrad2)"/>
          {/* Binder Rings */}
          <circle cx="16" cy="12" r="2.5" fill="#050816" stroke="url(#goldGrad2)" strokeWidth="1"/>
          <circle cx="32" cy="12" r="2.5" fill="#050816" stroke="url(#goldGrad2)" strokeWidth="1"/>
          {/* Calendar grid/dates */}
          <rect x="13" y="24" width="5" height="5" rx="1" fill="url(#goldGrad2)" opacity="0.4"/>
          <rect x="21" y="24" width="5" height="5" rx="1" fill="url(#goldGrad2)" opacity="0.4"/>
          <rect x="29" y="24" width="5" height="5" rx="1" fill="url(#goldGrad2)" opacity="0.4"/>
          <rect x="13" y="32" width="5" height="5" rx="1" fill="url(#goldGrad2)" opacity="0.4"/>
          <rect x="21" y="32" width="5" height="5" rx="1" fill="url(#goldGrad2)"/>
          <rect x="29" y="32" width="5" height="5" rx="1" fill="url(#goldGrad2)" opacity="0.4"/>
          <defs>
            <linearGradient id="goldGrad2" x1="8" y1="12" x2="40" y2="42" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F4C542"/>
              <stop offset="1" stopColor="#B89010"/>
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      title: "Most Repeated Topics",
      desc: "Leverage frequency analysis to capture patterns of highest recurring exam questions.",
      // 3D Glow-Graph & Flame SVG Icon
      icon: (
        <svg viewBox="0 0 48 48" className="h-12 w-12 drop-shadow-[0_4px_10px_rgba(244,197,66,0.3)]" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Base panel */}
          <rect x="8" y="8" width="32" height="32" rx="6" fill="#0B1220" stroke="url(#goldGrad3)" strokeWidth="1.5"/>
          {/* 3D flame overlapping graph */}
          <path d="M24 13C24 13 29 18 29 22.5C29 25.5 26.5 28 23.5 28C20.5 28 18 25.5 18 22.5C18 19 24 13 24 13Z" fill="url(#goldGrad3)" opacity="0.9"/>
          {/* Sparkles */}
          <path d="M15 15L16.5 16.5M33 13L31.5 14.5M32 29L30.5 27.5" stroke="url(#goldGrad3)" strokeWidth="1.5" strokeLinecap="round"/>
          {/* Analytics line graph at bottom */}
          <path d="M12 34L19 28L27 32L36 24" stroke="url(#goldGrad3)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <defs>
            <linearGradient id="goldGrad3" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F4C542"/>
              <stop offset="1" stopColor="#B89010"/>
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      title: "Premium Experience",
      desc: "No advertisements, no forced delays, only a clean academic workflow.",
      // 3D Glass Crown / Star Shield SVG Icon
      icon: (
        <svg viewBox="0 0 48 48" className="h-12 w-12 drop-shadow-[0_4px_10px_rgba(244,197,66,0.3)]" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Diamond base */}
          <path d="M24 6L38 18L24 42L10 18L24 6Z" fill="#0B1220" stroke="url(#goldGrad4)" strokeWidth="1.5"/>
          {/* Internal Diamond facet */}
          <path d="M24 6L29 18L24 32L19 18L24 6Z" fill="url(#goldGrad4)" opacity="0.3"/>
          <path d="M24 32L10 18L24 6" stroke="url(#goldGrad4)" strokeWidth="1" strokeDasharray="2 2"/>
          <path d="M24 32L38 18L24 6" stroke="url(#goldGrad4)" strokeWidth="1" strokeDasharray="2 2"/>
          {/* Floating glowing crown star */}
          <path d="M24 14L25.5 18L29.5 18L26.5 20.5L27.5 24.5L24 22L20.5 24.5L21.5 20.5L18.5 18L22.5 18L24 14Z" fill="url(#goldGrad4)"/>
          <defs>
            <linearGradient id="goldGrad4" x1="10" y1="6" x2="38" y2="42" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F4C542"/>
              <stop offset="1" stopColor="#B89010"/>
            </linearGradient>
          </defs>
        </svg>
      )
    }
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 py-4">
      {features.map((feat, idx) => (
        <motion.div
          key={feat.title}
          initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0)" }}
          transition={{ duration: 0.8, delay: idx * 0.1 }}
          viewport={{ once: true }}
          whileHover={{ 
            y: -10, 
            scale: 1.02, 
            rotateX: 2, 
            rotateY: -2,
          }}
          className="floating-panel rounded-3xl p-6 flex flex-col items-start gap-4 text-left select-none relative overflow-hidden group cursor-pointer"
        >
          {/* Subtle ambient glow */}
          <div className="absolute -top-16 -right-16 h-32 w-32 bg-primary/8 rounded-full blur-3xl group-hover:bg-primary/15 transition-all duration-500 pointer-events-none" />
          
          <div className="h-16 w-16 rounded-2xl bg-white/[0.03] flex items-center justify-center p-2.5 group-hover:bg-white/[0.06] transition-all duration-300"
            style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 4px 12px rgba(0,0,0,0.2)" }}
          >
            {feat.icon}
          </div>

          <div className="space-y-2 mt-2">
            <h3 className="font-extrabold text-white text-base tracking-tight group-hover:text-primary transition-colors duration-300">
              {feat.title}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed group-hover:text-[#B8C0D4]/90 transition-colors">
              {feat.desc}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
