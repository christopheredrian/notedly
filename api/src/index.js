// index.js
// This is the main entry point of our application
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

let notes = [
  { id: "1", content: 'This is a note', author: 'Adam Scott' },
  { id: "2", content: 'This is another note', author: 'Harlow Everly' },
  { id: "3", content: 'Hey! This is another note', author: 'Riley Harrison' }
];

const port = process.env.PORT || 4000;

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

// Provide resolver functions for our shema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    notes: () => notes,
    note: (parent, args, context, info) => {
      return notes.find(note => note.id === args.id);
    }
  },
  Mutation: {
    newNote: (parent, args) => {
      const noteValue = {
        id: String(notes.length + 1),
        content: args.content,
        author: args.author || "Chris Esp",
      };
      notes.push(noteValue);
      return noteValue;
    }
  }
};

const app = express();

// Apollo server setup
const server = new ApolloServer({
  typeDefs,
  resolvers
});

// Apply the GraphQL middleware and set the path to /api
server.applyMiddleware({ app, path: '/api' });

app.listen({ port }, () => {
  console.log(`GraphQL server running at http://localhost:${port}${server.graphqlPath}`);
});