import { create } from 'zustand'

interface AppState {
  notificationsCount: number
  incrementNotifications: () => void
  resetNotifications: () => void
}

export const useAppStore = create<AppState>((set) => ({
  notificationsCount: 3,
  incrementNotifications: () => set((state) => ({ notificationsCount: state.notificationsCount + 1 })),
  resetNotifications: () => set({ notificationsCount: 0 }),
}))
