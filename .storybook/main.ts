import type { StorybookConfig } from '@storybook/nextjs-vite'

const config: StorybookConfig = {
  stories: [
    '../components/**/*.mdx',
    '../components/**/*.stories.@(ts|tsx)'
  ],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-vitest'
  ],
  framework: {
    name: '@storybook/nextjs-vite',
    options: {}
  },
  docs: {
    autodocs: true
  },
  staticDirs: ['../public']
}

export default config