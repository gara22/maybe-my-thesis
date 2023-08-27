import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { Box, Flex, Heading, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import moment from 'moment';
import React, { useRef, useState } from 'react'
import { useQuery } from 'react-query';
import { useParams, useSearchParams } from 'react-router-dom';
import BookingForm, { BookingFormValues, SubmitHandle } from '../../components/Booking/BookingForm';
import { Calendar } from '../../components/Calendar/Calendar'
import CustomModal from '../../components/Modal/Modal';
import { Booking, BookingWithBooker, Classroom } from '../../types/types';
import { LENGTH_OF_WEEK, UTC_OFFSET } from '../../utils/constants';
import { addDays, getDays, subtractDays } from '../../utils/dates';


const ClassroomShow = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null)
  const [currentWeekStartingDate, setCurrentWeekStartingDate] = useState<Date>(moment(new Date()).startOf('isoWeek').toDate());
  const { id } = useParams();

  console.log(id)
  // const { data: classroom, isLoading, refetch } = api.classroom.getClassroomById.useQuery({ id } as { id: string });

  const { isOpen: isOpenCreate, onOpen: onOpenCreate, onClose: onCloseCreate } = useDisclosure();
  const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure();
  const days = getDays(currentWeekStartingDate, LENGTH_OF_WEEK);
  // const { data: bookings, isLoading: isBookingsLoading, refetch: refetchBookings } = api.booking.getBookingsOfClassroom.useQuery({ classroomId: id as string, from: days[0] as Date, to: moment(days[days.length - 1]).endOf('day').toDate() });


  const toast = useToast();


  const createBookingRef = useRef<SubmitHandle>(null);
  const editBookingRef = useRef<SubmitHandle>(null);



  const getClassroomById = async (id: string): Promise<{ classroom: Classroom }> => {
    const res = await fetch(`http://localhost:8080/classrooms/${id}`);
    return res.json();
  };

  const getBookings = async (): Promise<{ bookings: BookingWithBooker[] }> => {
    const from = days[0];
    const to = moment(days[days.length - 1]).endOf('day').toDate();
    const res = await fetch(`http://localhost:8080/bookings?from=${from.toISOString()}&to=${to.toISOString()}&classroomId=${id}`);
    return res.json();
  };
  const { data: classroomData, isLoading, refetch } = useQuery(['classroom', id], () => getClassroomById(id as string), { refetchOnWindowFocus: false });
  const { data: bookingsData, isLoading: isBookingsLoading } = useQuery(['bookings', days], getBookings, { refetchOnWindowFocus: false });
  const classroom = classroomData?.classroom;
  const bookings = bookingsData?.bookings;

  // const { mutate: createBooking } = api.booking.createBooking.useMutation({
  //   onSuccess: async () => {
  //     toast({
  //       title: 'Booking created.',
  //       description: "Booking created successfully",
  //       status: 'success',
  //       duration: 5000,
  //       isClosable: true,
  //     })
  //     await refetchBookings();
  //   },
  // });

  // const { mutate: updateBooking } = api.booking.editBooking.useMutation({
  //   onSuccess: async () => {
  //     toast({
  //       title: 'Booking updated.',
  //       description: "Booking updated successfully",
  //       status: 'success',
  //       duration: 5000,
  //       isClosable: true,
  //     })
  //     await refetchBookings();
  //   },
  // });

  const onCreate = (data: BookingFormValues) => {
    onCloseCreate();
    const { description, classroomId, day, time } = data;
    //TODO: convert time to number in bookingform
    const from = moment(day).add((Number(time) - UTC_OFFSET), 'hours').toDate();
    const to = moment(day).add(Number(time), 'hours').toDate();

    const bookingData = {
      from,
      to,
      classroomId,
      description: description || '',
    }

    // createBooking(bookingData);
  }

  const onEdit = (data: BookingFormValues) => {
    onCloseEdit();
    const { description, classroomId, day, time } = data;
    //TODO: convert time to number in bookingform
    const from = moment(day).add((Number(time) - UTC_OFFSET), 'hours').toDate();
    const to = moment(day).add(Number(time), 'hours').toDate();

    const bookingData = {
      from,
      to,
      classroomId,
      description: description || '',
    }

    // updateBooking({ ...bookingData, id: selectedBookingId as string });
  }


  function handleCellClick(date: Date, bookingId?: string): void {
    setSelectedDate(date);
    setSelectedBookingId(bookingId || null);
    bookingId ? onOpenEdit() : onOpenCreate();
  }

  if (isLoading)
    return <Spinner />

  if (!classroom)
    return <div>no classroom</div>

  return (
    <>
      <Flex direction='column'>
        <Heading>{classroom?.name}</Heading>
        <WeekSelector startDate={currentWeekStartingDate} onDateChange={setCurrentWeekStartingDate} />
        <Calendar days={days} onCellClick={handleCellClick} bookings={bookings || []} />
      </Flex>
      {selectedDate &&
        <CustomModal title='Create Booking'
          isOpen={isOpenCreate}
          onOpen={onOpenCreate}
          onClose={onCloseCreate}
          onSubmit={() => createBookingRef.current?._submit()}
          buttonLabel='Create Booking'
        >
          <BookingForm onSubmit={onCreate}
            ref={createBookingRef}
            classrooms={[{ id: classroom?.id, name: classroom?.name }]}
            defaultValues={{ classroomId: classroom.id, date: selectedDate, }}
          />
        </CustomModal>}
      {selectedDate && selectedBookingId &&
        <CustomModal title='Edit Booking'
          isOpen={isOpenEdit}
          onOpen={onOpenEdit}
          onClose={onCloseEdit}
          onSubmit={() => editBookingRef.current?._submit()}
          buttonLabel='Edit Booking'
        >
          {/* <BookingForm onSubmit={onEdit}
            ref={editBookingRef}
            classrooms={[{ id: classroom?.id, name: classroom?.name }]}
            defaultValues={{ classroomId: classroom.id, date: selectedDate, description: bookings?.find(b => b.id === selectedBookingId)?.description || '' }}
            isEdit
          /> */}
        </CustomModal>}
    </>
  )
}

const WeekSelector = ({ startDate, onDateChange }: { startDate: Date, onDateChange: (updatedDate: Date) => void }) => {
  return (
    <Flex justifyContent='center' padding='10' fontSize='3xl' alignItems='center'>
      <ArrowBackIcon boxSize='10' onClick={() => onDateChange(subtractDays(startDate, 7))} cursor='pointer' />
      Current week is: {moment(startDate).format('YYYY/MM/DD')} - {moment(startDate).add(LENGTH_OF_WEEK - 1, 'day').format('YYYY/MM/DD')}
      <ArrowForwardIcon boxSize='10' onClick={() => onDateChange(addDays(startDate, 7))} cursor='pointer' />
    </Flex>
  )
}

export default ClassroomShow;
