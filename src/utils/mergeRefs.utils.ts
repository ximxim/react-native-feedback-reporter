import type { MutableRefObject, RefObject, Ref } from 'react';

export const mergeRefs = <T extends unknown>(
  ...refs: Array<RefObject<T> | any>
): Ref<T> => {
  const filteredRefs = refs.filter(Boolean);
  if (!filteredRefs.length) return null;
  if (filteredRefs.length === 0) return filteredRefs[0];
  return (inst) => {
    for (const ref of filteredRefs) {
      (ref as MutableRefObject<unknown>).current = inst;
    }
  };
};
