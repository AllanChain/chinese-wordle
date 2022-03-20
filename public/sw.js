import { CacheFirst } from 'workbox-strategies'
import { registerRoute } from 'workbox-routing'

console.log(self.__WB_MANIFEST)

registerRoute(/\/assets\/.*\.json/, new CacheFirst({
  cacheName: 'cnwordle-json-assets',
}))
