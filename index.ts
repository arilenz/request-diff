import isEqual from "lodash/isEqual";
import isPlainObject from "lodash/isPlainObject";

const isEqualDate = (_old: Date, _new: Date) =>
  _old.getDate() === _new.getDate() &&
  _old.getMonth() === _new.getMonth() &&
  _old.getFullYear() === _new.getFullYear();

export function getDifference(
  _old: any,
  _new: any,
  options?: { dismissTimeInDates?: boolean }
) {
  if (isPlainObject(_new) && isPlainObject(_old)) {
    const diffObj = Object.keys(_new).reduce((result: any, key) => {
      const difference = getDifference(_old[key], _new[key], options);

      if (difference || difference === null) {
        result[key] = difference;
      }

      return result;
    }, {});

    return Object.keys(diffObj).length === 0 ? undefined : diffObj;
  } else if (Array.isArray(_new) && Array.isArray(_old)) {
    let itemsChanged = 0;
    const diffArray = _new.map((_, index) => {
      const difference: any = getDifference(_old[index], _new[index], options);

      if (difference || difference === null) {
        itemsChanged++;
        return difference;
      } else {
        return typeof _old[index] === "object" ? {} : _old[index];
      }
    });

    return itemsChanged === 0 ? undefined : diffArray;
  } else {
    const isEqualFn =
      options?.dismissTimeInDates &&
      _old instanceof Date &&
      _new instanceof Date
        ? isEqualDate
        : isEqual;

    if (isEqualFn(_old, _new)) {
      return undefined;
    }

    return _new;
  }
}

export const removeNulls = (data: any) => {
  if (isPlainObject(data)) {
    return Object.keys(data).reduce((result: any, key) => {
      result[key] = removeNulls(data[key]);
      return result;
    }, {});
  } else if (Array.isArray(data)) {
    return data.filter((item) => item !== null);
  } else {
    if (data === null) {
      return undefined;
    }
    return data;
  }
};
