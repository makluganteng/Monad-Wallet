import { Box, Flex, Text, Spacer, IconButton, Menu, MenuButton, MenuList, MenuItem, Avatar } from "@chakra-ui/react";
import { ChevronDownIcon, CopyIcon, SettingsIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { retrieveAddressChrome } from "../utils/chrome";

export const Navbar = () => {
    const [address,setAddress] = useState("");

    useEffect(()=>{
        const callFunction = async() => {
            const walletAddress =  await retrieveAddressChrome();
            if(!walletAddress) alert("Failed");
            setAddress(walletAddress);
        }
        callFunction();
    }, [])

    const truncate = (fullStr: any, strLen: any, separator: any) => {
        if (fullStr.length <= strLen) return fullStr;
    
        separator = separator || '...';
    
        const sepLen = separator.length,
              charsToShow = strLen - sepLen,
              frontChars = Math.ceil(charsToShow / 2),
              backChars = Math.floor(charsToShow / 2);
    
        return fullStr.substr(0, frontChars) + separator + fullStr.substr(fullStr.length - backChars);
      };

    return (
        <Box bg="gray.700" px={4} py={2}> {/* Adjusted the color to match the provided image */}
            <Flex alignItems="center">
                <Avatar size="sm" name="Account 3" bg="yellow.500" /> {/* Added background color to the avatar */}
                <Text ml={2} fontSize="sm" color="white">Account 3</Text>
                <ChevronDownIcon ml={2} color="white" />
                <Spacer />
                <Text fontSize="s" color="white">{truncate(address, 20 , "...")}</Text>
                <IconButton
                    aria-label="Copy address"
                    icon={<CopyIcon />}
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

