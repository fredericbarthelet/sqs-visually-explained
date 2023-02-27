import { FunctionComponent } from "react";
import { FormControl, FormLabel, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Button, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, HStack, VStack } from "@chakra-ui/react";



type QueueConfigProps = {
    queueConfig: {
        receiveMessageWaitTimeSeconds: number;
        visibilityTimeout: number;
        messageRetentionPeriod: number;
    },
    setQueueConfig: React.Dispatch<React.SetStateAction<{
            receiveMessageWaitTimeSeconds: number;
            visibilityTimeout: number
            messageRetentionPeriod: number;
        }>>
}

export const QueueConfig: FunctionComponent<QueueConfigProps> = ({ queueConfig, setQueueConfig}) => {
    return (
        <VStack spacing='20px'>
            <FormControl>
                <HStack justifyContent={"space-between"}>
                    <FormLabel>Visibility Timeout</FormLabel>
                    <Button variant={"outline"} size={"sm"} onClick={() => setQueueConfig((queueConfig) => ({ ...queueConfig, visibilityTimeout: 30}))}>Reset to default</Button>
                </HStack>
                <HStack spacing='24px'>
                    <NumberInput width='135px' size='sm' min={0} max={43200} value={queueConfig.visibilityTimeout} onChange={(v) => setQueueConfig((queueConfig) => ({ ...queueConfig, visibilityTimeout: Number(v)}))}>
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                    <Slider aria-label='slider-ex-1' value={queueConfig.visibilityTimeout} min={0} max={43200} onChange={(v) => setQueueConfig((queueConfig) => ({ ...queueConfig, visibilityTimeout: v}))}>
                        <SliderTrack>
                            <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                    </Slider>
                </HStack>
            </FormControl>
            <FormControl>
                <HStack justifyContent={"space-between"}>
                    <FormLabel>Message Retention Period</FormLabel>
                    <Button variant={"outline"} size={"sm"} onClick={() => setQueueConfig((queueConfig) => ({ ...queueConfig, messageRetentionPeriod: 345600}))}>Reset to default</Button>
                </HStack>
                <HStack spacing='24px'>
                    <NumberInput width='135px' size='sm' min={60} max={1209600} value={queueConfig.messageRetentionPeriod} onChange={(v) => setQueueConfig((queueConfig) => ({ ...queueConfig, messageRetentionPeriod: Number(v)}))}>
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                    <Slider aria-label='slider-ex-1' value={queueConfig.messageRetentionPeriod} min={60} max={1209600} onChange={(v) => setQueueConfig((queueConfig) => ({ ...queueConfig, messageRetentionPeriod: v}))}>
                        <SliderTrack>
                            <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                    </Slider>
                </HStack>
            </FormControl>
        </VStack>
    )
}