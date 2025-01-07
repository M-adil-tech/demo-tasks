import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Container,
  TextField,
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  IconButton,
  Badge,
  Grid,
} from '@mui/material';
import { Favorite, Share, Comment } from '@mui/icons-material';

const SocialFeed = () => {
  const [posts, setPosts] = useState(() => {
    const savedPosts = localStorage.getItem("posts");
    return savedPosts ? JSON.parse(savedPosts) : [];
  });
  const [newPostText, setNewPostText] = useState("");
  const [newPostImage, setNewPostImage] = useState(null);

  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(posts));
  }, [posts]);

  const handlePostCreation = () => {
    if (!newPostText && !newPostImage) return;

    const newPost = {
      id: uuidv4(),
      user: {
        name: "Current User",
        profilePicture: "https://via.placeholder.com/50",
      },
      timestamp: new Date().toLocaleString(),
      content: newPostText,
      image: newPostImage ? URL.createObjectURL(newPostImage) : null,
      likes: 0,
      comments: 0,
    };

    setPosts([newPost, ...posts]);
    setNewPostText("");
    setNewPostImage(null);
  };

  const handleLike = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const handleComment = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, comments: post.comments + 1 } : post
      )
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const mockPost = {
        id: uuidv4(),
        user: {
          name: "Mock User",
          profilePicture: "https://via.placeholder.com/50",
        },
        timestamp: new Date().toLocaleString(),
        content: "This is a mock post.",
        image: null,
        likes: 0,
        comments: 0,
      };
      setPosts((prevPosts) => [mockPost, ...prevPosts]);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Container maxWidth="md" style={{ marginTop: '20px' }}>
      <Card
        style={{
          marginBottom: '20px',
          padding: '20px',
          backgroundColor: '#f3f4f6',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h6" gutterBottom style={{ fontWeight: 600 }}>
          Create a Post
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          multiline
          rows={4}
          placeholder="What's on your mind?"
          value={newPostText}
          onChange={(e) => setNewPostText(e.target.value)}
          style={{ marginBottom: '10px', backgroundColor: '#fff' }}
        />
        <input
          type="file"
          onChange={(e) => setNewPostImage(e.target.files[0])}
          style={{ marginBottom: '10px' }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handlePostCreation}
          style={{ textTransform: 'none' }}
        >
          Post
        </Button>
      </Card>

      <div className="feed">
        {posts.map((post) => (
          <Card
            key={post.id}
            style={{
              marginBottom: '20px',
              backgroundColor: '#fff',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
              borderRadius: '10px',
            }}
          >
            <CardHeader
              avatar={<Avatar src={post.user.profilePicture} />}
              title={
                <Typography variant="h6" style={{ fontWeight: 500 }}>
                  {post.user.name}
                </Typography>
              }
              subheader={
                <Typography
                  variant="body2"
                  color="textSecondary"
                  style={{ fontSize: '0.85rem' }}
                >
                  {post.timestamp}
                </Typography>
              }
            />
            <CardContent>
              <Typography variant="body1" style={{ marginBottom: '10px' }}>
                {post.content}
              </Typography>
              {post.image && (
                <img
                  src={post.image}
                  alt="Post content"
                  style={{
                    marginTop: '10px',
                    maxWidth: '100%',
                    borderRadius: '8px',
                  }}
                />
              )}
            </CardContent>
            <CardActions disableSpacing>
              <IconButton
                onClick={() => handleLike(post.id)}
                color="primary"
              >
                <Badge badgeContent={post.likes} color="secondary">
                  <Favorite />
                </Badge>
              </IconButton>
              <IconButton
                onClick={() => handleComment(post.id)}
                color="primary"
              >
                <Badge badgeContent={post.comments} color="secondary">
                  <Comment />
                </Badge>
              </IconButton>
              <IconButton color="primary">
                <Share />
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </div>
    </Container>
  );
};

export default SocialFeed;
