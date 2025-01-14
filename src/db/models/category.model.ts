import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ICategory {
  _id: string
  name: string
  description?: string
}

interface Category extends ICategory, Document {
  _id: string
}

const CategorySchema = new Schema<Category>(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
  },
  {
    timestamps: true,
  },
)

const CategoryModel: Model<Category> = mongoose.models.Category || mongoose.model<Category>('Category', CategorySchema)

export default CategoryModel
