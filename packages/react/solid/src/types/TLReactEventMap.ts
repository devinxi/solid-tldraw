import type { TLEventMap } from "@tldraw/core";
import type { Controller } from "@use-gesture/core";

export interface TLSolidEventMap extends TLEventMap {
  wheel: WheelEvent;
  pointer: PointerEvent;
  touch: TouchEvent;
  keyboard: KeyboardEvent;
  gesture: any;
}
