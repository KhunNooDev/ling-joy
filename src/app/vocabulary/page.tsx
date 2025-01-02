'use client'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { IVocabulary } from '@/db/models/vocabulary.model'
import { deleteVocabulary, getVocabulary } from '@/db/actions/vocabulary.action'
import VocabularyButtonDialogForm from './VocabularyButtonDialogForm'
import { Button } from '@/components/ui/button'
import { Trash2Icon } from 'lucide-react'

export default function VocabularyPage() {
  const [vocabularies, setVocabularies] = useState<IVocabulary[]>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const data = await getVocabulary()
      setVocabularies(data)
    } catch (error) {
      console.error('Error fetching vocabularies:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteData = async (id: string) => {
    try {
      await deleteVocabulary(id)
      toast.success('Vocabulary deleted successfully')
      setVocabularies((prev) => prev?.filter((vocab) => vocab._id !== id) || [])
    } catch (error) {
      console.error('Error deleting vocabulary:', error)
      toast.error('Failed to delete vocabulary')
    }
  }

  return (
    <main className='p-6'>
      <h1 className='mb-4 text-2xl font-bold'>Vocabulary List</h1>
      <VocabularyButtonDialogForm setVocabularies={setVocabularies} />
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
                  <VocabularyButtonDialogForm isEdit pkId={vocab._id} setVocabularies={setVocabularies} />

                  <Button variant='destructive' onClick={() => deleteData(vocab._id)} size='icon'>
                    <Trash2Icon />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
