'use client'

export function UIOverlayLines() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="absolute top-0 left-10 w-px h-full bg-gradient-to-b from-transparent via-cyber-dim to-transparent opacity-20" />
      <div className="absolute top-0 right-10 w-px h-full bg-gradient-to-b from-transparent via-cyber-dim to-transparent opacity-20" />
      <div className="absolute top-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyber-dim to-transparent opacity-20" />
    </div>
  )
}

