import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { AppButtonLogin, AppButtonLogout, AppButtonToPath } from '@/components/AppButton'

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  return (
    <main className='flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6'>
      <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-md'>
        <h1 className='mb-4 text-center text-2xl font-bold'>
          {session?.user?.role === 'Admin'
            ? 'Welcome, Admin!'
            : session?.user?.role === 'User'
              ? 'Welcome, User!'
              : 'Not logged in'}
        </h1>
        <div className='mb-4 flex justify-center'>{session ? <AppButtonLogout /> : <AppButtonLogin />}</div>

        <div className='flex flex-col gap-2'>
          {session?.user?.role === 'Admin' && <AppButtonToPath href='/administration' text='Go to Administration' />}
          <AppButtonToPath href='/vocabulary' text='Go to Vocabulary' />
        </div>
      </div>
    </main>
  )
}
