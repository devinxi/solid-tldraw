import { Context, createContext, useContext } from "solid-js";
import { Store } from "solid-js/store";
import type { TLSolidShape, TLReactApp } from "~/options/solid/src/lib";

const contextMap: Record<string, Context<any>> = {};

export function getAppContext<
  S extends TLSolidShape = TLSolidShape,
  R extends TLReactApp<S> = TLReactApp<S>
>(id = "noid"): Context<() => R> {
  if (!contextMap[id]) {
    contextMap[id] = createContext({} as R);
  }
  return contextMap[id];
}

export function useApp<
  S extends TLSolidShape = TLSolidShape,
  R extends TLReactApp<S> = TLReactApp<S>
>(id = "noid"): () => R {
  return useContext(getAppContext<S, R>(id));
}
