'use server'
import dbConnect from '@/lib/dbConnect'
import { MongoServerError } from 'mongodb'
import VocabularyModel, { IVocabulary } from '@/db/models/vocabulary.model'
import { convertMongoObjectIdToString, handleMongoError } from '@/db/utils'

/** Get all vocabulary */
export async function getVocabularies() {
  await dbConnect()
  const data = await VocabularyModel.find({})
  const vocab = convertMongoObjectIdToString<IVocabulary[]>(data)
  return vocab
}

/** Get vocabulary by id */
export async function getVocabularyById(id: string) {
  await dbConnect()
  const data = await VocabularyModel.findById(id)
  const vocab = convertMongoObjectIdToString<IVocabulary>(data)
  return vocab
}

/** Create Vocabulary */
export async function createVocabulary(createData: Partial<IVocabulary>) {
  await dbConnect()
  try {
    const vocab = new VocabularyModel(createData)
    const data = await vocab.save()
    const createdData = convertMongoObjectIdToString<IVocabulary>(data)
    return createdData
  } catch (error) {
    throw new Error(handleMongoError(error))
  }
}

/** Update Vocabulary by id */
export async function updateVocabulary(id: string, updateData: Partial<IVocabulary>) {
  await dbConnect()
  try {
    const data = await VocabularyModel.findByIdAndUpdate(id, updateData, { new: true })
    const updatedData = convertMongoObjectIdToString<IVocabulary>(data)
    return updatedData
  } catch (error) {
    throw new Error(handleMongoError(error))
  }
}

/** Delete Vocabulary by id */
export async function deleteVocabulary(id: string) {
  await dbConnect()
  await VocabularyModel.findByIdAndDelete(id)
  return { message: 'Vocabulary deleted successfully' }
}
