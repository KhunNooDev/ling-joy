import React, { useEffect } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { AppCombobox, IAppCombobox } from './AppCombobox'
import { AppButton } from './AppButton'

interface IAppForm {
  id?: string //add props form='nameForm' same id for used button outside the form.
  schema: z.ZodType<any>
  onSubmit: (data: any, reset: () => void) => void
  children: React.ReactNode
  defaultValues?: Record<string, any>
}
export default function AppForm({ id, schema, onSubmit, children, defaultValues = {} }: IAppForm) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  })

  useEffect(() => {
    form.reset(defaultValues)
  }, [defaultValues, form])

  return (
    <FormProvider {...form}>
      <form
        id={id}
        autoComplete='off'
        onSubmit={form.handleSubmit((data) => onSubmit(data, form.reset))}
        className='space-y-4'
      >
        {children}
      </form>
    </FormProvider>
  )
}

export function AppFormResetButton({ defaultValues }: { defaultValues?: Record<string, any> }) {
  const formContext = useFormContext()
  if (!formContext) {
    return null // or handle the error as needed
  }
  const { reset } = formContext
  return (
    <AppButton variant='secondary' onClick={() => reset(defaultValues)}>
      Reset
    </AppButton>
  )
}

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
            <Input {...field} {...props} />
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
            <Input type='number' {...field} {...props} />
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
            <Input type='password' {...field} {...props} />
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
            <AppCombobox {...field} {...props} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
