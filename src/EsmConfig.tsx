import { FunctionComponent } from "react";
import { FormControl, FormLabel, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Button, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, HStack, VStack } from "@chakra-ui/react";



type EsmConfigProps = {
    esmConfig: {
        batchSize: number;
        maximumConcurrency: number;
    },
    setEsmConfig: React.Dispatch<React.SetStateAction<{
        batchSize: number;
        maximumConcurrency: number;
    }>>
}

export const EsmConfig: FunctionComponent<EsmConfigProps> = ({ esmConfig, setEsmConfig}) => {
    return (
        <VStack spacing='20px'>
            <FormControl>
                <HStack justifyContent={"space-between"}>
                    <FormLabel>Maximum concurrency</FormLabel>
                    <Button isDisabled variant={"outline"} size={"sm"} onClick={() => setEsmConfig((esmConfig) => ({ ...esmConfig, maximumConcurrency: 1}))}>Reset to default</Button>
                </HStack>
                <HStack spacing='24px'>
                    <NumberInput isDisabled width='135px' size='sm' min={1} max={10} value={esmConfig.maximumConcurrency} onChange={(v) => setEsmConfig((esmConfig) => ({ ...esmConfig, maximumConcurrency: Number(v)}))}>
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                    <Slider isDisabled aria-label='slider-ex-1' value={esmConfig.maximumConcurrency} min={1} max={10} onChange={(v) => setEsmConfig((esmConfig) => ({ ...esmConfig, maximumConcurrency: v}))}>
                        <SliderTrack>
                            <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                    </Slider>
                </HStack>
            </FormControl>
            <FormControl>
                <HStack justifyContent={"space-between"}>
                    <FormLabel>Batch size</FormLabel>
                    <Button variant={"outline"} size={"sm"} onClick={() => setEsmConfig((esmConfig) => ({ ...esmConfig, batchSize: 10}))}>Reset to default</Button>
                </HStack>
                <HStack spacing='24px'>
                    <NumberInput width='135px' size='sm' min={0} max={43200} value={esmConfig.batchSize} onChange={(v) => setEsmConfig((esmConfig) => ({ ...esmConfig, batchSize: Number(v)}))}>
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                    <Slider aria-label='slider-ex-1' value={esmConfig.batchSize} min={1} max={10} onChange={(v) => setEsmConfig((esmConfig) => ({ ...esmConfig, batchSize: v}))}>
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