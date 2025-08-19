'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  BarChart3, 
  Settings, 
  ChevronLeft,
  Menu,
  Plane
} from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard/gestor',
    icon: LayoutDashboard,
  },
  {
    name: 'Clientes',
    href: '/clients',
    icon: Users,
  },
  {
    name: 'Contas de Milhas',
    href: '/accounts',
    icon: CreditCard,
    badge: 'Em breve',
  },
  {
    name: 'Relatórios',
    href: '/reports',
    icon: BarChart3,
    badge: 'Em breve',
  },
  {
    name: 'Configurações',
    href: '/settings',
    icon: Settings,
  },
]

interface SidebarProps {
  className?: string
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
}

export function Sidebar({ className, collapsed = false, onCollapsedChange }: SidebarProps) {
  const pathname = usePathname()

  const handleToggleCollapse = () => {
    onCollapsedChange?.(!collapsed)
  }

  return (
    <div className={cn(
      "flex flex-col h-full bg-card border-r border-border",
      collapsed ? "w-16" : "w-64",
      "transition-all duration-300 ease-in-out",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Plane className="text-primary-foreground h-4 w-4" />
            </div>
            <span className="font-semibold text-lg text-foreground">FlyMilhas</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleCollapse}
          className="h-8 w-8"
        >
          {collapsed ? (
            <Menu className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  collapsed ? "px-2" : "px-3",
                  isActive && "bg-secondary text-secondary-foreground"
                )}
                title={collapsed ? item.name : undefined}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && (
                  <>
                    <span className="truncate">{item.name}</span>
                    {item.badge && (
                      <span className="ml-auto text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        {!collapsed ? (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Sistema Online</span>
          </div>
        ) : (
          <div className="flex justify-center" title="Sistema Online">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  )
}