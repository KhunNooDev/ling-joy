import { create } from 'zustand'
import { AppAlertDialogType } from '@/components/AppAlertDialog'

// Define the state and actions for the alert dialog
interface AlertDialogState {
  isDialogOpen: boolean
  alertType: string | null
  title: string | null
  description: string | null
  onClick: (() => void) | null
  openDialog: (
    alertType: 'confirm' | 'warning' | 'info',
    title?: string,
    description?: string,
    onClick?: () => void,
  ) => void
  closeDialog: () => void
}

// Create the store
export const useAlertDialogStore = create<AlertDialogState>((set) => ({
  isDialogOpen: false,
  alertType: null,
  title: null,
  description: null,
  onClick: null,
  openDialog: (alertType, title, description, onClick) =>
    set({ isDialogOpen: true, alertType, title, description, onClick }),
  closeDialog: () => set({ isDialogOpen: false, alertType: null, title: null, description: null, onClick: null }),
}))

export function appAlertDialog({ alertType = 'confirm', title, description, onClick }: AppAlertDialogType) {
  useAlertDialogStore.getState().openDialog(alertType, title, description, onClick)
}
