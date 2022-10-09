import {useState, useEffect} from 'react'
import {Text} from '@chakra-ui/react'

export default function ({ timeSeconds, timerOn, setRemainingTime, onTimeout }) {
  const [timeCounter, setTimeCounter] = useState(0)
  const [countLimit, setCountLimit] = useState(timeSeconds/1000)
  const [timerId, setTimerId] = useState(0)
  const remaingSeconds = () => countLimit - timeCounter

  useEffect(() => {
    const timer = setInterval(() => {
      console.log('---------count: ', timeCounter, remaingSeconds())
      if (timeCounter === countLimit - 1) {
        clearInterval(timerId)
        onTimeout()
      }
      else {
        setTimeCounter(timeCounter + 1)
        setRemainingTime(remaingSeconds()* 1000)
      }
    }, 1000)
    setTimerId(timer)
    return () => {
      clearInterval(timer)
    }
  }, [timeCounter])

  useEffect(() => {
    if (timerOn) {
      setTimeCounter(0)
      setCountLimit(timeSeconds/1000)
    }
    else {
      clearInterval(timerId)
    }
  }, [timerOn])

  return (
    timeSeconds && remaingSeconds() > 0
      ? <Text as='b' fontSize='xl' style={{marginTop: '25px'}}>
          {remaingSeconds()}
          {` second${remaingSeconds() > 1 ? 's' : '' }`}
        </Text>
      : <span />
  )
}
