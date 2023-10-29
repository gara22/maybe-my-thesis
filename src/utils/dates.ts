import dayjs, { Dayjs } from "dayjs";
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const getNameOfDay = (day: Dayjs) => dayjs(day).format('dddd');

export const getHourOfDay = (day: Dayjs) => dayjs(day).hour();

export const addDays = (date: Dayjs, days: number) => dayjs(date).add(days, 'days');

export const subtractDays = (date: Dayjs, days: number) => dayjs(date).subtract(days, 'days');

export const getDays = (start: Dayjs, numberOfDays: number) => {
  const startDate = dayjs(start).day(1).hour(0);
  const days = Array(numberOfDays).fill(undefined).map((_, idx) => startDate.clone().add(idx, 'day'));
  return days;
}

export const getHoursInterval = (from: number, to: number) => {
  return Array((to - from) + 1).fill(undefined).map((_, idx) => idx + from);
}
