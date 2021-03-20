const express = require('express');
const app = express();
const port = 8080;

app.listen(port, () => {
    console.log(`Start sever at http://localhost:${port}`)
})

// Graphql
const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const fs = require('fs');
const path = require('path');

const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const User = require('./resolvers/User')
const Link = require('./resolvers/Link')

const resolvers = {
    Query,
    Mutation,
    User,
    Link
}

const { getUserId } = require('./utils');

const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf8'
    ),
    resolvers,
    context: ({ req }) => {
        return {
            ...req,
            prisma,
            userId:
                req && req.headers.authorization
                    ? getUserId(req)
                    : null
        };
    }
})

// Route
app.use('/', require('./routes/home'));