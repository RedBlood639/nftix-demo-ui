import { Button, Flex, Heading, Text, Box, useToast } from "@chakra-ui/react";
import QrReader from "react-qr-scanner";
import { useState, useEffect } from "react";
function CheckIn({ connectedContract }) {
  const toast = useToast();

  const [showScanner, setShowScanner] = useState(false);
  const [scannedAddress, setScannedAddress] = useState(null);
  const [hasTicket, setHasTicket] = useState(false);

  useEffect(() => {
    const confirmOwnership = async () => {
      try {
        if (!connectedContract) return;
        const res = await connectedContract.confirmOwnership(scannedAddress);

        setHasTicket(res);

        console.log(res);
      } catch (error) {
        console.log(error);
      }
    };

    if (scannedAddress) {
      confirmOwnership();
    }
  }, [connectedContract, scannedAddress]);

  return (
    <>
      <Heading mb={4}>Check In</Heading>
      {!showScanner && scannedAddress && hasTicket && (
        <>
          <Text fontSize="xl" mb="8">
            This wallet owns a NFTix!
          </Text>
          <Flex width="100%" justifyContent="center">
            <Button size="lg" colorScheme="teal">
              Check In
            </Button>
          </Flex>
        </>
      )}
      {!showScanner && (
        <>
          {!scannedAddress && (
            <Text fontSize="xl" mb="8">
              Scan Wallet address to verify ticket ownership and check-in.
            </Text>
          )}
          {scannedAddress && !hasTicket && (
            <Text fontSize="xl" mb="8">
              This wallet does not own a NFTix. Please try again.
            </Text>
          )}
          {!hasTicket && (
            <Flex width="100%" justifyContent="center">
              <Button
                size="lg"
                colorScheme="teal"
                onClick={() => setShowScanner(true)}
              >
                Scan QR
              </Button>
            </Flex>
          )}
        </>
      )}

      {showScanner && (
        <>
          <Box margin="16px auto 8px auto" padding="0 16px" width="360px">
            <QrReader
              delay={3000}
              style={{
                maxWidth: "100%",
                margin: "0 auto",
              }}
              onError={(error) => {
                console.log(error);
                toast({
                  title: "Failure!",
                  status: "error",
                  variant: "subtle",
                });
                setShowScanner(false);
              }}
              onScan={(data) => {
                if (!data) return;
                console.log(data);

                const address = data.text.split("ethereum:");
                setScannedAddress(address[1]);
                setShowScanner(false);
                toast({
                  title: "Captured address!",
                  description: `${address[1].slice(0, 6)}...${address[1].slice(
                    -4
                  )}`,
                  status: "success",
                  variant: "subtle",
                });
              }}
            />
          </Box>
          <Flex width="100%" justifyContent="center">
            <Button
              size="lg"
              colorScheme="teal"
              onClick={() => setShowScanner(false)}
            >
              Cancel
            </Button>
          </Flex>
        </>
      )}
    </>
  );
}

export default CheckIn;
