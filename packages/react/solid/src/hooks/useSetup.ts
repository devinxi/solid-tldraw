import { onCleanup } from "solid-js";
import { createRenderEffect } from "solid-js";
import type { TLAppPropsWithoutApp, TLAppPropsWithApp } from "~/options/solid/src/components";
import type { TLSolidShape, TLReactApp } from "~/options/solid/src/lib";

declare const window: Window & { tln: TLReactApp<any> };

export function useSetup<
  S extends TLSolidShape = TLSolidShape,
  R extends TLReactApp<S> = TLReactApp<S>
>(app: () => R, props: TLAppPropsWithApp<S, R> | TLAppPropsWithoutApp<S, R>) {
  const { onPersist, onSave, onSaveAs, onError, onMount } = props;

  createRenderEffect(() => {
    const unsubs: (() => void)[] = [];
    if (!app) return;
    app().history.reset();
    if (typeof window !== undefined) window["tln"] = app();
    if (onMount) onMount(app(), null);
    onCleanup(() => {
      unsubs.forEach(unsub => unsub());
      app().dispose();
    });
  });

  createRenderEffect(() => {
    const unsubs: (() => void)[] = [];
    if (onPersist) unsubs.push(app().subscribe("persist", onPersist));
    if (onSave) unsubs.push(app().subscribe("save", onSave));
    if (onSaveAs) unsubs.push(app().subscribe("saveAs", onSaveAs));
    if (onError) unsubs.push(app().subscribe("error", onError));
    onCleanup(() => unsubs.forEach(unsub => unsub()));
  });
}
