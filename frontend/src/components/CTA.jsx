export default function CTA() {
  return (
    <section className="px-margin-desktop py-32">
      <div className="max-w-5xl mx-auto rounded-full bg-primary-container p-xl md:p-32 relative overflow-hidden text-center text-on-primary-container shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-container/80 pointer-events-none"></div>
        <div className="relative z-10 space-y-lg">
          <h2 className="font-display-lg text-display-lg lg:text-[48px] font-black">
            Pronto para transformar seu suporte?
          </h2>
          <p className="font-body-lg text-body-lg text-primary-fixed/80 max-w-2xl mx-auto">
            Junte-se a mais de 500 empresas que confiam no SupportHub para gerenciar milhões de interações todos os dias.
          </p>
          <div className="flex flex-col sm:flex-row gap-md justify-center pt-md">
            <button className="px-xl py-md bg-white text-primary font-title-lg text-title-lg rounded-xl hover:bg-surface-bright transition-all shadow-md">
              Falar com um Especialista
            </button>
            <button className="px-xl py-md border border-primary-fixed/30 text-on-primary-container font-title-lg text-title-lg rounded-xl hover:bg-white/10 transition-all">
              Começar teste gratuito
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
