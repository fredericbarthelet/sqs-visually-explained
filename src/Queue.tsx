import { FunctionComponent } from "react";
import { Button, Card, CardBody, CardHeader, Flex, HStack, Image, Text } from "@chakra-ui/react";
import { createGlobalState } from "react-use";
import { v4 as uuidv4 } from 'uuid';
import { Event } from "./Event";
import sqsLogo from './assets/sqs.svg'

export type EventInQueue = {
    id: string;
    isInFlight: boolean;
    messageGroupId?: string;
    messageBody: string;
}

export type ReceiveMessageRequest = {
    maxNumberOfMessages?: number,
    waitTimeSeconds?: number,
    // visibilityTimeout: number,
}

export type ReceiveMessageResponse = {
    messages: EventInQueue[]
}

type SendMessageInput = {
    delaySeconds?: number,
    messageBody: string,
    messageGroupId?: string,
}

const createMessage = ({ messageBody, messageGroupId }: SendMessageInput): EventInQueue => {
    return {
        id: uuidv4(),
        isInFlight: false,
        messageGroupId,
        messageBody,
    }
}

type QueueProps = {
    queueConfig: {
        receiveMessageWaitTimeSeconds: number,
        visibilityTimeout: number,
        messageRetentionPeriod: number,
    }
}

const useEventsState = createGlobalState<EventInQueue[]>([])
export const useQueue = ({ receiveMessageWaitTimeSeconds, visibilityTimeout, messageRetentionPeriod }: { receiveMessageWaitTimeSeconds: number, visibilityTimeout: number, messageRetentionPeriod: number}) => {
    const [events, setEvents] = useEventsState();

    const getAvailableMessages = () => {
        return events.filter(({ isInFlight }) => !isInFlight )
    }

    const sendMessage = (message: SendMessageInput) => {
        const formattedMessage = createMessage(message);
        setTimeout(() => {
            deleteMessage({ messageId: formattedMessage.id })
        }, messageRetentionPeriod * 1000);
        setEvents((previousEvents) => [
            ...previousEvents,
            formattedMessage
        ])
    }

    const sendMessageBatch = (messages: SendMessageInput[]) => {
        const formattedMessages = messages.map((message) => createMessage(message));
        setTimeout(() => {
            deleteMessageBatch(formattedMessages.map(({ id }) => id))
        }, messageRetentionPeriod * 1000);
        setEvents((previousEvents) => [
            ...previousEvents,
            ...formattedMessages
        ])
    }

    const getMessage = (id: string): EventInQueue => {
        const event =  events.find(({ id: eventId }) => eventId === id);
        if (!event) throw new Error(`Message with id ${id} could not be found for get`)
        return event;
    }

    const updateEvent = (id: string, updatePayload: Partial<Omit<EventInQueue, 'id'>>): EventInQueue => {
        let message: EventInQueue | undefined;
        setEvents((events) => events.reduce((returnValue, event) => {
            if (id === event.id) {
                message = { ...event, ...updatePayload };
                returnValue.push(message)
                return returnValue;
            }
            returnValue.push(event);
            return returnValue
        }, [] as EventInQueue[]))
        if (!message) throw new Error(`Message with id ${id} could not be found for update`)
        return message;
    }

    // should use receiptHandle instead of messageId
    const deleteMessage = ({ messageId }: { messageId: string}): void => {
        setEvents((events) => events.filter(({ id }) => id !== messageId ))
    }

    // should use receiptHandle instead
    const deleteMessageBatch = (messagesId: string[]): void => {
        setEvents((events) => events.filter(({ id }) => !messagesId.includes(id) ))
    }

    const updateMessageInFlight = (id: string): EventInQueue => {
        if (visibilityTimeout !== 0) {
            // find a way to delete the time if deleteMessage or deleteMessageBatch has been successfully called before timeout is reached
            setTimeout(() => {
                updateEvent(id, { isInFlight: false })
            }, visibilityTimeout * 1000);
            return updateEvent(id, { isInFlight: true });
        }
        return getMessage(id);
    }

    const receiveMessage = ({ maxNumberOfMessages = 1, waitTimeSeconds }: ReceiveMessageRequest): ReceiveMessageResponse => {
        let shouldExit = false;
        const resolvedWaitTimeSeconds = waitTimeSeconds ?? receiveMessageWaitTimeSeconds
        const messages: EventInQueue[] = [];
        const start = Date.now();
        while(!shouldExit) {
            getAvailableMessages().map((message) => {
                if (messages.length < maxNumberOfMessages) {
                    messages.push(updateMessageInFlight(message.id));
                }
            })
            const isLongPolling = resolvedWaitTimeSeconds > 0;
            const hasSufficientMessages = messages.length === maxNumberOfMessages;
            const shouldWaitMore = Date.now() - start > resolvedWaitTimeSeconds * 1000;
            shouldExit = !isLongPolling || (isLongPolling && (hasSufficientMessages || shouldWaitMore))
        }

        return { messages }
    }

    return {
        events,
        sendMessage,
        sendMessageBatch,
        receiveMessage,
        deleteMessage,
        deleteMessageBatch,
    }
}

export const Queue: FunctionComponent<QueueProps> = ({ queueConfig }) => {
    const { events, sendMessage, sendMessageBatch } = useQueue(queueConfig);

    return (
        <Card bg='pink.100'>
            <CardHeader>
                <HStack>
                    <Image width='50px' src={sqsLogo} />
                    <Text as='b'>Amazon SQS</Text>
                </HStack>
            </CardHeader>
            <CardBody pt='0px'>
                <HStack>
                    <Button onClick={() => sendMessage({ messageBody: 'This is the message body'})}>Add 1 event</Button>
                    <Button onClick={() => sendMessageBatch(new Array(10).fill({ messageBody: 'This is the message body'}))}>Add 10 events</Button>
                    <Button onClick={() => sendMessageBatch(new Array(100).fill({ messageBody: 'This is the message body'}))}>Add 100 events</Button>
                </HStack>
                <Text>Quantity of events in queue: {events.length}</Text>
                <Flex flexWrap={"wrap"}>
                    {events.map(({id, isInFlight}) => <Event active={!isInFlight} key={id}/>)}
                </Flex>
            </CardBody>
        </Card>
    )
}