const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL's schema language
const typeDefs = gql`
    
    scalar DateTime
    
    type Query {
        hello: String
        notes: [Note!]!
        note(id: ID!): Note!
    }

    type Note {
        id: ID!
        content: String!
        author: String!
        createdAt: DateTime,
        updatedAt: DateTime
    }

    type Mutation {
        newNote(content: String!): Note!
        updateNote(id: ID!, content: String): Note!
        deleteNote(id: ID!): Boolean!
    }
`;

module.exports = typeDefs;