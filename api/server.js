const express = require("express");

const postsRouter = require('../posts/posts-router');

const server = express();

server.get("/", (req, res) => {
  res.send(`
    <h2>Blog Posts API</h>
    <p>Welcome to the Blog Posts API</p>
  `);
});

server.use("/api/posts", postsRouter);

module.exports = server;