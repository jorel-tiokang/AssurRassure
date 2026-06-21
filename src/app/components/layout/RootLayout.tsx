import { Outlet } from "react-router"

export function RootLayout() {
  return (
    <div className="min-h-screen bg-canvas font-sans text-ink selection:bg-[#0055FF] selection:text-white">
      <Outlet />
    </div>
  )
}
