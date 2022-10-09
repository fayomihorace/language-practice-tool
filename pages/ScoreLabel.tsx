import { useState, useEffect } from 'react';
import {
  Text,
  Badge,
} from '@chakra-ui/react'

export default function ({ name, goodAnswersCount, nbWordsToQuiz, fontSize = "xl" }) {
  
  const [score, setScore] = useState(0)

  useEffect(() => {
    setScore(goodAnswersCount / nbWordsToQuiz * 100)
  }, [goodAnswersCount, nbWordsToQuiz])

  const getScoreLabel = () => {
    if (score === 100) return {text: "Perfect", color: "green"}
    else if (score > 90) return {text: "Excellent", color: "green"}
    else if (score > 80) return {text: "Very Good job", color: "green"}
    else if (score > 70) return {text: "Good", color: "green"}
    else if (score > 60) return {text: "Average Good", color: "yellow"}
    else if (score >= 50) return {text: "Medium", color: "orange"}
    else if (score > 25) return {text: "Bad", color: "red"}
    else return {text: "Very bad", color: "red"}
  }

  return (
    <>
      <Text
        as='b' fontSize={fontSize} mt={10} mb={10}
        style={{textAlign: "center"}}
      >
        {name} score: {goodAnswersCount}/{nbWordsToQuiz}
                {` (${score}%)`}
        <Badge ml={3} fontSize='xl' colorScheme={getScoreLabel().color}>
          {getScoreLabel().text}
        </Badge>
      </Text>
    </>
  )
}
