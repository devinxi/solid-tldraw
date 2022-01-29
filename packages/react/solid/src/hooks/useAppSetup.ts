import { Accessor, createSignal } from "solid-js";
import { createStore, Store } from "solid-js/store";
import type { TLAppPropsWithApp, TLAppPropsWithoutApp } from "~/options/solid/src/components";
import { TLReactApp, TLSolidShape } from "~/options/solid/src/lib";

export function useAppSetup<S extends TLSolidShape, R extends TLReactApp<S> = TLReactApp<S>>(
  props: TLAppPropsWithoutApp<S, R> | TLAppPropsWithApp<S, R>
): () => R {
  if ("app" in props) return () => props.app;
  const [app] = createSignal<R>(new TLReactApp(props.model, props.Shapes, props.Tools) as R);
  return app;
}
