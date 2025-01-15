'use client'
import { useEffect } from 'react'
import { PencilIcon, Trash2Icon } from 'lucide-react'
import { useVocabularyStore } from '@/store/vocabularyStore'
import { AppButton } from '@/components/AppButton'
import VocabularyDialogForm from './VocabularyDialogForm'
import { levels } from '@/db/constData/levels'
import AppDataTable, { Column } from '@/components/AppDataTable'

export default function VocabularyPage() {
  const { vocabularies, isLoading, fetchVocabularies, deleteVocabulary, openDialog, categories } = useVocabularyStore()

  useEffect(() => {
    fetchVocabularies()
  }, [])

  return (
    <main className='p-6'>
      <VocabularyDialogForm />
      <h1 className='mb-4 text-2xl font-bold'>Vocabulary List</h1>
      <AppButton onClick={() => openDialog()}>New</AppButton>
      <div className='p-3'>
        <AppDataTable
          data={vocabularies}
          actions={[
            {
              tooltip: 'Edit',
              onClick: (rowData) => openDialog(true, rowData._id),
              icon: <PencilIcon size={40} />,
            },
            {
              tooltip: 'Delete',
              onClick: (rowData) => deleteVocabulary(rowData._id),
              icon: <Trash2Icon />,
              variant: 'destructive',
              isConfirm: 'Are you sure you want to delete this item?',
            },
          ]}
        >
          <Column field='word' title='Word' sortable />
          <Column field='pronunciation' title='Pronunciation' sortable />
          <Column field='translation' title='Translation' sortable />
          <Column field='example' title='Example' sortable />
          <Column field='exampleTranslation' title='ExampleTranslation' sortable size={500} />
          <Column field='level' title='Level' sortable useKeyValue={levels} />
          <Column field='category' title='Category' sortable useKeyValue={categories} />
        </AppDataTable>
      </div>
    </main>
  )
}
