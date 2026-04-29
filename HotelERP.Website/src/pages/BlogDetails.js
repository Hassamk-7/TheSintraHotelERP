import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  Chip,
  Button,
  Divider,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  ArrowBack as BackIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';

const BlogDetails = () => {
  const { id } = useParams();

  // This would typically come from an API or state management
  const blogPost = {
    id: parseInt(id),
    title: 'Top 10 Tourist Destinations in Pakistan',
    content: `
      <p>Pakistan is home to some of the world's most breathtaking landscapes and cultural treasures. From the towering peaks of the Karakoram range to the ancient ruins of the Indus Valley Civilization, this diverse country offers experiences that will leave you spellbound.</p>

      <h2>1. Hunza Valley - The Crown Jewel</h2>
      <p>Nestled in the heart of the Karakoram mountain range, Hunza Valley is often called the "Shangri-La" of Pakistan. With its crystal-clear lakes, terraced fields, and snow-capped peaks, it's a paradise for nature lovers and photographers alike.</p>

      <h2>2. Skardu - Gateway to the Giants</h2>
      <p>Skardu serves as the base camp for some of the world's highest peaks, including K2. The region offers stunning landscapes with its pristine lakes like Shangrila and Satpara, making it a must-visit destination for adventure enthusiasts.</p>

      <h2>3. Swat Valley - The Switzerland of Pakistan</h2>
      <p>Known for its lush green valleys, clear streams, and snow-capped mountains, Swat Valley earned its nickname as the "Switzerland of Pakistan." The region is rich in Buddhist heritage and offers excellent opportunities for hiking and cultural exploration.</p>

      <h2>4. Lahore - The Cultural Capital</h2>
      <p>Lahore is the beating heart of Pakistani culture, home to magnificent Mughal architecture, vibrant bazaars, and some of the country's best cuisine. The Badshahi Mosque, Lahore Fort, and Shalimar Gardens are just a few of the city's architectural marvels.</p>

      <h2>5. Karachi - The City of Lights</h2>
      <p>Pakistan's largest city and economic hub, Karachi offers a unique blend of modernity and tradition. From its bustling markets and street food to its beautiful coastline, Karachi provides a true taste of urban Pakistani life.</p>

      <h2>6. Islamabad - The Planned Beauty</h2>
      <p>The capital city of Pakistan, Islamabad, is known for its modern architecture and well-planned layout. The Faisal Mosque, one of the largest mosques in the world, and the nearby Margalla Hills make it a city worth exploring.</p>

      <h2>7. Gilgit-Baltistan - Land of High Passes</h2>
      <p>This region is home to five peaks over 8,000 meters and some of the world's longest glaciers outside the polar regions. The confluence of three great mountain ranges - the Karakoram, Hindukush, and Himalayas - creates a landscape of unparalleled beauty.</p>

      <h2>8. Chitral - Valley of Festivals</h2>
      <p>Chitral is famous for its unique culture, colorful festivals, and the ancient Kalash valleys. The region offers insights into some of the world's most fascinating indigenous cultures and traditions.</p>

      <h2>9. Multan - City of Saints</h2>
      <p>Known as the "City of Saints," Multan is one of Pakistan's oldest cities with a rich spiritual heritage. The city is famous for its Sufi shrines, beautiful blue pottery, and traditional handicrafts.</p>

      <h2>10. Deosai Plains - Land of Giants</h2>
      <p>The Deosai Plains, also known as the "Land of Giants," is one of the highest plateaus in the world. During summer, it transforms into a carpet of wildflowers, making it a photographer's paradise and a unique ecosystem worth preserving.</p>

      <h2>Planning Your Journey</h2>
      <p>When planning your trip to Pakistan, consider the best time to visit each destination. The northern areas are best visited from May to October, while the southern regions can be explored year-round. Always check local conditions and travel advisories before planning your itinerary.</p>

      <p>Pakistan's tourism industry is rapidly developing, with improved infrastructure and facilities making it easier than ever to explore these incredible destinations. Whether you're seeking adventure, culture, or natural beauty, Pakistan has something extraordinary to offer every traveler.</p>
    `,
    excerpt: 'Discover the most beautiful places to visit during your stay in Pakistan, from the northern mountains to southern beaches.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    category: 'travel',
    author: 'Sarah Ahmed',
    authorBio: 'Sarah is a travel writer and photographer who has been exploring Pakistan for over 10 years. She specializes in adventure travel and cultural documentation.',
    authorImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    date: '2024-01-15',
    readTime: '8 min read',
    tags: ['Travel', 'Pakistan', 'Tourism', 'Adventure', 'Culture'],
    featured: true
  };

  const relatedPosts = [
    {
      id: 2,
      title: 'A Culinary Journey Through Pakistani Cuisine',
      excerpt: 'Experience the rich flavors and diverse culinary traditions that make Pakistani food unique.',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      category: 'food',
      readTime: '6 min read'
    },
    {
      id: 3,
      title: 'The Majestic Beauty of Northern Pakistan',
      excerpt: 'Explore the stunning mountain ranges, pristine lakes, and breathtaking valleys.',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      category: 'travel',
      readTime: '10 min read'
    },
    {
      id: 4,
      title: 'Traditional Pakistani Festivals and Celebrations',
      excerpt: 'Learn about the vibrant festivals and cultural celebrations across Pakistan.',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      category: 'culture',
      readTime: '7 min read'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Back Button */}
        <Button
          component={Link}
          to="/blogs"
          startIcon={<BackIcon />}
          sx={{
            mb: 4,
            color: '#2563eb',
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#eff6ff',
            },
          }}
        >
          Back to Blog
        </Button>

        <Grid container spacing={6}>
          {/* Main Content */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{ borderRadius: 4, overflow: 'hidden', mb: 4 }}>
              {/* Hero Image */}
              <Box sx={{ position: 'relative' }}>
                <Box
                  component="img"
                  src={blogPost.image}
                  alt={blogPost.title}
                  sx={{
                    width: '100%',
                    height: { xs: 250, md: 400 },
                    objectFit: 'cover',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                    p: 4,
                  }}
                >
                  <Chip
                    label={blogPost.category}
                    sx={{
                      backgroundColor: '#2563eb',
                      color: 'white',
                      fontWeight: 600,
                      mb: 2,
                      textTransform: 'capitalize',
                    }}
                  />
                </Box>
              </Box>

              {/* Article Content */}
              <Box sx={{ p: { xs: 3, md: 6 } }}>
                <Typography
                  variant="h3"
                  fontWeight="700"
                  sx={{
                    mb: 3,
                    color: '#111827',
                    fontFamily: 'Playfair Display',
                    lineHeight: 1.2,
                  }}
                >
                  {blogPost.title}
                </Typography>

                {/* Author and Meta Info */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                  <Avatar
                    src={blogPost.authorImage}
                    sx={{ width: 48, height: 48 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight="600" sx={{ color: '#111827' }}>
                      {blogPost.author}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CalendarIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                          {new Date(blogPost.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <TimeIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                          {blogPost.readTime}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      startIcon={<ShareIcon />}
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: '#e5e7eb',
                        color: '#6b7280',
                        '&:hover': {
                          borderColor: '#2563eb',
                          color: '#2563eb',
                        },
                      }}
                    >
                      Share
                    </Button>
                    <Button
                      startIcon={<BookmarkIcon />}
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: '#e5e7eb',
                        color: '#6b7280',
                        '&:hover': {
                          borderColor: '#2563eb',
                          color: '#2563eb',
                        },
                      }}
                    >
                      Save
                    </Button>
                  </Box>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* Article Body */}
                <Box
                  sx={{
                    '& h2': {
                      fontFamily: 'Playfair Display',
                      fontWeight: 700,
                      fontSize: '1.75rem',
                      color: '#111827',
                      mt: 4,
                      mb: 2,
                    },
                    '& h3': {
                      fontFamily: 'Playfair Display',
                      fontWeight: 600,
                      fontSize: '1.5rem',
                      color: '#111827',
                      mt: 3,
                      mb: 2,
                    },
                    '& p': {
                      fontSize: '1.1rem',
                      lineHeight: 1.8,
                      color: '#374151',
                      mb: 3,
                    },
                    '& ul, & ol': {
                      pl: 3,
                      mb: 3,
                      '& li': {
                        fontSize: '1.1rem',
                        lineHeight: 1.8,
                        color: '#374151',
                        mb: 1,
                      },
                    },
                  }}
                  dangerouslySetInnerHTML={{ __html: blogPost.content }}
                />

                <Divider sx={{ my: 4 }} />

                {/* Tags */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" fontWeight="600" sx={{ mb: 2, color: '#111827' }}>
                    Tags
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {blogPost.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        variant="outlined"
                        sx={{
                          borderColor: '#e5e7eb',
                          color: '#6b7280',
                          '&:hover': {
                            borderColor: '#2563eb',
                            color: '#2563eb',
                            backgroundColor: '#eff6ff',
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                {/* Author Bio */}
                <Paper sx={{ p: 4, backgroundColor: '#f8fafc', borderRadius: 3 }}>
                  <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                    <Avatar
                      src={blogPost.authorImage}
                      sx={{ width: 80, height: 80 }}
                    />
                    <Box>
                      <Typography variant="h6" fontWeight="700" sx={{ mb: 1, color: '#111827' }}>
                        About {blogPost.author}
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#6b7280', lineHeight: 1.6 }}>
                        {blogPost.authorBio}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            {/* Related Posts */}
            <Paper sx={{ p: 4, borderRadius: 3, mb: 4 }}>
              <Typography variant="h5" fontWeight="700" sx={{ mb: 3, color: '#111827' }}>
                Related Stories
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {relatedPosts.map((post) => (
                  <Card
                    key={post.id}
                    sx={{
                      display: 'flex',
                      boxShadow: 'none',
                      border: '1px solid #e5e7eb',
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{ width: 100, height: 100, objectFit: 'cover' }}
                      image={post.image}
                      alt={post.title}
                    />
                    <CardContent sx={{ flex: 1, p: 2 }}>
                      <Typography
                        variant="subtitle2"
                        fontWeight="600"
                        sx={{
                          mb: 1,
                          color: '#111827',
                          lineHeight: 1.3,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {post.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#6b7280',
                          display: 'block',
                          mb: 1,
                        }}
                      >
                        {post.readTime}
                      </Typography>
                      <Button
                        component={Link}
                        to={`/blog/${post.id}`}
                        size="small"
                        endIcon={<ArrowIcon />}
                        sx={{
                          color: '#2563eb',
                          textTransform: 'none',
                          fontWeight: 600,
                          p: 0,
                          minWidth: 'auto',
                          '&:hover': {
                            backgroundColor: 'transparent',
                            color: '#1d4ed8',
                          },
                        }}
                      >
                        Read
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Paper>

            {/* Newsletter Signup */}
            <Paper
              sx={{
                p: 4,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: 'white',
                textAlign: 'center',
              }}
            >
              <Typography variant="h6" fontWeight="700" sx={{ mb: 2 }}>
                Stay Updated
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
                Get the latest travel stories and tips delivered to your inbox.
              </Typography>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: 'white',
                  color: '#2563eb',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#f8fafc',
                  },
                }}
              >
                Subscribe
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default BlogDetails;
