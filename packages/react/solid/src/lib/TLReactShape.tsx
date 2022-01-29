/* eslint-disable @typescript-eslint/no-explicit-any */
import { TLAsset, TLShape, TLShapeProps } from "@tldraw/core";
import { JSX } from "solid-js";

export interface TLCommonShapeProps<M = unknown> {
  meta: M;
  isEditing: boolean;
  isBinding: boolean;
  isHovered: boolean;
  isSelected: boolean;
  isErasing: boolean;
  asset?: TLAsset;
}

export type TLIndicatorProps<M = unknown> = TLCommonShapeProps<M>;

export interface TLComponentProps<M = unknown> extends TLCommonShapeProps<M> {
  events: {
    onPointerMove: React.PointerEventHandler;
    onPointerDown: React.PointerEventHandler;
    onPointerUp: React.PointerEventHandler;
    onPointerEnter: React.PointerEventHandler;
    onPointerLeave: React.PointerEventHandler;
    onKeyUp: React.KeyboardEventHandler;
    onKeyDown: React.KeyboardEventHandler;
  };
}

export interface TLReactShapeConstructor<S extends TLSolidShape = TLSolidShape> {
  new (props: S["props"] & { type: any }): S;
  id: string;
}

export abstract class TLSolidShape<P extends TLShapeProps = TLShapeProps, M = any> extends TLShape<
  P,
  M
> {
  abstract SolidComponent: (props: TLComponentProps<M>) => JSX.Element | null;
  abstract SolidIndicator: (props: TLIndicatorProps<M>) => JSX.Element | null;
}
