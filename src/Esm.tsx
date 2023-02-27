import { Text, Card, CardHeader, CardBody } from "@chakra-ui/react";
import { FunctionComponent, useEffect } from "react";
import { useToggle } from "react-use";
import { useQueue } from "./Queue";

type EsmProps = {
    queueConfig: {
        receiveMessageWaitTimeSeconds: number,
        visibilityTimeout: number,
        messageRetentionPeriod: number,
    },
    esmConfig: {
        batchSize: number,
    }
    invoke: (events: {id: string}[]) => Promise<string>
}

export const Esm: FunctionComponent<EsmProps> = ({ queueConfig, esmConfig, invoke }) => {
    const [isPolling, toggleIsPolling] = useToggle(false);
    const { receiveMessage, deleteMessageBatch } = useQueue(queueConfig);

    const handleMessages = async () => {
        toggleIsPolling();
        // Artificial poller desynchronization
        await new Promise((resolve) => setTimeout(resolve, Math.random()*1000));
        // When more than 10, esm handles multiple calls to SQS to achieve a certain batch size
        const { messages } = receiveMessage({ maxNumberOfMessages: esmConfig.batchSize });
        if(messages.length !== 0) {
            await invoke(messages);
            deleteMessageBatch(messages.map(({ id }) => id))
        }
        toggleIsPolling();
    }

    useEffect(() => {
        if(!isPolling) {
            handleMessages();
        }
    }, [isPolling])


    return (
        <Card>
            <CardHeader>
                <Text>Poller</Text>
            </CardHeader>
            <CardBody>
            </CardBody>
        </Card>
    )
}