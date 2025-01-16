import React from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

interface IAppForm {
  id?: string //add props form='nameForm' same id for used button outside the form.
  schema: z.ZodType<any>
  onSubmit: (data: any) => void
  children: React.ReactNode
  defaultValues?: Record<string, any>
}
export default function AppForm({ id, schema, onSubmit, children, defaultValues = {} }: IAppForm) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  })

  return (
    <FormProvider {...form}>
      <form id={id} autoComplete='off' onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        {children}
      </form>
    </FormProvider>
  )
}

interface IDefaultInput {
  field: string
  label: string
}

export function AppInputText({ field, label }: IDefaultInput) {
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
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export function AppInputPass({ field, label }: IDefaultInput) {
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
            <Input type='password' {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
