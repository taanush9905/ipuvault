import { motion } from "framer-motion";
import { FileText, GraduationCap, Users, TrendingUp } from "lucide-react";

export function StatsBar() {
  const stats = [
    { icon: FileText, text: "200+ Previous Year Papers", color: "from-[#F4C542] to-[#B89010]" },
    { icon: GraduationCap, text: "7+ Branches Covered", color: "from-[#F5D061] to-[#C89F18]" },
    { icon: Users, text: "5000+ Students Helped", color: "from-[#F3BA2F] to-[#A57805]" },
    { icon: TrendingUp, text: "Most Repeated Topics Analysis", color: "from-[#F4C542] to-[#F3BA2F]" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0)" }}
      transition={{ duration: 0.6, delay: 0.1 }}
      viewport={{ once: true }}
      className="w-full relative z-20 -mt-3 px-2 sm:px-4"
    >
      <div className="rounded-2xl p-4 md:py-5 md:px-8 backdrop-blur-xl bg-[#0B1220]/35 flex items-center justify-between gap-4 md:gap-8 overflow-x-auto scrollbar-none"
        style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.03)" }}
      >
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="flex items-center gap-3.5 shrink-0 select-none group py-1">
              <motion.div 
                whileHover={{ scale: 1.15, rotate: 5 }}
                className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color} text-[#050816] shadow-[0_0_15px_rgba(244,197,66,0.3)]`}
              >
                <Icon className="h-4 w-4 md:h-5 md:w-5" />
              </motion.div>
              
              <span className="text-xs md:text-sm font-bold tracking-tight text-white group-hover:text-primary transition-colors duration-300">
                {stat.text}
              </span>
              
              {idx < stats.length - 1 && (
                <div className="hidden lg:block h-6 w-px bg-white/10 ml-8 self-center" />
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
