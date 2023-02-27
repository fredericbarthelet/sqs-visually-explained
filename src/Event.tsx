import type { FunctionComponent } from "react";
import { Box, Fade } from "@chakra-ui/react";

export type EventProps = {
    active: boolean;
}

export const Event: FunctionComponent<EventProps> = ({ active }) => (
    <Fade in={true}>
        <Box w={'30px'} h={'15px'} backgroundColor={active ? "blue.200" : "grey"} borderRadius={'15px'} m={'2px'}/>
    </Fade>
)