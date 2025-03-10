import type { TLSubscriptionEventInfo, TLSubscriptionEventName } from '@tldraw/core'
import type { TLReactShape } from '~lib'
import type { TLReactApp } from '../lib/TLReactApp'

export type TLReactSubscription<
  S extends TLReactShape = TLReactShape,
  R extends TLReactApp<S> = TLReactApp<S>,
  E extends TLSubscriptionEventName = TLSubscriptionEventName
> = {
  event: E
  callback: TLReactCallback<S, R, E>
}

export type TLReactSubscribe<
  S extends TLReactShape = TLReactShape,
  R extends TLReactApp<S> = TLReactApp<S>
> = {
  <E extends TLSubscriptionEventName>(subscription: TLReactSubscription<S, R, E>): () => void
  <E extends TLSubscriptionEventName>(event: E, callback: TLReactCallback<S, R, E>): () => void
}

export type TLReactCallback<
  S extends TLReactShape = TLReactShape,
  R extends TLReactApp<S> = TLReactApp<S>,
  E extends TLSubscriptionEventName = TLSubscriptionEventName
> = (app: R, info: TLSubscriptionEventInfo<E>) => void

export interface TLReactCallbacks<
  S extends TLReactShape = TLReactShape,
  R extends TLReactApp<S> = TLReactApp<S>
> {
  onMount: TLReactCallback<S, R, 'mount'>
  onPersist: TLReactCallback<S, R, 'persist'>
  onSave: TLReactCallback<S, R, 'save'>
  onSaveAs: TLReactCallback<S, R, 'saveAs'>
  onError: TLReactCallback<S, R, 'error'>
}
