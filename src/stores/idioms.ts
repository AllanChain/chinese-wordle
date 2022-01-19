import { defineStore } from 'pinia'
import { shallowRef } from 'vue'

export type Idiom = string
export type Idioms = Record<Idiom, string>

export const useIdiomsStore = defineStore('idioms', {
  state: () => ({ allIdioms: shallowRef({} as Idioms) }),
  getters: {
    isValidIdiom(state) {
      return (idiom: Idiom) => {
        return idiom in state.allIdioms
      }
    },
    randomIdiom(state) {
      return (): Idiom => {
        const allIdiomsString = Object.keys(state.allIdioms)
        const randomIndex = Math.floor(Math.random() * allIdiomsString.length)
        return allIdiomsString[randomIndex]
      }
    },
  },
  actions: {
    setAllIdioms(idioms: Idioms) {
      this.allIdioms = idioms
    },
  },
})
