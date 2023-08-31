import React, { PropsWithChildren } from 'react'

import {
  Box,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Modal,
  Button,
  Spacer,
  ButtonProps,
} from '@chakra-ui/react';
import { WithRequired } from '../../utils/types';

export type ModalProps = {
  isOpen: boolean;
  onClose: VoidFunction;
  onOpen: VoidFunction;
  onSubmit: VoidFunction;
  isSubmittable?: boolean;
  title: string;
  btnColor?: string;
  buttonLabel?: string;
  isLoading?: boolean;
  secondaryButton?: WithRequired<ButtonProps, 'title'>;
} & PropsWithChildren

export default function CustomModal({ isOpen, isLoading = false, onClose, children, title, onSubmit, isSubmittable = true, buttonLabel = 'Submit', secondaryButton }: ModalProps) {

  return (
    <Modal isOpen={isOpen} onClose={onClose} motionPreset={'scale'}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* {isLoading ? <Spinner /> :  */}
          <Box
            rounded={'lg'}
            boxShadow={'lg'}
            p={8}>
            {children}
          </Box >
        </ModalBody>

        <ModalFooter justifyContent={'flex-end'} gap={'5px'}>
          {secondaryButton && <Button {...secondaryButton} >{secondaryButton.title}</Button>}
          <Spacer />
          <Button bg='red.400' _hover={{
            bg: 'red.700',
          }} onClick={onClose} isDisabled={isLoading} >Cancel</Button>
          <Button type='submit' onClick={onSubmit} isLoading={isLoading} isDisabled={!isSubmittable}>
            {buttonLabel}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>

  );
}