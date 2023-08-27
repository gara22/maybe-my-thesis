import moment from "moment";

export const TIME_INTERVALS = [
  { view: '8:00 - 9:00', time: 8 },
  { view: '9:00 - 10:00', time: 9 },
  { view: '10:00 - 11:00', time: 10 },
  { view: '11:00 - 12:00', time: 11 },
  { view: '12:00 - 13:00', time: 12 },
  { view: '13:00 - 14:00', time: 13 },
  { view: '14:00 - 15:00', time: 14 },
  { view: '15:00 - 16:00', time: 15 },
  { view: '16:00 - 17:00', time: 16 },
  { view: '17:00 - 18:00', time: 17 },
  { view: '18:00 - 19:00', time: 18 },
  { view: '19:00 - 20:00', time: 19 },
  { view: '20:00 - 21:00', time: 20 },
];
export const START_HOUR = 8;
export const END_HOUR = 20;
export const LENGTH_OF_WEEK = 5;
export const UTC_OFFSET = moment().utcOffset() / 60;