/**
 * @description This file defines valid data types and associated methods
 */

import { Bson } from 'mongo'

/**
 * Class definition of Number Schema datatype
 * @param value Raw value input from the user.
 * @returns An object of class SchemaNumber.
 */
class SchemaNumber {
  public value: unknown
  public valid: boolean | undefined
  public convertedValue: number | Bson.Double | null | undefined

  constructor(value: unknown) {
    if (value === undefined) {
      throw new Error('A value is required.')
    }
    this.value = value
    this.convertedValue
    this.valid
  }

  /**
   * Attempts to convert raw value to the given data type.
   * Sets convertedValue property to the casted input if possible, or undefined if not.
   */
  convertType() {
    if (this.value === null) {
      this.convertedValue = this.value
    } else if (typeof this.value === 'object') {
      if (this.value instanceof Bson.Double) {
        this.convertedValue = this.value
      }
    } else if (
      typeof this.value !== 'number' &&
      typeof this.value !== 'string'
    ) {
      return
    } else if (typeof this.value === 'string') {
      const stringNum: number = parseFloat(this.value)
      if (isNaN(stringNum)) {
        return
      }
      const bsonNumber = new Bson.Double(stringNum)
      this.convertedValue = bsonNumber
    } else if (typeof this.value === 'number') {
      const bsonNumber = new Bson.Double(this.value)
      this.convertedValue = bsonNumber
    }

    return this.convertedValue
  }

  /**
   * Checks whether the value was casted to the correct data type.
   * Sets valid property to true or false.
   */
  validateType() {
    this.valid = this.convertedValue === undefined ? false : true
    return this.valid
  }
}

/**
 * Class definition of Decimal128 Schema datatype
 * @param value Raw value input from the user.
 * @returns An object of class SchemaDecimal128.
 */
class SchemaDecimal128 {
  public value: any
  public valid: boolean | undefined
  public convertedValue: Bson.Decimal128 | null | undefined

  constructor(value: any) {
    if (value === undefined) {
      throw new Error('A value is required.')
    }
    this.value = value
    this.convertedValue
    this.valid
  }

  /**
   * Attempts to convert raw value to the given data type.
   * Sets convertedValue property to the casted input if possible, or undefined if not.
   */
  convertType() {
    if (this.value === null) {
      this.convertedValue = this.value
    } else if (typeof this.value === 'object') {
      if (this.value instanceof Bson.Decimal128) {
        this.convertedValue = this.value
      }
    } else if (
      typeof this.value !== 'number' &&
      typeof this.value !== 'string'
    ) {
      return
    } else if (typeof this.value === 'string') {
      const stringNum: number = parseFloat(this.value)
      if (isNaN(stringNum)) {
        return
      }
      const decimal128Number = new Bson.Decimal128(this.value)
      this.convertedValue = decimal128Number
    } else if (typeof this.value === 'number') {
      const decimal128Number = new Bson.Decimal128(this.value.toString())
      this.convertedValue = decimal128Number
    }

    return this.convertedValue
  }

  /**
   * Checks whether the value was casted to the correct data type.
   * Sets valid property to true or false.
   */
  validateType() {
    this.valid = this.convertedValue === undefined ? false : true
    return this.valid
  }
}

/**
 * Class definition of String Schema datatype
 * @param value Raw value input from the user.
 * @returns An object of class SchemaString.
 */
class SchemaString {
  public value: any
  public valid: boolean | undefined
  public convertedValue: string | String | null | undefined

  constructor(value: any) {
    if (value === undefined) {
      throw new Error('A value is required.')
    }
    this.value = value
    this.convertedValue
    this.valid
  }

  /**
   * Attempts to convert raw value to the given data type.
   * Sets convertedValue property to the casted input if possible, or undefined if not.
   */
  convertType() {
    if (this.value === null) {
      this.convertedValue = this.value
    } else if (typeof this.value === 'object') {
      if (this.value instanceof String) {
        this.convertedValue = this.value
      }
    } else if (
      typeof this.value !== 'number' &&
      typeof this.value !== 'string' &&
      typeof this.value !== 'boolean'
    ) {
      return
    } else if (typeof this.value === 'string') {
      this.convertedValue = this.value
    } else if (typeof this.value === 'number') {
      this.convertedValue = this.value.toString()
    } else if (typeof this.value === 'boolean') {
      this.convertedValue = this.value ? 'true' : 'false'
    }

    return this.convertedValue
  }

  /**
   * Checks whether the value was casted to the correct data type.
   * Sets valid property to true or false.
   */
  validateType() {
    this.valid = this.convertedValue === undefined ? false : true
    // or
    // this.valid = this.convertedValue !== undefined
    return this.valid
  }
}

/**
 * Class definition of Boolean Schema datatype
 * @param value Raw value input from the user.
 * @returns An object of class SchemaBoolean.
 */
class SchemaBoolean {
  public value: any
  public valid: boolean | undefined
  public convertedValue: boolean | Boolean | null | undefined

  constructor(value: any) {
    if (value === undefined) {
      throw new Error('A value is required.')
    }
    this.value = value
    this.convertedValue
    this.valid
  }

  /**
   * Attempts to convert raw value to the given data type.
   * Sets convertedValue property to the casted input if possible, or undefined if not.
   */
  convertType() {
    if (this.value === null) {
      this.convertedValue = this.value
    } else if (typeof this.value === 'object') {
      if (this.value instanceof Boolean) {
        this.convertedValue = this.value
      }
    } else if (
      typeof this.value !== 'number' &&
      typeof this.value !== 'string' &&
      typeof this.value !== 'boolean'
    ) {
      return
    } else if (typeof this.value === 'string') {
      if (this.value.toLowerCase() === 'true') this.convertedValue = true
      else if (this.value.toLowerCase() === 'false') {
        this.convertedValue = false
      }
    } else if (typeof this.value === 'number') {
      if (this.value === 1) this.convertedValue = true
      else if (this.value === 0) this.convertedValue = false
    } else if (typeof this.value === 'boolean') {
      this.convertedValue = this.value
    }

    return this.convertedValue
  }

