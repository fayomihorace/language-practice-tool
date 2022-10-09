import { useState, useEffect } from 'react';
import {
  Text,
  VStack,
  Button,
  FormControl,
  Input,
  Badge,
} from '@chakra-ui/react'
import {
  LOCAL_STORAGE_NAME,
  DEFAULT_LISTENING_SCORE,
  DEFAULT_TRANSLATION_SCORE,
  TIME_PER_CHAR_SECONDS,
  DEFAULT_WRONG_ANSWER_MESSAGE,
  DEFAULT_ANSWERING_TIME_BONUS,
  DEFAULT_LISTENING_REPETION_SCORE
} from '../consts'
import { usePrevious } from '../hooks'
import initWordsDataset from '../words.json'
import Timer from './Timer'
import TextToSpeech from './TextToSpeech';
import ScoreLabel from './ScoreLabel'


export default function QuizForm({nbWordsToQuiz, setNbWordsToQuiz}) {
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

  const [quizCounter, setQuizCounter] = useState(0)
  const [goodAnswersCount, setGoodAnswersCount] = useState(0)
  const [goodAnswersTranslationCount, setGoodAnswerTranslationsCount] = useState(0)
  const [quizQuestionSetIdx, setQuizQuestionSetIdx] = useState([])

  const [answered, setCurrentQuestionAnswered] = useState(false)
  const [answer, setCurrentQuestionAnswer] = useState('')
  const [answerTranslation, setCurrentQuestionAnswerTranslation] = useState('')
  const [currentQuestionTime, setCurrentQuestionTime] = useState(0)
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [currentWord, setCurrentWord] = useState(WORDS[currentQuestionIdx])
  const [currentWordListenCount, setCurrentWordListenCount] = useState(0)
  useEffect(() => {
    setCurrentWord(WORDS[currentQuestionIdx])
  }, [currentQuestionIdx])
  const[remainingTime, setRemainingTime] = useState(0)
  const[timerIsOn, setTimerIsOn] = useState(false)

  const [quizHasStarted, setQuizHasStarted] = useState(false)
  const [quizHasEnded, setQuizHasEnded] = useState(false)
  const quizIsEnded = () => quizCounter === quizQuestionSetIdx.length - 1
  const endQuiz = () => {
    setQuizHasEnded(true)
    localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(WORDS))
  }

  const handleCurrentQuestionAnswerChange = (event) => {
    setCurrentQuestionAnswer(event.target.value)
  }

  const handleCurrentQuestionAnswerTranslationChange = (event) => {
    setCurrentQuestionAnswerTranslation(event.target.value)
  }

  const [answerInputRef, setAnswerInputRef] = useState(null)
  const focusAnswerInput = () => {
    answerInputRef.focus()
  }
  const setAnswerInputRefCallback = (val) => {
    setAnswerInputRef(val)
    // if (answerInputRef) answerInputRef.focus()
  }

  const startQuiz = () => {
    // sort words by score
    let wordsArray = []
    Object.keys(WORDS).forEach(wordIdx => {
      wordsArray.push(WORDS[wordIdx])
    })
    wordsArray.sort((a, b) => new Date(a.lastSeenDay) - new Date(b.lastSeenDay))
              .sort((a, b) => a.score - b.score)

    setQuizQuestionSetIdx(wordsArray.slice(0, nbWordsToQuiz))
    setQuizHasStarted(true)
    setQuizHasEnded(false)
    setTimerIsOn(true)
    handleTimeQuestionHasElpsed(WORDS[currentQuestionIdx])
    readOutLoudCurrentWord()
  }

  const readOutLoudCurrentWord = () => {
    if('speechSynthesis' in window) {
      window.speechSynthesis.speak(
        new SpeechSynthesisUtterance(WORDS[currentQuestionIdx].text)
      )
    }
  }

  const onTimeout = () => {
    console.log('-----onTimeout: ')
    setWrongAnswerMsg('Time elapsed')
    answerCurrentQuestion()
  }

  const handleTimeQuestionHasElpsed = (currentWord) => {
    let wordTime = currentWord.text.replace(/ /g, '').length * TIME_PER_CHAR_SECONDS
    setCurrentQuestionTime(wordTime)
    console.log('----------currentQuestionTime: ', currentQuestionTime)
  }

  const _wellAnswered = () => currentWord.text.toLowerCase() === answer.toLowerCase()
  const _wellTranslated = () => currentWord.meanings.map(m => m.toLowerCase())
                                  .includes(answerTranslation.toLowerCase())

  const answerCurrentQuestion = async () => {
    await setTimerIsOn(false)
    let score = 0
    currentWord.learnCount += 1

    let listenningRepScore = DEFAULT_LISTENING_REPETION_SCORE - currentWordListenCount

    let remainingTimeScore = (remainingTime * DEFAULT_ANSWERING_TIME_BONUS) / currentQuestionTime

    if (_wellAnswered()) {
      currentWord.listeningScoreTotal += DEFAULT_LISTENING_SCORE
      score += DEFAULT_LISTENING_SCORE
      score += listenningRepScore / 2
      score += remainingTimeScore / 2
      setGoodAnswersCount(goodAnswersCount + 1)
    }
    if (_wellTranslated()) {
      currentWord.translationScoreTotal += DEFAULT_TRANSLATION_SCORE
      score += DEFAULT_LISTENING_SCORE
      score += listenningRepScore / 2
      score += remainingTimeScore / 2
      setGoodAnswerTranslationsCount(goodAnswersCount + 1)
    }
  
    currentWord.totalScore += score
    let realScore = currentWord.totalScore/currentWord.learnCount
    currentWord.score = parseFloat(realScore.toFixed(2))
    currentWord.lastSeenDay = new Date()
    setWords(WORDS)
    setCurrentQuestionAnswered(true)
    setCurrentQuestionTime(0)
  }

  const gotToNextQuestion = () => {
    setQuizCounter(quizCounter + 1)
    if (quizIsEnded()) {
      endQuiz()
    }
    else {
      setCurrentQuestionIdx(
        prevQuestionIdx => {
          const _currentQuestionIdx = prevQuestionIdx + 1
          handleTimeQuestionHasElpsed(WORDS[_currentQuestionIdx])
          return _currentQuestionIdx
        }
      )
      setCurrentQuestionAnswer('')
      setCurrentQuestionAnswerTranslation('')
      setCurrentQuestionAnswered(false)
      setWrongAnswerMsg(DEFAULT_WRONG_ANSWER_MESSAGE)
      focusAnswerInput()
      setTimerIsOn(true)
    }
  }

  const resetQuiz = () => {
    setQuizCounter(0)
    setQuizQuestionSetIdx([])
    setQuizHasStarted(false)
    setQuizHasEnded(false)
    setCurrentQuestionAnswered(false)
    setCurrentQuestionAnswer('')
    setCurrentQuestionAnswerTranslation('')
    setNbWordsToQuiz(0)
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

  if (quizHasEnded) {
    return (
      <VStack>
        <Text as='b' fontSize='2xl' style={{textAlign: "center"}}>
          End
        </Text>
        <ScoreLabel
          name="Listening"
          goodAnswersCount={goodAnswersCount}
          nbWordsToQuiz={nbWordsToQuiz}
        />
        <ScoreLabel
          name="Translation"
          goodAnswersCount={goodAnswersTranslationCount}
          nbWordsToQuiz={nbWordsToQuiz}
        />
        <ScoreLabel
          fontSize="4xl"
          name="Total"
          goodAnswersCount={goodAnswersCount + goodAnswersTranslationCount}
          nbWordsToQuiz={nbWordsToQuiz * 2}
        />
        <ResetButton />
      </VStack>
    )
  }

  if (quizHasStarted) {
    return (
      <FormControl>
        <VStack>
          <ResetButton />
          <Timer
            timerOn={timerIsOn}
            timeSeconds={currentQuestionTime}
            setRemainingTime={setRemainingTime}
            onTimeout={onTimeout}
          />
          <Text mt={5} fontSize='xl' style={{textAlign: "center"}}>
            {quizCounter + 1}/{nbWordsToQuiz}
          </Text>
          <Text as='b' fontSize='4xl' style={{textAlign: "center"}}>
          {
            answered ? WORDS[currentQuestionIdx].text : '**********'
          }
          </Text>
          <TextToSpeech
            text={WORDS[currentQuestionIdx].text}
            url={WORDS[currentQuestionIdx].url}
            listenCount={currentWordListenCount}
            setListenCount={setCurrentWordListenCount}
          />
        </VStack>
        <Text>
        {
          answered && (
            <>
              <span>Traduction: </span>
              {
                WORDS[currentQuestionIdx].meanings.map(
                  (answer, index) => (
                    <Text as='b' color='green' key={answer}>
                    {`${answer}${index !== WORDS[currentQuestionIdx].meanings.length - 1 ? ', ' : '.'}`}
                    </Text>
                  )
                )
              }
              {/* <WordDetails word={WORDS[currentQuestionIdx]} />*/ }
            </>
          )
        }
        </Text>
        <Input
          value={answer}
          onChange={handleCurrentQuestionAnswerChange}
          mt={5}
          placeholder='Answer'
          autoComplete="off"
          ref={(ref) => {setAnswerInputRefCallback(ref)}}
          onKeyDown={(e) => { e.key === 'Enter' && answerCurrentQuestion() }}
        />        
          {answered && (
            _wellAnswered()
              ? <Badge fontSize='xs' colorScheme='green'>Good answer</Badge>
              : <Badge fontSize='xs' colorScheme='red'>{wrongAnswerMsg}</Badge>
          )}
        <Input
          value={answerTranslation}
          onChange={handleCurrentQuestionAnswerTranslationChange}
          mt={3}
          placeholder='Translation'
          autoComplete="off"
          onKeyDown={(e) => { e.key === 'Enter' && answerCurrentQuestion() }}
        />
          {answered && (
            _wellTranslated()
              ? <Badge fontSize='xs' colorScheme='green'>Good answer</Badge>
              : <Badge fontSize='xs' colorScheme='red'>{wrongAnswerMsg}</Badge>
          )}
        <div style={{color: "white"}}>_</div>
        {
          !answered &&
            <Button
              colorScheme='red'
              size='xs'
              mr={10}
              onClick={answerCurrentQuestion}
            >
              Skip
            </Button>
        }
        {' '}
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
    );
  }

  return (
    <Button
      colorScheme='blue'
      onClick={() => startQuiz()}
      style={{marginTop: '100px'}}
    >
      Start {nbWordsToQuiz} questions quiz
    </Button>
  ) 
}
