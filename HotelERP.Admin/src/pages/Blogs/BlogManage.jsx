import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Public as PublicIcon,
  PublicOff as PublicOffIcon,
  Article as ArticleIcon,
  Category as CategoryIcon,
  TrendingUp as TrendingUpIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

const BlogManage = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    totalBlogs: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
    featuredBlogs: 0,
    totalViews: 0,
    totalCategories: 0
  });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filterFeatured, setFilterFeatured] = useState('');
  const [filterPublished, setFilterPublished] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
    fetchStats();
  }, [page, rowsPerPage, searchTerm, selectedCategory, filterFeatured, filterPublished]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const params = {
        page: page + 1,
        pageSize: rowsPerPage,
        search: searchTerm || undefined,
        categoryId: selectedCategory || undefined,
        isFeatured: filterFeatured === '' ? undefined : filterFeatured === 'true',
        isPublished: filterPublished === '' ? undefined : filterPublished === 'true'
      };

      const response = await axios.get(`${API_BASE_URL}/Blog`, { params });
      setBlogs(response.data.data || []);
      setTotalCount(response.data.totalCount || 0);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Blog/categories`);
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/Blog/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleCategoryFilter = (event) => {
    setSelectedCategory(event.target.value);
    setPage(0);
  };

  const handleToggleFeatured = async (blogId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/Blog/${blogId}/toggle-featured`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBlogs();
      fetchStats();
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  const handleTogglePublish = async (blogId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/Blog/${blogId}/toggle-publish`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBlogs();
      fetchStats();
    } catch (error) {
      console.error('Error toggling publish status:', error);
    }
  };

  const handleDeleteClick = (blog) => {
    setBlogToDelete(blog);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/Blog/${blogToDelete.blogID}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDeleteDialogOpen(false);
      setBlogToDelete(null);
      fetchBlogs();
      fetchStats();
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const statCards = [
    {
      title: 'Total Blogs',
      value: stats.totalBlogs || 0,
      icon: <ArticleIcon sx={{ fontSize: 26 }} />,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      shadow: '0 10px 24px rgba(102, 126, 234, 0.35)'
    },
    {
      title: 'Published',
      value: stats.publishedBlogs || 0,
      icon: <PublicIcon sx={{ fontSize: 26 }} />,
      gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
      shadow: '0 10px 24px rgba(17, 153, 142, 0.35)'
    },
    {
      title: 'Drafts',
      value: stats.draftBlogs || 0,
      icon: <PublicOffIcon sx={{ fontSize: 26 }} />,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      shadow: '0 10px 24px rgba(79, 172, 254, 0.35)'
    },
    {
      title: 'Featured',
      value: stats.featuredBlogs || 0,
      icon: <StarIcon sx={{ fontSize: 26 }} />,
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      shadow: '0 10px 24px rgba(250, 112, 154, 0.30)'
    },
    {
      title: 'Total Views',
      value: stats.totalViews || 0,
      icon: <VisibilityIcon sx={{ fontSize: 26 }} />,
      gradient: 'linear-gradient(135deg, #a044ff 0%, #6a3093 100%)',
      shadow: '0 10px 24px rgba(160, 68, 255, 0.30)'
    },
    {
      title: 'Categories',
      value: stats.totalCategories || 0,
      icon: <CategoryIcon sx={{ fontSize: 26 }} />,
      gradient: 'linear-gradient(135deg, #f857a6 0%, #ff5858 100%)',
      shadow: '0 10px 24px rgba(248, 87, 166, 0.30)'
    }
  ];

  return (
    <Box sx={{ p: 3, maxWidth: '100%', margin: '0 auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Blog Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/blogs/new')}
          sx={{
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            color: 'white',
            '&:hover': {
              background: 'linear-gradient(45deg, #1976D2 30%, #00ACC1 90%)',
            }
          }}
        >
          Create New Blog
        </Button>
      </Box>

      {/* Stats Cards - Enhanced Professional Design */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statCards.map((c) => (
          <Grid key={c.title} item xs={12} sm={6} md={4} xl={2}>
            <Card
              sx={{
                background: c.gradient,
                color: 'white',
                borderRadius: 3,
                boxShadow: c.shadow,
                transition: 'all 0.25s ease',
                height: 96,
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  filter: 'brightness(1.02)'
                }
              }}
            >
              <CardContent sx={{ p: 1.75, height: '100%', '&:last-child': { pb: 1.75 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, height: '100%' }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(255,255,255,0.18)',
                      border: '1px solid rgba(255,255,255,0.20)',
                      flexShrink: 0
                    }}
                  >
                    {c.icon}
                  </Box>

                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        opacity: 0.9,
                        fontWeight: 600,
                        letterSpacing: 0.3,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {c.title}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.1, mt: 0.25 }}>
                      {c.value}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filters - Enhanced Design */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Select
                fullWidth
                value={selectedCategory}
                onChange={handleCategoryFilter}
                displayEmpty
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.categoryID} value={category.categoryID}>
                    {category.categoryName}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} md={2}>
              <Select
                fullWidth
                value={filterFeatured}
                onChange={(e) => { setFilterFeatured(e.target.value); setPage(0); }}
                displayEmpty
              >
                <MenuItem value="">All (Featured)</MenuItem>
                <MenuItem value="true">Featured Only</MenuItem>
                <MenuItem value="false">Not Featured</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} md={2}>
              <Select
                fullWidth
                value={filterPublished}
                onChange={(e) => { setFilterPublished(e.target.value); setPage(0); }}
                displayEmpty
              >
                <MenuItem value="">All (Status)</MenuItem>
                <MenuItem value="true">Published</MenuItem>
                <MenuItem value="false">Draft</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Blogs Table - Enhanced Design */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>TITLE</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>CATEGORY</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>AUTHOR</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>DATE</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>STATUS</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>VIEWS</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">Loading...</TableCell>
              </TableRow>
            ) : blogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">No blogs found</TableCell>
              </TableRow>
            ) : (
              blogs.map((blog) => (
                <TableRow key={blog.blogID} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {blog.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {blog.readTime}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={blog.categoryName}
                      size="small"
                      sx={{ background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)', color: 'white' }}
                    />
                  </TableCell>
                  <TableCell>{blog.author}</TableCell>
                  <TableCell>{formatDate(blog.publishedDate)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      <Chip
                        label={blog.isPublished ? 'Published' : 'Draft'}
                        size="small"
                        color={blog.isPublished ? 'success' : 'default'}
                      />
                      {blog.isFeatured && (
                        <Chip
                          icon={<StarIcon />}
                          label="Featured"
                          size="small"
                          sx={{ background: 'linear-gradient(45deg, #FFD700 30%, #FFA500 90%)', color: 'white' }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <VisibilityIcon fontSize="small" color="action" />
                      <Typography variant="body2">{blog.viewCount}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title={blog.isFeatured ? "Remove from Featured" : "Mark as Featured"}>
                        <IconButton
                          size="small"
                          onClick={() => handleToggleFeatured(blog.blogID)}
                          sx={{ color: blog.isFeatured ? '#FFD700' : 'inherit' }}
                        >
                          {blog.isFeatured ? <StarIcon /> : <StarBorderIcon />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={blog.isPublished ? "Unpublish" : "Publish"}>
                        <IconButton
                          size="small"
                          onClick={() => handleTogglePublish(blog.blogID)}
                          color={blog.isPublished ? 'success' : 'default'}
                        >
                          {blog.isPublished ? <PublicIcon /> : <PublicOffIcon />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/blogs/edit/${blog.blogID}`)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(blog)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the blog "{blogToDelete?.title}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BlogManage;
