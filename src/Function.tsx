import { FunctionComponent } from "react";
import { Card, CardHeader, CardBody, Flex, Text, Image } from "@chakra-ui/react";
import { Event } from './Event';
import functionLogo from './assets/function.svg';

type FunctionProps = {
    id: string;
    events: { id: string }[];
}

export const Function: FunctionComponent<FunctionProps> = ({ id, events }) => {
    return (
        <Card direction='row'>
            <CardHeader>
                <Image width='40px' src={functionLogo} />
            </CardHeader>
            <CardBody>
                <Flex flexWrap={"wrap"}>
                    {events.map(({ id }) => (<Event active={true} key={id} />))}
                </Flex>
            </CardBody>
        </Card>
    )
}