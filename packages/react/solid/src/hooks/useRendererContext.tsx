/* eslint-disable @typescript-eslint/no-explicit-any */

import { Context, useContext } from "solid-js";
import { createContext } from "solid-js";
import type { TLRendererContext } from "~/options/solid/src/components";
import type { TLSolidShape } from "~/options/solid/src/lib";

export const contextMap: Record<string, Context<() => TLRendererContext<any>>> = {};

export function getRendererContext<S extends TLSolidShape = TLSolidShape>(
  id = "noid"
): Context<() => TLRendererContext<S>> {
  if (!contextMap[id]) {
    contextMap[id] = createContext(() => ({} as TLRendererContext<S>));
  }
  return contextMap[id];
}

export function useRendererContext<S extends TLSolidShape = TLSolidShape>(
  id = "noid"
): () => TLRendererContext<S> {
  return useContext(getRendererContext<S>(id));
}
