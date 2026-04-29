import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Chip,
  Button,
  Divider,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Avatar,
  CircularProgress,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  ArrowBack as BackIcon,
  Visibility as ViewIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import Seo from '../components/Seo';
import { apiConfig } from '../config/api';

const API_BASE_URL = apiConfig.baseURL;
const IMAGE_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');

// Helper function to get full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/800x400?text=Blog+Image';
  if (imagePath.startsWith('http')) return imagePath;
  return `${IMAGE_BASE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

const BlogDetailsDynamic = () => {
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
      const filtered = response.data.data?.filter(b => b.blogID !== currentBlogId) || [];
      setRelatedBlogs(filtered.slice(0, 3));
    } catch (error) {
      console.error('Error fetching related blogs:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!blog) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Seo
          title="Blog"
          description="Blog post not found at Luxury Hotel. Browse our latest stories, travel tips, and hotel updates across Pakistan."
          keywords="Luxury Hotel blog, travel tips Pakistan, hotel news, travel guides, offers, updates"
          robots="noindex,nofollow"
        />
        <Typography variant="h4">Blog not found</Typography>
        <Button
          component={Link}
          to="/blogs"
          startIcon={<BackIcon />}
          sx={{ mt: 2 }}
        >
          Back to Blogs
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Seo
        title={blog?.title || 'Blog'}
        description={blog?.excerpt || 'Read our latest stories, travel tips, and hotel updates.'}
        keywords={Array.isArray(blog?.tags) && blog.tags.length > 0
          ? blog.tags.join(', ')
          : 'hotel blog, travel tips, hotel news, updates'}
        ogImage={blog?.featuredImage ? getImageUrl(blog.featuredImage) : undefined}
        ogType="article"
      />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Back Button */}
        <Button
          component={Link}
          to="/blogs"
          startIcon={<BackIcon />}
          sx={{
            mb: 4,
            color: '#2563eb',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: '#eff6ff',
            },
          }}
        >
          Back to Blogs
        </Button>

        {/* Featured Image */}
        {blog.featuredImage && (
          <Box
            component="img"
            src={getImageUrl(blog.featuredImage)}
            alt={blog.title}
            sx={{
              width: '100%',
              height: { xs: 300, md: 500 },
              objectFit: 'cover',
              borderRadius: 3,
              mb: 4,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            }}
          />
        )}

        {/* Blog Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <Chip
              label={blog.category?.categoryName || 'Uncategorized'}
              sx={{
                backgroundColor: '#2563eb',
                color: 'white',
                fontWeight: 600,
              }}
            />
            {blog.isFeatured && (
              <Chip
                label="Featured"
                sx={{
                  backgroundColor: '#fbbf24',
                  color: 'white',
                  fontWeight: 600,
                }}
              />
            )}
            {blog.tags?.map((tag, index) => (
              <Chip key={index} label={tag} variant="outlined" size="small" />
            ))}
          </Box>

          <Typography
            variant="h2"
            sx={{
              fontFamily: 'Playfair Display',
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '3rem' },
              mb: 2,
              color: '#111827',
              lineHeight: 1.2,
            }}
          >
            {blog.title}
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: '#6b7280',
              mb: 3,
              lineHeight: 1.6,
            }}
          >
            {blog.excerpt}
          </Typography>

          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ bgcolor: '#2563eb', width: 40, height: 40 }}>
                <PersonIcon />
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#111827' }}>
                  {blog.author}
                </Typography>
                <Typography variant="caption" sx={{ color: '#6b7280' }}>
                  Author
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarIcon sx={{ fontSize: 18, color: '#6b7280' }} />
              <Typography variant="body2" sx={{ color: '#6b7280' }}>
                {new Date(blog.publishedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TimeIcon sx={{ fontSize: 18, color: '#6b7280' }} />
              <Typography variant="body2" sx={{ color: '#6b7280' }}>
                {blog.readTime}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ViewIcon sx={{ fontSize: 18, color: '#6b7280' }} />
              <Typography variant="body2" sx={{ color: '#6b7280' }}>
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
              fontWeight: 700,
              mt: 4,
              mb: 2,
              color: '#111827'
            },
            '& h2': {
              fontSize: '2rem',
            },
            '& h3': {
              fontSize: '1.5rem',
            },
            '& p': {
              fontSize: '1.125rem',
              lineHeight: 1.8,
              mb: 2,
              color: '#374151'
            },
            '& ul, & ol': {
              pl: 4,
              mb: 2
            },
            '& li': {
              fontSize: '1.125rem',
              lineHeight: 1.8,
              mb: 1,
              color: '#374151'
            },
            '& a': {
              color: '#2563eb',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            },
            '& blockquote': {
              borderLeft: '4px solid #2563eb',
              pl: 3,
              py: 1,
              my: 3,
              fontStyle: 'italic',
              bgcolor: '#eff6ff',
              borderRadius: 1
            }
          }}
          dangerouslySetInnerHTML={{ __html: blog.contentHTML }}
        />

        {/* Blog Images Gallery */}
        {blog.images && blog.images.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: '#111827' }}>
              Gallery
            </Typography>
            <Grid container spacing={2}>
              {blog.images.map((image, index) => (
                <Grid item xs={12} sm={6} md={4} key={image.imageID || index}>
                  <Box
                    component="img"
                    src={getImageUrl(image.imagePath)}
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
                    <Typography variant="caption" sx={{ mt: 1, display: 'block', color: '#6b7280' }}>
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
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: '#111827' }}>
              Related Stories
            </Typography>
            <Grid container spacing={3}>
              {relatedBlogs.map((relatedBlog) => (
                <Grid item xs={12} md={4} key={relatedBlog.blogID}>
                  <Card
                    component={Link}
                    to={`/blog/${relatedBlog.slug}`}
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      textDecoration: 'none',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="180"
                      image={getImageUrl(relatedBlog.featuredImage)}
                      alt={relatedBlog.title}
                    />
                    <CardContent>
                      <Chip
                        label={relatedBlog.category?.categoryName || 'Uncategorized'}
                        size="small"
                        sx={{ mb: 1, backgroundColor: '#2563eb', color: 'white' }}
                      />
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#111827' }}>
                        {relatedBlog.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6b7280', mb: 2 }}>
                        {relatedBlog.excerpt?.substring(0, 100)}...
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TimeIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                        <Typography variant="caption" sx={{ color: '#6b7280' }}>
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

export default BlogDetailsDynamic;
