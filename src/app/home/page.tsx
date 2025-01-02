'use client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  return (
    <main>
      <Button onClick={() => router.push('/vocabulary')}>Go to Vocabulary</Button>
    </main>
  )
}
