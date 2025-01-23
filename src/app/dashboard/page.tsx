import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/auth/login')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Dashboard
      </h1>
      <div className="mt-6">
        <p className="text-gray-600">
          Welcome back, {user.email}
        </p>
        {/* Add your dashboard content here */}
      </div>
    </div>
  )
}
