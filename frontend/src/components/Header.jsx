import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-margin-desktop py-md bg-surface/95 backdrop-blur-sm border-b border-outline-variant shadow-sm">
      <div className="font-headline-sm text-headline-sm font-bold text-primary">AtendeAí</div>
      <nav className="hidden md:flex gap-lg items-center">
        <a className="font-body-md text-body-md text-primary font-bold border-b-2 border-primary pb-1" href="#">
          Features
        </a>
        <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">
          Solutions
        </a>
        <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">
          Pricing
        </a>
        <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">
          Resources
        </a>
      </nav>
      <div className="flex items-center gap-md">
        <Link
          to="/login"
          className="px-lg py-sm font-label-md text-label-md text-primary border border-primary rounded-lg hover:bg-surface-container-low transition-all cursor-pointer"
        >
          Entrar
        </Link>
        <button className="md:hidden flex items-center text-on-surface">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
    </header>
  )
}
