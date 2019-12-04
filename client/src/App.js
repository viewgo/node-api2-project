import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import axios from "axios";

const api = "http://localhost:9000/api/posts"

function App() {

  const [posts, setPosts] = useState([]);
  const [change, setChange] = useState(false);

  useEffect(() => {
    axios
      .get(api)
      .then(response => {
        console.log("GET response", response);
        setPosts(response.data);
      })
  }, [change])


  return (
    <div className="App">
      {posts.map(post => (
        <div className="blog-post" key={post.id}>
        <h2>{post.title}</h2>
        <p>{post.contents}</p>
        </div>
      )
      )}


    </div>
  );
}

export default App;
