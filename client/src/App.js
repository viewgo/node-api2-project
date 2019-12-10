import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

import axios from "axios";

const api = "http://localhost:9000/api/posts";

function App() {
  const [posts, setPosts] = useState([]);
  const [change, setChange] = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    axios
      .get(api)
      .then(response => {
        setPosts(response.data);
      })
      .catch(err => {
        console.log("error: ", err);
      });
  }, [change]);

  useEffect(() => {
    if (posts.length > 0) {
      const newComments = [];
      posts.map(post => {
        axios
          .get(`${api}/${post.id}/comments`)
          .then(response => {
            newComments.push({ data: response.data, id: post.id });
            setComments(newComments);
          })
          .catch(err => {
            console.log("error: ", err);
          });
      });
    }
  }, [posts]);

  return (
    <div className="App">
      <h1>Blog Posts</h1>
      <div className="post-list">
        {posts.map(post => (
          <div className="blog-post" key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.contents}</p>

            {comments.map(comment => {

              if (comment.id === post.id) {

                return(
                comment.data.map(i => {
                  return <h6>{i.text}</h6>;
                }))

              }

            })}
            
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
