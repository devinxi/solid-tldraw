/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TLReactApp, TLSolidShape, TLReactShapeConstructor } from "~/options/solid/src/lib";
import { AppProvider } from "~/options/solid/src/components";
import type {
  AnyObject,
  TLDocumentModel,
  TLCallback,
  TLTheme,
  TLToolConstructor
} from "@tldraw/core";
import { JSX } from "solid-js";
import type { TLSolidComponents } from "~/options/solid/src/types/component-props";
import type { TLSolidEventMap } from "~/options/solid/src/types";
import { AppCanvas } from "./AppCanvas";

export interface TLCommonAppProps<
  S extends TLSolidShape = TLSolidShape,
  R extends TLReactApp<S> = TLReactApp<S>
> {
  id?: string;
  className?: string;
  meta?: AnyObject;
  theme?: Partial<TLTheme>;
  components?: TLSolidComponents<S>;
  children?: JSX.Element;
  onMount?: TLCallback<S, TLSolidEventMap, R, "mount">;
  onPersist?: TLCallback<S, TLSolidEventMap, R, "persist">;
  onSave?: TLCallback<S, TLSolidEventMap, R, "save">;
  onSaveAs?: TLCallback<S, TLSolidEventMap, R, "saveAs">;
  onLoad?: TLCallback<S, TLSolidEventMap, R, "load">;
  onUndo?: TLCallback<S, TLSolidEventMap, R, "undo">;
  onRedo?: TLCallback<S, TLSolidEventMap, R, "redo">;
  onError?: TLCallback<S, TLSolidEventMap, R, "error">;
}

export interface TLAppPropsWithoutApp<
  S extends TLSolidShape = TLSolidShape,
  R extends TLReactApp<S> = TLReactApp<S>
> extends TLCommonAppProps<S, R> {
  model?: TLDocumentModel;
  Shapes?: TLReactShapeConstructor<S>[];
  Tools?: TLToolConstructor<S, TLSolidEventMap, TLReactApp<S>>[];
  children?: JSX.Element;
}

export interface TLAppPropsWithApp<
  S extends TLSolidShape = TLSolidShape,
  R extends TLReactApp<S> = TLReactApp<S>
> extends TLCommonAppProps<S, R> {
  app: R;
  children?: JSX.Element;
}

export type AppProps<S extends TLSolidShape = TLSolidShape> =
  | TLAppPropsWithoutApp<S>
  | TLAppPropsWithApp<S>;

export function App<S extends TLSolidShape>(props: AppProps<S>): JSX.Element {
  return (
    <AppProvider {...props}>
      <AppCanvas {...props} />
    </AppProvider>
  );
}
