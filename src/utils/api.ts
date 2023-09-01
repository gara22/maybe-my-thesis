import axios from "axios";
import { BookingParams } from "../features/classrooms/ClassroomShow";
import { Booking } from "../types/types";

const editBooking = (data: Pick<Booking, 'id' | 'description'>) => {
  return axios.put("http://localhost:8080/bookings/edit", data);

}

const createBooking = (data: BookingParams) => {
  return axios.post("http://localhost:8080/bookings/new", data);

}

const deleteBooking = (bookingId: string) => {
  const res = axios.delete(`http://localhost:8080/bookings/delete/${bookingId}`);
  return res;
}
const deleteClassroom = (data: string) => {
  const res = axios.delete(`http://localhost:8080/classrooms/delete/${data}`);
  return res;
}

const bookings = {
  editBooking,
  createBooking,
  deleteBooking
}

//TODO: create classroom
const classrooms = {

  deleteClassroom
}

export default {
  bookings,
  classrooms
}