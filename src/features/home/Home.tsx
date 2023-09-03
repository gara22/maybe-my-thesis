
import moment from "moment";
import { useState } from "react";
import { SimpleGrid, Card, Heading, CardBody, Button, Text, Spinner, Flex, ListItem, UnorderedList, Link } from "@chakra-ui/react";
import FindClassroomForm from "../../components/Classroom/FindClassroomForm";
import { Classroom, Booking } from "../../types/types";
import { useQuery } from "react-query";
import API from "../../utils/api";

type SearchParams = {
  from: Date;
  to: Date;
  hasComputer: boolean
}

export const Home = () => {

  const [inputs, setInputs] = useState<SearchParams & { enabled: boolean }>({ to: new Date(), from: new Date(), hasComputer: false, enabled: false })

  const getFreeClassrooms = async (): Promise<{ freeClassrooms: Classroom[] }> => {
    const { from, to, hasComputer } = inputs;
    return API.classrooms.getFreeClassrooms(from, to, hasComputer);
  };

  const { data: rooms, isLoading, refetch, isFetching } = useQuery(['freeClassrooms', inputs.from, inputs.to, inputs.hasComputer], getFreeClassrooms, { enabled: inputs.enabled, refetchOnWindowFocus: false, onSuccess: () => console.log('asd') });
  // const { data: rooms = [], isLoading, isFetching } = useQuery(''{ from: inputs.from, to: inputs.to, hasComputer: inputs.hasComputer }, { enabled: inputs.enabled, refetchOnWindowFocus: false, onSuccess: () => console.log('success') })


  const onQuery = (data: { day: Date; time: number; hasComputer: boolean }) => {
    console.log("🚀 ~ file: Home.tsx:34 ~ onQuery ~ time:", data)

    const { day, time, hasComputer } = data;
    //TODO: convert time to number in bookingform
    //TODO: investigate time zones. why do we need -2? 
    const from = moment(day).add(Number(time) - 2, 'hours').toDate();
    const to = moment(day).add(Number(time) - 1, 'hours').toDate();

    const bookingData = {
      from,
      to,
      hasComputer,
      enabled: true,
    }
    setInputs(bookingData);
    // refetch()
  }

  const classrooms = rooms?.freeClassrooms || []


  return (
    <>
      <Flex as={'main'} direction='column' gap='30px'>
        <FindClassroomForm onSubmit={onQuery} />
        <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(300px, 1fr))'>
          {/* TODO: don't show spinner when not fetching/loading */}
          {(isLoading || isFetching) ? <Spinner /> :
            classrooms.map(r => (
              //TODO add color for light mode too
              <Card bg='gray.600' key={r.id}>
                <CardBody>
                  <Heading size='md'>{r.name}</Heading>
                  <Text fontSize='xs'> {moment(inputs.from).format('YYYY/\MM/\DD HH:00')} -  {moment(inputs.to).format('HH:00')}</Text>
                  <UnorderedList fontSize='sm' paddingLeft='10px' paddingTop='10px'>
                    <ListItem>Capacity: {r.capacity}</ListItem>
                    <ListItem>Has computers:  {r.hasComputer ? 'Yes' : 'No'}</ListItem>
                  </UnorderedList>
                </CardBody>
                <Button>
                  <Link href={`/classrooms/${r.id}`} style={{ flexGrow: 1 }}>
                    View here
                  </Link>
                </Button>
              </Card>

            ))
          }
        </SimpleGrid>
      </Flex>
    </>
  );
};