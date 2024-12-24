import { NextRequest, NextResponse } from 'next/server'
import VocabularyModel from '@/model/vocabularies'
import dbConnect from '@/lib/dbConnect'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id

    await dbConnect()
    const vocabulary = await VocabularyModel.findById(id)
    return NextResponse.json({ success: true, data: vocabulary }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id
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
    await VocabularyModel.findByIdAndUpdate(id, data)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id

    await dbConnect()
    await VocabularyModel.findByIdAndDelete(id)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 })
  }
}
