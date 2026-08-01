export default function Hero() {
  return (
    <section className="relative px-margin-desktop py-xl lg:py-32 hero-gradient">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-xl items-center">
        <div className="lg:col-span-7 space-y-lg">
          <div className="inline-flex items-center gap-sm px-md py-xs bg-primary/10 text-primary rounded-full border border-primary/20">
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              bolt
            </span>
            <span className="font-label-md text-label-md uppercase tracking-wider">Novo: Módulo IA preditiva</span>
          </div>
          <h1 className="font-display-lg text-display-lg lg:text-[64px] lg:leading-[72px] text-on-surface font-extrabold tracking-tight">
            Eleve a gestão de chamados ao nível{' '}
            <span className="text-primary-container">Enterprise.</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            A plataforma unificada que conecta suas equipes de suporte, TI e clientes através de automação inteligente e
            fluxos de trabalho sistemáticos.
          </p>
          <div className="flex flex-col sm:flex-row gap-md">
            <button className="px-xl py-md bg-primary-container text-on-primary-container font-title-lg text-title-lg rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all">
              Começar agora
            </button>
            <button className="px-xl py-md bg-transparent border border-outline text-on-surface font-title-lg text-title-lg rounded-xl hover:bg-surface-container transition-all flex items-center justify-center gap-sm">
              Ver demonstração
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
          <div className="flex items-center gap-lg pt-md grayscale opacity-60">
            <span className="font-label-md text-label-md">CONFIADO POR:</span>
            <div className="flex gap-md font-bold text-headline-sm">TECHCORE</div>
            <div className="flex gap-md font-bold text-headline-sm">GLOBALSY</div>
          </div>
        </div>
        <div className="lg:col-span-5 relative">
          <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl border border-outline-variant">
            <img
              className="w-full h-auto"
              alt="Dashboard de suporte enterprise com métricas de chamados, gráficos de análise em azul e layout de sidebar profissional"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXNuPBj3-lMp_h8OrfbSzY0DIrlJGxJYlbl02yPiozvO3X6v0d3Aw4gQFw3PMOYVo787kefF5UvoPI51rwaQtPGuKL0lU2wLfWAvaoo614WPGgMf7nL6TZ9Y281dChJdgqcz8m-kw5mSW7UYnT5WdbA0TVn-ZtDna1zKw4AhKrQIKpK0iAjsZEImtUVTjFIaJyO4j5nCwmwpCUdMhmRlKJHXDFG5S9-QSDaxlmd-4KPKJVCBwCrbmh_Q"
            />
          </div>
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-0"></div>
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-secondary-container/20 rounded-full blur-2xl -z-0"></div>
        </div>
      </div>
    </section>
  )
}
