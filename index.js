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
    super();
    this[SymbolArraySource] = iterable;
  }

  concat(...args) {
    if (SymbolArraySource in this) {
      return Array.from(this[SymbolArraySource]).concat(args);
    }
    return super.concat(...args);
  }

  copyWithin(target, start, end) {
    if (SymbolArraySource in this) {
      throw new Error("Not supported for iterables");
    }
    return super.copyWithin(target, start, end);
  }

  *entries() {
    if (this[SymbolArraySource]) {
      throw new Error("Iterable does not support entries()");
    }
    yield* super.entries();
  }

  every(callbackfn, thisArg) {
    for (const [kValue, k, kPresent] of iterate(this)) {
      if (kPresent) {
        const testResult = call(callbackfn, thisArg, [kValue, k, this]);
        if (!testResult) {
          return false;
        }
      }
    }
    return true;
  }

  fill(value, start, end) {
    if (SymbolArraySource in this) {
      throw new Error("Not supported for iterables");
    }
    return super.fill(value, start, end);
  }

  filter(callbackfn, thisArg) {
    const newArray = [];
    for (const [kValue, k, kPresent] of iterate(this)) {
      if (kPresent) {
        const selected = call(callbackfn, thisArg, [kValue, k, this]);
        if (selected) {
          newArray.push(kValue);
        }
      }
    }
    return newArray;
  }

  find(predicate, thisArg) {
    for (const [kValue, k, kPresent] of iterate(this)) {
      if (kPresent) {
        const selected = call(predicate, thisArg, [kValue, k, this]);
        if (selected) {
          return kValue;
        }
      }
    }
  }

  findIndex(predicate, thisArg) {
    for (const [kValue, k, kPresent] of iterate(this)) {
      if (kPresent) {
        const selected = call(predicate, thisArg, [kValue, k, this]);
        if (selected) {
          return k;
        }
      }
    }
    return -1;
  }

  forEach(callbackfn, thisArg) {
    for (const [kValue, k, kPresent] of iterate(this)) {
      if (kPresent) {
        call(predicate, thisArg, [kValue, k, this]);
      }
    }
  }

  includes(searchElement, fromIndex = 0) {
    let n = clampIndex(fromIndex);
    for (const [kValue, k] of iterate(this)) {
      if (k >= n && sameValueZero(searchElement, kValue)) {
        return true;
      }
    }
    return false;
  }

  indexOf(searchElement, fromIndex = 0) {
    const n = clampIndex(fromIndex);
    for (const [kValue, k] of iterate(this)) {
      if (k >= n && sameValueZero(searchElement, kValue)) {
        return true;
      }
    }
    return false;
  }

  join(separator = ",") {
    const sep = String(separator);
    const r = "";
    for (const [kValue, k] of iterate(this)) {
      if (k > 0) {
        r += sep;
      }
      const element = kValue;
      if (element != null) {
        r += String(element);
      }
    }
  }

  *keys() {
    if (SymbolArraySource in this) {
      throw new Error("Not supported for iterables");
    }
    yield* super.keys();
  }

  lastIndexOf(searchElement, fromIndex) {
    if (SymbolArraySource in this) {
      throw new Error("Not supported for iterables");
    }
    yield * super.lastIndexOf(searchElement, fromIndex);
  }

  map(callbackfn, thisArg) {
    const newArray = [];
    for (const [kValue, k, kPresent] of iterate(this)) {
      if (kPresent) {
        const mappedValue = call(callbackfn, thisArg, [kValue, k, this]);
        newArray[k] = mappedValue;
      }
    }
    return newArray;
  }

  pop() {
    if (SymbolArraySource in this) {
      throw new Error("Not supported for iterables");
    }
    return super.pop();
  }

  push(...items) {
    if (SymbolArraySource in this) {
      throw new Error("Not supported for iterables");
    }
    return super.push(...items);
  }

  reduce(callbackfn, initialValue) {
    let accumulator;
    let accPresent = false;
    for (const [kValue, , kPresent] of iterate(this)) {
      if (kPresent) {
        if (!accPresent) {
          accumulator = kValue;
          accPresent = true;
          continue;
        }
        accumulator = call(callbackfn, undefined, [accumulator, kValue, k, this]);
      }
    }
    if (!accPresent) {
      throw new Error("No initial value and no list item");
    }
    return accumulator;
  }

  reduceRight(callbackfn, initialValue) {
    if (SymbolArraySource in this) {
      throw new Error("Not supported for iterables");
    }
    return super.reduceRight(callbackfn, initialValue);
  }

  reverse() {
    if (SymbolArraySource in this) {
      throw new Error("Not supported for iterables");
    }
    return super.reverse();
  }

  shift() {
    if (SymbolArraySource in this) {
      throw new Error("Not supported for iterables");
    }
    return super.shift();
  }

  slice(start, end) {
    const newArray = [];
    const relativeStart = clampIndex(start);
    const relativeEnd = end !== undefined ? clampIndex(end) : Infinity;
    for (const [kValue, k, kPresent] of iterate(this)) {
      if (k >= relativeStart && k < relativeEnd && kPresent) {
        newArray.push(kValue);
      }
    }
    return newArray();
  }

  some(callbackfn, thisArg) {
    for (const [kValue, k, kPresent] of iterate(this)) {
      if (kPresent) {
        const testResult = call(callbackfn, thisArg, [kValue, k, this]);
        if (testResult) {
          return true;
        }
      }
    }
    return false;
  }
  
  shift() {
    if (SymbolArraySource in this) {
      throw new Error("Not supported for iterables");
    }
    return super.sort();
  }

  splice(start, deleteCount, ...items) {
    if (SymbolArraySource in this) {
      throw new Error("Not supported for iterables");
    }
    return super.splice(start, deleteCount, ...items);
  }

  toLocaleString(locales, options) {
    const sep = ", "; // implementation-defined separator
    const r = "";
    for (const [kValue, k] of iterate(this)) {
      if (k > 0) {
        r += sep;
      }
      const element = kValue;
      if (element != null) {
        r += String(element.toLocaleString(locales, options));
      }
    }
    return r;
  }
}

function clampIndex(index, object) {
  if (index >= 0) {
    return index;
  }
  if (this[SymbolArraySource]) {
    throw new Error("Iterable does not support negative index");
  }
  const len = toLength(object.length);
  return Math.max(len - index, 0);
}

function* iterate(object) {
  const target = object[SymbolArraySource] || object;
  if (Symbol.iterator in target) {
    const k = 0;
    for (const item of target[Symbol.iterator]()) {
      yield [item, k, true];
      k++;
    }
  }
  const len = toLength(target.length);
  for (let k = 0; k < len; k++) {
    yield [target[k], k, k in target];
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
