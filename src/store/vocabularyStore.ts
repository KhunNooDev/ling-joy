import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  createVocabulary,
  deleteVocabulary,
  getVocabularies,
  getVocabularyById,
  getVocabularyByWord,
  updateVocabulary,
} from '@/db/actions/vocabulary.action'
import { IVocabulary } from '@/db/models/vocabulary.model'
import { toast } from 'sonner'
import { z } from 'zod'
import { getCategoryOptions } from '@/db/actions/category.action'
import { appAlertDialog } from './useAlertDialogStore'

export const vocabularySchema = z.object({
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
export type VocabularySchemaType = z.infer<typeof vocabularySchema>

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
  saveVocabulary: (data: VocabularySchemaType) => Promise<boolean>
  deleteVocabulary: (id: string) => Promise<void>

  isDialogOpen: boolean
  pkId?: string
  isEdit: boolean
  entityVocabulary: VocabularySchemaType
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
      saveVocabulary: async (values) => {
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
          return true
        } catch (error) {
          if (error instanceof Error) {
            const errorCodeMatch = error.message.match(/error code: (\d+) - (.+)/)
            const errorCode = errorCodeMatch ? errorCodeMatch[1] : 'Unknown'
            const errorMessage = errorCodeMatch ? errorCodeMatch[2] : 'Unknown error'
            if (errorCode === '11000') {
              appAlertDialog({
                alertType: 'warning',
                title: 'Duplicate entry',
                description: `Failed to update vocabulary: ${errorMessage}\nDo you want to open the existing vocabulary? This data will be lost.`,
                onClick: async () => {
                  // Open the existing vocabulary
                  const existingVocabulary = await getVocabularyByWord(values.word)
                  if (existingVocabulary) {
                    get().openDialog(true, existingVocabulary._id)
                  }
                },
              })
            } else {
              toast.error(`Failed to update vocabulary: ${error.message}`)
            }
          } else {
            toast.error('Failed to update vocabulary.')
          }
          return false
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
