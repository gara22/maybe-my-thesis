import { Flex, Grid, GridItem, GridItemProps } from '@chakra-ui/react'
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import moment from 'moment';
import React, { ReactNode } from 'react'
import { BookingWithBooker } from '../../types/types';
import { END_HOUR, START_HOUR } from '../../utils/constants';
import { getHourOfDay, getHoursInterval, getNameOfDay } from '../../utils/dates';

export const Calendar = ({ days, onCellClick, bookings = [] }: { days: Date[]; onCellClick: (date: Date, bookingId?: string) => void, bookings: BookingWithBooker[] }) => {

  const hourInterval = getHoursInterval(START_HOUR, END_HOUR);

  // console.log(first)
  const daysWithHours = hourInterval.reduce<Date[]>((acc, hour) => {
    for (const day of days) {
      const item = moment(day).add(hour, 'hour').toDate();
      acc.push(item)
    }
    return acc;
  }, []);

  //TODO: rethink this, find more optimal solution
  const daysWithBookings = daysWithHours.map(day => {
    const bookingMatch = bookings.filter(b => {
      return getHourOfDay(b.from) === getHourOfDay(day) && getNameOfDay(b.from) === getNameOfDay(day)
    })
    return {
      date: day,
      booking: bookingMatch.length > 0 ? bookingMatch[0] : undefined,
    }
  })

  return (
    <Grid gridTemplateColumns={`repeat(${days.length + 1}, 1fr)`} gridTemplateRows={`repeat(${hourInterval.length} minmax(50px, 1fr))`}>
      <>
        <HeaderCell> </HeaderCell>
        {days.map(day => <HeaderCell key={moment(day).format('MM/dd')}><><span>{moment(day).format('dddd')}</span> <span>{moment(day).format('MM/DD')}</span></></HeaderCell>)}
        {hourInterval.map((hour, idx) => (<Cell
          bg='gray.700'
          gridColumn={1}
          gridRow={idx + 2}
          key={hour}>{`${hour}:00 - ${hour + 1}:00`}
        </Cell>))}
        {daysWithBookings.map(day => (
          <BookingCell booking={day.booking}
            onClick={() => onCellClick(day.date, day.booking?.id)}
            key={` ${getNameOfDay(day.date)} + ${getHourOfDay(day.date)}`}
            date={day.date}>
            <>
              <span>
                {day.booking ? day.booking.booker.name : 'free'}
              </span>
              <span>
                {day.booking?.description}

              </span>
            </>
          </BookingCell>))}
      </>
    </Grid>
  )
}

const Cell = ({ children, ...rest }: CellProps): ReactJSXElement => {
  return <GridItem height='120px' outlineColor={'gray.500'} outline='1px solid'{...rest}>
    <Flex height={'100%'} justifyContent='center' alignItems='center' flexDirection='column'>
      {children}
    </Flex>
  </GridItem>
}

const HeaderCell = ({ children }: { children: ReactNode }): ReactJSXElement => {
  return <Cell height='50px'>{children}</Cell>
}

const BookingCell = ({ children, booking, date, ...rest }: BookingCellProps): ReactJSXElement => {
  return <Cell bg={booking ? 'teal' : 'gray.600'} _hover={{ bg: 'gray.500', cursor: 'pointer' }} {...rest}>{children}</Cell>
}

interface CellProps extends GridItemProps {
  children: ReactNode;
}

interface BookingCellProps extends CellProps {
  booking?: BookingWithBooker;
  date: Date;

}