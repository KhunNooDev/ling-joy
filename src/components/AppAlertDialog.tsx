'use client'
import { useEffect, useState } from 'react'
import _ from 'lodash'
import { TriangleAlertIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { useAlertDialogStore } from '@/store/useAlertDialogStore'

interface IAppAlertDialog {
  alertType?: 'confirm' | 'warning' | 'info'
  title?: string
  description?: string
  onClick?: () => void
}

export type AppAlertDialogType = IAppAlertDialog
export function AppAlertDialog(props: IAppAlertDialog) {
  const {
    isDialogOpen,
    closeDialog,
    alertType: alertTypeStore,
    title: titleStore,
    description: descriptionStore,
    onClick: onClickStore,
  } = useAlertDialogStore()

  const alertType = alertTypeStore || props.alertType
  const title = titleStore || props.title
  const description = descriptionStore || props.description
  const onClick = onClickStore || props.onClick

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={closeDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className='flex items-center gap-2'>
            {alertType === 'confirm' && <TriangleAlertIcon color='red' />}
            {title || (alertType === 'confirm' && 'Confirm')}
          </AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
        </AlertDialogHeader>
        <div className='whitespace-pre'>{description || 'Are you sure?'}</div>
        <AlertDialogFooter>
          <AlertDialogCancel>No</AlertDialogCancel>
          <Button variant='destructive' onClick={onClick} asChild>
            <AlertDialogAction>Yes</AlertDialogAction>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
