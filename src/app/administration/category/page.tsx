'use client'
import { useEffect } from 'react'
import { PencilIcon, Trash2Icon } from 'lucide-react'
import { useCategoryStore } from '@/store/categoryStore'
import { AppButton } from '@/components/AppButton'
import CategoryDialogForm from './CategoryDialogForm'
import AppDataTable, { Column } from '@/components/AppDataTable'
import CategoryModel from '@/db/models/category.model'

export default function CategoryPage() {
  const { categories, isLoading, fetchCategories, deleteCategory, openDialog } = useCategoryStore()

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <main className='p-6'>
      <CategoryDialogForm />
      <h1 className='mb-4 text-2xl font-bold'>Category List</h1>
      <AppButton onClick={() => openDialog()}>New</AppButton>
      <div className='p-3'>
        <AppDataTable data={categories} onEdit={(rowData) => openDialog(true, rowData._id)}>
          <Column field='name' title='Name' sortable />
          <Column field='description' title='Description' sortable size={300} />
        </AppDataTable>
      </div>
    </main>
  )
}
