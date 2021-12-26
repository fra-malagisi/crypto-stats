import { last } from 'ramda';

const isLastElement = (arrayLength: number, index: number): boolean => {
  return index === arrayLength;
};

const getLastElement = <T>(array: T[]): T | undefined => last(array);

const ArrayUtil = {
  isLastElement,
  getLastElement,
};

export default ArrayUtil;
