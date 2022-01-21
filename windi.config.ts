import { defineConfig } from 'windicss/helpers'
import plugin from 'windicss/plugin'

export default defineConfig({
  safelist: [
    'text-gray-500 text-yellow-500 text-green-500',
    'bg-gray-300 bg-green-500 bg-blue-400',
  ],
  attributify: {
    prefix: 'w:',
  },
  alias: {
    'badge': 'rounded-full px-2 m-1',
    'full-border': 'first-child:border-l-2 children:border-2 '
      + 'children:border-l-0 children:border-dashed children:border-red-200',
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
