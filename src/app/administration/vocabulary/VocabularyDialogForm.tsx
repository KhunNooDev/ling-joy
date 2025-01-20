'use client'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { levels } from '@/db/constData/levels'
import { AppButton } from '@/components/AppButton'
import AppForm, { AppFormResetButton, AppInputCombobox, AppInputText } from '@/components/AppForm'
import { vocabularySchema, useVocabularyStore, VocabularySchemaType } from '@/store/vocabularyStore'

interface IVocabularyForm {}

export default function VocabularyDialogForm({}: IVocabularyForm) {
  const { isDialogOpen, setIsDialogOpen, isEdit, entityVocabulary, updateVocabulary, categories } = useVocabularyStore()

  const onSubmit = async (values: VocabularySchemaType, reset: () => void) => {
    const success = await updateVocabulary(values)
    if (success) {
      reset()
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Vocabulary' : 'New Vocabulary'}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <AppForm id='vocabularyForm' schema={vocabularySchema} defaultValues={entityVocabulary} onSubmit={onSubmit}>
          <AppInputText field='word' label='Word' disabled={isEdit} />
          <AppInputText field='pronunciation' label='Pronunciation' />
          <AppInputText field='translation' label='Translation' />
          <AppInputText field='example' label='Example Sentence' />
          <AppInputText field='exampleTranslation' label='Translation of Example Sentence' />
          <div className='flex w-full gap-2'>
            <AppInputCombobox
              field='level'
              label='Level'
              options={levels}
              placeholder='Select level...'
              className='w-1/2'
            />
            <AppInputCombobox
              field='category'
              label='Category'
              options={categories}
              placeholder='Select category...'
              className='w-1/2'
            />
          </div>
          <DialogFooter className='flex-row !justify-between'>
            <AppFormResetButton />
            <div className='flex gap-4'>
              <DialogClose asChild>
                <AppButton variant='destructive'>Cancel</AppButton>
              </DialogClose>
              <AppButton form='vocabularyForm' type='submit'>
                {isEdit ? 'Update' : 'Submit'}
              </AppButton>
            </div>
          </DialogFooter>
        </AppForm>
      </DialogContent>
    </Dialog>
  )
}
