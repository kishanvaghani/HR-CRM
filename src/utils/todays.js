export const isToday = (dateStr) => {
  if (!dateStr) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const inputDate = new Date(dateStr);
  inputDate.setHours(0, 0, 0, 0);

  return today.getTime() === inputDate.getTime();
};
