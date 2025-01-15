'use server'
import dbConnect from '@/lib/dbConnect'
import CategoryModel, { ICategory } from '@/db/models/category.model'
import { convertMongoObjectIdToString, handleMongoError, trimString } from '@/db/utils'

/** Get all categories */
export async function getCategories() {
  await dbConnect()
  const data = await CategoryModel.find({})
  const categories = convertMongoObjectIdToString<ICategory[]>(data)
  return categories
}

/** Get all category options */
export async function getCategoryOptions() {
  await dbConnect()
  const categories = await CategoryModel.find({})
  // const categories = convertMongoObjectIdToString<ICategory[]>(data)
  return categories.map((category) => ({
    value: category._id.toString(),
    label: category.name,
  }))
}

/** Get category by id */
export async function getCategoryById(id: string) {
  await dbConnect()
  const data = await CategoryModel.findById(id)
  const category = convertMongoObjectIdToString<ICategory>(data)
  return category
}

/** Create Category */
export async function createCategory(createData: Partial<ICategory>) {
  await dbConnect()
  try {
    const category = new CategoryModel(trimString(createData))
    console.log(category, '=============')
    const data = await category.save()
    const createdData = convertMongoObjectIdToString<ICategory>(data)
    return createdData
  } catch (error) {
    console.log(error)

    throw new Error(handleMongoError(error))
  }
}

/** Update Category by id */
export async function updateCategory(id: string, updateData: Partial<ICategory>) {
  await dbConnect()
  try {
    const data = await CategoryModel.findByIdAndUpdate(id, trimString(updateData), { new: true })
    const updatedData = convertMongoObjectIdToString<ICategory>(data)
    return updatedData
  } catch (error) {
    throw new Error(handleMongoError(error))
  }
}

/** Delete Category by id */
export async function deleteCategory(id: string) {
  await dbConnect()
  await CategoryModel.findByIdAndDelete(id)
  return { message: 'Category deleted successfully' }
}
