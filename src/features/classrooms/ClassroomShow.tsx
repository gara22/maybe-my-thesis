import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { Flex, Heading, Spinner, useDisclosure } from '@chakra-ui/react'
import { useUser } from '@clerk/clerk-react';
import dayjs from 'dayjs';
import { useRef, useState } from 'react'
import { useQuery } from 'react-query';
import { useParams, useSearchParams } from 'react-router-dom';
import BookingForm, { BookingFormValues, SubmitHandle } from '../../components/Booking/BookingForm';
import DeleteBooking, { DeleteHandle } from '../../components/Booking/DeleteBooking';
import { Calendar } from '../../components/Calendar/Calendar'
import CustomModal from '../../components/Modal/Modal';
import { useMutate } from '../../hooks/useMutate';
import { Booking, BookingWithBooker } from '../../types/types';
import API from '../../utils/api';
import { LENGTH_OF_WEEK, USER_ID, UTC_OFFSET } from '../../utils/constants';
import { addDays, getDays, subtractDays } from '../../utils/dates';

//TODO: move this from here
export type BookingParams = Pick<Booking, 'from' | 'to' | 'classroomId' | 'description' | 'bookerId'>;


const ClassroomShow = () => {
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get('date');
  const startMoment = dayjs(dateParam).isValid() ? dayjs(dateParam) : dayjs();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null)
  const [currentWeekStartingDate, setCurrentWeekStartingDate] = useState<Date>(startMoment.startOf('week').toDate());
  const { id } = useParams();
  //TODO: not sure if this is the right approach
  const { user } = useUser();

  // const { data: classroom, isLoading, refetch } = api.classroom.getClassroomById.useQuery({ id } as { id: string });

  const { isOpen: isOpenCreate, onOpen: onOpenCreate, onClose: onCloseCreate } = useDisclosure();
  const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure();
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();
  const days = getDays(currentWeekStartingDate, LENGTH_OF_WEEK);

  const createBookingRef = useRef<SubmitHandle>(null);
  const editBookingRef = useRef<SubmitHandle>(null);
  const deleteBookingRef = useRef<DeleteHandle>(null);

  const getBookings = async (): Promise<{ bookings: BookingWithBooker[] }> => {
    const from = days[0];
    const to = dayjs(days[days.length - 1]).endOf('day').toDate();
    return API.bookings.getBookings(from, to, id as string)
  };

  const { data: classroomData, isLoading, refetch } = useQuery(['classroom', id], () => API.classrooms.getClassroomById(id as string), { refetchOnWindowFocus: false });
  const { data: bookingsData, isLoading: isBookingsLoading, refetch: refetchBookings } = useQuery(['bookings', days], getBookings, { refetchOnWindowFocus: false });
  const classroom = classroomData?.classroom;
  const bookings = bookingsData?.bookings;

  const { mutate: createBooking, isLoading: isCreateLoading } = useMutate<BookingParams>(API.bookings.createBooking, { onSuccess: refetchBookings, onSettled: onCloseCreate }, {
    title: 'Booking created', description: "Booking created successfully"
  }, { title: "Couldn't create booking" });

  const { mutate: editBooking, isLoading: editLoading, } = useMutate<Pick<Booking, 'id' | 'description'>>(API.bookings.editBooking,
    { onSettled: onCloseEdit, onSuccess: refetchBookings },
    { title: 'Booking updated.', description: 'Booking updated successfully' }, {
    title: "Couldn't update booking"
  });

  const { mutate: deleteBooking, isLoading: isDeleteLoading } = useMutate(API.bookings.deleteBooking, { onSuccess: refetchBookings, onSettled: () => { onCloseEdit(), onCloseDelete() } }, {
    title: 'Booking deleted.',
    description: "Booking deleted successfully",
    status: 'info'
  }, { title: "Couldn't delete booking" })

  const onCreate = (data: BookingFormValues) => {
    const { description, classroomId, day, time } = data;
    //TODO: convert time to number in bookingform
    const from = dayjs(day).add((Number(time) - UTC_OFFSET), 'hours').toDate();
    const to = dayjs(day).add(Number(time), 'hours').toDate();

    const bookingData = {
      from,
      to,
      classroomId,
      description: description || '',
      bookerId: user?.id as string,
    }

    createBooking(bookingData);
  }

  const onEdit = (data: BookingFormValues) => {
    const { description, classroomId, day, time } = data;
    //TODO: convert time to number in bookingform
    const from = dayjs(day).add((Number(time) - UTC_OFFSET), 'hours').toDate();
    const to = dayjs(day).add(Number(time), 'hours').toDate();

    const bookingData = {
      from,
      to,
      classroomId,
      description: description || '',
    }

    editBooking({ ...bookingData, id: selectedBookingId as string })
  }

  const onDelete = (id: string) => {
    deleteBooking(id);
  }



  function handleCellClick(date: Date, bookingId?: string): void {
    setSelectedDate(date);
    setSelectedBookingId(bookingId || null);
    bookingId ? onOpenEdit() : onOpenCreate();
  }

  const deleteButtonProps = {
    bg: 'red.700 ',
    color: 'grey.400',
    title: 'Delete Booking',
    onClick: () => onOpenDelete(),
    isDisabled: (editLoading || isDeleteLoading),
    _hover: {
      bg: 'red.900',
    },
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
          isLoading={isCreateLoading}
        >
          <BookingForm onSubmit={onCreate}
            ref={createBookingRef}
            classrooms={[{ id: classroom?.id, name: classroom?.name }]}
            defaultValues={{ classroomId: classroom.id, date: selectedDate, }}
            isLoading={isCreateLoading}
          />
        </CustomModal>}
      {selectedDate && selectedBookingId &&
        <CustomModal title='Edit Booking'
          isOpen={isOpenEdit}
          onOpen={onOpenEdit}
          onClose={onCloseEdit}
          onSubmit={() => editBookingRef.current?._submit()}
          buttonLabel='Edit Booking'
          isLoading={editLoading || isDeleteLoading}
          secondaryButton={deleteButtonProps}
        >
          <BookingForm onSubmit={onEdit}
            ref={editBookingRef}
            classrooms={[{ id: classroom?.id, name: classroom?.name }]}
            defaultValues={{ classroomId: classroom.id, date: selectedDate, description: bookings?.find(b => b.id === selectedBookingId)?.description || '' }}
            isEdit
            isLoading={editLoading || isDeleteLoading}
          />
        </CustomModal>}
      <CustomModal title='Delete Booking' isLoading={isDeleteLoading} isOpen={isOpenDelete} onOpen={onOpenDelete} onClose={() => { setSelectedBookingId(''); onCloseDelete() }} onSubmit={() => deleteBookingRef.current?._delete()}>
        <DeleteBooking onDelete={onDelete} bookingId={selectedBookingId as string} ref={deleteBookingRef} />
      </CustomModal>
    </>
  )
}

const WeekSelector = ({ startDate, onDateChange }: { startDate: Date, onDateChange: (updatedDate: Date) => void }) => {
  return (
    <Flex justifyContent='center' padding='10' fontSize='3xl' alignItems='center'>
      <ArrowBackIcon boxSize='10' onClick={() => onDateChange(subtractDays(startDate, 7))} cursor='pointer' />
      Current week is: {dayjs(startDate).format('YYYY/MM/DD')} - {dayjs(startDate).add(LENGTH_OF_WEEK - 1, 'day').format('YYYY/MM/DD')}
      <ArrowForwardIcon boxSize='10' onClick={() => onDateChange(addDays(startDate, 7))} cursor='pointer' />
    </Flex>
  )
}

export default ClassroomShow;
