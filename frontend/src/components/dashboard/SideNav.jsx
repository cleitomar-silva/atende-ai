export default function SideNav() {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-lowest border-r border-outline-variant shadow-sm flex flex-col py-md px-sm z-50">
      <div className="mb-xl px-sm">
        <h1 className="text-title-lg font-title-lg font-bold text-primary">AtendeAí</h1>
        <p className="text-label-md font-label-md text-on-surface-variant opacity-70">Suporte Corporativos</p>
      </div>
      <nav className="flex-1 space-y-1">
        <a className="flex items-center gap-3 px-md py-sm rounded-lg bg-secondary-container text-on-secondary-container font-semibold transition-colors duration-200 ease-in-out" href="#">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="font-body-md text-body-md">Dashboard</span>
        </a>
        <a className="flex items-center gap-3 px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors duration-200 ease-in-out" href="#">
          <span className="material-symbols-outlined">confirmation_number</span>
          <span className="font-body-md text-body-md">Tickets</span>
        </a>
        <a className="flex items-center gap-3 px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors duration-200 ease-in-out" href="#">
          <span className="material-symbols-outlined">group</span>
          <span className="font-body-md text-body-md">Customers</span>
        </a>
        <a className="flex items-center gap-3 px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors duration-200 ease-in-out" href="#">
          <span className="material-symbols-outlined">assessment</span>
          <span className="font-body-md text-body-md">Reports</span>
        </a>
        <a className="flex items-center gap-3 px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors duration-200 ease-in-out" href="#">
          <span className="material-symbols-outlined">settings</span>
          <span className="font-body-md text-body-md">Settings</span>
        </a>
      </nav>
      <div className="mt-auto pt-lg border-t border-outline-variant px-sm">
        <button className="w-full bg-primary text-on-primary py-sm rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
          <span className="material-symbols-outlined">add</span>
          Novo Chamado
        </button>
        <div className="mt-lg flex items-center gap-3">
          <img
            className="w-10 h-10 rounded-full border border-outline-variant"
            alt="Foto de perfil do agente"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-J048WSjv8gYRvKN0LrFSn7dBvaQ9_zKGYj3mNzscaibV2d-Md8K1i04iu0wBB45HTViuEjnTxhLclqyLG_BxaskCGDYj8YbNCPYTOYZ1TeQlS5IeC57ktWCHLN30DOIQ930xGZrQhzMsySyV2l_DVQNXW_dy_khrdlePKSSNMQlIZ7E9ZszyJlQoRE97p2RyrYLVNP2iRJFbDmHJPdw_qrStHmXixCj-9N6dx94cRWyXgIp0pbwN4A"
          />
          <div className="overflow-hidden">
            <p className="text-body-md font-bold truncate">Agente Silva</p>
            <p className="text-label-md text-on-surface-variant truncate">Nível Sênior</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
