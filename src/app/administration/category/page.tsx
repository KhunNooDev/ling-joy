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
        <AppDataTable
          data={categories}
          actions={[
            {
              tooltip: 'Edit',
              onClick: (rowData) => openDialog(true, rowData._id),
              icon: <PencilIcon size={40} />,
            },
            {
              tooltip: 'Delete',
              onClick: (rowData) => deleteCategory(rowData._id),
              icon: <Trash2Icon />,
              variant: 'destructive',
              isConfirm: 'Are you sure you want to delete this item?',
            },
          ]}
        >
          <Column field='name' title='Name' sortable />
          <Column field='description' title='Description' sortable size={400} />
        </AppDataTable>
      </div>
    </main>
  )
}
