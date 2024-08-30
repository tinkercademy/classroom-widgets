import React, { useState } from 'react';
import axios from 'axios';
import QRCode from 'react-qr-code';
import { Box, Button, Input, Stack, Text, Heading, Flex } from '@chakra-ui/react'; // Import necessary Chakra UI components
import API_KEY from '../../secrets/shortioKey';
const BASE_URL = 'https://api.short.io/links'; // Correct endpoint for Short.io API requests

const ShortenLink: React.FC = () => {
  const [link, setLink] = useState<string>('');
  const [shortenedLink, setShortenedLink] = useState<string>('');
  const [qrCodeValue, setQrCodeValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleShortenLink = async () => {
    try {
      const response = await axios.post(
        BASE_URL,
        {
          originalURL: link,
          domain: "tk.sg" // Replace with your domain or remove if not needed
        },
        {
          headers: {
            authorization: API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('API Response:', response.data);

      if (response.data && response.data.secureShortURL) {
        setShortenedLink(response.data.secureShortURL);
        setQrCodeValue(response.data.secureShortURL);
        setError(null); // Clear any previous errors
      } else if (response.data && response.data.shortURL) {
        setShortenedLink(response.data.shortURL);
        setQrCodeValue(response.data.shortURL);
        setError(null); // Clear any previous errors
      } else {
        setError('Shortening the link failed. No valid URL received.');
      }
    } catch (err) {
      console.error('Error shortening the link:', err);
      setError('An error occurred while shortening the link. Please try again.');
    }
  };

  return (
    <Box
      width="400px"
      height="400px"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p="4"
      boxShadow="md"
      bg="white"
    >
      <Stack spacing={4} align="center"> {/* Reduced the spacing to 2 */}
        <Heading textColor="black" size="md">Shorten Your Link</Heading>
        <Input
          placeholder="Enter your link here"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          textColor={"black"}
        />
        <Button onClick={handleShortenLink} colorScheme="teal" width="full">
          Shorten Link
        </Button>

        {error && <Text color="red.500">{error}</Text>} {/* Display errors in red */}

        {shortenedLink && (
          <Box textAlign="center"> {/* Use a Box with textAlign center */}
            <Text textColor={"black"} >Your Shortened Link:</Text>
            <Text color="blue.500">
              <a href={shortenedLink} target="_blank" rel="noopener noreferrer">
                {shortenedLink}
              </a>
            </Text>
            <Flex justifyContent={"center"} mt={2}> {/* Add a small margin-top to create space between the link and QR code */}
              <QRCode value={qrCodeValue} size={128} /> {/* Set the QR code size to 128px */}
            </Flex>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default ShortenLink;
