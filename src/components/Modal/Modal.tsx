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
} from '@chakra-ui/react';

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
} & PropsWithChildren

export default function CustomModal({ isOpen, isLoading = false, onClose, children, title, onSubmit, isSubmittable = true, buttonLabel = 'Submit' }: ModalProps) {

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

        <ModalFooter>
          <Button bg='red.400' _hover={{
            bg: 'red.700',
          }} onClick={onClose} isDisabled={isLoading} >Cancel</Button>
          <Button ml={3} type='submit' onClick={onSubmit} isLoading={isLoading} isDisabled={!isSubmittable}>
            {buttonLabel}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>

  );
}