  /**
   * Checks whether the value was casted to the correct data type..
   * Sets valid property to true or false.
   */
  validateType() {
    this.valid = this.convertedValue === undefined ? false : true
    return this.valid
  }
}

/**
 * Class definition of ObjectId Schema datatype
 * @param value Raw value input from the user.
 * @returns An object of class SchemaObjectId.
 */
class SchemaObjectId {
  public value: any
  public valid: boolean | undefined
  public convertedValue: Bson.ObjectId | null | undefined

  constructor(value: any) {
    if (value === undefined) {
      throw new Error('A value is required.')
    }
    this.value = value
    this.convertedValue
    this.valid
  }

  /**
   * Attempts to convert raw value to the given data type.
   * Sets convertedValue property to the casted input if possible, or undefined if not.
   */
  convertType() {
    if (this.value === null) {
      this.convertedValue = this.value
    } else if (typeof this.value === 'object') {
      if (this.value instanceof Bson.ObjectId) {
        this.convertedValue = this.value
      }
    } else if (Bson.ObjectId.isValid(this.value)) {
      this.convertedValue = new Bson.ObjectId(this.value)
    }

    return this.convertedValue
  }

  /**
   * Checks whether the value was casted to the correct data type..
   * Sets valid property to true or false.
   */
  validateType() {
    this.valid = this.convertedValue === undefined ? false : true
    return this.valid
  }
}

/**
 * Class definition of UUID Schema datatype
 * @param value Raw value input from the user.
 * @returns An object of class SchemaUUID.
 */
export class SchemaUUID {
  public value: any
  public valid: boolean | undefined
  public convertedValue: Bson.UUID | null | undefined

  constructor(value: any) {
    if (value === undefined) {
      throw new Error('A value is required.')
    }
    this.value = value
    this.convertedValue
    this.valid
  }

  /**
   * Attempts to convert raw value to the given data type.
   * Sets convertedValue property to the casted input if possible, or undefined if not.
   */
  convertType() {
    if (this.value === null) {
      this.convertedValue = this.value
    } else if (typeof this.value === 'object') {
      if (this.value instanceof Bson.UUID) {
        this.convertedValue = this.value
      }
    } else if (Bson.UUID.isValid(this.value)) {
      this.convertedValue = new Bson.UUID(this.value)
    }

    return this.convertedValue
  }

  /**
   * Checks whether the value was casted to the correct data type..
   * Sets valid property to true or false.
   */
  validateType() {
    this.valid = this.convertedValue === undefined ? false : true
    return this.valid
  }
}

/**
 * Class definition of Date Schema datatype
 * @param value Raw value input from the user.
 * @returns An object of class SchemaDate.
 */
class SchemaDate {
  public value: any
  public valid: boolean | undefined
  public convertedValue: Date | null | undefined

  constructor(value: any) {
    if (value === undefined) {
      throw new Error('A value is required.')
    }
    this.value = value
    this.convertedValue
    this.valid
  }

  /**
   * Attempts to convert raw value to the given data type.
   * Sets convertedValue property to the casted input if possible, or undefined if not.
   */
  convertType() {
    if (this.value === null) {
      this.convertedValue = this.value
    } else if (typeof this.value === 'object') {
      if (this.value instanceof Date) {
        this.convertedValue = this.value
      }
    } else if (
      typeof this.value !== 'number' &&
      typeof this.value !== 'string'
    ) {
      return
    } else if (typeof this.value === 'string') {
      const convertedDate: number | Date = Date.parse(this.value)
      if (typeof convertedDate === 'number') {
        if (isNaN(convertedDate)) {
          return
        } else {
          this.convertedValue = new Date(convertedDate)
        }
      }
    } else if (typeof this.value === 'number') {
      this.convertedValue = new Date(this.value)
    }

    return this.convertedValue
  }

  /**
   * Checks whether the value was casted to the correct data type..
   * Sets valid property to true or false.
   */
  validateType() {
    this.valid = this.convertedValue === undefined ? false : true
    return this.valid
  }
}

// SCHEMA OBJ

class SchemaObject {
  public value: any
  public valid: boolean | undefined
  public convertedValue: Record<string, unknown> | null | undefined

  constructor(value: any) {
    if (value === undefined) {
      throw new Error('A value is required.')
    }
    this.value = value
    this.convertedValue
    this.valid
  }

  /**
   * Attempts to convert raw value to the given data type.
   * Sets convertedValue property to the casted input if possible, or undefined if not.
   */
  convertType() {
    if (this.value === null) {
      this.convertedValue = this.value
    } else if (typeof this.value === 'object') {
      this.convertedValue = this.value
      // }
    } else if (typeof this.value !== 'object') {
      return
    }

    return this.convertedValue
  }

  /**
   * Checks whether the value was casted to the correct data type..
   * Sets valid property to true or false.
   */
  validateType() {
    this.valid = this.convertedValue === undefined ? false : true
    return this.valid
  }
}

export const dataTypes = {
  number: SchemaNumber,
  decimal128: SchemaDecimal128,
  string: SchemaString,
  boolean: SchemaBoolean,
  objectid: SchemaObjectId,
  uuid: SchemaUUID,
  date: SchemaDate,
  object: SchemaObject,
}
