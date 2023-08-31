import React, { forwardRef, useImperativeHandle } from 'react'
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Switch,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { Classroom } from '../../types/types';

const schema = z.object({
  name: z.string().min(3).max(20),
  capacity: z.coerce.number().int().positive().max(50),
  hasComputer: z.boolean(),
});

export type SubmitFormType = {
  _submit: VoidFunction;
}

export type ClassroomFormProps = {
  onSubmit: (data: Pick<Classroom, 'name' | 'capacity' | 'hasComputer'>) => void;
  isLoading?: boolean;
}

export const ClassroomForm = forwardRef<SubmitFormType, ClassroomFormProps>(({ onSubmit, isLoading = false }, ref) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Pick<Classroom, 'name' | 'capacity' | 'hasComputer'>>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
  });

  useImperativeHandle(ref, () => ({
    async _submit() {
      await handleSubmit(onSubmit)();
    }
  }));

  // console.log(errors)

  return (

    <form>
      <Stack spacing={6}>
        <FormControl isInvalid={!!errors.name} isDisabled={isLoading} id="name">
          <FormLabel>Name</FormLabel>
          <Input type="text" {...register('name')} />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.capacity} isDisabled={isLoading} id="capacity">
          <FormLabel>Capacity</FormLabel>
          <Input type="number" {...register('capacity')} />
          {errors.capacity && <FormErrorMessage>{errors.capacity.message}</FormErrorMessage>}
        </FormControl>
        <FormControl id="hasComputer" isDisabled={isLoading}>
          <FormLabel>Has computers?</FormLabel>
          <Switch id='email-alerts' {...register('hasComputer')} />
        </FormControl>
      </Stack>
    </form>

  );
})

ClassroomForm.displayName = 'ClassroomForm'

export default ClassroomForm;