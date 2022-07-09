import { defineConfig } from 'windicss/helpers'
import plugin from 'windicss/plugin'

export default defineConfig({
  darkMode: 'media',
  safelist: [
    'text-gray-500 text-yellow-500 text-green-500 dark:text-gray-400',
    'bg-gray-300 bg-green-500 bg-blue-400 dark:bg-gray-700 dark:bg-green-600 dark:bg-blue-600',
  ],
  attributify: {
    prefix: 'w:',
  },
  alias: {
    'badge': 'rounded-full px-2 m-1',
    'full-border': 'first-child:border-l-2 children:border-2 '
      + 'children:border-l-0 children:border-dashed '
      + 'children:border-red-200 dark:children:border-stone-700',
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant('first-child', ({ modifySelectors }) => {
        return modifySelectors(({ className }) => {
          // const element = e(`not-first${separator}${className}`)
          return `.${className} > :first-child`
        })
      })
    }),
  ],
})
