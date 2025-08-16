'use client'

import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'
import type { UserRole } from '@/lib/database.types'

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: UserRole[]
  requireAuth?: boolean
}

export function ProtectedRoute({ 
  children, 
  allowedRoles = ['admin', 'gestor', 'cliente'], 
  requireAuth = true 
}: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      // If authentication is required but user is not logged in
      if (requireAuth && !user) {
        router.push('/login')
        return
      }

      // If user is logged in but profile is not loaded yet
      if (user && !profile) {
        // Wait for profile to load
        return
      }

      // If user has profile but role is not allowed
      if (profile && !allowedRoles.includes(profile.role)) {
        // Redirect to appropriate dashboard based on their actual role
        if (profile.role === 'admin') {
          router.push('/admin/dashboard')
        } else if (profile.role === 'gestor') {
          router.push('/dashboard/gestor')
        } else if (profile.role === 'cliente') {
          router.push('/dashboard/cliente')
        } else {
          router.push('/login')
        }
        return
      }
    }
  }, [user, profile, loading, router, allowedRoles, requireAuth])

  // Show loading while checking authentication
  if (loading || (requireAuth && !user) || (user && !profile)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-600"></div>
      </div>
    )
  }

  // Show content if all checks pass
  return <>{children}</>
}

// Convenience component for role-specific protection
interface RoleGuardProps {
  children: ReactNode
  allowedRoles: UserRole[]
  fallback?: ReactNode
}

export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const { profile } = useAuth()

  if (!profile || !allowedRoles.includes(profile.role)) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h2>
          <p className="text-gray-600">Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}