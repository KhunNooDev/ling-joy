import { NextRequest, NextResponse } from 'next/server'
import {
  createVocabulary,
  getVocabulary,
  updateVocabulary,
  deleteVocabulary,
} from '../../../db/actions/vocabulary.action'

// Handle POST request (Create)
export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const result = await createVocabulary(formData)
  return NextResponse.json(result)
}

// Handle GET request (Fetch by word)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const word = searchParams.get('word')
  if (!word) return NextResponse.json({ message: 'Word not provided' }, { status: 400 })

  const vocab = await getVocabulary()
  if (!vocab) return NextResponse.json({ message: 'Not found' }, { status: 404 })

  return NextResponse.json(vocab)
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
