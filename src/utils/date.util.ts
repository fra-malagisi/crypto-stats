export const getYesterday = () => {
  const today = new Date();
  return new Date(today.setDate(today.getDate() - 1));
};

export const getLastDayOfLastMonth = () => {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), 0);
};

export const getMonthAndYear = () => {
  const today = new Date();
  return `${today.getDate() !== 1 ? today.getMonth() + 1 : today.getMonth() === 0 ? '12' : today.getMonth()}/${
    today.getDate() === 1 && today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear()
  }`;
};
