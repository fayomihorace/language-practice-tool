import { ChakraProvider } from '@chakra-ui/react'
import Main from './Main'

export default function HomePage() {

  return (
    <ChakraProvider>
      <Main />
    </ChakraProvider>
  );
}
