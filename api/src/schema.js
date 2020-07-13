const { gql } = require('apollo-server-express');


// Construct a schema, using GraphQL's schema language
const typeDefs = gql`
    type Query {
        hello: String
        notes: [Note!]!
        note(id: ID!): Note!
    }

    type Note {
        id: ID!
        content: String!
        author: String!
    }

    type Mutation {
        newNote(content: String!): Note!
    }
`;

module.exports = typeDefs;