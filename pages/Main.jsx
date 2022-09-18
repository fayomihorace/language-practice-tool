import { useState } from 'react';
import {
  Center,
  Container,
  Text,
  VStack,
  Button,
  FormControl,
  FormLabel,
  Input,
  Badge,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react'
import {LOCAL_STORAGE_NAME} from '../consts'
import initWordsDataset from '../words'
import Timer from './Timer'
import WordDetails from './WordDetails';
import LoadWords from './LoadWords'

const DEFAULT_GOOD_ANSWER_SCORE = 5
const TIME_PER_WORD_SECONDS = 5000
const DEFAULT_WRONG_ANSWER_MESSAGE = 'Wrong answer'

export default function HomePage() {
  const [WORDS, setWords] = useState({})

  if (typeof window !== 'undefined') {
    if (Object.keys(WORDS).length === 0) {
      let wordsStr = localStorage.getItem(LOCAL_STORAGE_NAME)
      if (!wordsStr) {
        wordsStr = initWordsDataset
        localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(wordsStr))
        setWords(wordsStr)
      } else {
        setWords(JSON.parse(wordsStr))
      }
    }
  }

  const [wrongAnswerMsg, setWrongAnswerMsg] = useState(DEFAULT_WRONG_ANSWER_MESSAGE)
  const [quizTimeoutToClear, setQuizTimeoutToClear] = useState(null)
  const [quizHasStarted, setQuizHasStarted] = useState(false)
  const [quizCounter, setQuizCounter] = useState(0)
  const [goodAnswersCount, setGoodAnswersCount] = useState(0)
  const [quizQuestionSetIdx, setQuizQuestionSetIdx] = useState([])
  const [nbWordsToQuiz, setNbWordsToQuiz] = useState(2)

  const [answered, setCurrentQuestionAnswered] = useState(false)
  const [answer, setCurrentQuestionAnswer] = useState('')
  const [currentQuestionTime, setCurrentQuestionTime] = useState(0)
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)

  const [quizHasEnded, setQuizHasEnded] = useState(false)
  const quizIsEnded = () => quizCounter === quizQuestionSetIdx.length - 1
  const endQuiz = () => {
    setQuizHasEnded(true)
    localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(WORDS))
  }

  const handleCurrentQuestionAnswerChange = (event) => {
    setCurrentQuestionAnswer(event.target.value)
  }

  const [answerInputRef, setAnswerInputRef] = useState(null)
  const focusAnswerInput = () => {
    answerInputRef.focus()
  }
  const setAnswerInputRefCallback = (val) => {
    setAnswerInputRef(val)
    if (answerInputRef) answerInputRef.focus()
  }

  const startQuiz = () => {
    // sort words by score
    let wordsArray = []
    Object.keys(WORDS).forEach(wordIdx => {
      wordsArray.push(WORDS[wordIdx])
    })
    wordsArray.sort((a, b) => a.score - b.score)

    setQuizQuestionSetIdx(wordsArray.slice(0, nbWordsToQuiz))
    setQuizHasStarted(true)
    setQuizHasEnded(false)
    handleTimeQuestionHasElpsed()
  }

  const answerCurrentQuestion = () => {
    if (quizTimeoutToClear) {
      clearTimeout(quizTimeoutToClear)
    }
    let currentWord = WORDS[currentQuestionIdx]
    currentWord.learnCount += 1

    if (currentWord.meanings.includes(answer.toLowerCase())) {
      currentWord.score += DEFAULT_GOOD_ANSWER_SCORE
      setGoodAnswersCount(goodAnswersCount + 1)
    }

    setCurrentQuestionAnswered(true)
    setCurrentQuestionTime(0)
  }

  const handleTimeQuestionHasElpsed = () => {
    let currentWord = WORDS[currentQuestionIdx]
    let wordTime = currentWord.text.split(' ').length * TIME_PER_WORD_SECONDS
    setCurrentQuestionTime(wordTime)
    let timeout = setTimeout(() => {
      setWrongAnswerMsg('Time elapsed')
      answerCurrentQuestion()
    }, wordTime)
    setQuizTimeoutToClear(timeout)
  }

  const gotToNextQuestion = () => {
    setQuizCounter(quizCounter + 1)
    if (quizIsEnded()) {
      endQuiz()
    }
    else {
      setCurrentQuestionIdx(currentQuestionIdx + 1)
      setCurrentQuestionAnswer('')
      setCurrentQuestionAnswered(false)
      setWrongAnswerMsg(DEFAULT_WRONG_ANSWER_MESSAGE)
      handleTimeQuestionHasElpsed()
      focusAnswerInput()
    }
  }

  const resetQuiz = () => {
    setQuizCounter(0)
    setQuizQuestionSetIdx([])
    setQuizHasStarted(false)
    setQuizHasEnded(false)
    setCurrentQuestionAnswered(false)
    setCurrentQuestionAnswer('')
  }

  const ResetButton = () => (
    <Button
      colorScheme='orange'
      onClick={resetQuiz}
      size='sm'
      style={{marginTop: "40px"}}
    >
      End
    </Button>
  )

  const getScore = () => goodAnswersCount / nbWordsToQuiz * 100
  const getScoreLabel = () => {
    let score = getScore()
    if (score === 100) return {text: "Perfect", color: "green"}
    else if (score > 90) return {text: "Excellent", color: "green"}
    else if (score > 80) return {text: "Very Good job", color: "green"}
    else if (score > 70) return {text: "Good", color: "green"}
    else if (score > 60) return {text: "Average", color: "yellow"}
    else if (score > 50) return {text: "fair", color: "orange"}
    else if (score > 25) return {text: "Bad", color: "red"}
    else return {text: "Very bad", color: "red"}
  }

  return (
    <Container pt={10}>
      <Center mt={10}>
        <VStack>
          <LoadWords />
          <Text as='b' fontSize='3xl' color="blue">
            Simple english praticing tool
          </Text>
        </VStack>
      </Center>
      <Center style={{textAlign: "center"}}>
        {
          !quizHasStarted ?
          <FormControl >
            <FormLabel style={{textAlign: "center"}}>
              Enter the number of words to practice
            </FormLabel>
            <NumberInput
              value={nbWordsToQuiz}
              onChange={(value) => setNbWordsToQuiz(value)}
              min={1}
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
            <br />
            <Button
              colorScheme='blue'
              onClick={startQuiz}
            >
              Start the quiz
            </Button>
          </FormControl>
          : (
            !quizHasEnded
              ?
                <FormControl>
                  <VStack>
                    <ResetButton />
                    <Timer timeSeconds={currentQuestionTime} />
                  </VStack>
                  <Text mt={5} fontSize='xl' style={{textAlign: "center"}}>
                    {quizCounter + 1}/{nbWordsToQuiz}
                  </Text>
                  <Text as='b' fontSize='4xl' style={{textAlign: "center"}}>
                    {WORDS[currentQuestionIdx].text}
                  </Text>
                  <Text mt={5} mb={5}>
                  {
                    answered
                      && (
                        WORDS[currentQuestionIdx].meanings.includes(answer)
                        ? <Badge fontSize='xl' colorScheme='green'>Good answer</Badge>
                        : <Badge fontSize='xl' colorScheme='red'>{wrongAnswerMsg}</Badge>
                      )
                  }
                  </Text>
                  <Text>
                  {
                    answered && (
                      <>
                        <span>Good answers: </span>
                        {
                          WORDS[currentQuestionIdx].meanings.map(
                            (answer, index) => (
                              <Text as='b' color='green' key={answer}>
                              {`${answer}${index !== WORDS[currentQuestionIdx].meanings.length - 1 ? ', ' : '.'}`}
                              </Text>
                            )
                          )
                        }
                        <WordDetails word={WORDS[currentQuestionIdx]} />
                      </>
                    )
                  }
                  </Text>
                  <Input
                    value={answer}
                    onChange={handleCurrentQuestionAnswerChange}
                    mt={5}
                    mb={5}
                    placeholder='Answer'
                    ref={(ref) => {setAnswerInputRefCallback(ref)}}
                    onKeyDown={(e) => { e.key === 'Enter' && answerCurrentQuestion() }}
                  />
                  {
                    !answered
                      ? <Button
                          colorScheme='blue'
                          disabled={!answer}
                          onClick={answerCurrentQuestion}
                        >
                          Submit
                        </Button>
                      : <Button
                          colorScheme='blue'
                          onClick={gotToNextQuestion}
                        >
                          Next
                        </Button>
                  }
                </FormControl>
            :
            <VStack>
              <Text as='b' fontSize='2xl' style={{textAlign: "center"}}>
                End
              </Text>
              <Text
                as='b' fontSize='4xl' mt={10} mb={10}
                style={{textAlign: "center"}}
              >
                Score: {goodAnswersCount}/{nbWordsToQuiz}
                        {` (${getScore()}%)`}
              </Text>
              <Badge mb={5} fontSize='xl' colorScheme={getScoreLabel().color}>
                {getScoreLabel().text}
              </Badge>
              <ResetButton />
            </VStack>
          )
        }
      </Center>
    </Container>
  );
}
