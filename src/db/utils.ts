import { MongoServerError } from 'mongodb'
import { z } from 'zod'
import mongoose, { Schema } from 'mongoose'

/** Convert MongoDB documents */
export function convertMongoObjectIdToString<T>(docs: any) {
  if (Array.isArray(docs)) {
    return docs.map((item) => ({
      ...item.toObject(),
      _id: item._id.toString(), // Convert the ObjectId to a string
    })) as T
  }

  // If it's a single document, convert it and return as a single object
  return {
    ...docs.toObject(),
    _id: docs._id.toString(), // Convert the ObjectId to a string
  } as T
}

/** Get required fields from the Mongoose schema */
export function getRequiredFields(model: any, data: any) {
  const requiredFields = Object.keys(model.schema.paths).filter((key) => model.schema.paths[key].isRequired)

  // Check for missing required fields dynamically
  return requiredFields.filter((field) => !data[field])
}

/** Trims whitespace from string */
export function trimString(data: any) {
  Object.keys(data).forEach((key) => {
    if (typeof data[key] === 'string') {
      data[key] = data[key].trim()
    }
  })
  return data
}

export function handleMongoError(error: unknown) {
  if (error instanceof MongoServerError) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0]
      return `${field} already exists`
    }
  }
  return 'An unexpected error occurred.'
}
