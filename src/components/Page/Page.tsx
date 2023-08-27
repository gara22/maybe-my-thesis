import { Flex, useColorModeValue } from '@chakra-ui/react'
import React, { ReactNode } from 'react'

export const Page = ({ children }: { children: ReactNode }) => {
  return (
    //TODO: change fix width later according to screen size -> maxwidth 1024? 
    <Flex direction='column' margin={'auto'} flexGrow={1} width={1024} padding={8} bg={useColorModeValue('gray.100', 'gray.700')} >
      { children}
    </Flex >
  )
}
