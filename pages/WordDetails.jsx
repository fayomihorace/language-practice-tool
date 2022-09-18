import {React} from 'react'
import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter
} from "@chakra-ui/react"

function createMarkup(iframeHtml) {
  return {__html: iframeHtml};
}

export default function ({word}) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  // const url = "https://www.google.com/search?q=google+translate+" + word.text.split(' ').join('+')
  const url = "https://www.google.com"
  const iframeHtml = `<iframe src="${url}" width="540" height="450"></iframe>`;
  return (
    <>
      <Button variant='link' onClick={onOpen} ml={3}>
        Learn more
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>\</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div dangerouslySetInnerHTML={createMarkup(iframeHtml)} />;
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}