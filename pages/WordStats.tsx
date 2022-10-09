import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react'

export default function ({word}) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Button size="xs" mr={5} onClick={onOpen}>Full details</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{word.text}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ul>
              {
                Object.keys(word).map(
                  key => (<li key={key}>{key}: {word[key]}</li>)
                )
              }
            </ul>
          </ModalBody>

          <ModalFooter>
            <Button size="xs" colorScheme='blue' onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
