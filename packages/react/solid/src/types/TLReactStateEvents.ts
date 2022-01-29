import type { TLSolidShape } from "~/options/solid/src/lib";
import type { TLReactEventHandlers } from "./TLReactEventHandlers";
import type { TLReactEvents } from "./TLReactEvents";

export interface TLReactStateEvents<S extends TLSolidShape = TLSolidShape>
  extends TLReactEventHandlers<S> {
  onEnter: <T>(info: { fromId: string } & T) => void;
  onExit: <T>(info: { toId: string } & T) => void;
  onTransition: <T>(info: { toId: string; fromId: string } & T) => void;
  onModifierKey: TLReactEvents<S>["keyboard"];
}
