'use client'
import { useEffect } from 'react'
import { PencilIcon, Trash2Icon } from 'lucide-react'
import { useVocabularyStore } from '@/store/vocabularyStore'
import { AppButton } from '@/components/AppButton'
import VocabularyButtonDialogForm from './VocabularyButtonDialogForm'

export default function VocabularyPage() {
  const { vocabularies, fetchVocabularies, deleteVocabulary, isLoading, openDialog } = useVocabularyStore()

  useEffect(() => {
    fetchVocabularies()
  }, [])

  return (
    <main className='p-6'>
      <h1 className='mb-4 text-2xl font-bold'>Vocabulary List</h1>
      {/* <VocabularyButtonDialogForm /> */}

      <div className='p-3'>
        {isLoading ? (
          <p>Loading...</p>
        ) : !vocabularies || vocabularies.length === 0 ? (
          <p>No vocabulary found.</p>
        ) : (
          <div className='mx-auto flex flex-row flex-wrap gap-4'>
            {vocabularies.map((vocab) => (
              <div key={vocab._id} className='col-span-1 h-fit w-52 rounded-lg border bg-gray-100 p-4 shadow-xl'>
                <h2 className='text-lg font-semibold'>{vocab.word}</h2>
                <p className='text-sm text-gray-500'>{vocab.pronunciation}</p>
                <p>{vocab.translation}</p>
                <p className='italic'>{vocab.example}</p>
                <p className='text-sm text-gray-400'>{vocab.exampleTranslation}</p>
                <span className='text-blue-600'>Level: {vocab.level}</span>
                <div className='flex w-full justify-between'>
                  <VocabularyButtonDialogForm isEdit pkId={vocab._id} />

                  <AppButton onClick={() => openDialog(true, vocab._id)} size='icon'>
                    <PencilIcon />
                  </AppButton>
                  <AppButton
                    variant='destructive'
                    onClick={() => deleteVocabulary(vocab._id)}
                    size='icon'
                    tooltip='Delete'
                  >
                    <Trash2Icon />
                  </AppButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
