export default function Footer() {
  return (
    <footer className="w-full py-xl px-margin-desktop grid grid-cols-1 md:grid-cols-2 gap-lg bg-surface-container-highest border-t border-outline-variant">
      <div className="space-y-md">
        <div className="font-title-lg text-title-lg font-black text-on-surface">AtendeAí</div>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
          A solução definitiva para Service Management empresarial. Conectando pessoas, processos e tecnologia.
        </p>
        <div className="flex gap-md">
          <a
            className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-all"
            href="#"
          >
            <span className="material-symbols-outlined text-[20px]">public</span>
          </a>
          <a
            className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-all"
            href="#"
          >
            <span className="material-symbols-outlined text-[20px]">mail</span>
          </a>
          <a
            className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-all"
            href="#"
          >
            <span className="material-symbols-outlined text-[20px]">link</span>
          </a>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-lg">
        <div className="space-y-sm">
          <h4 className="font-label-md text-label-md font-bold text-on-surface uppercase tracking-wider">Empresa</h4>
          <div className="flex flex-col gap-xs">
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors" href="#">
              Sobre Nós
            </a>
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors" href="#">
              Carreiras
            </a>
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors" href="#">
              Blog
            </a>
          </div>
        </div>
        <div className="space-y-sm">
          <h4 className="font-label-md text-label-md font-bold text-on-surface uppercase tracking-wider">Suporte</h4>
          <div className="flex flex-col gap-xs">
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors" href="#">
              Central de Ajuda
            </a>
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors" href="#">
              Status do Sistema
            </a>
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors" href="#">
              Falar com Vendas
            </a>
          </div>
        </div>
      </div>
      <div className="md:col-span-2 pt-xl border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-md">
        <div className="font-label-md text-label-md text-on-surface-variant">
          © 2026 AtendeAí Gerenciamento de Serviços Corporativos. Todos os direitos reservados.
        </div>
        <div className="flex gap-lg">
          <a className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface" href="#">
            Privacy Policy
          </a>
          <a className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface" href="#">
            Terms of Service
          </a>
          <a className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface" href="#">
            Security
          </a>
        </div>
      </div>
    </footer>
  )
}
