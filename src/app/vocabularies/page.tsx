'use client'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { VocabularyType } from '@/model/vocabularies'
import ButtonDialogForm from './buttonDialogForm'
import { TriangleAlertIcon } from 'lucide-react'

export default function VocabulariesPage() {
  const [vocabularies, setVocabularies] = useState<VocabularyType[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/vocabularies')
      const data = await response.json()
      setVocabularies(data.data)
      console.log(data)
    } catch (error) {
      console.error('Error fetching vocabularies:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/vocabularies/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete vocabulary.')
      }

      setVocabularies((prev) => prev?.filter((vocab) => vocab._id !== id) || null)
      toast.success('Vocabulary deleted successfully!')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to delete vocabulary.')
    }
  }

  return (
    <main className='space-y-4 p-4'>
      <section>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-semibold'>Vocabularies</h1>
          <ButtonDialogForm setVocabularies={setVocabularies} />
        </div>
      </section>
      <section>
        {vocabularies && vocabularies.length > 0 ? (
          <Carousel className='mx-auto w-full md:w-3/4 lg:w-2/3 xl:w-1/2'>
            <CarouselContent className='-ml-1'>
              {vocabularies.map((vocabulary, index) => (
                <CarouselItem key={index} className='pl-1 md:basis-1/2 lg:basis-1/3'>
                  <div className='p-1'>
                    <Card>
                      <CardContent className='flex aspect-square flex-col items-center justify-center p-6'>
                        <span className='text-2xl font-semibold'>{vocabulary.vocabulary}</span>
                        <span className='text-base font-semibold'>{vocabulary.pronunciation}</span>
                        <span className='text-base font-semibold'>{vocabulary.translation}</span>
                      </CardContent>
                      <CardFooter className='justify-between'>
                        <ButtonDialogForm isEdit pkId={vocabulary._id} setVocabularies={setVocabularies} />

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant='destructive'>Delete</Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <span>Delete</span>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className='flex items-center gap-2'>
                                <TriangleAlertIcon color='red' />
                                Confirm delete
                              </AlertDialogTitle>
                              <AlertDialogDescription></AlertDialogDescription>
                            </AlertDialogHeader>
                            Are you sure you want to delete this item?
                            <AlertDialogFooter>
                              <AlertDialogCancel>No</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(vocabulary._id)}>Yes</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </CardFooter>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          <div className='flex h-96 items-center justify-center'>
            <span className='text-2xl font-semibold'>
              {isLoading ? 'Loading vocabularies...' : 'No vocabularies found.'}
            </span>
          </div>
        )}
      </section>
    </main>
  )
}
