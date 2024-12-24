'use client'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { VocabularyType } from '@/model/vocabularies'

const formSchema = z.object({
  vocabulary: z.string().min(1, {
    message: 'Vocabulary is required.',
  }),
  pronunciation: z.string().min(1, {
    message: 'Pronunciation is required.',
  }),
  translation: z.string().min(1, {
    message: 'Translation is required.',
  }),
  exampleSentence: z.string().min(1, {
    message: 'Example sentence is required.',
  }),
  translationOfExampleSentence: z.string().min(1, {
    message: 'Translation of example sentence is required.',
  }),
})

const defaultValues = {
  vocabulary: '',
  pronunciation: '',
  translation: '',
  exampleSentence: '',
  translationOfExampleSentence: '',
}
interface IVocabularyForm {
  isEdit?: boolean
  pkId?: string
  setVocabularies: Dispatch<SetStateAction<VocabularyType[]>>
}

export default function ButtonDialogForm({
  isEdit: isEdit,
  pkId: pkId,
  setVocabularies: setVocabularies,
}: IVocabularyForm) {
  const [editingVocabulary, setEditingVocabulary] = useState<z.infer<typeof formSchema>>(defaultValues)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: editingVocabulary || defaultValues,
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const isCreate = !(isEdit && pkId)
      const url = isCreate ? '/api/vocabularies' : `/api/vocabularies/${pkId}`
      const method = isCreate ? 'POST' : 'PUT'
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...values }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      setVocabularies((prev) => {
        if (isCreate) {
          return [...(prev || []), data.data]
        }
        return prev?.map((vocabulary) => (vocabulary._id === pkId ? data.data : vocabulary)) || null
      })
      toast.success(editingVocabulary ? 'Vocabulary updated!' : 'Vocabulary created!')
      setIsDialogOpen(false)
    } catch (error) {
      toast.error('Failed to submit form.')
    }
  }
  //fetch data by id
  const onOpenDialog = async () => {
    setIsDialogOpen(true)
    if (isEdit && pkId) {
      const response = await fetch(`/api/vocabularies/${pkId}`)
      const data = await response.json()
      const _editingVocabulary = data.data
      setEditingVocabulary(_editingVocabulary)
      form.reset(_editingVocabulary)
    } else {
      form.reset(defaultValues)
    }
  }
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      {isEdit ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={() => onOpenDialog()}>Edit</Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>Edit</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <Button onClick={() => onOpenDialog()}>New</Button>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Vocabulary' : 'New Vocabulary'}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id='vocabularyForm' autoComplete='off' onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='vocabulary'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vocabulary</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter vocabulary' {...field} />
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
                    <Input placeholder='Enter pronunciation' {...field} />
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
                    <Input placeholder='Enter translation' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='exampleSentence'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Example Sentence</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter example sentence' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='translationOfExampleSentence'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Translation of Example Sentence</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter translation of example sentence' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className='flex-row !justify-between'>
          <Button variant='secondary' onClick={() => form.reset(editingVocabulary)}>
            Reset
          </Button>
          <div className='flex gap-4'>
            <DialogClose asChild>
              <Button variant='destructive'>Cancel</Button>
            </DialogClose>
            <Button form='vocabularyForm' type='submit'>
              {isEdit ? 'Update' : 'Submit'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
