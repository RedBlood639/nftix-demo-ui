import { Button, Flex, Heading, Text, useToast } from "@chakra-ui/react";
import { useState } from "react";

function Admin({ isOwner, connectedContract }) {
  const [openSaleTxnPending, setopenSaleTxnPending] = useState(false);
  const [closeSaleTxnPending, setcloseSaleTxnPending] = useState(false);

  const toast = useToast();

  const closeSale = async () => {
    try {
      if (!connectedContract) return;
      setcloseSaleTxnPending(true);
      let closeSaleTxn = await connectedContract.closeSale();
      await closeSaleTxn.wait();
      setcloseSaleTxnPending(false);
      toast({
        status: "success",
        title: "Sale is close!",
        variant: "subtle",
        description: (
          <a
            href={`https://rinkeby.etherscan.io/tx/${closeSaleTxn.hash}`}
            target="_blank"
            rel="nofollow noreferrer"
          >
            Checkout the transaction on Etherscan
          </a>
        ),
      });
    } catch (error) {
      console.log(error);
      setcloseSaleTxnPending(false);
      toast({
        status: "error",
        title: "Failure",
        variant: "subtle",
      });
    }
  };

  const openSale = async () => {
    try {
      if (!connectedContract) return;
      setopenSaleTxnPending(true);
      let openSaleTxn = await connectedContract.openSale();
      await openSaleTxn.wait();
      setopenSaleTxnPending(false);
      toast({
        status: "success",
        title: "Sale is open!",
        variant: "subtle",
        description: (
          <a
            href={`https://rinkeby.etherscan.io/tx/${openSaleTxn.hash}`}
            target="_blank"
            rel="nofollow noreferrer"
          >
            Checkout the transaction on Etherscan
          </a>
        ),
      });
    } catch (err) {
      console.log(err);
      setopenSaleTxnPending(false);
      toast({
        status: "error",
        title: "Failure",
        variant: "subtle",
      });
    }
  };

  return (
    <>
      <Heading mb={4}>Admin panel</Heading>
      <Text fontSize="xl" mb={8}>
        Enable and disable sales on the smart contract.
      </Text>
      <Flex width="100%" justifyContent="center">
        <Button
          size="lg"
          colorScheme="teal"
          isDisabled={!isOwner || closeSaleTxnPending}
          onClick={openSale}
          isLoading={openSaleTxnPending}
        >
          Open Sale
        </Button>
        <Button
          size="lg"
          colorScheme="red"
          variant="solid"
          marginLeft="24px"
          onClick={closeSale}
          isLoading={closeSaleTxnPending}
          isDisabled={!isOwner || openSaleTxnPending}
        >
          Close Sale
        </Button>
      </Flex>
    </>
  );
}

export default Admin;
