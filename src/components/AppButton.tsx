'use client'
import { Button, ButtonProps } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { TriangleAlertIcon } from 'lucide-react'
import { useState } from 'react'

interface IAppButton extends ButtonProps {
  tooltip?: string
  isConfirm?: boolean
}

export function AppButton({ tooltip, isConfirm, children, onClick, ...props }: IAppButton) {
  const [isADgShow, setIsADgShow] = useState(false)
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button //onClick={onClick}
            onClick={(e) => {
              isConfirm ? setIsADgShow(true) : onClick && onClick(e)
            }}
            {...props}
          >
            {children}
          </Button>
        </TooltipTrigger>
        {tooltip && (
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        )}
      </Tooltip>
      {isConfirm && (
        <AlertDialog open={isADgShow} onOpenChange={setIsADgShow}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className='flex items-center gap-2'>
                <TriangleAlertIcon color='red' />
                Confirm delete
              </AlertDialogTitle>
              <AlertDialogDescription></AlertDialogDescription>
            </AlertDialogHeader>
            Are you sure you want to delete this item?
            <AlertDialogFooter>
              <AlertDialogCancel>No</AlertDialogCancel>
              <AlertDialogAction onClick={onClick}>Yes</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </TooltipProvider>
  )
}
