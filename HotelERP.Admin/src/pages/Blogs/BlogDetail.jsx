import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Chip,
  Avatar,
  Divider,
  Card,
  CardContent,
  CardMedia,
  Button,
  Grid
} from '@mui/material';
import {
  AccessTime,
  Person,
  Visibility,
  ArrowBack,
  CalendarToday
} from '@mui/icons-material';
import { API_BASE_URL } from '../../config/api';

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogDetail();
  }, [slug]);

  const fetchBlogDetail = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/Blog/slug/${slug}`);
      setBlog(response.data);
      
      // Fetch related blogs from same category
      if (response.data.categoryID) {
        fetchRelatedBlogs(response.data.categoryID, response.data.blogID);
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async (categoryId, currentBlogId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Blog`, {
        params: {
          categoryId,
          pageSize: 3,
          isPublished: true
        }
      });
      // Filter out current blog
      const filtered = response.data.items?.filter(b => b.blogID !== currentBlogId) || [];
      setRelatedBlogs(filtered.slice(0, 3));
    } catch (error) {
      console.error('Error fetching related blogs:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!blog) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>Blog not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Back Button */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/blog')}
          sx={{ mb: 3 }}
        >
          Back to Blogs
        </Button>

        {/* Featured Image */}
        {blog.featuredImage && (
          <Box
            component="img"
            src={`https://api.thesintrahotel.com${blog.featuredImage}`}
            alt={blog.title}
            sx={{
              width: '100%',
              height: 400,
              objectFit: 'cover',
              borderRadius: 3,
              mb: 4,
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
            }}
          />
        )}

        {/* Blog Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <Chip
              label={blog.category?.categoryName || 'Uncategorized'}
              color="primary"
              sx={{ fontWeight: 'bold' }}
            />
            {blog.isFeatured && (
              <Chip
                label="Featured"
                sx={{
                  background: 'linear-gradient(45deg, #FFD700 30%, #FFA500 90%)',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              />
            )}
            {blog.tags?.map((tag, index) => (
              <Chip key={index} label={tag} variant="outlined" size="small" />
            ))}
          </Box>

          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 3 }}>
            {blog.title}
          </Typography>

          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            {blog.excerpt}
          </Typography>

          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <Person />
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {blog.author}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Author
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarToday sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {new Date(blog.publishedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTime sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {blog.readTime}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Visibility sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {blog.viewCount} views
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Blog Content */}
        <Box
          sx={{
            mb: 6,
            '& img': {
              maxWidth: '100%',
              height: 'auto',
              borderRadius: 2,
              my: 3
            },
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              fontWeight: 'bold',
              mt: 4,
              mb: 2
            },
            '& p': {
              fontSize: '1.1rem',
              lineHeight: 1.8,
              mb: 2,
              color: 'text.primary'
            },
            '& ul, & ol': {
              pl: 4,
              mb: 2
            },
            '& li': {
              fontSize: '1.1rem',
              lineHeight: 1.8,
              mb: 1
            },
            '& a': {
              color: 'primary.main',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            },
            '& blockquote': {
              borderLeft: '4px solid',
              borderColor: 'primary.main',
              pl: 3,
              py: 1,
              my: 3,
              fontStyle: 'italic',
              bgcolor: 'rgba(0,0,0,0.02)'
            }
          }}
          dangerouslySetInnerHTML={{ __html: blog.contentHTML }}
        />

        {/* Blog Images Gallery */}
        {blog.images && blog.images.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
              Gallery
            </Typography>
            <Grid container spacing={2}>
              {blog.images.map((image, index) => (
                <Grid item xs={12} sm={6} md={4} key={image.imageID || index}>
                  <Box
                    component="img"
                    src={`https://api.thesintrahotel.com${image.imagePath}`}
                    alt={image.altText || `Gallery image ${index + 1}`}
                    sx={{
                      width: '100%',
                      height: 250,
                      objectFit: 'cover',
                      borderRadius: 2,
                      cursor: 'pointer',
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  />
                  {image.caption && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      {image.caption}
                    </Typography>
                  )}
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        <Divider sx={{ mb: 4 }} />

        {/* Related Blogs */}
        {relatedBlogs.length > 0 && (
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
              Related Stories
            </Typography>
            <Grid container spacing={3}>
              {relatedBlogs.map((relatedBlog) => (
                <Grid item xs={12} md={4} key={relatedBlog.blogID}>
                  <Card
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                      }
                    }}
                    onClick={() => navigate(`/blog/${relatedBlog.slug}`)}
                  >
                    <CardMedia
                      component="img"
                      height="180"
                      image={relatedBlog.featuredImage || '/placeholder-blog.jpg'}
                      alt={relatedBlog.title}
                    />
                    <CardContent>
                      <Chip
                        label={relatedBlog.category?.categoryName || 'Uncategorized'}
                        size="small"
                        color="primary"
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {relatedBlog.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {relatedBlog.excerpt?.substring(0, 100)}...
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {relatedBlog.readTime}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default BlogDetail;
