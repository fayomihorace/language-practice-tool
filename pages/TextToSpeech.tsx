import { useEffect } from "react"
import { Button } from '@chakra-ui/react'


export default function ({ text='', url='', listenCount, setListenCount }) {

  useEffect(() => {
    read()
    setListenCount(0)
  }, [text])

  const read = () => {
    setListenCount(listenCount+1)
    if (url) {
      var a = new Audio(url);
      a.play();
    }
    else if (text) {
      if('speechSynthesis' in window) {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(text))
      }
    }
  }

  return (
    <Button
      colorScheme='blue'
      size='xs'
      onClick={read}
    >
      Listen
    </Button>
  )
}
