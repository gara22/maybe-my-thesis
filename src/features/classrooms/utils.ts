import axios from "axios";
import { Classroom } from "../../types/Classroom";

const URL_PREFIX = import.meta.env.VITE_SERVER_URL_DEV;


// type GetClassroomResponse = {

//   classroom: Classroom,
// };

export const getClassroom = async (id: string) => {
  try {
    const { data } = await axios.get<Classroom>(URL_PREFIX + '/classrooms/' + id);
    console.log(data);

    return data


  } catch (error) {
    return null;
  }
}