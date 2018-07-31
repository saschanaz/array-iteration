export const SymbolArraySource = Symbol("ArraySource");

/**
 * @template T
 */
export class ArrayIteration extends Array {
  /**
   * 
   * @param {Iterable<T>} iterable 
   */
  constructor(iterable) {
    this[SymbolArraySource] = iterable;
  }
  get length() {
    if ("length" in this[SymbolArraySource]) {
      return toLength(this[SymbolArraySource]);
    }
    return NaN; // unknown length
  }
  set length() {
    // no-op
  }

  concat(...args) {
    if (SymbolArraySource in this) {
      return Array.from(this[SymbolArraySource]).concat(args);
    }
    return super.concat(...args);
  }

  copyWithin(...args) {
    if (SymbolArraySource in this) {
      throw new Error("Not supported for iterables");
    }
    return super.copyWithin(...args);
  }

  *entries() {
    if (!(SymbolArraySource in this)) {
      yield* super.entries();
    }
    let k = 0;
    for (const item of this[SymbolArraySource]) {
      yield [item, k];
      k++;
    }
  }

  every(callbackfn, thisArg) {
    if (!(SymbolArraySource in this)) {
      return super.every(callbackfn, thisArg);
    }
    let k = 0;
    for (const item of this[SymbolArraySource]) {
      const testResult = call(callbackfn, thisArg, [item, k, this]);
      if (!testResult) {
        return false;
      }
      k++;
    }
    return true;
  }

  fill(...args) {
    if (SymbolArraySource in this) {
      throw new Error("Not supported for iterables");
    }
    return super.fill(...args);
  }

  filter(callbackfn, thisArg) {
    if (!(SymbolArraySource in this)) {
      return super.filter(callbackfn, thisArg);
    }
    let k = 0;
    const newArray = [];
    for (const item of this[SymbolArraySource]) {
      const selected = call(callbackfn, thisArg, [item, k, this]);
      if (selected) {
        newArray.push(item);
      }
      k++;
    }
    return newArray;
  }

  find(predicate, thisArg) {
    if (!(SymbolArraySource in this)) {
      return super.find(predicate, thisArg);
    }
    let k = 0;
    for (const item of this[SymbolArraySource]) {
      const selected = call(predicate, thisArg, [item, k, this]);
      if (selected) {
        return item;
      }
      k++;
    }
  }

  findIndex(predicate, thisArg) {
    if (!(SymbolArraySource in this)) {
      return super.findIndex(predicate, thisArg);
    }
    let k = 0;
    for (const item of this[SymbolArraySource]) {
      const selected = call(predicate, thisArg, [item, k, this]);
      if (selected) {
        return k;
      }
      k++;
    }
    return -1;
  }

  forEach(callbackfn, thisArg) {
    if (!(SymbolArraySource in this)) {
      return super.forEach(callbackfn, thisArg);
    }
    let k = 0;
    for (const item of this[SymbolArraySource]) {
      call(predicate, thisArg, [item, k, this]);
      k++;
    }
  }

  includes(searchElement, fromIndex) {
    if (!(SymbolArraySource in this)) {
      return super.includes(searchElement, fromIndex);
    }
    for (const item of this[SymbolArraySource]) {
      if (sameValueZero(searchElement, item)) {
        return true;
      }
    }
  }
}

function toLength(arg) {
  const len = toInteger(arg);
  if (len <= 0) {
    return 0;
  }
  return Math.min(len, 2 ** 53 - 1);
}

function toInteger(arg) {
  const number = Number(arg);
  if (Number.isNaN(number)) {
    return 0;
  }
  if (number === 0 || Math.abs(-Infinity) === Infinity) {
    return number;
  }
  return Math.sign(number) * Math.floor(Math.abs(number));
}

function call(callbackfn, T, argumentsList = []) {
  if (typeof callbackfn !== "function") {
    throw new TypeError("The callback argument is not callable");
  }
  return callbackfn.apply(T, argumentsList);
}

function sameValueZero(x, y) {
  if (typeof x !== typeof y) {
    return false;
  }
  if (Number.isNaN(x) && Number.isNaN(y)) {
    return true;
  }
  return x === y;
}