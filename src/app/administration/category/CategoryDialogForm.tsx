'use client'
import { useEffect } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { formSchema, useCategoryStore } from '@/store/categoryStore'

interface ICategoryForm {}

export default function CategoryDialogForm({}: ICategoryForm) {
  const { isDialogOpen, setIsDialogOpen, isEdit, entityCategory, updateCategory } = useCategoryStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: entityCategory,
  })

  useEffect(() => {
    form.reset(entityCategory)
  }, [entityCategory, form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await updateCategory(values)
    form.reset()
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Category' : 'New Category'}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id='categoryForm' autoComplete='off' onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className='flex-row !justify-between'>
          <Button variant='secondary' onClick={() => form.reset(entityCategory)}>
            Reset
          </Button>
          <div className='flex gap-4'>
            <DialogClose asChild>
              <Button variant='destructive'>Cancel</Button>
            </DialogClose>
            <Button form='categoryForm' type='submit'>
              {isEdit ? 'Update' : 'Submit'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
