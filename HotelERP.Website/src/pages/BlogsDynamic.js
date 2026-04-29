import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Button,
  Avatar,
  Pagination,
  CircularProgress,
} from '@mui/material';
import {
  AccessTime as TimeIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import Seo from '../components/Seo';
import { apiConfig } from '../config/api';

const API_BASE_URL = apiConfig.baseURL;
const IMAGE_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');

// Helper function to get full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return `${IMAGE_BASE_URL}/uploads/default-blog.jpg`;
  if (imagePath.startsWith('http')) return imagePath;
  
  // If path already starts with /uploads/, use it as is
  if (imagePath.startsWith('/uploads/')) {
    return `${IMAGE_BASE_URL}${imagePath}`;
  }
  
  // If path doesn't start with /, add /uploads/blogs/
  if (!imagePath.startsWith('/')) {
    return `${IMAGE_BASE_URL}/uploads/blogs/${imagePath}`;
  }
  
  return `${IMAGE_BASE_URL}${imagePath}`;
};

const BlogsDynamic = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [blogs, setBlogs] = useState([]);
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const postsPerPage = 30;

  useEffect(() => {
    fetchCategories();
    fetchFeaturedBlogs();
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [selectedCategory, currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Blog/categories`);
      const activeCategories = (response.data || []).filter(cat => cat.isActive);
      setCategories(activeCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchFeaturedBlogs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Blog/featured?count=3`);
      console.log('Featured blogs response:', response.data);
      console.log('First blog featuredImage:', response.data[0]?.featuredImage);
      console.log('First blog full object:', JSON.stringify(response.data[0]));
      setFeaturedBlogs(response.data || []);
    } catch (error) {
      console.error('Error fetching featured blogs:', error);
      console.error('Error details:', error.response?.data);
    }
  };

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        pageSize: postsPerPage,
        isPublished: true
      };
      
      if (selectedCategory !== 'all') {
        params.categoryId = selectedCategory;
      }

      const response = await axios.get(`${API_BASE_URL}/Blog`, { params });
      console.log('Blogs response:', response.data);
      setBlogs(response.data.data || []);
      setTotalCount(response.data.totalCount || 0);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / postsPerPage);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  return (
    <Box sx={{ py: 4, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Seo
        title="Blogs"
        description="Read Luxury Hotel blogs for travel inspiration, local guides, hotel updates, and special offers across Pakistan."
        keywords="Luxury Hotel blog, travel tips Pakistan, hotel news, travel guides, offers, updates"
        author="Luxury Hotel"
      />
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e40af 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h1"
              sx={{
                fontFamily: 'Playfair Display',
                fontWeight: 700,
                fontSize: { xs: '2.5rem', md: '4rem' },
                mb: 3,
                background: 'linear-gradient(45deg, #ffffff 30%, #fbbf24 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Travel Blog
            </Typography>
            <Typography
              variant="h5"
              sx={{
                opacity: 0.9,
                maxWidth: '800px',
                mx: 'auto',
                lineHeight: 1.6,
                mb: 4,
              }}
            >
              Discover Pakistan's hidden gems, cultural treasures, and culinary delights 
              through our curated collection of travel stories and guides.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 8 }}>
        {/* Category Filter */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" fontWeight="700" sx={{ mb: 4, textAlign: 'center', color: '#111827' }}>
            Explore Our Stories
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
            <Chip
              label={`All Posts (${totalCount})`}
              onClick={() => handleCategoryChange('all')}
              variant={selectedCategory === 'all' ? 'filled' : 'outlined'}
              sx={{
                px: 3,
                py: 1.5,
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                borderRadius: 3,
                height: 'auto',
                backgroundColor: selectedCategory === 'all' ? '#2563eb' : 'transparent',
                color: selectedCategory === 'all' ? 'white' : '#374151',
                borderColor: selectedCategory === 'all' ? '#2563eb' : '#d1d5db',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: selectedCategory === 'all' ? '#1d4ed8' : '#f3f4f6',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                },
              }}
            />
            {categories.map((category) => (
              <Chip
                key={category.categoryID}
                label={`${category.categoryName} (${category.postCount || 0})`}
                onClick={() => handleCategoryChange(category.categoryID)}
                variant={selectedCategory === category.categoryID ? 'filled' : 'outlined'}
                sx={{
                  px: 3,
                  py: 1.5,
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  borderRadius: 3,
                  height: 'auto',
                  backgroundColor: selectedCategory === category.categoryID ? '#2563eb' : 'transparent',
                  color: selectedCategory === category.categoryID ? 'white' : '#374151',
                  borderColor: selectedCategory === category.categoryID ? '#2563eb' : '#d1d5db',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: selectedCategory === category.categoryID ? '#1d4ed8' : '#f3f4f6',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Featured Posts */}
        {selectedCategory === 'all' && featuredBlogs.length > 0 && (
          <Box sx={{ mb: 8 }}>
            <Typography variant="h4" fontWeight="700" sx={{ mb: 4, color: '#111827' }}>
              Featured Stories
            </Typography>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { 
                xs: '1fr', 
                sm: 'repeat(2, 1fr)', 
                md: 'repeat(3, 1fr)' 
              },
              gap: 4
            }}>
              {featuredBlogs.map((post) => (
                <Card
                  key={post.blogID}
                  component={Link}
                  to={`/blog/${post.slug}`}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 16px 48px rgba(0, 0, 0, 0.18)',
                    },
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={post.featuredImage ? `${IMAGE_BASE_URL}${post.featuredImage}` : `${IMAGE_BASE_URL}/uploads/default-blog.jpg`}
                      alt={post.title}
                    />
                    <Chip
                      label="Featured"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        backgroundColor: '#fbbf24',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                      }}
                    />
                    <Chip
                      label={post.category?.categoryName || 'Uncategorized'}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        backgroundColor: '#2563eb',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                      }}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" fontWeight="700" sx={{ mb: 2, color: '#111827', lineHeight: 1.3 }}>
                      {post.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280', mb: 3, lineHeight: 1.5, flexGrow: 1 }}>
                      {post.excerpt}
                    </Typography>
                    <Box sx={{ mt: 'auto' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Avatar sx={{ width: 24, height: 24, backgroundColor: '#2563eb', fontSize: '0.75rem' }}>
                          {post.author?.charAt(0) || 'A'}
                        </Avatar>
                        <Typography variant="caption" fontWeight="600" sx={{ color: '#374151' }}>
                          {post.author}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="caption" sx={{ color: '#6b7280' }}>
                          {new Date(post.publishedDate).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#6b7280' }}>
                          {post.readTime}
                        </Typography>
                      </Box>
                      <Button
                        fullWidth
                        variant="contained"
                        endIcon={<ArrowIcon />}
                        sx={{
                          backgroundColor: '#2563eb',
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                          '&:hover': {
                            backgroundColor: '#1d4ed8',
                          },
                        }}
                      >
                        Read More
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        )}

        {/* All Stories */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" fontWeight="700" sx={{ mb: 4, color: '#111827' }}>
            All Stories
          </Typography>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : blogs.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No blog posts found
              </Typography>
            </Box>
          ) : (
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { 
                xs: '1fr', 
                sm: 'repeat(2, 1fr)', 
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)' 
              },
              gap: 3
            }}>
              {blogs.map((post) => (
                <Card
                  key={post.blogID}
                  component={Link}
                  to={`/blog/${post.slug}`}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                    },
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="160"
                      image={post.featuredImage ? `${IMAGE_BASE_URL}${post.featuredImage}` : `${IMAGE_BASE_URL}/uploads/default-blog.jpg`}
                      alt={post.title}
                    />
                    <Chip
                      label={post.category?.categoryName || 'Uncategorized'}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: '#2563eb',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                      }}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="subtitle1" fontWeight="700" sx={{ mb: 1, color: '#111827', lineHeight: 1.3 }}>
                      {post.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280', mb: 2, lineHeight: 1.4, flexGrow: 1 }}>
                      {post.excerpt?.substring(0, 80)}...
                    </Typography>
                    <Box sx={{ mt: 'auto' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Avatar sx={{ width: 20, height: 20, backgroundColor: '#2563eb', fontSize: '0.7rem' }}>
                          {post.author?.charAt(0) || 'A'}
                        </Avatar>
                        <Typography variant="caption" fontWeight="600" sx={{ color: '#374151' }}>
                          {post.author}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TimeIcon sx={{ fontSize: 14, color: '#6b7280' }} />
                        <Typography variant="caption" sx={{ color: '#6b7280' }}>
                          {post.readTime}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Box>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
              sx={{
                '& .MuiPaginationItem-root': {
                  borderRadius: 2,
                  fontWeight: 600,
                },
              }}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default BlogsDynamic;
