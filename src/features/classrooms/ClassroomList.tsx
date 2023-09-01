import { Card, CardBody, Flex, Heading, Link, Spinner, Stack, Text, useColorModeValue, useDisclosure, useToast } from '@chakra-ui/react'
import { useRef, useState } from 'react'

import { DeleteIcon } from '@chakra-ui/icons';
import CustomModal from '../../components/Modal/Modal';
import DeleteBooking, { DeleteHandle } from '../../components/Booking/DeleteBooking';
import { SubmitFormType } from '../../components/Classroom/ClassroomForm';
import { Classroom } from '../../types/types';
import { useMutation, useQuery } from 'react-query';
import axios from 'axios';
import { useMutate } from '../../hooks/useMutate';
import API from '../../utils/api';

export const Classrooms = () => {

  const { isOpen: isOpenCreate, onOpen: onOpenCreate, onClose: onCloseCreate } = useDisclosure();
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();

  const [selectedClassroomId, setSelectedClassroomId] = useState('');


  const toast = useToast()

  const createClassroomRef = useRef<SubmitFormType>(null);
  const deleteClassroomRef = useRef<DeleteHandle>(null);

  // const classrooms: Classroom[] = [];

  const getClassrooms = async (): Promise<{ classrooms: Classroom[] }> => {
    const res = await fetch("http://localhost:8080/classrooms");
    return res.json();
  };

  const { mutate: createClassroom, isLoading: isCreateLoading } = useMutation((data: Pick<Classroom, 'name' | 'capacity' | 'hasComputer'>) => {
    const res = axios.post("http://localhost:8080/classrooms/new", data);
    return res;
  }, {
    onSuccess: async () => {
      toast({
        title: 'Classroom created.',
        description: "Classroom created successfully",
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      await refetch();
    },
    onError: (err: Error) => {
      toast({
        title: err.message,
        description: "Couldn't create classroom",
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    },
    onSettled: () => {
      onCloseCreate();
    }
  });

  const { data, isLoading, refetch } = useQuery('classrooms', getClassrooms);


  const { mutate: deleteClassroom, isLoading: isDeleteLoading } = useMutate(API.classrooms.deleteClassroom, { onSuccess: refetch, onSettled: () => onCloseDelete() }, {
    title: 'Classroom deleted.',
    description: "Classroom deleted successfully",
    status: 'info'
  }, { title: "Couldn't delete Classroom" })

  const onDelete = (id: string) => {
    deleteClassroom(id)
  }

  const onCreate = (data: Pick<Classroom, 'name' | 'capacity' | 'hasComputer'>) => {
    createClassroom(data);
  }



  const bg = useColorModeValue('gray.200', 'gray.600');

  return (
    <>
      <Stack spacing='2'>
        <h1>
          classrooms
        </h1>
        {/* <Button onClick={onOpenCreate} width='2xs'>New Classroom</Button> */}
        {isLoading ?
          <Spinner />
          :
          (data?.classrooms.map(c => (
            <Card bg={bg} key={c.id} size='sm'>
              <CardBody>
                <Heading size='xs' fontSize='md'><Link href={`/classrooms/${c.id}`}>{c.name}</Link></Heading>
                <Flex justifyContent='space-between' alignItems='center'>
                  <Flex gap='10px'>
                    <Text fontSize='xs' >Capacity: {c.capacity} </Text>
                    <Text fontSize='xs' > Has computers: {c.hasComputer ? 'Yes' : 'No'} </Text>
                  </Flex>
                  <DeleteIcon onClick={() => { setSelectedClassroomId(c.id); onOpenDelete() }} w={6} h={6} color="red.500" _hover={{ color: 'red.800', cursor: 'pointer' }} />
                </Flex>
              </CardBody>
            </Card>
          )))
        }
      </Stack>
      {/* <CustomModal title='Create Classroom' isLoading={isCreateLoading} isOpen={isOpenCreate} onOpen={onOpenCreate} onClose={onCloseCreate} onSubmit={() => createClassroomRef.current?._submit()} >
        <ClassroomForm onSubmit={onCreate} ref={createClassroomRef} isLoading={isCreateLoading} />
      </CustomModal> */}
      <CustomModal title='Delete Classroom' isLoading={isDeleteLoading} isOpen={isOpenDelete} onOpen={onOpenDelete} onClose={() => { setSelectedClassroomId(''); onCloseDelete() }} onSubmit={() => deleteClassroomRef.current?._delete()}>
        {/* TODO: make a general delete component */}
        <DeleteBooking onDelete={onDelete} bookingId={selectedClassroomId} ref={deleteClassroomRef} />
      </CustomModal>
    </>
  )
}
export default Classrooms;