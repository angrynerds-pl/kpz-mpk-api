export function groupBy<Elem, Key>(
  array: readonly Elem[],
  by: (elem: Elem) => Key
): Map<Key, Elem[]> {
  const map = new Map<Key, Elem[]>();

  for (let i = 0; i < array.length; i += 1) {
    const elem = array[i];
    const key = by(elem);

    const mappedGroup = map.get(key);
    const group = mappedGroup === undefined ? [] : mappedGroup;

    group.push(elem);

    if (mappedGroup !== group) {
      map.set(key, group);
    }
  }

  return map;
}
