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
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { formSchema, useVocabularyStore } from '@/store/vocabularyStore'
import { AppCombobox } from '@/components/AppCombobox'
import { levels } from '@/db/constData/levels'
import { AppButton } from '@/components/AppButton'

interface IVocabularyForm {}

export default function VocabularyDialogForm({}: IVocabularyForm) {
  const { isDialogOpen, setIsDialogOpen, isEdit, entityVocabulary, updateVocabulary, categories } = useVocabularyStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: entityVocabulary,
  })

  useEffect(() => {
    form.reset(entityVocabulary)
  }, [entityVocabulary, form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await updateVocabulary(values)
    form.reset()
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Vocabulary' : 'New Vocabulary'}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id='vocabularyForm' autoComplete='off' onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='word'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Word</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='pronunciation'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pronunciation</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='translation'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Translation</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='example'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Example Sentence</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='exampleTranslation'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Translation of Example Sentence</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex w-full gap-2'>
              <FormField
                control={form.control}
                name='level'
                render={({ field }) => (
                  <FormItem className='w-1/2'>
                    <FormLabel>Level</FormLabel>
                    <FormControl>
                      <AppCombobox {...field} options={levels} placeholder='Select level...' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='category'
                render={({ field }) => (
                  <FormItem className='w-1/2'>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <AppCombobox {...field} options={categories} placeholder='Select category...' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter className='flex-row !justify-between'>
          <AppButton variant='secondary' onClick={() => form.reset(entityVocabulary)}>
            Reset
          </AppButton>
          <div className='flex gap-4'>
            <DialogClose asChild>
              <AppButton variant='destructive'>Cancel</AppButton>
            </DialogClose>
            <AppButton form='vocabularyForm' type='submit'>
              {isEdit ? 'Update' : 'Submit'}
            </AppButton>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
