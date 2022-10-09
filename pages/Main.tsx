import { useState } from 'react';
import {
  Center,
  Container,
  Text,
  VStack,
} from '@chakra-ui/react'
import QuizForm from './QuizForm'
import SetNbWordsToQuizForm from './SetNbWordsToQuizForm'
import ManageWords from './ManageWords'


const HomePage = () => {
  const [nbWordsToQuiz, setNbWordsToQuiz] = useState(0)

  return (
    <Container pt={10}>
      <Center mt={10} mb={10}>
        <VStack>
          {<ManageWords />}
          <Text as='b' fontSize='3xl' color="blue">
            Simple english praticing tool
          </Text>
        </VStack>
      </Center>
      <Center style={{textAlign: "center"}}>
        {
          nbWordsToQuiz
            ? <QuizForm
                nbWordsToQuiz={nbWordsToQuiz}
                setNbWordsToQuiz={setNbWordsToQuiz}
              />
            : <SetNbWordsToQuizForm
                setNbWordsToQuiz={setNbWordsToQuiz}
              />
        }
      </Center>
    </Container>
  );
}

export default HomePage;
