import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  createVocabulary,
  deleteVocabulary,
  getVocabularies,
  getVocabularyById,
  updateVocabulary,
} from '@/db/actions/vocabulary.action'
import { IVocabulary } from '@/db/models/vocabulary.model'
import { toast } from 'sonner'
import { z } from 'zod'
import { getCategoryOptions } from '@/db/actions/category.action'

export const formSchema = z.object({
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
  category: z.string(),
})

export const defaultValues = {
  word: '',
  pronunciation: '',
  translation: '',
  example: '',
  exampleTranslation: '',
  level: '',
  category: '',
}

interface VocabularyState {
  vocabularies: IVocabulary[]
  categories: {
    value: string
    label: string
  }[]
  isLoading: boolean
  fetchVocabularies: () => Promise<void>
  updateVocabulary: (data: z.infer<typeof formSchema>) => Promise<void>
  deleteVocabulary: (id: string) => Promise<void>

  isDialogOpen: boolean
  pkId?: string
  isEdit: boolean
  entityVocabulary: z.infer<typeof formSchema>
  setIsDialogOpen: (isOpen: boolean) => void
  openDialog: (isEdit?: boolean, pkId?: string) => Promise<void>
}

export const useVocabularyStore = create<VocabularyState>()(
  persist(
    (set, get) => ({
      vocabularies: [],
      categories: [], //options
      isLoading: true,
      fetchVocabularies: async () => {
        set({ isLoading: true, isDialogOpen: false })
        try {
          const data = await getVocabularies()
          const categories = await getCategoryOptions()
          set({ vocabularies: data, categories })
        } catch (error) {
          console.error('Error fetching vocabularies:', error)
        } finally {
          set({ isLoading: false })
        }
      },
      updateVocabulary: async (values) => {
        const { isEdit, pkId } = get()
        try {
          const newVocabulary = isEdit ? await updateVocabulary(pkId!, values) : await createVocabulary(values)

          toast.success(isEdit ? 'Vocabulary updated!' : 'Vocabulary created!')
          set((state) => ({
            isDialogOpen: false,
            vocabularies: isEdit
              ? state.vocabularies.map((vocab) => (vocab._id === pkId ? newVocabulary : vocab))
              : [...state.vocabularies, newVocabulary],
          }))
        } catch (error) {
          if (error instanceof Error) {
            toast.error(`Failed to update vocabulary: ${error.message}`)
          } else {
            toast.error('Failed to update vocabulary.')
          }
        }
      },
      deleteVocabulary: async (id) => {
        try {
          await deleteVocabulary(id)
          set((state) => ({
            vocabularies: state.vocabularies.filter((vocab) => vocab._id !== id),
          }))
          toast.success('Vocabulary deleted successfully')
        } catch (error) {
          console.error('Error deleting vocabulary:', error)
          toast.error('Failed to delete vocabulary')
        }
      },
      isDialogOpen: false,
      setIsDialogOpen: (isOpen) => {
        set((state) => ({
          isDialogOpen: isOpen,
        }))
      },
      isEdit: false,
      entityVocabulary: defaultValues,
      openDialog: async (isEdit, pkId) => {
        let entityVocabulary = defaultValues
        if (isEdit && pkId) {
          entityVocabulary = await getVocabularyById(pkId)
        }
        set((state) => ({
          isDialogOpen: true,
          isEdit,
          pkId,
          entityVocabulary,
        }))
      },
    }),
    {
      name: 'vocabulary-storage', // Persist with localStorage
    },
  ),
)
