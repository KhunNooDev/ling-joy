'use client'
import React, { forwardRef, useEffect, useImperativeHandle } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm, useFormContext, UseFormReset, UseFormReturn } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { AppCombobox, IAppCombobox } from '@/components/AppCombobox'
import { AppButton } from '@/components/AppButton'
import { cn } from '@/lib/utils'

interface IAppForm extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  id?: string //add props form='nameForm' same id for used button outside the form.
  schema: z.ZodType<any>
  onSubmit: (data: any) => void
  // children: React.ReactNode
  defaultValues?: Record<string, any>
  readOnly?: boolean // Add readonly prop
}

export default forwardRef(function AppForm(
  { id, schema, onSubmit, defaultValues = {}, children, className, readOnly, ...props }: IAppForm,
  ref,
) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    disabled: readOnly === true ? true : undefined,
  })

  useEffect(() => {
    form.reset(defaultValues)
  }, [defaultValues, form])

  const { handleSubmit, reset } = form

  useImperativeHandle(ref, () => ({ reset }), [reset])

  return (
    <FormProvider {...form}>
      <form
        id={id}
        autoComplete='off'
        onSubmit={handleSubmit(onSubmit)}
        className={cn('space-y-4', className)}
        {...props}
      >
        {children}
      </form>
    </FormProvider>
  )
})

interface IDefaultInput extends React.InputHTMLAttributes<HTMLInputElement> {
  field: string
  label: string
}

export function AppInputText({ field, label, ...props }: IDefaultInput) {
  const { control } = useFormContext()

  return (
    <FormField
      defaultValue=''
      name={field}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...field} {...props} disabled={field.disabled || props.disabled} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export function AppInputNumber({ field, label, ...props }: IDefaultInput) {
  const { control } = useFormContext()

  return (
    <FormField
      defaultValue=''
      name={field}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type='number' {...field} {...props} disabled={field.disabled || props.disabled} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export function AppInputPass({ field, label, ...props }: IDefaultInput) {
  const { control } = useFormContext()

  return (
    <FormField
      defaultValue=''
      name={field}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type='password' {...field} {...props} disabled={field.disabled || props.disabled} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

interface IAppInputCombobox extends IAppCombobox {
  field: string
  label: string
}
export function AppInputCombobox({ field, label, className, ...props }: IAppInputCombobox) {
  const { control } = useFormContext()

  return (
    <FormField
      defaultValue=''
      name={field}
      control={control}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <AppCombobox {...field} {...props} disabled={field.disabled || props.disabled} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
