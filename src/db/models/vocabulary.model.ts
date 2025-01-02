import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IVocabulary {
  _id: string
  word: string
  pronunciation: string
  translation: string
  example: string
  exampleTranslation: string
  level: string
}

interface Vocabulary extends IVocabulary, Document {
  _id: string
}

const VocabularySchema = new Schema<Vocabulary>(
  {
    word: { type: String, unique: true, required: true },
    pronunciation: { type: String, required: true },
    translation: { type: String, required: true },
    example: { type: String, required: true },
    exampleTranslation: { type: String, required: true },
    level: { type: String, required: true },
  },
  {
    timestamps: true,
  },
)

const VocabularyModel: Model<Vocabulary> =
  mongoose.models.Vocabulary || mongoose.model<Vocabulary>('Vocabulary', VocabularySchema)

export default VocabularyModel
