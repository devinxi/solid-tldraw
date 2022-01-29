import { createMemo, createSignal } from 'solid-js'
import { createMutable, createStore } from 'solid-js/store'

const s = Symbol('TL')
export function makeObservable(t: any) {
  console.log('makeObservable', t)
  t[s] = true
}
export function makeAutoObservable(t: any) {
  return createMutable(t)
}

export function action(obj: any, prop: string, desc?: any): any {
  console.log(obj, prop, desc)
  return desc
}

export function toJS(t: any) {
  return t
}
export function observe() {}

export function observable(obj: any, prop: string): any
export function observable(obj: any, prop: string, desc?: any): any {
  const [signal, setSignal] = createSignal(desc?.initializer?.())
  console.log(obj, prop, desc)
  return {
    enumerable: false,
    configurable: true,
    get: () => {
      return signal()
    },
    set: (newVal: any) => {
      setSignal(() => newVal)
    },
  }
}

export function store(obj: any, prop: string, desc?: any): any {
  const [signal, setSignal] = createStore(desc.initializer?.())
  console.log(obj, prop, desc)
  return {
    enumerable: false,
    configurable: true,
    get: () => {
      return signal
    },
    set: (newVal: any) => {
      setSignal(() => newVal)
    },
  }
}

export function computed(obj: any, prop: string, val: any): any {
  let memo: any
  return val
}
