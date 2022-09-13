import { useState } from "react";
import {
  Button,
  ButtonGroup,
  Heading,
  Text,
  Flex,
  useToast,
} from "@chakra-ui/react";
import { useEffect } from "react";

function Buy({ connectedContract }) {
  const toast = useToast();

  const [totalTicketCount, settotalTicketCount] = useState(null);
  const [availableTicketCount, setavailableTicketCount] = useState(null);
  const [buyTxnPending, setBuyTxnPending] = useState(false);

  useEffect(() => {
    if (!connectedContract) return;
    getAavailableTicketCount();
    getTotalTicketCount();
  });

  const buyTicket = async () => {
    try {
      if (!connectedContract) return;
      setBuyTxnPending(true);
      const buyTxn = await connectedContract.mint({
        value: `${0.08 * 10 ** 18}`,
      });
      await buyTxn.wait();
      setBuyTxnPending(false);
      toast({
        status: "success",
        title: "Success!",
        variant: "subtle",
        description: (
          <a
            href={`https://rinkeby.etherscan.io/tx/${buyTxn.hash}`}
            target="_blank"
            rel="nofollow noreferrer"
          >
            Checkout the transaction on Etherscan
          </a>
        ),
      });
    } catch (error) {
      console.log(error);
      setBuyTxnPending(false);
      toast({
        status: "error",
        title: "Failure",
        variant: "subtle",
      });
    }
  };

  const getAavailableTicketCount = async () => {
    try {
      const count = await connectedContract.availableTicketCount();
      setavailableTicketCount(count.toNumber());
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalTicketCount = async () => {
    try {
      const count = await connectedContract.totalTicketCount();
      settotalTicketCount(count.toNumber());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Heading mb={4}>DevDAO Conference 2022</Heading>
      <Text fontSize="xl" mb={4}>
        Connect your wallet to mint your NFT. It'll be your ticket to get in!
      </Text>
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        margin="0 auto"
        maxW="140px"
      >
        <ButtonGroup mb={4}>
          <Button
            loadingText="Pending"
            size="lg"
            colorScheme="teal"
            isLoading={buyTxnPending}
            onClick={buyTicket}
          >
            Buy Ticket
          </Button>
        </ButtonGroup>
        {availableTicketCount && totalTicketCount && (
          <Text>
            {availableTicketCount} of {totalTicketCount} minted !
          </Text>
        )}
      </Flex>
    </>
  );
}

export default Buy;
