import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Avatar,
  Grid,
  Pagination
} from '@mui/material';
import { AccessTime, Person } from '@mui/icons-material';
import { API_BASE_URL } from '../../config/api';

const BlogList = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchFeaturedBlogs();
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [selectedCategory, page]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Blog/categories`);
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchFeaturedBlogs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Blog/featured?count=3`);
      setFeaturedBlogs(response.data || []);
    } catch (error) {
      console.error('Error fetching featured blogs:', error);
    }
  };

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const params = {
        pageNumber: page,
        pageSize: 8,
        isPublished: true
      };
      
      if (selectedCategory !== 'all') {
        params.categoryId = selectedCategory;
      }

      const response = await axios.get(`${API_BASE_URL}/Blog`, { params });
      setBlogs(response.data.items || []);
      setTotalCount(response.data.totalCount || 0);
      setTotalPages(Math.ceil(response.data.totalCount / 8));
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setPage(1);
  };

  const handleBlogClick = (slug) => {
    navigate(`/blog/${slug}`);
  };

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          mb: 6
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
            Travel Blog
          </Typography>
          <Typography variant="h6" sx={{ textAlign: 'center', opacity: 0.9 }}>
            Discover Pakistan's hidden gems, unforgettable experiences, and culinary delights through our curated collection of stories and guides.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Category Filter */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
            Explore Our Stories
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant={selectedCategory === 'all' ? 'contained' : 'outlined'}
              onClick={() => handleCategoryChange('all')}
              sx={{ borderRadius: 5, px: 3 }}
            >
              All Posts ({totalCount})
            </Button>
            {categories.map((category) => (
              <Button
                key={category.categoryID}
                variant={selectedCategory === category.categoryID ? 'contained' : 'outlined'}
                onClick={() => handleCategoryChange(category.categoryID)}
                sx={{ borderRadius: 5, px: 3 }}
              >
                {category.categoryName} ({category.postCount || 0})
              </Button>
            ))}
          </Box>
        </Box>

        {/* Featured Stories */}
        {featuredBlogs.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
              Featured Stories
            </Typography>
            <Grid container spacing={3}>
              {featuredBlogs.map((blog) => (
                <Grid item xs={12} md={4} key={blog.blogID}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                      }
                    }}
                    onClick={() => handleBlogClick(blog.slug)}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={blog.featuredImage ? `https://api.thesintrahotel.com${blog.featuredImage}` : '/placeholder-blog.jpg'}
                        alt={blog.title}
                      />
                      <Chip
                        label="Featured"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 12,
                          left: 12,
                          background: 'linear-gradient(45deg, #FFD700 30%, #FFA500 90%)',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                      <Chip
                        label={blog.category?.categoryName || 'Uncategorized'}
                        size="small"
                        color="primary"
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {blog.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {blog.excerpt}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
                            <Person sx={{ fontSize: 16 }} />
                          </Avatar>
                          <Typography variant="caption">{blog.author}</Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(blog.publishedDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {blog.readTime}
                        </Typography>
                      </Box>
                    </CardContent>
                    <Box sx={{ p: 2, pt: 0 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        sx={{
                          borderRadius: 5,
                          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #1976D2 30%, #00ACC1 90%)',
                          }
                        }}
                      >
                        Read More →
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* All Stories */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
            All Stories
          </Typography>
          <Grid container spacing={3}>
            {blogs.map((blog) => (
              <Grid item xs={12} sm={6} md={3} key={blog.blogID}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                    }
                  }}
                  onClick={() => handleBlogClick(blog.slug)}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="160"
                      image={blog.featuredImage ? `https://api.thesintrahotel.com${blog.featuredImage}` : '/placeholder-blog.jpg'}
                      alt={blog.title}
                    />
                    <Chip
                      label={blog.category?.categoryName || 'Uncategorized'}
                      size="small"
                      color="primary"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {blog.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {blog.excerpt?.substring(0, 80)}...
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Avatar sx={{ width: 20, height: 20, bgcolor: 'primary.main' }}>
                        <Person sx={{ fontSize: 14 }} />
                      </Avatar>
                      <Typography variant="caption">{blog.author}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTime sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {blog.readTime}
                      </Typography>
                    </Box>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      sx={{ borderRadius: 5 }}
                    >
                      Read More →
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
              size="large"
            />
          </Box>
        )}

        {/* Newsletter Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 4,
            p: 6,
            mb: 6,
            textAlign: 'center',
            color: 'white'
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
            Stay Updated!
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
            Subscribe to our newsletter for the latest travel tips, destination guides, and exclusive offers.
          </Typography>
          <Button
            variant="contained"
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              px: 4,
              py: 1.5,
              borderRadius: 5,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)'
              }
            }}
          >
            Subscribe
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default BlogList;
