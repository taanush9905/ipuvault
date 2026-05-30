export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl gradient-primary shadow-elegant px-6 py-12 sm:px-10 sm:py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.08),transparent_40%)]" />
      <div className="relative max-w-3xl">
        <p className="text-xs sm:text-sm font-medium tracking-[0.2em] uppercase text-primary-foreground/80 mb-4 animate-fade-in">
          IPU Vault · Academic Platform
        </p>
        <h1 className="hero-title-3d text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary-foreground text-balance animate-fade-in">
          Every previous year paper, in one clean vault.
        </h1>
        <p className="mt-4 text-base sm:text-lg text-primary-foreground/85 max-w-2xl leading-relaxed animate-fade-in">
          Pick your semester and branch — reach papers, datesheets, and most-repeated topics with a premium, distraction-free experience.
        </p>
      </div>
    </section>
  );
}
