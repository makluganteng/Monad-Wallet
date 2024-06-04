import { Tabs, TabList, Tab, TabPanels, TabPanel, Button, Box, Text, Stack, Heading } from "@chakra-ui/react";
import { useState } from "react";
import {Navbar} from "../components/Navbar";

function MainPage() {
    const [balance, _setBalance] = useState(0.1706);
    const [usdBalance, _setUsdBalance] = useState(0.12);

    return (
        <>
        <Navbar />
        <Box p={4} bg="gray.900" color="white" minH="100vh">
            <Box textAlign="center" mb={4}>
                <Heading as="h1" size="2xl">{balance} MATIC</Heading>
                <Text fontSize="xl">${usdBalance} USD</Text>
            </Box>
            <Box textAlign="center" mb={8}>
                <Stack direction="row" spacing={4} justify="center">
                    <Button colorScheme='blue'>Send</Button>
                    <Button colorScheme='blue'>Swap</Button>
                </Stack>
            </Box>
            <Tabs isFitted>
                <TabList mb="1em">
                    <Tab>Tokens</Tab>
                    <Tab>NFTs</Tab>
                    <Tab>Activity</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <p>No tokens available</p>
                    </TabPanel>
                    <TabPanel>
                        <p>No NFTs available</p>
                    </TabPanel>
                    <TabPanel>
                        <p>No recent activity</p>
                    </TabPanel>
                </TabPanels>
            </Tabs>
            <Box textAlign="center" mt={8}>
                <Text>You have no transactions</Text>
                <Button colorScheme='blue' mt={4}>Monad Wallet support</Button>
            </Box>
        </Box>
        </>
    );
}

export default MainPage;
