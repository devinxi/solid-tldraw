/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'
import { SvgPathUtils, TLDrawShape, TLDrawShapeProps } from '@tldraw/core'
import { SVGContainer, TLComponentProps } from '@tldraw/react'
import { observer } from 'mobx-react-lite'
import { computed, makeObservable } from 'mobx'
import { NuStyleProps, withClampedStyles } from './style-props'

export interface HighlighterShapeProps extends TLDrawShapeProps, NuStyleProps {
  type: 'highlighter'
}

export class HighlighterShape extends TLDrawShape<HighlighterShapeProps> {
  constructor(props = {} as Partial<HighlighterShapeProps>) {
    super(props)
    makeObservable(this)
  }

  static id = 'highlighter'

  static defaultProps: HighlighterShapeProps = {
    id: 'highlighter',
    parentId: 'page',
    type: 'highlighter',
    point: [0, 0],
    points: [],
    isComplete: false,
    stroke: '#000000',
    fill: '#ffffff',
    strokeWidth: 2,
    opacity: 1,
  }

  @computed get pointsPath() {
    const { points } = this.props
    return SvgPathUtils.getCurvedPathForPoints(points)
  }

  ReactComponent = observer(({ events, isErasing }: TLComponentProps) => {
    const {
      pointsPath,
      props: { stroke, strokeWidth, opacity },
    } = this

    return (
      <SVGContainer {...events} opacity={isErasing ? 0.2 : opacity}>
        <path
          d={pointsPath}
          strokeWidth={strokeWidth * 16}
          stroke={stroke}
          fill="none"
          pointerEvents="all"
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity={0.5}
        />
      </SVGContainer>
    )
  })

  ReactIndicator = observer(() => {
    const { pointsPath } = this
    return <path d={pointsPath} fill="none" />
  })

  validateProps = (props: Partial<HighlighterShapeProps>) => {
    props = withClampedStyles(props)
    if (props.strokeWidth !== undefined) props.strokeWidth = Math.max(props.strokeWidth, 1)
    return props
  }
}
