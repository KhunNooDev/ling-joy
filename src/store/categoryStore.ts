import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from '@/db/actions/category.action'
import { ICategory } from '@/db/models/category.model'
import { toast } from 'sonner'
import { z } from 'zod'

export const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Name is required.',
  }),
  description: z.string().optional(),
})

export const defaultValues = {
  name: '',
  // description: null,
}

interface CategoryState {
  categories: ICategory[]
  isLoading: boolean
  fetchCategories: () => Promise<void>
  updateCategory: (data: z.infer<typeof formSchema>) => Promise<void>
  deleteCategory: (id: string) => Promise<void>

  isDialogOpen: boolean
  pkId?: string
  isEdit: boolean
  entityCategory: z.infer<typeof formSchema>
  setIsDialogOpen: (isOpen: boolean) => void
  openDialog: (isEdit?: boolean, pkId?: string) => Promise<void>
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      categories: [],
      isLoading: true,
      fetchCategories: async () => {
        set({ isLoading: true, isDialogOpen: false })
        try {
          const data = await getCategories()
          set({ categories: data })
        } catch (error) {
          console.error('Error fetching categories:', error)
        } finally {
          set({ isLoading: false })
        }
      },
      updateCategory: async (values) => {
        const { isEdit, pkId } = get()
        try {
          const newCategory = isEdit ? await updateCategory(pkId!, values) : await createCategory(values)

          toast.success(isEdit ? 'Category updated!' : 'Category created!')
          set((state) => ({
            isDialogOpen: false,
            categories: isEdit
              ? state.categories.map((cat) => (cat._id === pkId ? newCategory : cat))
              : [...state.categories, newCategory],
          }))
        } catch (error) {
          if (error instanceof Error) {
            toast.error(`Failed to update category: ${error.message}`)
          } else {
            toast.error('Failed to update category.')
          }
        }
      },
      deleteCategory: async (id) => {
        try {
          await deleteCategory(id)
          set((state) => ({
            categories: state.categories.filter((cat) => cat._id !== id),
          }))
          toast.success('Category deleted successfully')
        } catch (error) {
          console.error('Error deleting category:', error)
          toast.error('Failed to delete category')
        }
      },
      isDialogOpen: false,
      setIsDialogOpen: (isOpen) => {
        set((state) => ({
          isDialogOpen: isOpen,
        }))
      },
      isEdit: false,
      entityCategory: defaultValues,
      openDialog: async (isEdit, pkId) => {
        let entityCategory = defaultValues
        if (isEdit && pkId) {
          entityCategory = await getCategoryById(pkId)
        }
        set((state) => ({
          isDialogOpen: true,
          isEdit,
          pkId,
          entityCategory,
        }))
      },
    }),
    {
      name: 'category-storage', // Persist with localStorage
    },
  ),
)
