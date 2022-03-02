import {
  Box,
  Button,
  Center,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import nlp from 'compromise';

const App = () => {
  const [sentence, setSentence] = useState('I walk');
  const [formula, setFormula] = useState('S + V1(s)');
  const [tense, setTense] = useState(0); //0 1 2 present past future
  const [tenseType, setTenseType] = useState(0); // simple cont' perfect
  const [type, setType] = useState(0); // 0, 1, 2 positive negative question
  const helpers = ['am', 'have', 'do', 'was', 'had', 'will'];

  const toNegative = () => {
    // Not negative
    if (type !== 1) {
      const arr = sentence.split(' ');
      const sIndex = arr.findIndex((ele) => ele === 'I');
      const hIndex = arr.findIndex((ele) =>
        helpers.some((x) => ele.includes(x))
      );
      let helper = '';
      const not = 'not';
      // If no helper (present simple or past simple)
      if (hIndex === -1) {
        // Present simple
        if (tense === 0) {
          helper = 'do';
          arr.splice(sIndex + 1, 0, helper);
          arr.splice(sIndex + 2, 0, not);
          setFormula('S + do/does + not + V1');
          // past simple
        } else if (tense === 1) {
          helper = 'did';
          arr.splice(sIndex + 1, 0, helper);
          arr.splice(sIndex + 2, 0, not);
          let v = arr[arr.length - 1];
          const infinitive = nlp(v).verbs().toInfinitive().text();
          arr[arr.length - 1] = infinitive;
          setFormula('S + did + not + V1');
        }
      } else {
        // has helper
        if (tense === 0) {
          // Present cont'
          if (tenseType === 1) {
            arr.splice(hIndex + 1, 0, not);
            setFormula('S + is/am/are + not + V ing');
            // Present perfect
          } else {
            arr.splice(hIndex + 1, 0, not);
            setFormula('S + has/have + not + V3');
          }
        } else if (tense === 1) {
          // Past cont
          if (tenseType === 1) {
            arr.splice(hIndex + 1, 0, not);
            setFormula('S + was/were + not + V ing');
            // past perfect
          } else if (tenseType === 2) {
            arr.splice(hIndex + 1, 0, not);
            setFormula('S + had + not + V3');
          }
        } else {
          // Future simple
          if (tenseType === 0) {
            arr.splice(hIndex + 1, 0, not);
            setFormula('S + will + not + V1');
          } else if (tenseType === 1) {
            arr.splice(hIndex + 1, 0, not);
            setFormula('S + will + not + be + V ing');
          } else {
            arr.splice(hIndex + 1, 0, not);
            setFormula('S + will + not + have + V3');
          }
        }
      }
      setType(1);
      setSentence(arr.join(' '));
    }
  };

  const toQuestion = () => {
    // Not question
    if (type !== 2) {
      const arr = sentence.split(' ');
      const hIndex = arr.findIndex((ele) =>
        helpers.some((x) => ele.includes(x))
      );
      let helper = '';
      // If no helper (present simple or past simple)
      if (hIndex === -1) {
        // Present simple
        if (tense === 0) {
          helper = 'Do';
          arr.splice(0, 0, helper);
          setFormula('Do/does + S + V1');
          // Past simple
        } else if (tense === 1) {
          helper = 'did';
          arr.splice(0, 0, helper);
          let v = arr[arr.length - 1];
          const infinitive = nlp(v).verbs().toInfinitive().text();
          arr[arr.length - 1] = infinitive;
          setFormula('Did + S + V1');
        }
      } else {
        // has helper
        if (tense === 0) {
          // Present cont'
          if (tenseType === 1) {
            setFormula('Is/am/are + S + V ing');
            const tmp = arr[1];
            arr[1] = arr[0];
            arr[0] = tmp;
            // Present perfect
          } else {
            setFormula('Have + S + V3');
            const tmp = arr[1];
            arr[1] = arr[0];
            arr[0] = tmp;
          }
        } else if (tense === 1) {
          // past cont
          if (tenseType === 1) {
            setFormula('Was/were + S + V ing');
            const tmp = arr[1];
            arr[1] = arr[0];
            arr[0] = tmp;
          } else if (tenseType === 2) {
            setFormula('Had + S + V3');
            const tmp = arr[1];
            arr[1] = arr[0];
            arr[0] = tmp;
          }
        } else if (tense === 2) {
          if (tenseType === 0) {
            setFormula('Will + S + V1');
            const tmp = arr[1];
            arr[1] = arr[0];
            arr[0] = tmp;
          } else if (tenseType === 1) {
            setFormula('Will + S + be + V ing');
            const tmp = arr[1];
            arr[1] = arr[0];
            arr[0] = tmp;
          } else {
            setFormula('Will + S + have + V3');
            const tmp = arr[1];
            arr[1] = arr[0];
            arr[0] = tmp;
          }
        }
      }
      setType(2);
      setSentence(arr.join(' '));
    }
  };

  // Present
  const toPresentSimple = () => {
    setSentence('I walk');
    setFormula('S + V1(s)');
    setTense(0);
    setTenseType(0);
    setType(0);
  };

  const toPresentContinuous = () => {
    setSentence('I am walking');
    setFormula('S + is/am/are + V ing');
    setTense(0);
    setTenseType(1);
    setType(0);
  };

  const toPresentPerfect = () => {
    setSentence('I have walked');
    setFormula('S + has/have + V3');
    setTense(0);
    setTenseType(2);
    setType(0);
  };

  // Past
  const toPastSimple = () => {
    setSentence('I walked');
    setFormula('S + V2');
    setTense(1);
    setTenseType(0);
    setType(0);
  };

  const toPastContinuous = () => {
    setSentence('I was walking');
    setFormula('S + was/were + V ing');
    setTense(1);
    setTenseType(1);
    setType(0);
  };

  const toPastPerfect = () => {
    setSentence('I had walked');
    setFormula('S + have + V3');
    setTense(1);
    setTenseType(2);
    setType(0);
  };

  // Future
  const toFutureSimple = () => {
    setSentence('I will walk');
    setFormula('S + will + V1');
    setTense(2);
    setTenseType(0);
    setType(0);
  };

  const toFutureContinuous = () => {
    setSentence('I will be walking');
    setFormula('S + will + be + V ing');
    setTense(2);
    setTenseType(1);
    setType(0);
  };

  const toFuturePerfect = () => {
    setSentence('I will have walked');
    setFormula('S + will + have + V3');
    setTense(2);
    setTenseType(2);
    setType(0);
  };

  const renderTense = () => {
    let output = '';
    if (tense === 0) {
      output = 'Present';
    } else if (tense === 1) {
      output = 'Past';
    } else {
      output = 'Future';
    }

    if (tenseType === 0) {
      output += ' simple';
    } else if (tenseType === 1) {
      output += ' continuous';
    } else {
      output += ' perfect';
    }

    if (type === 0) {
      output += ' [positive]';
    } else if (type === 1) output += ' [negative]';
    else output += ' [question]';

    return output;
  };
  return (
    <Container maxW='container.xl'>
      <Grid templateColumns='repeat(5, 1fr)'>
        <GridItem colSpan={{ base: 5, md: 1 }}>
          <VStack mt='8'>
            <Button
              disabled={type === 2 || type === 1}
              colorScheme={'red'}
              onClick={toNegative}
            >
              To Negative
            </Button>
            <Button
              colorScheme={'yellow'}
              onClick={toQuestion}
              disabled={type === 1 || type === 2}
            >
              To Question
            </Button>
          </VStack>
        </GridItem>
        <GridItem colSpan={{ base: 5, md: 3 }}>
          <Center mt='8'>
            <VStack spacing={0}>
              <Text>{renderTense()}</Text>
              <Box fontSize='3em' key={Math.random()} className='roll-out'>
                {`${sentence} ${type === 2 ? '?' : ''}`}
              </Box>
              <Box
                fontWeight={'bold'}
                fontSize='2.5em'
                color='blue.600'
                key={Math.random()}
                className='roll-out'
              >
                {`${formula} ${type === 2 ? '?' : ''}`}
              </Box>
            </VStack>
          </Center>
          <Center my='4'>
            <Heading>Present Tense</Heading>
          </Center>
          <VStack spacing='4'>
            <Button colorScheme='green' onClick={toPresentSimple}>
              To present simple
            </Button>
            <Button colorScheme='green' onClick={toPresentContinuous}>
              To present continuous
            </Button>
            <Button colorScheme='green' onClick={toPresentPerfect}>
              To present perfect
            </Button>
          </VStack>
          <Center my='4'>
            <Heading>Past Tense</Heading>
          </Center>
          <VStack spacing='4'>
            <Button colorScheme='blue' onClick={toPastSimple}>
              To past simple
            </Button>
            <Button colorScheme='blue' onClick={toPastContinuous}>
              To past continuous
            </Button>
            <Button colorScheme='blue' onClick={toPastPerfect}>
              To past perfect
            </Button>
          </VStack>
          <Center my='4'>
            <Heading>Future Tense</Heading>
          </Center>
          <VStack spacing='4'>
            <Button colorScheme='pink' onClick={toFutureSimple}>
              To future simple
            </Button>
            <Button colorScheme='pink' onClick={toFutureContinuous}>
              To future continuous
            </Button>
            <Button colorScheme='pink' onClick={toFuturePerfect}>
              To future perfect
            </Button>
          </VStack>
        </GridItem>
        <GridItem colSpan={{ base: 5, md: 1 }}>
          <Box mt={4} mx={{ base: 8, md: 0 }}>
            <Heading color='red' textDecor='underline'>
              Notes
            </Heading>
            <ul>
              <li>
                Verb that is not the actual verb is called a helping verb or
                auxilary verb
              </li>
              <li>
                Conjugation happens on helper verb as well. The actual verb only
                change base on tense except when we omit the helper verb. E.g.
                He walks. He does walk.
              </li>
              <li>
                "Not" always comes after the helper verb. E.g. I do not walk. I
                am not walking.
              </li>
              <li>
                In the question form, helper verb always come at the front. E.g.
                Do I walk?
              </li>
            </ul>
          </Box>
        </GridItem>
      </Grid>
    </Container>
  );
};

export default App;
