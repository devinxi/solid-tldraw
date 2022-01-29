import { TLApp } from "@tldraw/core";
import type { TLSolidShape } from "./TLReactShape";
import type { TLSolidEventMap } from "~/options/solid/src/types";

export class TLReactApp<S extends TLSolidShape = TLSolidShape> extends TLApp<S, TLSolidEventMap> {}
