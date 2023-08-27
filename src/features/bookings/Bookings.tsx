import { Button, Card, CardBody, Flex, Heading, Spinner, Stack, Text, useColorModeValue, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import moment from 'moment';
import BookingForm, { BookingFormValues, SubmitHandle } from '../../components/Booking/BookingForm';
import { DeleteIcon } from '@chakra-ui/icons';
import DeleteBooking, { DeleteHandle } from '../../components/Booking/DeleteBooking';
import CustomModal from '../../components/Modal/Modal';
import { Booking, BookingWithAllData, Classroom } from '../../types/types';
import { useQuery } from 'react-query';

export const Bookings = () => {

  const { isOpen: isOpenCreate, onOpen: onOpenCreate, onClose: onCloseCreate } = useDisclosure();
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();

  const [selectedBookingId, setSelectedBookingId] = useState('');
  const toast = useToast()


  const createBookingRef = useRef<SubmitHandle>(null);
  const deleteBookingRef = useRef<DeleteHandle>(null);

  // const bookings: BookingWithAllData[] = [];
  const classrooms: Classroom[] = []

  //TODO: get userid from session
  const userId = 'clfpmmvmg0000un2o7wq3s4ms';

  const getClassrooms = async (): Promise<{ classrooms: Classroom[] }> => {
    const res = await fetch("http://localhost:8080/classrooms");
    return res.json();
  };


  const getBookingsOfUser = async (): Promise<{ bookings: BookingWithAllData[] }> => {
    const res = await fetch(`http://localhost:8080/bookings/user?userId=${userId}`);
    return res.json();
  };




  //TODO: fetching runs unnecessarily when either creating or deleting
  const { data, isLoading, refetch } = useQuery('bookings', getBookingsOfUser);
  // const { data: classrooms = [] } = api.classroom.getAllClassrooms.useQuery();
  // const { mutate: deleteBooking } = api.booking.deleteBooking.useMutation({
  //   onSuccess: async () => {
  //     toast({
  //       title: 'Booking deleted.',
  //       description: "Booking deleted successfully",
  //       status: 'info',
  //       duration: 5000,
  //       isClosable: true,
  //     })
  //     await refetch();
  //   },
  // });

  // const { mutate: createBooking } = api.booking.createBooking.useMutation({
  //   onSuccess: async () => {
  //     toast({
  //       title: 'Booking created.',
  //       description: "Booking created successfully",
  //       status: 'success',
  //       duration: 5000,
  //       isClosable: true,
  //     })
  //     await refetch();
  //   },
  // });

  const onCreate = (data: BookingFormValues) => {
    onCloseCreate();
    const { description, classroomId, day, time } = data;
    //TODO: convert time to number in bookingform
    const from = moment(day).add((Number(time) - 1), 'hours').toDate();
    const to = moment(day).add(Number(time), 'hours').toDate();

    const bookingData = {
      from,
      to,
      classroomId,
      description: description || '',
    }

    // createBooking(bookingData);
  }


  const onDelete = (id: string) => {
    onCloseDelete()
    // deleteBooking(id);
  }

  const bg = useColorModeValue('gray.200', 'gray.600');

  return (
    <>
      <Stack spacing='2'>
        <h1>
          my bookings
        </h1>
        <Button onClick={onOpenCreate} width='2xs'>New Booking</Button>
        {isLoading ?
          <Spinner />
          :
          (data?.bookings.map(b => (
            <Card bg={bg} key={b.id} size='sm'>
              <CardBody>
                <Heading size='xs' fontSize='md'>{b.classroom.name}</Heading>
                <Flex justifyContent='space-between' alignItems='center'>
                  <Flex gap='10px'>
                    <Text fontSize='xs' > {moment(b.from).format('YYYY/\MM/\DD HH:00')} -  {moment(b.to).format('HH:00')} {b.booker.name}</Text>
                    <Text fontSize='xs' > {b.description}</Text>
                  </Flex>
                  <DeleteIcon onClick={() => { setSelectedBookingId(b.id); onOpenDelete() }} w={6} h={6} color="red.500" _hover={{ color: 'red.800', cursor: 'pointer' }} />
                </Flex>
              </CardBody>
            </Card>
          )))
        }
      </Stack>
      <CustomModal title='Create Booking' isOpen={isOpenCreate} onOpen={onOpenCreate} onClose={onCloseCreate} onSubmit={() => createBookingRef.current?._submit()} >
        <BookingForm onSubmit={onCreate} ref={createBookingRef} classrooms={classrooms.map(c => ({ id: c.id, name: c.name }))} />
      </CustomModal>
      <CustomModal title='Delete Booking' isOpen={isOpenDelete} onOpen={onOpenDelete} onClose={() => { setSelectedBookingId(''); onCloseDelete() }} onSubmit={() => deleteBookingRef.current?._delete()}>
        <DeleteBooking onDelete={onDelete} bookingId={selectedBookingId} ref={deleteBookingRef} />
      </CustomModal>
    </>
  )
}
export default Bookings;