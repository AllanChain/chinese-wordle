import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  safelist: [
    'text-gray-500 text-yellow-500 text-green-500',
    'bg-gray-300 bg-green-500 bg-blue-400',
  ],
  attributify: {
    prefix: 'w:',
  },
  alias: {
    badge: 'rounded-full px-2 m-1',
  },
})
