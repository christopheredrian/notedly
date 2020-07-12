// index.js
// This is the main entry point of our application
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
require('dotenv').config();

// dotenv
const db = require('./db');
const models = require('./models');

// database
const DB_HOST = process.env.DB_HOST;
const port = process.env.PORT || 4000;


let notes = [
  { id: '1', content: 'This is a note', author: 'Adam Scott' },
  { id: '2', content: 'This is another note', author: 'Harlow Everly' },
  { id: '3', content: 'Hey! This is another note', author: 'Riley Harrison' }
];


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
    notes: async () => {
      return await models.Note.find();
    },
    note: (parent, args, context, info) => {
      return models.Note.findById(args.id);
    }
  },
  Mutation: {
    newNote: async (parent, args) => {
      return await models.Note.create({
        content: args.content,
        author: args.author || 'Chris Esp'
      });
    }
  }
};

const app = express();

db.connect(DB_HOST);

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