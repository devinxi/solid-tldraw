/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'
import type { TLCustomProps } from '@tldraw/core'
import { SVGContainer, TLComponentProps, TLIndicatorProps } from '@tldraw/react'
import { TLBoxShape, TLBoxShapeProps } from '@tldraw/box-shape'
import { observer } from 'mobx-react-lite'
import { makeObservable, observable } from 'mobx'
import { NuStyleProps, withClampedStyles } from './NuStyleProps'

export interface NuBoxShapeProps extends TLBoxShapeProps, NuStyleProps {
  borderRadius: number
}

export class NuBoxShape extends TLBoxShape<NuBoxShapeProps> {
  constructor(props = {} as TLCustomProps<NuBoxShapeProps>) {
    super(props)
    this.init(props)
    makeObservable(this)
  }

  static id = 'box'

  @observable stroke = '#000000'
  @observable fill = '#ffffff'
  @observable strokeWidth = 2
  @observable borderRadius = 0
  @observable opacity = 1

  ReactComponent = observer(({ events, isErasing, isSelected }: TLComponentProps) => {
    const {
      size: [w, h],
      stroke,
      fill,
      strokeWidth,
      borderRadius,
      opacity,
    } = this

    return (
      <SVGContainer {...events} opacity={isErasing ? 0.2 : opacity}>
        <rect
          className={isSelected ? 'tl-hitarea-fill' : 'tl-hitarea-stroke'}
          x={strokeWidth / 2}
          y={strokeWidth / 2}
          rx={borderRadius}
          ry={borderRadius}
          radius={10}
          width={Math.max(0.01, w - strokeWidth)}
          height={Math.max(0.01, h - strokeWidth)}
          pointerEvents="all"
        />
        <rect
          x={strokeWidth / 2}
          y={strokeWidth / 2}
          rx={borderRadius}
          ry={borderRadius}
          width={Math.max(0.01, w - strokeWidth)}
          height={Math.max(0.01, h - strokeWidth)}
          strokeWidth={strokeWidth}
          stroke={stroke}
          fill={fill}
        />
      </SVGContainer>
    )
  })

  ReactIndicator = observer((props: TLIndicatorProps) => {
    const {
      size: [w, h],
      borderRadius,
    } = this
    return <rect width={w} height={h} rx={borderRadius} ry={borderRadius} fill="transparent" />
  })

  validateProps = (props: Partial<TLCustomProps<NuBoxShapeProps>>) => {
    if (props.size !== undefined) {
      props.size[0] = Math.max(props.size[0], 1)
      props.size[1] = Math.max(props.size[1], 1)
    }
    if (props.borderRadius !== undefined) props.borderRadius = Math.max(0, props.borderRadius)
    return withClampedStyles(props)
  }
}
