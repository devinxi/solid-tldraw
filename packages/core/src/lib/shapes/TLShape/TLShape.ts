/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  intersectLineSegmentBounds,
  intersectLineSegmentPolyline,
  intersectPolygonBounds,
} from '@tldraw/intersect'
import Vec from '@tldraw/vec'
import { action, computed, makeObservable, observable } from 'mobx'
import type { TLHandle, TLBounds, TLResizeEdge, TLResizeCorner } from '~types'
import { deepCopy, BoundsUtils, PointUtils } from '~utils'

export type TLShapeModel<P extends TLShapeProps = TLShapeProps> = {
  nonce?: number
} & Partial<P> & { id: string; type: P['type'] }

export interface TLShapeConstructor<S extends TLShape = TLShape> {
  new (props: any): S
  id: string
}

export interface TLShapeProps {
  id: string
  type: any
  parentId: string
  point: number[]
  name?: string
  rotation?: number
  handles?: TLHandle[]
  label?: string
  labelPosition?: number[]
  assetId?: string
  children?: string[]
  isGhost?: boolean
  isHidden?: boolean
  isLocked?: boolean
  isGenerated?: boolean
  isAspectRatioLocked?: boolean
}

export interface TLResizeInfo {
  type: TLResizeEdge | TLResizeCorner
  scale: number[]
  transformOrigin: number[]
}

export interface TLHandleChangeInfo {
  index: number
  delta: number[]
}

export abstract class TLShape<P extends TLShapeProps = TLShapeProps, M = any> {
  constructor(props: Partial<P>) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const type = this.constructor['id']
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const defaultProps = this.constructor['defaultProps']
    this.type = type
    this.props = { ...defaultProps, ...props }
    debugger
    makeObservable(this)
  }

  static type: string

  private version = 1

  @observable props: P

  readonly stayMounted: boolean = false
  readonly showCloneHandles: boolean = false
  readonly hideResizeHandles: boolean = false
  readonly hideRotateHandle: boolean = false
  readonly hideContextBar: boolean = false
  readonly hideSelectionDetail: boolean = false
  readonly hideSelection: boolean = false
  readonly isEditable: boolean = false
  readonly isStateful: boolean = false
  readonly isAspectRatioLocked: boolean = false
  readonly aspectRatio?: number
  readonly type: string

  nonce = 0

  isDirty = false

  private lastSerialized = {} as TLShapeModel<P>

  abstract getBounds: () => TLBounds

  @computed get id() {
    console.log(this, this.props)
    return this.props.id
  }

  getCenter = () => {
    return BoundsUtils.getBoundsCenter(this.bounds)
  }

  getRotatedBounds = () => {
    const {
      bounds,
      props: { rotation },
    } = this
    if (!rotation) return bounds
    return BoundsUtils.getBoundsFromPoints(BoundsUtils.getRotatedCorners(bounds, rotation))
  }

  hitTestPoint = (point: number[]): boolean => {
    const ownBounds = this.rotatedBounds
    if (!this.props.rotation) {
      return PointUtils.pointInBounds(point, ownBounds)
    }
    const corners = BoundsUtils.getRotatedCorners(ownBounds, this.props.rotation)
    return PointUtils.pointInPolygon(point, corners)
  }

  hitTestLineSegment = (A: number[], B: number[]): boolean => {
    const box = BoundsUtils.getBoundsFromPoints([A, B])
    const {
      rotatedBounds,
      props: { rotation = 0 },
    } = this
    return BoundsUtils.boundsContain(rotatedBounds, box) || rotation
      ? intersectLineSegmentPolyline(A, B, BoundsUtils.getRotatedCorners(this.bounds)).didIntersect
      : intersectLineSegmentBounds(A, B, rotatedBounds).length > 0
  }

  hitTestBounds = (bounds: TLBounds): boolean => {
    const {
      rotatedBounds,
      props: { rotation = 0 },
    } = this
    const corners = BoundsUtils.getRotatedCorners(this.bounds, rotation)
    return (
      BoundsUtils.boundsContain(bounds, rotatedBounds) ||
      intersectPolygonBounds(corners, bounds).length > 0
    )
  }

  @computed get center(): number[] {
    return this.getCenter()
  }

  @computed get bounds(): TLBounds {
    return this.getBounds()
  }

  @computed get rotatedBounds(): TLBounds {
    return this.getRotatedBounds()
  }

  getSerialized = (): TLShapeModel<P> => {
    return deepCopy({ ...this.props, type: this.type, nonce: this.nonce } as TLShapeModel<P>)
  }

  protected getCachedSerialized = (): TLShapeModel<P> => {
    if (this.isDirty) {
      this.nonce++
      this.isDirty = false
      this.lastSerialized = this.getSerialized()
    }
    return this.lastSerialized
  }

  get serialized(): TLShapeModel<P> {
    return this.getCachedSerialized()
  }

  validateProps = (
    props: Partial<TLShapeProps> & Partial<P>
  ): Partial<TLShapeProps> & Partial<P> => {
    return props
  }

  @action update = (props: Partial<TLShapeProps & P & any>, isDeserializing = false) => {
    if (!(isDeserializing || this.isDirty)) this.isDirty = true
    Object.assign(this.props, this.validateProps(props as Partial<TLShapeProps> & Partial<P>))
    return this
  }

  clone = (): typeof this => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return new this.constructor(this.serialized)
  }

  onResize = (bounds: TLBounds, initialProps: any, info: TLResizeInfo) => {
    this.update({ point: [bounds.minX, bounds.minY] })
    return this
  }

  onResizeStart?: () => void

  onHandleChange = (initialShape: any, { index, delta }: TLHandleChangeInfo) => {
    if (initialShape.handles === undefined) return
    const nextHandles = [...initialShape.handles]
    nextHandles[index] = {
      ...nextHandles[index],
      point: Vec.add(delta, initialShape.handles[index].point),
    }
    const topLeft = BoundsUtils.getCommonTopLeft(nextHandles.map(h => h.point))
    this.update({
      point: Vec.add(initialShape.point, topLeft),
      handles: nextHandles.map(h => ({ ...h, point: Vec.sub(h.point, topLeft) })),
    })
  }
}

