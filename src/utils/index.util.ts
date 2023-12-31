/**
 * @description 过滤key 用于过滤掉拿到的值后返回给前端
 * @param target
 * @param keys
 * @returns newArr
 */
export const onPickKeys = <T extends object, K extends keyof T>(
  target: T[],
  keys: K[],
): T[] => {
  return target.map(x => {
    const result = {} as T;
    for (const key in x) {
      if (!keys.includes(key as unknown as K)) {
        result[key] = x[key];
      }
    }
    return result;
  });
};

/**
 * 对传入数据的深克隆
 * @param {object} target 需要克隆的对象(不可为map、set... 未做适配)
 * @param {WeakMap} map WeakMap对象
 * @return {object} 被克隆的target
 **/
export const deepClone = function <T extends object>(
  target: T,
  map: WeakMap<T, T> = new WeakMap(),
): T {
  if (!(target instanceof Object)) return target;
  if (map.has(target)) return map.get(target) as T;
  const tempObject: T = Array.isArray(target)
    ? []
    : Object.create(Object.getPrototypeOf(target));
  // 对象保存 为了防止引用自身导致的内存溢出
  map.set(target, tempObject);
  Object.keys(target).forEach(key => {
    const newKey = key as keyof T;
    // 对于函数的单独处理
    if (target[newKey] instanceof Function)
      return (tempObject[newKey] = (target[newKey] as Function).bind(
        tempObject,
      ));
    // @ts-ignore
    tempObject[newKey] = deepClone(target[newKey], map);
  });
  return tempObject;
};
