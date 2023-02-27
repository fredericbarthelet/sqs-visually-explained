import { FunctionComponent } from "react";
import { FormControl, FormLabel, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Button, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, HStack } from "@chakra-ui/react";



type QueueConfigProps = {
    queueConfig: {
        receiveMessageWaitTimeSeconds: number;
        visibilityTimeout: number
    },
    setQueueConfig: React.Dispatch<React.SetStateAction<{
            receiveMessageWaitTimeSeconds: number;
            visibilityTimeout: number
        }>>
}

export const QueueConfig: FunctionComponent<QueueConfigProps> = ({ queueConfig, setQueueConfig}) => {
    return (
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
    )
}