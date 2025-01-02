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
import { createVocabulary, getVocabularyById, updateVocabulary } from '@/db/actions/vocabulary.action'
import { IVocabulary } from '@/db/models/vocabulary.model'
import { PencilIcon } from 'lucide-react'

const formSchema = z.object({
  word: z.string().min(1, {
    message: 'Word is required.',
  }),
  pronunciation: z.string().min(1, {
    message: 'Pronunciation is required.',
  }),
  translation: z.string().min(1, {
    message: 'Translation is required.',
  }),
  example: z.string().min(1, {
    message: 'Example is required.',
  }),
  exampleTranslation: z.string().min(1, {
    message: 'Translation of example is required.',
  }),
  level: z.string().min(1, {
    message: 'Level is required.',
  }),
})

const defaultValues = {
  word: '',
  pronunciation: '',
  translation: '',
  example: '',
  exampleTranslation: '',
  level: '',
}
interface IVocabularyForm {
  isEdit?: boolean
  pkId?: string
  setVocabularies: Dispatch<SetStateAction<IVocabulary[] | undefined>>
}

export default function VocabularyButtonDialogForm({
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
      const data = isCreate ? await createVocabulary(values) : await updateVocabulary(pkId, values)

      setVocabularies((prev) => {
        if (isCreate) {
          return [...(prev || []), data]
        }
        return prev?.map((vocabulary) => (vocabulary._id === pkId ? data : vocabulary)) || []
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
      const data = await getVocabularyById(pkId)
      const _editingVocabulary = data
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
              <Button onClick={() => onOpenDialog()} size='icon'>
                <PencilIcon />
              </Button>
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
              name='word'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Word</FormLabel>
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
              name='example'
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
              name='exampleTranslation'
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
            <FormField
              control={form.control}
              name='level'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Level</FormLabel>
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
