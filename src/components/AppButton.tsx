'use client'
import { useState } from 'react'
import { TriangleAlertIcon } from 'lucide-react'
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

interface IAppButton extends ButtonProps {
  tooltip?: string
  isConfirm?: boolean
  alertText?: string
}

export function AppButton({ tooltip, isConfirm, alertText, children, onClick, ...props }: IAppButton) {
  const [isADgShow, setIsADgShow] = useState(false)
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
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
                Confirm
              </AlertDialogTitle>
              <AlertDialogDescription></AlertDialogDescription>
            </AlertDialogHeader>
            {alertText ? alertText : 'Are you sure?'}
            <AlertDialogFooter>
              <AlertDialogCancel>No</AlertDialogCancel>
              <Button variant='destructive' onClick={onClick} asChild>
                <AlertDialogAction>Yes</AlertDialogAction>
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </TooltipProvider>
  )
}
