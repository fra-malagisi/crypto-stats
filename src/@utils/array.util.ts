const isLastElement = (arrayLength: number, index: number): boolean => {
  return index === arrayLength - 1;
};

const getLastElement = <T>(array: T[]): T => array[array.length - 1];

const ArrayUtil = {
  isLastElement,
  getLastElement,
};

export default ArrayUtil;
