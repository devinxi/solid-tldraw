import * as React from 'react'
import type { TLAppPropsWithApp, TLAppPropsWithoutApp } from '~components'
import type { TLReactShape } from '~lib'
import { TLReactApp } from '~types'

export function useAppSetup<S extends TLReactShape, R extends TLReactApp<S> = TLReactApp<S>>(
  props: TLAppPropsWithoutApp<S, R> | TLAppPropsWithApp<S, R>
): R {
  if ('app' in props) return props.app
  const [app] = React.useState<R>(
    () =>
      new TLReactApp(props.id ?? 'app', props.document, props.state, props.Shapes, props.Tools) as R
  )
  return app
}
