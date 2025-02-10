'use client'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface IAppDialog {
  isDialogOpen: boolean
  setIsDialogOpen: (isOpen: boolean) => void
  title: string
  children: React.ReactNode
  footer: React.ReactNode
}

export function AppDialog({ isDialogOpen, setIsDialogOpen, title, children, footer }: IAppDialog) {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className='gap-0 p-0'>
        <DialogHeader className='rounded-t-md bg-zinc-100 p-4'>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className='max-h-[80vh] overflow-auto p-4'>{children}</div>
        <DialogFooter className='flex-row !justify-between rounded-b-md bg-zinc-100 p-4'>{footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
