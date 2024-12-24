import { NextRequest, NextResponse } from 'next/server'
import VocabularyModel from '@/model/vocabularies'
import dbConnect from '@/lib/dbConnect'

export async function GET() {
  try {
    await dbConnect()

    const vocabularies = await VocabularyModel.find({})
    return NextResponse.json({ success: true, data: vocabularies }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    // Get required fields from the Mongoose schema
    const requiredFields = Object.keys(VocabularyModel.schema.paths).filter(
      (key) => VocabularyModel.schema.paths[key].isRequired,
    )

    // Check for missing required fields dynamically
    const missingFields = requiredFields.filter((field) => !data[field])

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: `Missing required fields: ${missingFields.join(', ')}`,
        },
        { status: 400 },
      )
    }
    // Trim string fields
    Object.keys(data).forEach((key) => {
      if (typeof data[key] === 'string') {
        data[key] = data[key].trim()
      }
    })
    await dbConnect()

    const vocabulary = new VocabularyModel(data)
    await vocabulary.save()
    return NextResponse.json(
      {
        success: true,
        data: vocabulary,
        message: 'Created success',
      },
      { status: 200 },
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 })
  }
}
