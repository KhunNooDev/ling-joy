'use client'

import { AppButtonToPath } from '@/components/AppButton'

export default function HomeAdministrationPage() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6'>
      <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-md'>
        <h1>Home Administration</h1>
        <div className='flex flex-col gap-2'>
          <AppButtonToPath href='/administration/vocabulary' text='Go to Admin Vocabulary' />
          <AppButtonToPath href='/administration/category' text='Go to Admin Category' />
        </div>
      </div>
    </main>
  )
}
