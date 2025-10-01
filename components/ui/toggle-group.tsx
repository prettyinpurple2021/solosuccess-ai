"use client"

import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { type VariantProps} from "class-variance-authority"

import { cn} from "@/lib/utils"
import { toggleVariants} from "@/components/ui/toggle"

// Lazy context creation to prevent build errors
let ToggleGroupContext: React.Context<VariantProps<typeof toggleVariants>> | undefined

function getToggleGroupContext() {
  if (!ToggleGroupContext) {
    ToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants>>({
      size: "default",
      variant: "default",
    })
  }
  return ToggleGroupContext
}

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, children, ...props }, ref) => {
  const Context = getToggleGroupContext()
  return (
    <ToggleGroupPrimitive.Root
      ref={ref}
      className={cn("flex items-center justify-center gap-1", className)}
      {...props}
    >
      <Context.Provider value={{ variant, size }}>
        {children}
      </Context.Provider>
    </ToggleGroupPrimitive.Root>
  )
})

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleVariants>
>(({ className, children, variant, size, ...props }, ref) => {
  const Context = getToggleGroupContext()
  const context = React.useContext(Context)

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
})

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

export { ToggleGroup, ToggleGroupItem }
