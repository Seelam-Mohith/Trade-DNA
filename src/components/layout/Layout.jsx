import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Sidebar from './Sidebar.jsx'
import Footer from './Footer.jsx'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onMenuClick={() => setSidebarOpen((v) => !v)} />
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 sm:px-6">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="min-w-0 flex-1 py-8">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}
