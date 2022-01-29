import type { TLAppPropsWithApp, TLAppPropsWithoutApp } from "~/options/solid/src/components";
import type { TLSolidShape, TLReactApp } from "~/options/solid/src/lib";

export function usePropControl<S extends TLSolidShape, R extends TLReactApp<S> = TLReactApp<S>>(
  app: R,
  props: TLAppPropsWithoutApp<S> | TLAppPropsWithApp<S>
) {
  createEffect(() => {
    if (!("model" in props)) return;
    if (props.model) app.loadDocumentModel(props.model);
  }, [(props as TLAppPropsWithoutApp<S>).model]);
}
