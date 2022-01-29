import type { TLSolidShape } from "~/options/solid/src/lib";
import type { TLEventInfo, TLEvents } from "@tldraw/core";
import type { TLSolidEventMap } from "./TLReactEventMap";

export interface TLReactEventHandlers<
  S extends TLSolidShape = TLSolidShape,
  E extends TLEventInfo<S> = TLEventInfo<S>
> {
  onWheel: TLEvents<S, TLSolidEventMap, E>["wheel"];
  onPointerDown: TLEvents<S, TLSolidEventMap, E>["pointer"];
  onPointerUp: TLEvents<S, TLSolidEventMap, E>["pointer"];
  onPointerMove: TLEvents<S, TLSolidEventMap, E>["pointer"];
  onPointerEnter: TLEvents<S, TLSolidEventMap, E>["pointer"];
  onPointerLeave: TLEvents<S, TLSolidEventMap, E>["pointer"];
  onKeyDown: TLEvents<S, TLSolidEventMap, E>["keyboard"];
  onKeyUp: TLEvents<S, TLSolidEventMap, E>["keyboard"];
  onPinchStart: TLEvents<S, TLSolidEventMap, E>["pinch"];
  onPinch: TLEvents<S, TLSolidEventMap, E>["pinch"];
  onPinchEnd: TLEvents<S, TLSolidEventMap, E>["pinch"];
}
