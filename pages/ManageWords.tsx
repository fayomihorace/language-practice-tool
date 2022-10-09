import React, { useState, useEffect } from 'react'
import {
  Text,
  VStack,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react"
import initWordsDataset from '../words.json'
import {LOCAL_STORAGE_NAME} from '../consts'
import EditWordForm from './EditWordForm'
import { useToast } from '@chakra-ui/react'
import WordStats from './WordStats'

const headers = [
  "id",
  "text",
  "meanings",
  "learnCount",
  "lastSeenDay",
  "score",
]

const ListItems = ({ items }) => {
  return (
    <ul>
      {items.map((item, idx) => <li key={idx}>{item}</li>)}
    </ul>
  )
}
export default function () {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [WORDS, setWords] = useState({})
  const [wordsList, setWordsList] = useState([])
  const toast = useToast()
  
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
  
  useEffect(() => {
    let list = Object.keys(WORDS).map(key => ({
      key,
      ...WORDS[key]
    }))
    list.sort((a, b) => new Date(a.lastSeenDay) - new Date(b.lastSeenDay))
        .sort((a, b) => a.score - b.score)
    setWordsList(list)
    }, [WORDS])

  const addWord  = ({text, meanings}) => {
    let wordsCount = Object.keys(WORDS).length
    let words = JSON.parse(JSON.stringify(WORDS))
    words[wordsCount + 1] = {
      text,
      meanings: meanings.split('|'),
      lastSeenDay: "",
      learnCount: 0,
      score: 0,
      listeningScoreTotal: 0,
      translationScoreTotal: 0,
      popularity: 0,
      sentences: [],
      context: [],
      category: "",
      tags: []
    }
    setWords(words)
    localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(words))
    toast({
      title: 'Word added',
      // description: "We've created your account for you.",
      status: 'success',
      duration: 4000,
      isClosable: true,
    })
  }

  const updateWord  = ({id, data}) => {
    let words = JSON.parse(JSON.stringify(WORDS))
    words[id].text = data.text
    words[id].meanings = data.meanings.split('|'),
    setWords(words)
    localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(words))
    toast({
      title: 'Word updated',
      // description: "We've created your account for you.",
      status: 'success',
      duration: 4000,
      isClosable: true,
    })
  }

  const removeWord = (key) => {
    let words = JSON.parse(JSON.stringify(WORDS))
    delete words[key]
    setWords(words)
    localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(words))
    toast({
      title: 'Word removed',
      // description: "We've created your account for you.",
      status: 'success',
      duration: 4000,
      isClosable: true,
    }) 
  }

  return (
    <>
      <Button variant='link' onClick={onOpen} size='sm' mb={5}>
        Manage words
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="full" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Words manager</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Accordion allowToggle>
            <AccordionItem>
                <h2>
                  <AccordionButton>
                    Add word
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <EditWordForm addWord={addWord} words={WORDS} />
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
            <TableContainer mt={10}>
              <Table variant='simple'>
                <Thead>
                  <Tr>
                    {[...headers, 'Actions'].map((header, idx) => <Th key={idx}>{header}</Th>)}
                  </Tr>
                </Thead>
                <Tbody>
                  {
                    wordsList.map(
                      word => (
                        <Tr key={word.key}>
                          {headers.map(
                            (header, idx) => {
                              let value = word[header]
                              if (header === 'id') value = word.key
                              if (Array.isArray(value)) {
                                return (
                                  <Td key={idx}><ListItems key={idx} items={value} /></Td>
                                )
                              }
                              return <Td key={idx}>{value}</Td>
                            }
                          )}
                          <Td>
                            <WordStats word={word} />
                            <Menu>
                              <MenuButton as={Button} colorScheme='red' size="xs">Delete</MenuButton> 
                              <MenuList>
                                <MenuItem>Cancel</MenuItem>
                                <MenuItem color='red' onClick={() => removeWord(word.key)}>
                                  Confirm deletion
                                </MenuItem>
                              </MenuList>
                            </Menu>
                            <Menu>
                              <MenuButton as={Button} ml={2} colorScheme='blue' size="xs">Update</MenuButton> 
                              <MenuList p={5} style={{width: '600px'}}>
                                <EditWordForm
                                  wordToEdit={word}
                                  updateWord={(data) => updateWord({id: word.key, data: data})}
                                  words={WORDS}
                                />
                              </MenuList>
                            </Menu>
                          </Td>
                        </Tr>
                      )
                    )
                  }
                </Tbody>
              </Table>
            </TableContainer>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
