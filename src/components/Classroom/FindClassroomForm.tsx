import React, { } from 'react'
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Stack,
  Switch,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { TIME_INTERVALS } from '../../utils/constants';
import moment from 'moment';

const schema = z.object({
  // classroomId: z.string().min(1, {
  //   message: "Must choose classroom!",
  // }),
  day: z.coerce.date(),
  time: z.coerce.number().min(1, {
    message: "Must choose time!",
  }),
  hasComputer: z.boolean()
});

export type FindClassroomFormProps = {
  onSubmit: (data: { day: Date; time: number; hasComputer: boolean }) => void;
}

export const FindClassroomForm = ({ onSubmit }: FindClassroomFormProps) => {
  const { register, handleSubmit, formState: { errors }, getValues } = useForm<{ day: Date; time: number; hasComputer: boolean }>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: {
      day: moment(new Date).format('YYYY-MM-DD').toString() as unknown as Date,
      time: 8,
    }
  });

  return (

    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={6}>
        <FormControl id="day" isInvalid={!!errors.day}>
          <FormLabel>day</FormLabel>
          {/* TODO: add default value to date input */}
          <Input
            placeholder="Select Date and Time"
            size="md"
            type='date'
            {...register('day')}
          />
          <FormErrorMessage>{errors.day?.message}</FormErrorMessage>
        </FormControl>
        <FormControl id="time" isInvalid={!!errors.time}>
          <FormLabel>time</FormLabel>
          <Select placeholder='Select option'  {...register('time')}>
            {
              TIME_INTERVALS.map(({ view, time }) => (
                <option key={time} value={time}>{view}</option>
              ))
            }
          </Select>
          <FormErrorMessage>{errors.time?.message}</FormErrorMessage>
        </FormControl>
        <FormControl id="hasComputer">
          <FormLabel>Has computers?</FormLabel>
          <Switch id='hasComputer' {...register('hasComputer')} />
        </FormControl>
        <Button type='submit'>
          search
        </Button>
      </Stack>
    </form>

  );
}

FindClassroomForm.displayName = 'FindClassroomForm'

export default FindClassroomForm;