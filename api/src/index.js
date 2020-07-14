// index.js
// This is the main entry point of our application
const express = require('express');
const jwt = require('jsonwebtoken');

const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

require('dotenv').config();

// dotenv
const db = require('./db');
const models = require('./models');

// database
const DB_HOST = process.env.DB_HOST;
const port = process.env.PORT || 4000;


const app = express();

db.connect(DB_HOST);

const getUser = token => {
  if (token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      throw new Error("Session invalid.");
    }
  }
};

// Apollo server setup
const server = new ApolloServer({
  typeDefs,
  // Provide resolver functions for our shema fields
  resolvers,
  context: ({req}) => {
    // get the user token form the headers
    const token = req.headers.authorization;

    // try to retrieve a user with the token
    const user = getUser(token);

    console.log(user);

    return { models, user };
  }
});

// Apply the GraphQL middleware and set the path to /api
server.applyMiddleware({ app, path: '/api' });

app.listen({ port }, () => {
  console.log(`GraphQL server running at http://localhost:${port}${server.graphqlPath}`);
});