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

/** Trims whitespace from string */
export function trimWhitespaceFromStrings(data: any) {
  Object.keys(data).forEach((key) => {
    if (typeof data[key] === 'string') {
      data[key] = data[key].trim()
    }
  })
}
