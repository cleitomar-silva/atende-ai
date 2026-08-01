function Testimonial({ quote, name, role, image, alt }) {
  return (
    <div className="glass-card p-xl rounded-xl flex flex-col gap-lg">
      <div className="flex gap-xs text-primary">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            star
          </span>
        ))}
      </div>
      <blockquote className="font-title-lg text-title-lg italic text-on-surface">{quote}</blockquote>
      <div className="flex items-center gap-md">
        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary-fixed">
          <img className="w-full h-full object-cover" alt={alt} src={image} />
        </div>
        <div>
          <p className="font-title-lg text-title-lg font-bold">{name}</p>
          <p className="font-label-md text-label-md text-on-surface-variant">{role}</p>
        </div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="px-margin-desktop py-xl bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-xl gap-md">
          <div className="space-y-sm max-w-xl">
            <h2 className="font-headline-md text-headline-md text-on-surface">Histórias de Sucesso</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Veja como as maiores empresas do país transformaram sua eficiência operacional com o SupportHub.
            </p>
          </div>
          <div className="flex gap-sm">
            <button className="w-12 h-12 rounded-full border border-outline flex items-center justify-center hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <button className="w-12 h-12 rounded-full border border-outline flex items-center justify-center hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          <Testimonial
            quote="A transição para o SupportHub foi o maior salto de produtividade que nossa equipe de TI já deu. A clareza dos dados e a facilidade de automação economizaram centenas de horas mensais."
            name="Mariana Costa"
            role="CTO na TechGlobal"
            alt="Retrato profissional de uma Chief Technology Officer sorridente em escritório moderno"
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuCZwXUY19DTRMGVoj9HiQdQkFhoFpTkS5iktUIXz_1gmheXD6NPvMabGfSPRuBiPGLjHOvble3xCI4NNnSezcxALmuhBlcc-5-S6SY6jVHPGLz6ffj-Ke1SSqHOkpBhwAFr644ZZrJjlgEbv-zvj6LlvIPU-28ZDvjce47oj7S1r4B3Xt1z4Y8Ph6KpKcKFYXi8fugfUkAn3DHRNhDHOJ9n79z-NZGEcxZoGQrMEHTx8aO6RJUiwxULcA"
          />
          <Testimonial
            quote="Finalmente temos uma ferramenta que acompanha o ritmo de crescimento da nossa empresa. O suporte multi-canal é impecável e a interface é extremamente intuitiva."
            name="Roberto Mendes"
            role="Diretor de Operações na LogisticsX"
            alt="Retrato profissional de um Diretor de Operações com blazer azul-marinho"
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuCmM5E4cPP7rvwAfaxYfZ9roTRqlhFTEXSFuHGzP2CiWqsTGrtmAmliwtxJ1kZGJVSUjhrUDxMUJJuPqeh6cBh4S9zEeTQ6yWcoY3R7iBI9FHLw8LDozHHR-G218RssVkWk94DIXzqnrqPooE1DI-lijA_ugNU_ntZxFBspqMmwlHeKYNMV0E7nK6XzP3i93__fHmNNj7qYJO9Mgwiwxc4H1q7OSBIxsO0_fGOIzr-hZEIIwKwNp3uSjA"
          />
        </div>
      </div>
    </section>
  )
}
