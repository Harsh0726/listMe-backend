const router = require("express").Router();
const Post = require("../models/Post");

//create a post
router.post("/", async (req,res)=>{
    const newPost = new Post(req.body);
    try{
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

//update a post
router.put("/:id", async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        if(post.userId === req.body.userId){
            await post.updateOne({$set:req.body});
            res.status(200).json("The post has been updated");  
        }
        else{
            res.status(403).json("You can update only your post");
        }
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
    
});

//delete a post
router.delete("/:id", async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        if(post.userId === req.body.userId){
            await post.deleteOne();
            res.status(200).json("The post has been deleted");  
        }
        else{
            res.status(403).json("You can delete only your post");
        }
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
    
});

//get a post
router.get("/:id", async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.status(200).json(post);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
})

module.exports = router;