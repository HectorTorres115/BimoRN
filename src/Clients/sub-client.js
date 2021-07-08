import { ApolloClient, InMemoryCache, split } from 'apollo-client-preset';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import {url, port} from '../Clients/client-config'

const wsLink = new WebSocketLink({
    uri: `ws://${url}:${port}/graphql`,
    options: {
        reconnect: true,
        inactivityTimeout: 0    
    },  
});

const link = split(
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink
);

export const subClient = new ApolloClient({
    link,
    cache: new InMemoryCache(),
});