import { defineStore } from 'pinia'
import { shallowRef } from 'vue'

export type Idiom = string
export type Idioms = Record<Idiom, string>

export const useIdiomsStore = defineStore('idioms', {
  state: () => ({
    allIdioms: shallowRef({} as Idioms),
    freqIdioms: shallowRef([] as string[]),
  }),
  getters: {
    isValidIdiom(state) {
      return (idiom: Idiom) => {
        return idiom in state.allIdioms
      }
    },
    randomIdiom(state) {
      return (): Idiom => {
        const randomIndex = Math.floor(Math.random() * state.freqIdioms.length)
        return state.freqIdioms[randomIndex]
      }
    },
  },
  actions: {
    setAllIdioms(idioms: Idioms) {
      this.allIdioms = idioms
    },
    setFreqIdioms(freqIdioms: string[]) {
      this.freqIdioms = freqIdioms
    },
  },
})
