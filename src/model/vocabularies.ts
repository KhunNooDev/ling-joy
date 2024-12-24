import mongoose, { Document, Schema, Model } from 'mongoose'

interface Vocabularies {
  vocabulary: string
  pronunciation: string
  translation: string
  exampleSentence: string
  translationOfExampleSentence: string
}
interface IVocabularies extends Vocabularies, Document {}

const VocabulariesSchema: Schema = new Schema(
  {
    vocabulary: { type: String, required: true },
    pronunciation: { type: String, required: true },
    translation: { type: String, required: true },
    exampleSentence: { type: String, required: true },
    translationOfExampleSentence: { type: String, required: true },
  },
  {
    timestamps: true,
  },
)

const Vocabularies: Model<IVocabularies> =
  mongoose.models.Vocabularies || mongoose.model<IVocabularies>('Vocabularies', VocabulariesSchema)

export default Vocabularies
export type VocabularyType = Vocabularies & {
  _id: string
  createdAt: Date
  updatedAt: Date
  __v: number
}
