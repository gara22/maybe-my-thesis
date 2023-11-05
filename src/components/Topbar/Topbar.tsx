import { ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";

import {
  Box,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  Link,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useAuth, useUser, useClerk } from "@clerk/clerk-react";

const NavLink = ({ children, to }: { children: ReactNode; to: string }) => (
  <Link
    as={RouterLink}
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    to={to}
  >
    {children}
  </Link>
);

export default function Nav() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const { redirectToSignIn } = useClerk();

  return (
    <Box
      bg={useColorModeValue("gray.100", "gray.700")}
      px={4}
      shadow="md"
      zIndex={2}
      width="100%"
    >
      <Flex
        h={16}
        alignItems={"center"}
        justifyContent={"space-between"}
        maxWidth="1024px"
        margin={"auto"}
      >
        <Flex gap={10}>
          <NavLink to="/">home</NavLink>
          <NavLink to="/classrooms">classrooms</NavLink>
          <NavLink to="/bookings">bookings</NavLink>
          {/* <NavLink to='/admin'>
            admin
          </NavLink> */}
        </Flex>
        <Flex alignItems={"center"}>
          <Stack direction={"row"} spacing={7}>
            <Button onClick={toggleColorMode}>
              {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            </Button>

            {isSignedIn ? (
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  <Avatar
                    size={"sm"}
                    src={
                      user?.imageUrl ??
                      "https://avatars.dicebear.com/api/male/username.svg"
                    }
                  />
                </MenuButton>
                <MenuList alignItems={"center"}>
                  <br />
                  <Center>
                    <Avatar
                      size={"2xl"}
                      src={
                        user?.imageUrl ??
                        "https://avatars.dicebear.com/api/male/username.svg"
                      }
                    />
                  </Center>
                  <br />
                  <Center>
                    <p>{user?.firstName}</p>
                  </Center>
                  <br />
                  <MenuDivider />
                  <MenuItem>Your Servers</MenuItem>
                  <MenuItem>Account Settings</MenuItem>
                  <MenuItem onClick={() => void signOut()}>Logout</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Button onClick={() => redirectToSignIn()}>Log in</Button>
            )}
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
}
