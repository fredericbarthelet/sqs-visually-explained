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

const LAMBDA_PROCESSING_TIME = 5000;

const App: FunctionComponent = () => {
  const [queueConfig, setQueueConfig] = useState<{receiveMessageWaitTimeSeconds: number, visibilityTimeout: number, messageRetentionPeriod: number}>({
    receiveMessageWaitTimeSeconds: 0,
    visibilityTimeout: 30,
    messageRetentionPeriod: 345600,
  })
  const [esmConfig, setEsmConfig] = useState<{batchSize: number, maximumConcurrency: number}>({
    batchSize: 10,
    maximumConcurrency: 1,
  })
  const [functions, { push, filter }] = useList<{id: string; events: {id: string}[]}>([]);

  const deleteFunction = (id: string) => {
    filter(({ id: lambdaFunctionId }) => id !== lambdaFunctionId)
  }

  const startFunction = async (events: {id: string}[]): Promise<string> => {
    const lambdaFunctionId = uuidv4();
    const invokePromise = new Promise<string>((resolve) => {
      setTimeout(() => {
        deleteFunction(lambdaFunctionId)
        resolve('ok')
      }, LAMBDA_PROCESSING_TIME);
      push({ id: lambdaFunctionId, events })
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
              <Esm queueConfig={queueConfig} esmConfig={esmConfig} invoke={startFunction} />
              <VStack>
                {functions.map(({ id, events }) => (<Function key={id} id={id} events={events}/>))}
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
      <GridItem pl='2' area={'lambda-settings'}></GridItem>
      <GridItem pl='2' area={'footer'}>
      </GridItem>
    </Grid>
  )
}

export default App
