import { NextRequest, NextResponse } from 'next/server'
import { createVocabulary, getVocabularies, updateVocabulary, deleteVocabulary } from '@/db/actions/vocabulary.action'

// Handle GET request (Fetch all data)
export async function GET() {
  try {
    const vocab = await getVocabularies()
    if (!vocab) {
      return NextResponse.json(
        {
          success: true,
          message: 'Not found',
        },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true, data: vocab })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 })
  }
}

// Handle POST request (Create)
export async function POST(req: NextRequest) {
  const data = await req.json()
  const result = await createVocabulary(data)
  return NextResponse.json(result)
}

// Handle PUT request (Update)
export async function PUT(req: NextRequest) {
  const body = await req.json()
  const { id, ...updateData } = body
  if (!id) return NextResponse.json({ message: 'ID not provided' }, { status: 400 })

  const updated = await updateVocabulary(id, updateData)
  return NextResponse.json(updated)
}

// Handle DELETE request (Delete)
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ message: 'ID not provided' }, { status: 400 })

  const result = await deleteVocabulary(id)
  return NextResponse.json(result)
}
