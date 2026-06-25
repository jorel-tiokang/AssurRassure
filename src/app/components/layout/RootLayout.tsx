import { Outlet } from "react-router"

export function RootLayout() {
  return (
    <div className="theme-landing min-h-screen selection:bg-[#0055FF] selection:text-white">
      <Outlet />
    </div>
  )
}
