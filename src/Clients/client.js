import { ApolloClient, InMemoryCache } from 'apollo-boost'
import { createUploadLink } from 'apollo-upload-client'
import { url, port } from './client-config'

const link = createUploadLink({ uri: `http://${url}:${port}/graphql` });

export const client = new ApolloClient({
    link,
    cache: new InMemoryCache()
});