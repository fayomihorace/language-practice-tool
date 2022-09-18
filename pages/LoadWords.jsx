import {React, useState} from 'react'
import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Textarea
} from "@chakra-ui/react"
import {LOCAL_STORAGE_NAME} from '../consts'


const exemplePlaceholder = `{
  "0": {
    "text": "ubiquitous",
    "meanings": [],
    "lastSeenDay": "",
    "learnCount": 0,
    "score": 0,
    "popularity": 6,
    "sentences": [],
    "context": []
  }
}
`

export default function () {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [words, setWords] = useState('')

  const submitWords = () => {
    localStorage.setItem(LOCAL_STORAGE_NAME, words)
    onClose()
  }

  return (
    <>
      <Button variant='link' onClick={onOpen} size='sm'>
        Load words
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Load words</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea
              value={words}
              rows={25}
              placeholder={exemplePlaceholder}
              onChange={(e) => setWords(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              colorScheme='blue'
              disabled={!words}
              onClick={submitWords}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}