import { useState } from 'react'
import SideNav from './SideNav.jsx'
import TopBar from './TopBar.jsx'

export default function PageShell({ children }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="bg-background text-on-background">
      <SideNav collapsed={collapsed} onToggle={() => setCollapsed((prev) => !prev)} />
      <div className={`${collapsed ? 'ml-16' : 'ml-64'} flex flex-col min-h-screen transition-all duration-200 ease-in-out`}>
        <TopBar />
        <main className="p-lg space-y-lg">{children}</main>
      </div>
    </div>
  )
}