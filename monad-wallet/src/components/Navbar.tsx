import { Box, Flex, Text, Spacer, IconButton, Menu, MenuButton, MenuList, MenuItem, Avatar } from "@chakra-ui/react";
import { ChevronDownIcon, CopyIcon, SettingsIcon } from "@chakra-ui/icons";

export const Navbar = () => {
    return (
        <Box bg="gray.700" px={4} py={2}> {/* Adjusted the color to match the provided image */}
            <Flex alignItems="center">
                <Avatar size="sm" name="Account 3" bg="yellow.500" /> {/* Added background color to the avatar */}
                <Text ml={2} fontSize="lg" color="white">Account 3</Text>
                <ChevronDownIcon ml={2} color="white" />
                <Spacer />
                <Text fontSize="sm" color="white">0xcA518...31e70</Text>
                <IconButton
                    aria-label="Copy address"
                    icon={<CopyIcon />}
                    size="sm"
                    variant="ghost"
                    colorScheme="whiteAlpha"
                    ml={2}
                />
                <IconButton
                    aria-label="Settings"
                    icon={<SettingsIcon />}
                    size="sm"
                    variant="ghost"
                    colorScheme="whiteAlpha"
                    ml={2}
                />
                <Menu>
                    <MenuButton
                        as={IconButton}
                        aria-label="Options"
                        icon={<SettingsIcon />}
                        variant="ghost"
                        size="sm"
                        colorScheme="whiteAlpha"
                        ml={2}
                    />
                    <MenuList>
                        <MenuItem>Profile</MenuItem>
                        <MenuItem>Settings</MenuItem>
                        <MenuItem>Log out</MenuItem>
                    </MenuList>
                </Menu>
            </Flex>
        </Box>
    );
}

