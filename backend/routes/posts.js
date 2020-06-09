const express = require("express");
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');
const postController = require("../controllers/post");
const router = express.Router();



router.post("/api/posts",checkAuth,extractFile, postController.postData );

router.put("/api/posts/:id",checkAuth,extractFile, postController.editData );

router.get("/api/posts/:id", postController.getById);

router.get('/api/posts', postController.retrieveAll);

router.delete('/api/posts/:id',checkAuth, postController.delete);

module.exports = router;
