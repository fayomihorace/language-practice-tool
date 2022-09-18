import {useState, useEffect} from 'react'
import {Text} from '@chakra-ui/react'

export default function ({ timeSeconds }) {
  const [date, setDate] = useState(new Date())
  const [timeCounter, setTimeCounter] = useState(0)
  const [countLimit, setCountLimit] = useState(timeSeconds/1000)
  const remaingSeconds = () => countLimit - timeCounter

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeCounter !== countLimit) {
        setTimeCounter(timeCounter + 1)
      }
    }, 1000)
    return () => {
      clearTimeout(timer)
    }
  }, [timeCounter])

  useEffect(() => {
    if (timeSeconds !==0 ) {
      setTimeCounter(0)
      setCountLimit(timeSeconds/1000)
    }
  }, [timeSeconds])

  return (
    timeSeconds && remaingSeconds() > 0
      ? <Text as='b' fontSize='xl' style={{marginTop: '25px'}}>
          {remaingSeconds()}
          {` second${remaingSeconds() > 1 ? 's' : '' }`}
        </Text>
      : ''
  )
}
