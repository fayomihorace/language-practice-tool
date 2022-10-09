import { useState, useEffect } from 'react';
import {
  VStack,
  Button,
  FormLabel,
  FormControl,
  FormErrorMessage,
  Input,
} from '@chakra-ui/react'


export default function SetNbWordsToQuizForm({addWord, updateWord, wordToEdit, words}) {

  const [text, setText] = useState(wordToEdit ? wordToEdit.text : '')
  const [translation, setTranslation] = useState(
    wordToEdit ? wordToEdit.meanings.join('| ') : '' 
  )
  const [wordsList, _] = useState(() => Object.keys(words).map(key => words[key].text))
  const isError = !(text && translation)
  const [existError, setExistError] = useState(false)
  const handleTextChange = (e) => setText(e.target.value)
  useEffect (() => { setExistError(false) }, [text])

  const handeTranslationChange = (e) => setTranslation(e.target.value)

  const _validateForm = () => {
    if (wordsList.includes(text.toLowerCase())) {
      setExistError(true)
      return false
    }
    return true
  }

  const _addWord = () => {
    if (_validateForm()) {
      addWord({ text: text.toLowerCase(), meanings: translation.toLowerCase() })
      setText('')
      setTranslation('')
    }
  }

  const _updateWord = () => {
    if (!(text.toLowerCase() !== wordToEdit.text && _validateForm()) ) {
      updateWord({ text: text.toLowerCase(), meanings: translation.toLowerCase() })
    }
  }

  return (
    <FormControl isInvalid={isError || existError}>
      <VStack>
        <Input
          value={text}
          required={true}
          size='sm'
          mt={3}
          placeholder='Text'
          autoComplete="off"
          onChange={handleTextChange}
        />
        <Input
          value={translation}
          required={true}
          size='sm'
          mt={3}
          placeholder='Translation (separated meanings with |)'
          autoComplete="off"
          onChange={handeTranslationChange}
        />
        {isError && <FormErrorMessage>Field required.</FormErrorMessage>}
        {existError && <FormErrorMessage>That word/expression already exists.</FormErrorMessage>}
        <Button
          disabled={isError || existError}
          mt={5}
          colorScheme='blue'
          onClick={ () => { wordToEdit ? _updateWord() : _addWord()} }
        >
          { wordToEdit ? 'Update' : 'Add' }
        </Button>
      </VStack>
    </FormControl>
  );
}
