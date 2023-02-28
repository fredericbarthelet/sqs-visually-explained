import { FunctionComponent } from "react";
import { Card, CardHeader, CardBody, Flex, Image, Text } from "@chakra-ui/react";
import { Event } from './Event';
import functionLogo from './assets/function.svg';

type FunctionProps = {
    id: string;
    starting: boolean;
    events: { id: string }[];
}

export const Function: FunctionComponent<FunctionProps> = ({ starting, events }) => {
    return (
        <Card minW='md' direction='row'>
            <CardHeader>
                <Image width='40px' src={functionLogo} />
            </CardHeader>
            <CardBody>
                {starting && (
                    <Text>Starting...</Text>
                )}
                <Flex flexWrap={"wrap"}>
                    {events.map(({ id }) => (<Event active={true} key={id} />))}
                </Flex>
            </CardBody>
        </Card>
    )
}