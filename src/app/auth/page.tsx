'use client'
import { z } from 'zod'
import { AppButton } from '@/components/AppButton'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AppForm, { AppInputPass, AppInputText } from '@/components/AppForm'

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
})

export default function LoginPage() {
  const router = useRouter()

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    const result = await signIn('credentials', {
      username: data.username,
      password: data.password,
      callbackUrl: '/',
      redirect: true,
    })
    if (result?.error) {
      console.error(result.error)
    }
  }

  return (
    <main className='flex min-h-screen flex-col items-center justify-center gap-4'>
      <AppForm schema={loginSchema} onSubmit={onSubmit}>
        <AppInputText field='username' label='Username' />
        <AppInputPass field='password' label='Password' />
        <div className='flex justify-between gap-2 px-4'>
          <AppButton type='submit'>Login</AppButton>
          <AppButton onClick={() => router.push('/')}>Anonymous</AppButton>
        </div>
      </AppForm>
    </main>
  )
}
