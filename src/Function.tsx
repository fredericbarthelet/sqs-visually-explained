import { FunctionComponent } from "react";
import { Card, CardHeader, CardBody, Flex, Text } from "@chakra-ui/react";
import { Event } from './Event';

type FunctionProps = {
    id: string;
    events: { id: string }[];
}

export const Function: FunctionComponent<FunctionProps> = ({ id, events }) => {
    return (
        <Card>
            <CardHeader>
                <Text>Lambda id: {id}</Text>
            </CardHeader>
            <CardBody>
                <Flex flexWrap={"wrap"}>
                    {events.map(({ id }) => (<Event active={true} key={id} />))}
                </Flex>
            </CardBody>
        </Card>
    )
}