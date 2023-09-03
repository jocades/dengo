import { dataTypes } from './data-types.ts'

export type DengoDataType = keyof typeof dataTypes

export type DengoTransformer = typeof dataTypes[DengoDataType]
