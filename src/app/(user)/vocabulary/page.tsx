'use client'
import { useEffect, useState } from 'react'
import { useVocabularyStore } from '@/store/vocabularyStore'
import { levels } from '@/db/constData/levels'
import { IVocabulary } from '@/db/models/vocabulary.model'
import { ArrowLeftToLineIcon, ArrowRightToLineIcon, GaugeIcon } from 'lucide-react'
import { AppButton } from '@/components/AppButton'
import { cn, keyValueTemplate } from '@/lib/utils'

export default function VocabularyPage() {
  const { vocabularies, isLoading, fetchVocabularies, categories } = useVocabularyStore()

  useEffect(() => {
    fetchVocabularies()
  }, [])

  const [showInfo, setShowInfo] = useState<{ [key: string]: boolean }>({})

  const categorizedVocabularies: Record<string, IVocabulary[]> = vocabularies.reduce(
    (acc: Record<string, IVocabulary[]>, vocab: IVocabulary) => {
      const category = vocab.category ? keyValueTemplate(vocab, 'category', categories) : 'No category'
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(vocab)
      return acc
    },
    {},
  )

  const toggleInfo = (id: string) => {
    setShowInfo((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <main className='p-6'>
      <h1 className='mb-4 text-2xl font-bold'>Vocabulary</h1>
      <div className='p-3'>
        {isLoading ? (
          <p>Loading...</p>
        ) : !vocabularies || vocabularies.length === 0 ? (
          <p>No vocabulary found.</p>
        ) : (
          <div className='mx-auto flex flex-col gap-4'>
            {Object.entries(categorizedVocabularies).map(([category, vocabList]) => (
              <div key={category} className='flex flex-col gap-2'>
                <h2 className='text-xl font-semibold'>{category}</h2>
                <div className='flex flex-row flex-wrap gap-4'>
                  {vocabList.map((vocab) => (
                    <div
                      key={vocab._id}
                      className={cn('flex h-fit w-56 overflow-hidden rounded-lg border bg-gray-100 p-4 shadow-md')}
                    >
                      <div
                        className={cn(
                          'flex transition-transform duration-500',
                          showInfo[vocab._id]
                            ? 'h-0 w-0 translate-x-[-100%] opacity-0'
                            : 'h-full w-full translate-x-0 opacity-100',
                        )}
                      >
                        <div className='w-10/12'>
                          <h3 className='text-lg font-semibold'>{vocab.word}</h3>
                          <p className='text-sm text-gray-500'>{vocab.pronunciation}</p>
                          {/* <span className='flex gap-2 text-blue-600'>
                            <GaugeIcon /> {keyValueTemplate(vocab, 'level', levels)}
                          </span> */}
                        </div>
                        <div className='flex w-2/12 items-center justify-center'>
                          <AppButton onClick={() => toggleInfo(vocab._id)} size='icon' variant='ghost'>
                            <ArrowRightToLineIcon />
                          </AppButton>
                        </div>
                      </div>
                      <div
                        className={cn(
                          'flex transition-transform duration-500',
                          showInfo[vocab._id]
                            ? 'h-full w-full translate-x-0 opacity-100'
                            : 'h-0 w-0 translate-x-[100%] opacity-0',
                        )}
                      >
                        <div className='flex w-2/12 items-center justify-center'>
                          <AppButton onClick={() => toggleInfo(vocab._id)} size='icon' variant='ghost'>
                            <ArrowLeftToLineIcon />
                          </AppButton>
                        </div>
                        <div className='w-10/12'>
                          <p>{vocab.translation}</p>
                          <p className='italic'>{vocab.example}</p>
                          <p className='text-sm text-gray-400'>{vocab.exampleTranslation}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
