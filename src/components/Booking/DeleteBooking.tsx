import React, { forwardRef, useImperativeHandle } from 'react'

import {
  Flex,
  Box,
  Stack,
} from '@chakra-ui/react';

export type DeleteBookingProps = {
  onDelete: (id: string) => void;
  bookingId: string;
}

export type DeleteHandle = {
  _delete: VoidFunction;
}

export const DeleteBooking = forwardRef<DeleteHandle, DeleteBookingProps>(({ onDelete, bookingId }, ref) => {

  useImperativeHandle(ref, () => ({
    _delete() {
      onDelete(bookingId);
    }
  }));

  return (

    <Stack spacing={6}>
      <Box>
        Are you sure you wanna delete booking # {bookingId} ?
      </Box>
      <Flex justifyContent={'space-between'}>
      </Flex>
    </Stack>

  );
});

DeleteBooking.displayName = 'DeleteBooking'

export default DeleteBooking;