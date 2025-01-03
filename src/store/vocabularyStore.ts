import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { deleteVocabulary, getVocabularies, getVocabularyById } from '@/db/actions/vocabulary.action'
import { IVocabulary } from '@/db/models/vocabulary.model'
import { toast } from 'sonner'
import { z } from 'zod'

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
})

export const defaultValues = {
  word: '',
  pronunciation: '',
  translation: '',
  example: '',
  exampleTranslation: '',
  level: '',
}

interface VocabularyState {
  vocabularies: IVocabulary[]
  isLoading: boolean
  upsertVocabulary: (data: IVocabulary, isCreate: boolean, pkId?: string) => void
  fetchVocabularies: () => Promise<void>
  deleteVocabulary: (id: string) => Promise<void>
  isDialogOpen: boolean
  // editingVocabulary: z.infer<typeof formSchema>
  setIsDialogOpen: (isOpen: boolean) => void
  openDialog: (isEdit: boolean, pkId?: string) => Promise<void>
  // closeDialog: () => void
}

export const useVocabularyStore = create<VocabularyState>()(
  persist(
    (set, get) => ({
      vocabularies: [],
      isLoading: true,
      upsertVocabulary: (data, isCreate, pkId) => {
        set((state) => ({
          vocabularies: isCreate
            ? [...state.vocabularies, data]
            : state.vocabularies.map((vocab) => (vocab._id === pkId ? data : vocab)),
        }))
      },
      fetchVocabularies: async () => {
        set({ isLoading: true })
        try {
          const data = await getVocabularies()
          set({ vocabularies: data })
        } catch (error) {
          console.error('Error fetching vocabularies:', error)
        } finally {
          set({ isLoading: false })
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
      // editingVocabulary: defaultValues,
      setIsDialogOpen: (isOpen) => {
        set((state) => ({
          isDialogOpen: isOpen,
        }))
      },
      openDialog: async (isEdit, pkId) => {
        set({ isDialogOpen: true })
        // if (isEdit && pkId) {
        //   try {
        //     const data = await getVocabularyById(pkId)
        //     const validatedData = formSchema.parse(data)
        //     set({ editingVocabulary: validatedData })
        //   } catch (error) {
        //     console.error('Failed to fetch vocabulary:', error)
        //     set({ editingVocabulary: formSchema.parse(defaultValues) })
        //   }
        // } else {
        //   set({ editingVocabulary: formSchema.parse(defaultValues) })
        // }
      },

      // closeDialog: () =>
      //   set({
      //     isDialogOpen: false,
      //     // editingVocabulary: formSchema.parse(defaultValues)
      //   }),
    }),
    {
      name: 'vocabulary-storage', // Persist with localStorage
    },
  ),
)
