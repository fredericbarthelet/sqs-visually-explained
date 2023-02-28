import { FunctionComponent } from "react";
import { FormControl, FormLabel, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Button, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, HStack, VStack } from "@chakra-ui/react";



type FunctionConfigProps = {
    functionConfig: {
        timeout: number
    },
    setFunctionConfig: React.Dispatch<React.SetStateAction<{
        timeout: number
    }>>
}

export const FunctionConfig: FunctionComponent<FunctionConfigProps> = ({ functionConfig, setFunctionConfig }) => {
    return (
        <VStack spacing='20px'>
            <FormControl>
                <HStack justifyContent={"space-between"}>
                    <FormLabel>Timeout</FormLabel>
                    <Button isDisabled variant={"outline"} size={"sm"} onClick={() => setFunctionConfig((functionConfig) => ({ ...functionConfig, timeout: 3}))}>Reset to default</Button>
                </HStack>
                <HStack spacing='24px'>
                    <NumberInput isDisabled width='135px' size='sm' min={1} max={900} value={functionConfig.timeout} onChange={(v) => setFunctionConfig((functionConfig) => ({ ...functionConfig, timeout: Number(v)}))}>
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                    <Slider isDisabled aria-label='slider-ex-1' value={functionConfig.timeout} min={1} max={900} onChange={(v) => setFunctionConfig((functionConfig) => ({ ...functionConfig, timeout: v}))}>
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