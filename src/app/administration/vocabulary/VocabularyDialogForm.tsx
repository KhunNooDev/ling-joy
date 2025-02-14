'use client'
import { useRef } from 'react'
import { levels } from '@/db/constData/levels'
import { AppButton } from '@/components/AppButton'
import AppForm, { AppInputCombobox, AppInputText } from '@/components/AppForm'
import { vocabularySchema, useVocabularyStore, VocabularySchemaType } from '@/store/vocabularyStore'
import AppDialog from '@/components/AppDialog'

interface IVocabularyDialogForm {}

export default function VocabularyDialogForm({}: IVocabularyDialogForm) {
  const {
    isDialogOpen,
    setIsDialogOpen,
    isEdit,
    entityVocabulary,
    saveVocabulary: updateVocabulary,
    categories,
  } = useVocabularyStore()

  const formRef = useRef<{ reset: () => void }>(null)

  const onSubmit = async (values: VocabularySchemaType) => {
    const success = await updateVocabulary(values)
    if (success) {
      formRef.current?.reset()
    }
  }

  return (
    <AppDialog
      title={isEdit ? 'Edit Vocabulary' : 'New Vocabulary'}
      isDialogOpen={isDialogOpen}
      setIsDialogOpen={setIsDialogOpen}
      footer={
        <>
          <AppButton onClick={() => formRef.current?.reset()}>Reset</AppButton>
          <div className='flex gap-4'>
            <AppButton variant='destructive' onClick={() => setIsDialogOpen(false)}>
              Cancel
            </AppButton>
            <AppButton form='vocabularyForm' type='submit'>
              {isEdit ? 'Update' : 'Submit'}
            </AppButton>
          </div>
        </>
      }
    >
      <AppForm
        ref={formRef}
        id='vocabularyForm'
        schema={vocabularySchema}
        defaultValues={entityVocabulary}
        onSubmit={onSubmit}
        // readOnly
      >
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
      </AppForm>
    </AppDialog>
  )
}
