'use client'

import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
        return
      }

      if (profile) {
        // Redirect based on user role
        if (profile.role === 'admin') {
          router.push('/admin/dashboard')
        } else if (profile.role === 'gestor') {
          router.push('/dashboard/gestor')
        } else if (profile.role === 'cliente') {
          router.push('/dashboard/cliente')
        } else {
          // Fallback for unknown roles
          router.push('/login')
        }
      }
    }
  }, [user, profile, loading, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-600"></div>
    </div>
  )
}