import { FunctionComponent, useState } from 'react'
import { Card, CardBody, CardHeader, Grid, GridItem, Heading, HStack, Image, SimpleGrid, Text, VStack } from '@chakra-ui/react'
import { Queue } from './Queue';
import { Esm } from './Esm';
import { Function } from './Function';
import { QueueConfig } from './QueueConfig';
import { v4 as uuidv4 } from 'uuid';
import { useList } from 'react-use';
import { EsmConfig } from './EsmConfig';
import lambdaLogo from './assets/lambda.svg'
import { FunctionConfig } from './FunctionConfig';

const LAMBDA_COLD_START_DURATION = 2000;
const LAMBDA_PROCESSING_DURATION = 4000;

const App: FunctionComponent = () => {
  const [queueConfig, setQueueConfig] = useState<{receiveMessageWaitTimeSeconds: number, visibilityTimeout: number, messageRetentionPeriod: number, delaySeconds: number}>({
    receiveMessageWaitTimeSeconds: 0,
    visibilityTimeout: 30,
    messageRetentionPeriod: 345600,
    delaySeconds: 0,
  })
  const [esmConfig, setEsmConfig] = useState<{batchSize: number, maximumConcurrency: number}>({
    batchSize: 10,
    maximumConcurrency: 1,
  })
  const [functionConfig, setFunctionConfig] = useState<{timeout: number}>({
    timeout: 4,
  })
  const [functions, { push, update }] = useList<{id: string; starting: boolean, events: {id: string}[]}>([]);

  const invoke = async (events: {id: string}[]): Promise<string> => {
    const availableFunctions = functions.filter(({ events, starting }) => !starting && events.length === 0)
    if (availableFunctions.length === 0) {
      return startFunction(events);
    }
    const functionToUse = availableFunctions[0];
    const invokePromise = new Promise<string>((resolve) => {
      update(({ id }, { id: targetId}) => targetId === id, { id: functionToUse.id, events, starting: false })
      setTimeout(() => {
        update(({ id }, { id: targetId}) => targetId === id, { id: functionToUse.id, events:[], starting: false })
        resolve('ok')
      }, LAMBDA_PROCESSING_DURATION);
    })
    return invokePromise;
  }

  const startFunction = async (events: {id: string}[]): Promise<string> => {
    const lambdaFunctionId = uuidv4();
    const invokePromise = new Promise<string>((resolve) => {
      setTimeout(() => {
        update(({ id }, { id: targetId}) => targetId === id, { id: lambdaFunctionId, events, starting: false })
        setTimeout(() => {
          update(({ id }, { id: targetId}) => targetId === id, { id: lambdaFunctionId, events:[], starting: false })
          resolve('ok')
        }, LAMBDA_PROCESSING_DURATION);
      }, LAMBDA_COLD_START_DURATION);
      push({ id: lambdaFunctionId, events:[], starting: true })
    })
    return invokePromise;
  }

  return (
    <Grid
      templateAreas={`"header header header"
                      "queue lambda lambda"
                      "queue-settings esm-settings lambda-settings"
                      "footer footer footer"`}
      gridTemplateRows={'100px repeat(2, 1fr)'}
      gridTemplateColumns={'repeat(3, 1fr)'}
      gap='10px'
      color='blackAlpha.700'
    >
      <GridItem pl='2' area={'header'}>
        <Heading>{"SQS <> Lambda Visually Explained"}</Heading>
      </GridItem>
      <GridItem pl='2' area={'queue'}>
        <Queue queueConfig={queueConfig} />
      </GridItem>
      <GridItem pl='2' pr='2' area={'lambda'}>
        <Card bg='orange.100'>
          <CardHeader>
            <HStack>
                <Image width='50px' src={lambdaLogo} />
                <Text as='b'>AWS Lambda</Text>
            </HStack>
          </CardHeader>
          <CardBody pt='0px'>
            <SimpleGrid columns={2} spacing='10px'>
              <Esm queueConfig={queueConfig} esmConfig={esmConfig} invoke={invoke} />
              <VStack>
                {functions.map(({ id, events, starting }) => (<Function key={id} id={id} starting={starting} events={events}/>))}
              </VStack>
            </SimpleGrid>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem pl='2' area={'queue-settings'}>
        <QueueConfig queueConfig={queueConfig} setQueueConfig={setQueueConfig} />
      </GridItem>
      <GridItem pl='2' area={'esm-settings'}>
        <EsmConfig esmConfig={esmConfig} setEsmConfig={setEsmConfig} />
      </GridItem>
      <GridItem pl='2' area={'lambda-settings'}>
        <FunctionConfig functionConfig={functionConfig} setFunctionConfig={setFunctionConfig} />
      </GridItem>
      <GridItem pl='2' area={'footer'}>
      </GridItem>
    </Grid>
  )
}

export default App
