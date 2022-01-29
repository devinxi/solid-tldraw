/* eslint-disable @typescript-eslint/no-explicit-any */

import type { TLEventHandlers, TLInputs, TLViewport } from "@tldraw/core";
import {
  SelectionBackground as _SelectionBackground,
  SelectionForeground as _SelectionForeground,
  SelectionDetail as _SelectionDetail,
  Grid as _Grid,
  Brush as _Brush,
  Handle as _Handle,
  DirectionIndicator as _DirectionIndicator
} from "~/options/solid/src/components";
import { getRendererContext } from "~/options/solid/src/hooks";
import { EMPTY_OBJECT } from "~/options/solid/src/constants";
import type { TLSolidShape } from "~/options/solid/src/lib";
import type { TLSolidComponents, TLSolidEventMap } from "~/options/solid/src/types";
import { createRenderEffect, mergeProps } from "solid-js";
import { createSignal } from "solid-js";
import { onCleanup, JSX } from "solid-js";

export interface TLRendererContextProps<S extends TLSolidShape = TLSolidShape> {
  id?: string;
  viewport: TLViewport;
  inputs: TLInputs<TLSolidEventMap>;
  callbacks?: Partial<TLEventHandlers<S, TLSolidEventMap>>;
  components?: Partial<TLSolidComponents<S>>;
  meta?: any;
  children?: JSX.Element;
}

export interface TLRendererContext<S extends TLSolidShape = TLSolidShape> {
  id: string;
  viewport: TLViewport;
  inputs: TLInputs<TLSolidEventMap>;
  callbacks: Partial<TLEventHandlers<S, TLSolidEventMap>>;
  components: Partial<TLSolidComponents<S>>;
  meta: any;
}

export const RendererContext = function App<S extends TLSolidShape>(
  _props: TLRendererContextProps<S>
): JSX.Element {
  const props = mergeProps(
    {
      id: "noid",
      callbacks: EMPTY_OBJECT,
      meta: EMPTY_OBJECT,
      components: EMPTY_OBJECT
    },
    _props
  );
  const create = () => {
    const {
      Brush,
      ContextBar,
      DirectionIndicator,
      Grid,
      Handle,
      SelectionBackground,
      SelectionDetail,
      SelectionForeground
    } = props.components;

    return {
      id: props.id,
      viewport: props.viewport,
      inputs: props.inputs,
      callbacks: props.callbacks,
      meta: props.meta,
      components: {
        Brush: Brush === null ? undefined : _Brush,
        ContextBar,
        DirectionIndicator: DirectionIndicator === null ? undefined : _DirectionIndicator,
        Grid: Grid === null ? undefined : _Grid,
        Handle: Handle === null ? undefined : _Handle,
        SelectionBackground: SelectionBackground === null ? undefined : _SelectionBackground,
        SelectionDetail: SelectionDetail === null ? undefined : _SelectionDetail,
        SelectionForeground: SelectionForeground === null ? undefined : _SelectionForeground
      }
    };
  };

  const state = create();
  const [currentContext, setCurrentContext] = createSignal<TLRendererContext<S>>(state);

  createRenderEffect(() => {
    const {
      Brush,
      ContextBar,
      DirectionIndicator,
      Grid,
      Handle,
      SelectionBackground,
      SelectionDetail,
      SelectionForeground
    } = props.components;

    setCurrentContext({
      id: props.id,
      viewport: props.viewport,
      inputs: props.inputs,
      callbacks: props.callbacks,
      meta: props.meta,
      components: {
        Brush: Brush === null ? undefined : _Brush,
        ContextBar,
        DirectionIndicator: DirectionIndicator === null ? undefined : _DirectionIndicator,
        Grid: Grid === null ? undefined : _Grid,
        Handle: Handle === null ? undefined : _Handle,
        SelectionBackground: SelectionBackground === null ? undefined : _SelectionBackground,
        SelectionDetail: SelectionDetail === null ? undefined : _SelectionDetail,
        SelectionForeground: SelectionForeground === null ? undefined : _SelectionForeground
      }
    });
  });

  const context = getRendererContext<S>(props.id);

  return <context.Provider value={currentContext}>{props.children}</context.Provider>;
};
