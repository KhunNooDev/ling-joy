'use server'
import VocabularyModel, { IVocabulary } from '@/db/models/vocabulary.model'
import dbConnect from '@/lib/dbConnect'
import { convertMongoObjectIdToString } from '@/db/utils'

//
export async function getVocabulary() {
  await dbConnect()
  const vocab = await VocabularyModel.find({})
  const vocabData = convertMongoObjectIdToString<IVocabulary[]>(vocab)
  return vocabData
}

//
export async function getVocabularyById(id: string) {
  await dbConnect()
  const vocab = await VocabularyModel.findById(id)
  const vocabData = convertMongoObjectIdToString<IVocabulary>(vocab)
  return vocabData
}

// Create Vocabulary Entry
export async function createVocabulary(vocabularyData: Partial<IVocabulary>) {
  await dbConnect()
  const vocab = new VocabularyModel(vocabularyData)
  const data = await vocab.save()
  const vocabData = convertMongoObjectIdToString<IVocabulary>(data)
  return vocabData
}

// Update Vocabulary by ID
export async function updateVocabulary(id: string, updateData: Partial<IVocabulary>) {
  await dbConnect()
  const updated = await VocabularyModel.findByIdAndUpdate(id, updateData, { new: true })
  const updatedData = convertMongoObjectIdToString<IVocabulary>(updated)
  return updatedData
}

// Delete Vocabulary by ID
export async function deleteVocabulary(id: string) {
  await dbConnect()
  await VocabularyModel.findByIdAndDelete(id)
  return { message: 'Vocabulary deleted successfully' }
}
