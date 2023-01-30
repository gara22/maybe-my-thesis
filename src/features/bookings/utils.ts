import axios from "axios";
import { Booking, BookingResponse } from "../../types/Booking";
import { Classroom } from "../../types/Classroom";
import { getClassroom } from "../classrooms/utils";
// import { httpGet } from "../../utils/http"

const URL_PREFIX = import.meta.env.VITE_SERVER_URL_DEV;


type GetBookingsResponse = {

  bookings: BookingResponse[],
  maxBookings: number,
};

export const getBookings = async () => {
  try {
    const { data } = await axios.get<GetBookingsResponse>(URL_PREFIX + '/bookings/all');
    return data


  } catch (error) {
    return {
      bookings: [],
      maxBookings: 0,
    }
  }
}

export const getFullBookings = async () => {
  console.log('get f');

  const { bookings: bookingsRes, maxBookings } = await getBookings();
  const classRoomIds = [...new Set<string>(bookingsRes.map(b => b.classroom_id))];

  const classrooms = await axios.all(classRoomIds.map(cId => getClassroom(cId)));
  const classroomObj: Record<string, Classroom> = classrooms.reduce((acc, c) => {

    return {
      ...acc,
      [c?._id as string]: c,
    }
  }, {});

  const bookings: Booking[] = bookingsRes.map(bRes => {
    return {
      ...bRes,
      classroom: classroomObj[bRes.classroom_id]
    }
  });

  return bookings;

}