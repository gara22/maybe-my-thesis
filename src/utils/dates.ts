import moment from "moment";

export const getNameOfDay = (day: Date) => moment(day).format('dddd');

export const getHourOfDay = (day: Date) => moment(day).hour();

export const addDays = (date: Date, days: number) => moment(date).add(days, 'days').toDate();

export const subtractDays = (date: Date, days: number) => moment(date).subtract(days, 'days').toDate();

export const getDays = (start: Date, numberOfDays: number) => {
  const startMoment = moment(start).startOf('isoWeek');
  const days = Array(numberOfDays).fill(undefined).map((_, idx) => startMoment.clone().add(idx, 'day').toDate());
  return days;
}

export const getHoursInterval = (from: number, to: number) => {
  return Array((to - from) + 1).fill(undefined).map((_, idx) => idx + from);
}
