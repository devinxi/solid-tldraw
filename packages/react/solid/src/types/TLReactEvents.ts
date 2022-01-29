import type { TLEvents } from "@tldraw/core";
import type { TLSolidShape } from "~/options/solid/src/lib";
import type { TLSolidEventMap } from "./TLReactEventMap";

export type TLReactEvents<S extends TLSolidShape> = TLEvents<S, TLSolidEventMap>;
