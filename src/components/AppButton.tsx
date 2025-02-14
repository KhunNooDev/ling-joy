'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import _ from 'lodash'
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
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'

export interface IAppButton extends ButtonProps {
  tooltip?: string
  isConfirm?: string | boolean
}

export function AppButton({ tooltip, isConfirm, children, onClick, className, ...props }: IAppButton) {
  const [isADgShow, setIsADgShow] = useState(false)
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type='button'
            onClick={(e) => {
              !!isConfirm ? setIsADgShow(true) : onClick?.(e)
            }}
            className={cn('select-none', className)}
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
      {!!isConfirm && (
        <AlertDialog open={isADgShow} onOpenChange={setIsADgShow}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className='flex items-center gap-2'>
                <TriangleAlertIcon color='red' />
                Confirm
              </AlertDialogTitle>
              <AlertDialogDescription></AlertDialogDescription>
            </AlertDialogHeader>
            {_.isString(isConfirm) ? isConfirm : 'Are you sure?'}
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

export function AppButtonToPath({ href, text, className }: { href: string; text: string; className?: string }) {
  const router = useRouter()
  return (
    <AppButton onClick={() => router.push(href)} className={className}>
      {text}
    </AppButton>
  )
}

export function AppButtonLogin() {
  return <AppButtonToPath href='/auth' text='Login' />
}

export function AppButtonLogout() {
  return (
    <AppButton onClick={() => signOut({ callbackUrl: '/auth', redirect: true })} variant='destructive'>
      Logout
    </AppButton>
  )
}
