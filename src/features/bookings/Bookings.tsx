import { Card, CardBody, Heading, Spinner, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import axios from 'axios'
import React from 'react'
import { Booking } from '../../types/Booking'
import moment from 'moment';
import { useLoaderData } from 'react-router-dom'

export const Bookings = () => {

  // const [bookings, setBookings] = useState<Booking[]>([])

  // console.log('booking render');

  const bookings = useLoaderData() as Booking[];
  // console.log(albums);



  // useEffect(() => {
  //   console.log('useeffeec');

  //   // (async () => {
  //   getFullBookings().then(fetchedBookings => setBookings(fetchedBookings)).catch(_err => setBookings([]));
  //   // setBookings(fetchedBookings)

  //   // })()

  // }, [])

  return (
    <Stack spacing='1'>
      {bookings.length > 0 ?
        (bookings.map(b => (
          <Card bg={useColorModeValue('gray.200', 'gray.600')} key={b._id} size='sm'>
            {/* <CardHeader>
            </CardHeader> */}
            <CardBody>
              <Heading size='xs' fontSize='xs'>{b.classroom.name}</Heading>
              <Text fontSize='xs' > {moment(b.from).format('YYYY/\MM/\DD HH:00')} -  {moment(b.to).format('HH:00')} {b.booked_by.name}</Text>
            </CardBody>
          </Card>
        )))
        : <Spinner />
      }
    </Stack>
  )
}
