const express = require("express");
const router = express.Router();
const cors = require("cors");

const posts = require("../data/db");

router.use(express.json());
router.use(cors());

router.get("/", (req, res) => {
  posts
    .find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      console.log(`error on GET /posts`, err);
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;

  posts
    .findById(id)
    .then(post => {
      if (post.length > 0) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      console.log(`error on GET /posts/:id`, err);
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});

router.post("/", (req, res) => {
  const body = req.body;
  console.log(req.body);

  if (!body.title || !body.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  } else {
    posts
      .insert(body)
      .then(post => {
        res.status(201).json(post);
      })
      .catch(err => {
        console.log("error on POST /posts", err);
        res.status(500).json({
          error: "There was an error while saving the post to the database"
        });
      });
  }
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;

  posts
    .remove(id)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: "Post removed successfully" });
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      console.log("error on DELETE /posts/:id", err);
      res.status(500).json({ error: "The post could not be removed" });
    });
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const body = req.body;

  if (!body.title || !body.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  } else {
    posts
      .update(id, body)
      .then(post => {
        if (post) {
          res.status(200).json(post);
        } else {
          res.status(404).json({
            message: "The post with the specified ID does not exist."
          });
        }
      })
      .catch(err => {
        console.log("error on PUT /posts/:id", err);
        res
          .status(500)
          .json({ error: "The post information could not be modified." });
      });
  }
});

router.get("/:id/comments", (req, res) => {
  const id = req.params.id;
  posts
    .findPostComments(id)
    .then(comment => {
      if (comment.length > 0) {
        res.status(200).json(comment);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      console.log(`error on GET /posts/:id/comments`, err);
      res
        .status(500)
        .json({ error: "The comments information could not be retrieved." });
    });
});

router.post("/:id/comments", (req, res) => {
  const id = req.params.id;
  const body = req.body;

  console.log(body);

  posts.findById(id).then(post => {
    if (post.length > 0) {
      //ACTUAL COMMENT POST
      if (!body.text) {
        res
          .status(400)
          .json({ errorMessage: "Please provide text for the comment." });
      } else {

        const newBody = {...body, post_id: id};
        console.log(newBody);

        posts
          .insertComment(newBody)
          .then(comment => {
            res.status(201).json(comment);
          })
          .catch(err => {
            console.log("error on POST /posts/:id/comments", err);
            res.status(500).json({
              error:
                "There was an error while saving the comment to the database"
            });
          });
      }
      //////////////////////////
    } else {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    }
  });

});

module.exports = router;
