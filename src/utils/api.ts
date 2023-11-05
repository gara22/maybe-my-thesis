import axios from "axios";
import { BookingParams } from "../features/classrooms/ClassroomShow";
import {
  Booking,
  BookingWithAllData,
  BookingWithBooker,
  Classroom,
} from "../types/types";
import { USER_ID } from "./constants";

const editBooking = (data: Pick<Booking, "id" | "description">) => {
  return axios.put("http://localhost:8080/bookings/edit", data);
};

const createBooking = (data: BookingParams) => {
  return axios.post("http://localhost:8080/bookings/new", data);
};

const deleteBooking = (bookingId: string) => {
  const res = axios.delete(
    `http://localhost:8080/bookings/delete/${bookingId}`,
  );
  return res;
};

const getBookingsOfUser = async (
  userId: string,
): Promise<{ bookings: BookingWithAllData[] }> => {
  const res = await fetch(
    `http://localhost:8080/bookings/user?userId=${userId}`,
  );
  return res.json();
};

const getBookings = async (
  from: Date,
  to: Date,
  id: string,
): Promise<{ bookings: BookingWithBooker[] }> => {
  const res = await fetch(
    `http://localhost:8080/bookings?from=${from.toISOString()}&to=${to.toISOString()}&classroomId=${id}`,
  );
  return res.json();
};

const deleteClassroom = (data: string) => {
  const res = axios.delete(`http://localhost:8080/classrooms/delete/${data}`);
  return res;
};

const createClassroom = (
  data: Pick<Classroom, "name" | "capacity" | "hasComputer">,
) => {
  const res = axios.post("http://localhost:8080/classrooms/new", data);
  return res;
};

const getClassroomById = async (
  id: string,
): Promise<{ classroom: Classroom }> => {
  const res = await fetch(`http://localhost:8080/classrooms/${id}`);
  return res.json();
};

const getClassrooms = async (): Promise<{ classrooms: Classroom[] }> => {
  const res = await fetch("http://localhost:8080/classrooms");
  return res.json();
};

const getFreeClassrooms = async (
  from: Date,
  to: Date,
  hasComputer: boolean,
): Promise<{ freeClassrooms: Classroom[] }> => {
  const res = await fetch(
    `http://localhost:8080/classrooms/free?from=${from.toISOString()}&to=${to.toISOString()}&hasComputer=${hasComputer}`,
  );
  return res.json();
};

const bookings = {
  editBooking,
  createBooking,
  deleteBooking,
  getBookingsOfUser,
  getBookings,
};

const classrooms = {
  createClassroom,
  deleteClassroom,
  getClassroomById,
  getClassrooms,
  getFreeClassrooms,
};

export default {
  bookings,
  classrooms,
};
