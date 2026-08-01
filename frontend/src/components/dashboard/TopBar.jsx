export default function TopBar() {
  return (
    <header className="sticky top-0 w-full z-40 bg-surface border-b border-outline-variant flex justify-between items-center h-16 px-lg">
      <div className="flex items-center gap-xl w-1/2">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
            search
          </span>
          <input
            className="w-full bg-surface-container-low border border-outline-variant rounded-full py-2 pl-10 pr-4 text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="Pesquisar tickets, clientes..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-md">
        <button className="p-2 text-on-surface-variant hover:text-primary transition-all duration-150 relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
        </button>
        <button className="p-2 text-on-surface-variant hover:text-primary transition-all duration-150">
          <span className="material-symbols-outlined">help_outline</span>
        </button>
        <div className="h-8 w-[1px] bg-outline-variant mx-sm"></div>
        <img
          className="w-8 h-8 rounded-full"
          alt="Avatar do perfil"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUH-Z7arjukjlgRil-A8WTCr0m_sZFDCA87tI-ct6EljirFkELnHmZWo2M5Nl5ZBy0MtCLJmqGSYfX_fofrlCONrF4Bae4Oz38R-6W6eBobTrb0CWCrvgX0FVnqPGNjBrbgzdlYtYKRjdroSTjJqqe24NQ7WUlD-ekhcBuE429KFQlCmHyLakbigMzIIKACg28TasbtEdBhPxBzrOf6Cx7AfXAwiupuOOG6be27wFPilMC3HWIXW00RQ"
        />
      </div>
    </header>
  )
}