// interface TLShapeWithHandlesProps<H extends TLHandle> extends TLShapeProps {
//   handles: H[]
// }

// export abstract class TLShapeWithHandles<
//   H extends TLHandle = TLHandle,
//   P extends TLShapeWithHandlesProps<H> = TLShapeWithHandlesProps<H>,
//   M = any
// > extends TLShape<P, M> {
//   protected propsKeys = new Set<string>(defaultPropKeys)

//   @observable handles: TLHandle[] = []

//   onHandleChange = ({ index, initialShape, delta }: TLHandleChangeInfo<H, P>) => {
//     const nextHandles = [...initialShape.handles]
//     nextHandles[index] = {
//       ...nextHandles[index],
//       point: Vec.add(delta, initialShape.handles[index].point),
//     }
//     const topLeft = BoundsUtils.getCommonTopLeft(nextHandles.map(h => h.point))
//     this.update({
//       point: Vec.add(initialShape.point, topLeft),
//       handles: nextHandles.map(h => ({ ...h, point: Vec.sub(h.point, topLeft) })),
//     })
//   }

//   onResize = (bounds: TLBounds, info: TLResizeInfo<this>) => {
//     this.update({ point: [bounds.minX, bounds.minY] })
//     return this
//   }
// }

// interface TLShapeWithChildrenProps extends TLShapeProps {
//   children: string[]
// }

// export abstract class TLShapeWithChildren<
//   P extends TLShapeWithChildrenProps = TLShapeWithChildrenProps,
//   M = any
// > extends TLShape<P, M> {
//   protected propsKeys = new Set<string>([
//     'type',
//     'nonce',
//     'parentId',
//     'point',
//     'name',
//     'rotation',
//     'children',
//     'isGhost',
//     'isHidden',
//     'isLocked',
//     'isGenerated',
//     'isAspectRatioLocked',
//   ])

//   @observable children: TLShape[] = []
// }
