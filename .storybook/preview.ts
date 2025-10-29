import type { Preview } from '@storybook/react'
import '../app/globals.css'
import { ThemeProvider } from 'next-themes'
import React from 'react'

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="min-h-screen bg-background text-foreground">
          <Story />
        </div>
      </ThemeProvider>
    )
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    a11y: {
      element: '#root',
      manual: false
    }
  }
}

export default preview