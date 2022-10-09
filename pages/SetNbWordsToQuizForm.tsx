import { useState } from 'react';
import {
  Button,
  FormLabel,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react'


export default function SetNbWordsToQuizForm({setNbWordsToQuiz}) {

  const [nbWords, setNbWords] = useState(2)

  const isError = nbWords < 2

  return (
    <FormControl isInvalid={isError}>
      <NumberInput
        value={nbWords}
        onChange={(value) => setNbWords(value)}
        min={2}
        max={50}
        size='sm'
        width='auto'
        mt={5}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      {!isError ? (
        <FormHelperText style={{textAlign: "center"}}>
          Enter the number of words/expressions to practice
        </FormHelperText>
      ) : (
        <FormErrorMessage>Must be greater than or equal 2.</FormErrorMessage>
      )}
      <Button
        disabled={isError}
        mt={5}
        colorScheme='blue'
        onClick={() => setNbWordsToQuiz(nbWords)}
      >
        Continue
      </Button>
    </FormControl>
  );
}
