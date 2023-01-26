import { Classroom } from "./Classroom";
import { User } from "./User";

export interface Booking {
  _id: string;
  classroom: Pick<Classroom, '_id' | 'name'>
  from: Date;
  to: Date;
  bookedBy: User;
  description: string;
}