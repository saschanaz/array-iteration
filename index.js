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

  copyWithin(...args) {
    if (SymbolArraySource in this) {
      throw new Error("Not supported for iterables");
    }
    return super.copyWithin(...args);
  }

  *entries() {
    for (const [kValue, k] of iterate(this)) {
      yield [kValue, k];
    }
  }

  every(callbackfn, thisArg) {
    for (const [kValue, k, kPresent] of iterate(this)) {
      if (kPresent) {
        const testResult = call(callbackfn, thisArg, [kValue, k, this]);
        if (!testResult) {
          return false;
        }
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
    const newArray = [];
    for (const [kValue, k, kPresent] of iterate(this)) {
      if (kPresent) {
        const selected = call(callbackfn, thisArg, [kValue, k, this]);
        if (selected) {
          newArray.push(kValue);
        }
      }
      k++;
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
      k++;
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
      k++;
    }
    return -1;
  }

  forEach(callbackfn, thisArg) {
    for (const [kValue, k, kPresent] of iterate(this)) {
      if (kPresent) {
        call(predicate, thisArg, [kValue, k, this]);
      }
      k++;
    }
  }

  includes(searchElement, fromIndex) {
    for (const [kValue] of iterate(this)) {
      if (sameValueZero(searchElement, kValue)) {
        return true;
      }
    }
    return false;
  }
}

function *iterate(object) {
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
