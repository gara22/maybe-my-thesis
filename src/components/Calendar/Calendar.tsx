import { Flex, Grid, GridItem, GridItemProps, Spinner } from "@chakra-ui/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import dayjs, { Dayjs } from "dayjs";
import React, { ReactNode } from "react";
import { BookingWithBooker } from "../../types/types";
import { END_HOUR, START_HOUR } from "../../utils/constants";
import {
  getHourOfDay,
  getHoursInterval,
  getNameOfDay,
} from "../../utils/dates";

export const Calendar = ({
  days,
  onCellClick,
  bookings = [],
  isLoading = false,
}: {
  days: Dayjs[];
  onCellClick: (date: Dayjs, bookingId?: string) => void;
  bookings: BookingWithBooker[];
  isLoading: boolean;
}) => {
  const hourInterval = getHoursInterval(START_HOUR, END_HOUR);

  // console.log(first)
  const daysWithHours = hourInterval.reduce<Dayjs[]>((acc, hour) => {
    for (const day of days) {
      const item = dayjs.utc(day).add(hour, "hour");
      acc.push(item);
    }
    return acc;
  }, []);

  //TODO: rethink this, find more optimal solution
  const daysWithBookings = daysWithHours.map((day) => {
    const bookingMatch = bookings.filter((b) => {
      return (
        getHourOfDay(dayjs.utc(b.from)) === getHourOfDay(day) &&
        getNameOfDay(dayjs.utc(b.from)) === getNameOfDay(day)
      );
    });
    return {
      date: day,
      booking: bookingMatch.length > 0 ? bookingMatch[0] : undefined,
    };
  });

  return (
    <Grid
      gridTemplateColumns={`repeat(${days.length + 1}, 1fr)`}
      gridTemplateRows={`repeat(${hourInterval.length} minmax(50px, 1fr))`}
    >
      <>
        <HeaderCell> </HeaderCell>
        {days.map((day) => (
          <HeaderCell key={dayjs(day).format("MM/dd")}>
            <>
              <span>{dayjs(day).format("dddd")}</span>{" "}
              <span>{dayjs(day).format("MM/DD")}</span>
            </>
          </HeaderCell>
        ))}
        {hourInterval.map((hour, idx) => (
          <Cell bg="gray.700" gridColumn={1} gridRow={idx + 2} key={hour}>
            {`${hour}:00 - ${hour + 1}:00`}
          </Cell>
        ))}
        {daysWithBookings.map((day) => (
          <BookingCell
            booking={day.booking}
            onClick={() => {
              if (!isLoading) onCellClick(day.date, day.booking?.id);
            }}
            key={` ${getNameOfDay(day.date)} + ${getHourOfDay(day.date)}`}
            date={day.date}
            isDisabled={isLoading}
            isLoading={isLoading}
          >
            <>
              <span>{day.booking ? day.booking.booker.username : "free"}</span>
              <span>{day.booking?.description}</span>
            </>
          </BookingCell>
        ))}
      </>
    </Grid>
  );
};

const Cell = ({
  children,
  isDisabled,
  isLoading,
  ...rest
}: CellProps): ReactJSXElement => {
  const disabledStyles = isDisabled
    ? {
        _hover: { cursor: "not-allowed" },
        opacity: isDisabled ? 0.5 : 1,
      }
    : {};
  return (
    <GridItem
      height="120px"
      outlineColor={"gray.500"}
      outline="1px solid"
      {...rest}
      {...disabledStyles}
    >
      <Flex
        height={"100%"}
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        {isLoading ? <Spinner /> : children}
      </Flex>
    </GridItem>
  );
};

const HeaderCell = ({ children }: { children: ReactNode }): ReactJSXElement => {
  return <Cell height="50px">{children}</Cell>;
};

const BookingCell = ({
  children,
  booking,
  date,
  ...rest
}: BookingCellProps): ReactJSXElement => {
  return (
    <Cell
      bg={booking ? "teal" : "gray.600"}
      _hover={{ bg: "gray.500", cursor: "pointer" }}
      {...rest}
    >
      {children}
    </Cell>
  );
};

interface CellProps extends GridItemProps {
  children: ReactNode;
  isDisabled?: boolean;
  isLoading?: boolean;
}

interface BookingCellProps extends CellProps {
  booking?: BookingWithBooker;
  date: Dayjs;
}
