import type { TLApp, TLTool } from "@tldraw/core";
import type { TLSolidShape } from "~/options/solid/src/lib";
import type { TLSolidEventMap } from "./TLReactEventMap";

export interface TLReactToolConstructor<
  S extends TLSolidShape = TLSolidShape,
  K extends TLSolidEventMap = TLSolidEventMap,
  R extends TLApp<S, K> = TLApp<S, K>
> {
  new (parent: R, app: R): TLTool<S, K, R>;
  id: string;
}
