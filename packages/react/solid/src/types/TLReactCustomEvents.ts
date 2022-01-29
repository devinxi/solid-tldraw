import type { TLSolidEventMap } from "./TLReactEventMap";

export interface TLSolidCustomEvents {
  wheel: (event: TLSolidEventMap["wheel"] & { order?: number }) => void;
  pinch: (event: TLSolidEventMap["gesture"] & { order?: number }) => void;
  pointer: (event: TLSolidEventMap["pointer"] & { order?: number }) => void;
  keyboard: (event: TLSolidEventMap["keyboard"] & { order?: number }) => void;
}
