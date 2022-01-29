/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TLSolidShape } from "~/options/solid/src/lib";
import { useSetup, getAppContext, usePropControl, useAppSetup } from "~/options/solid/src/hooks";
import type { TLAppPropsWithApp, TLAppPropsWithoutApp } from "./App";
import { JSX } from "solid-js";
export const AppProvider = function App<S extends TLSolidShape>(
  props: TLAppPropsWithoutApp<S> | TLAppPropsWithApp<S>
): JSX.Element {
  const app = useAppSetup(props);
  const context = getAppContext<S>(props.id);
  // usePropControl(app, props);
  useSetup(app, props);
  return <context.Provider value={app}>{props.children}</context.Provider>;
};
