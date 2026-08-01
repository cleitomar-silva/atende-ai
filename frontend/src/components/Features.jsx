export default function Features() {
  return (
    <section className="px-margin-desktop py-xl bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-xl space-y-sm">
          <h2 className="font-headline-md text-headline-md text-on-surface">Potencialize sua operação</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Arquitetura robusta desenhada para alta escalabilidade e conformidade.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-gutter">
          <div className="md:col-span-2 lg:col-span-2 p-xl rounded-xl bg-surface-container-low border border-outline-variant flex flex-col justify-between hover:border-primary/40 transition-colors group">
            <div className="space-y-md">
              <div className="w-12 h-12 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-container">
                <span className="material-symbols-outlined text-[32px]">cloud_download</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm">Automação Inteligente</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Reduza o trabalho manual em até 60% com gatilhos automáticos e roteamento inteligente de chamados
                baseado em IA.
              </p>
            </div>
            <div className="mt-lg pt-lg border-t border-outline-variant/30 text-primary font-label-md flex items-center gap-xs group-hover:gap-sm transition-all cursor-pointer">
              Saiba mais <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            </div>
          </div>

          <div className="p-xl rounded-xl bg-white border border-outline-variant flex flex-col gap-md hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[32px]">query_stats</span>
            </div>
            <h3 className="font-title-lg text-title-lg">Dashboards Real-time</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Visibilidade total do SLA com métricas granulares e relatórios customizáveis para gestores.
            </p>
          </div>

          <div className="p-xl rounded-xl bg-white border border-outline-variant flex flex-col gap-md hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[32px]">hub</span>
            </div>
            <h3 className="font-title-lg text-title-lg">Multi-canal</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Atendimento unificado via E-mail, Chat, WhatsApp e Portal do Cliente em uma única tela.
            </p>
          </div>

          <div className="md:col-span-3 lg:col-span-4 p-xl rounded-xl bg-inverse-surface text-inverse-on-surface flex flex-col md:flex-row items-center gap-xl">
            <div className="flex-1 space-y-sm">
              <div className="inline-block px-sm py-xs bg-primary-fixed text-on-primary-fixed rounded font-label-md">
                SEGURANÇA
              </div>
              <h3 className="font-headline-md text-headline-md">Segurança Enterprise &amp; Compliance</h3>
              <p className="font-body-lg text-body-lg text-surface-variant">
                Criptografia de ponta a ponta, suporte a SSO/SAML, auditoria completa de logs e conformidade com
                LGPD/GDPR para garantir que seus dados corporativos estejam sempre protegidos.
              </p>
            </div>
            <div className="flex gap-md">
              <span className="material-symbols-outlined text-[64px] text-primary-fixed-dim opacity-50">
                verified_user
              </span>
              <span className="material-symbols-outlined text-[64px] text-primary-fixed-dim opacity-50">gpp_good</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
