import dayjs from "dayjs";

export const getNameOfDay = (day: Date) => dayjs(day).format('dddd');

export const getHourOfDay = (day: Date) => dayjs(day).hour();

export const addDays = (date: Date, days: number) => dayjs(date).add(days, 'days').toDate();

export const subtractDays = (date: Date, days: number) => dayjs(date).subtract(days, 'days').toDate();

export const getDays = (start: Date, numberOfDays: number) => {
  const startMoment = dayjs(start).startOf('week');
  const days = Array(numberOfDays).fill(undefined).map((_, idx) => startMoment.clone().add(idx, 'day').toDate());
  return days;
}

export const getHoursInterval = (from: number, to: number) => {
  return Array((to - from) + 1).fill(undefined).map((_, idx) => idx + from);
}
