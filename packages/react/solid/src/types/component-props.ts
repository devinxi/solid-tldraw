/* -------------------- App Props ------------------- */

import type { TLBounds, TLHandle, TLOffset } from "@tldraw/core";
import type { TLSolidShape } from "~/options/solid/src/lib";
import { JSX } from "solid-js";
/* ------------------- Components ------------------- */

export type TLSelectionComponentProps<S extends TLSolidShape = TLSolidShape> = {
  zoom: number;
  shapes: S[];
  bounds: TLBounds;
  showResizeHandles?: boolean;
  showRotateHandles?: boolean;
};

export type TLBoundsComponent<S extends TLSolidShape = TLSolidShape> = (
  props: TLSelectionComponentProps<S>
) => JSX.Element | null;

export type TLContextBarProps<S extends TLSolidShape = TLSolidShape> = {
  shapes: S[];
  bounds: TLBounds;
  scaledBounds: TLBounds;
  rotation: number;
  offset: TLOffset;
};

export type TLContextBarComponent<S extends TLSolidShape = TLSolidShape> = (
  props: TLContextBarProps<S>
) => JSX.Element | null;

export type TLSelectionDetailProps<S extends TLSolidShape = TLSolidShape> = {
  shapes: S[];
  bounds: TLBounds;
  scaledBounds: TLBounds;
  zoom: number;
  rotation?: number;
  detail?: "size" | "rotation";
};

export type TLSelectionDetailComponent<S extends TLSolidShape = TLSolidShape> = (
  props: TLSelectionDetailProps<S>
) => JSX.Element | null;

export type TLDirectionIndicatorProps<S extends TLSolidShape = TLSolidShape> = {
  shapes: S[];
  bounds: TLBounds;
  direction: number[];
};

export type TLDirectionIndicatorComponent<S extends TLSolidShape = TLSolidShape> = (
  props: TLDirectionIndicatorProps<S>
) => JSX.Element;

export interface TLBrushProps {
  bounds: TLBounds;
}

export type TLBrushComponent = (props: TLBrushProps) => JSX.Element | null;

export interface TLHandleComponentProps<
  S extends TLSolidShape = TLSolidShape,
  H extends TLHandle = TLHandle
> {
  shape: S;
  handle: H;
  index: number;
}

export type TLHandleComponent<
  S extends TLSolidShape = TLSolidShape,
  H extends TLHandle = TLHandle
> = (props: TLHandleComponentProps<S, H>) => JSX.Element | null;

export interface TLGridProps {
  size: number;
}

export type TLGridComponent = (props: TLGridProps) => JSX.Element | null;

export type TLSolidComponents<S extends TLSolidShape = TLSolidShape> = {
  SelectionBackground?: TLBoundsComponent<S> | null;
  SelectionForeground?: TLBoundsComponent<S> | null;
  SelectionDetail?: TLSelectionDetailComponent<S> | null;
  DirectionIndicator?: TLDirectionIndicatorComponent<S> | null;
  Handle?: TLHandleComponent<S> | null;
  ContextBar?: TLContextBarComponent<S> | null;
  Brush?: TLBrushComponent | null;
  Grid?: TLGridComponent | null;
};
