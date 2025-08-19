'use client'

import * as React from "react"
import { createContext, useContext, useState } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

// Context para gerenciar estado do sheet
const SheetContext = createContext<{
  open: boolean
  setOpen: (open: boolean) => void
}>({
  open: false,
  setOpen: () => {},
})

// Hook para usar o contexto
const useSheet = () => {
  const context = useContext(SheetContext)
  if (!context) {
    throw new Error("useSheet must be used within a Sheet")
  }
  return context
}

// Sheet Root
interface SheetProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const Sheet = ({ children, open: controlledOpen, onOpenChange }: SheetProps) => {
  const [internalOpen, setInternalOpen] = useState(false)
  
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen

  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  )
}

// Sheet Trigger
interface SheetTriggerProps {
  children: React.ReactNode
  asChild?: boolean
}

const SheetTrigger = ({ children, asChild }: SheetTriggerProps) => {
  const { setOpen } = useSheet()
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: () => setOpen(true),
    })
  }

  return (
    <button onClick={() => setOpen(true)}>
      {children}
    </button>
  )
}

// Sheet Content
interface SheetContentProps {
  children: React.ReactNode
  className?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
}

const SheetContent = ({ children, className, side = 'right' }: SheetContentProps) => {
  const { open, setOpen } = useSheet()

  if (!open) return null

  const sideClasses = {
    top: 'inset-x-0 top-0 border-b translate-y-[-100%] slide-in-from-top',
    right: 'inset-y-0 right-0 h-full w-3/4 border-l translate-x-full slide-in-from-right sm:max-w-sm',
    bottom: 'inset-x-0 bottom-0 border-t translate-y-full slide-in-from-bottom',
    left: 'inset-y-0 left-0 h-full w-3/4 border-r translate-x-[-100%] slide-in-from-left sm:max-w-sm',
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      
      {/* Sheet */}
      <div className={cn(
        "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out duration-300",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:duration-300 data-[state=open]:duration-500",
        sideClasses[side],
        open ? "animate-in" : "animate-out",
        className
      )}>
        <div className="relative h-full">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-6 w-6 z-10"
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Fechar</span>
          </Button>
          
          <div className="pr-8 h-full overflow-auto">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}

// Sheet Header
const SheetHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left pb-4", className)}>
    {children}
  </div>
)

// Sheet Title
const SheetTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)}>
    {children}
  </h2>
)

// Sheet Description
const SheetDescription = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <p className={cn("text-sm text-muted-foreground", className)}>
    {children}
  </p>
)

// Sheet Footer
const SheetFooter = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4 border-t", className)}>
    {children}
  </div>
)

export {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
}