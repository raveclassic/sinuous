// Adapted from https://github.com/caiogondim/fast-memoize.js - MIT License
import { EMPTY_ARR } from './constants.js';

export function memo(func) {
  let cache = {};
  return function() {
    const args = EMPTY_ARR.slice.call(arguments);

    const argsWithFuncIds = args.map(x => {
      if (isPlainObject(x)) {
        return Object.keys(x)
          .reduce((acc, curr) => {
            acc[curr] = memoizedIdFunc(x[curr]);
            return acc;
          }, {});
      }
      return memoizedIdFunc(x);
    });

    const cacheKey = JSON.stringify(argsWithFuncIds);
    let computedValue = cache[cacheKey];
    if (computedValue === undefined) {
      // eslint-disable-next-line
      computedValue = func.apply(this, args);

      // Memoizing the contents of a document fragment is impossible because
      // once it is appended, it's cleared of its children leaving an empty
      // shell, on next render the comp would just be cleared.
      // Store the child refs in an array and memo and return this.
      if (computedValue && computedValue.nodeType === 11) {
        computedValue = EMPTY_ARR.slice.call(computedValue.childNodes);
      }

      cache[cacheKey] = computedValue;
    }
    return computedValue;
  };
}

let id = 0;
function memoizedIdFunc(x) {
  if (typeof x === 'function') {
    if (!x.__memoizedId) x.__memoizedId = ++id;
    return { __memoizedId: x.__memoizedId };
  }
  return x;
}

/**
 * Check if this is a plain obect.
 * @param {object} obj - The object to inspect.
 * @return {boolean}
 */
function isPlainObject(obj) {
  if (typeof obj !== 'object' || obj === null) return false;

  let proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(obj) === proto;
}
