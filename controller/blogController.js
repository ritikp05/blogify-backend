
const Blog = require("../model/blog");
async function addBlog(req, res) {
  const { title, description, category, image } = req.body;

  try {
    const blog = await Blog.create({
      userId: req.user._id,
      title,
      description,
      image,
      category,
      views:0,
    });
    if (!blog) {
      return res.status(403).json({
        msg: "something went wrong",
      });
    }
    return res.status(200).json({
      msg: "Blog created Sucessfully",
      blog,
    });
  } catch (err) {
    return res.status(403).json({
      msg: err.message,
    });
  }
}

async function getBlogs(req, res) {
  const category = req.params.category;
  try {
    if (category === "all") {
      const blogs = await Blog.find({}).populate("userId", "-password");
      return res.status(200).json({
        blogs,
      });
    }

    const blogs = await Blog.find({ category: category }).populate(
      "userId",
      "-password"
    );

    if (!blogs) {
      return res.status(400).json({
        msg: "no blogs",
      });
    }
    return res.status(200).json({
      blogs,
    });
  } catch (err) {
    return res.status(400).json({
      msg: err.message,
    });
  }
}

async function getSingleBLog(req, res) {
  const id = req.params.id;
  try {
    const blog = await Blog.findById(id).populate("userId", "-password");
    if (!blog) {
      return res.status(404).send({
        msg: "No blog found",
      });
    }
    return res.status(200).send({
      blog,
    });
  } catch (err) {
    res.send({
      msg: err.message,
    });
  }
}

async function editBlog(req, res) {
  const id = req.params.id;

  try {
    const blog = await Blog.findById(id);
    if (blog.userId == req.user._id) {
      const updatedBlog = await Blog.findByIdAndUpdate(id, req.body);
      return res.json({
        blog: updatedBlog,
      });
    }
    res.status(403).json({
      msg: "You can only edit blogs published by you",
    });
  } catch (err) {
    res.status(403).json({
      msg: err.message,
    });
  }
}

async function deleteBlog(req, res) {
  const id = req.params.id;

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      res.status(400).json({
        msg: "blog not found",
      });
    }

    if (blog.userId != req.user._id) {
      return res
        .status(403)
        .json({ msg: " You can only delete your own blogs" });
    }

    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) {
      return res
        .status(500)
        .json({ msg: "Internal server error: Failed to delete blog" });
    }

    return res.json({ msg: "Blog deleted successfully", deletedBlog });
  } catch (err) {
    console.error("Error deleting blog:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
}

module.exports = { addBlog, getBlogs, editBlog, deleteBlog, getSingleBLog };
