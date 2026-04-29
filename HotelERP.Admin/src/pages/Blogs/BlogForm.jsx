import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
  Alert,
  IconButton,
  Paper
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  CloudUpload as UploadIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { API_BASE_URL } from '../../config/api';

const BlogForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    featuredImage: '',
    categoryID: '',
    author: 'Kainat Malik',
    publishedDate: new Date().toISOString().split('T')[0],
    readTime: '',
    isFeatured: false,
    isPublished: true,
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    contentHTML: '',
    contentText: '',
    tags: []
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchCategories();
    if (isEditMode) {
      fetchBlog();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Blog/categories`);
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBlog = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/Blog/${id}`);
      const blog = response.data;
      setFormData({
        title: blog.title || '',
        slug: blog.slug || '',
        excerpt: blog.excerpt || '',
        featuredImage: blog.featuredImage || '',
        categoryID: blog.category?.categoryID || '',
        author: blog.author || 'Kainat Malik',
        publishedDate: blog.publishedDate?.split('T')[0] || new Date().toISOString().split('T')[0],
        readTime: blog.readTime || '',
        isFeatured: blog.isFeatured || false,
        isPublished: blog.isPublished || true,
        metaTitle: blog.metaTitle || '',
        metaDescription: blog.metaDescription || '',
        metaKeywords: blog.metaKeywords || '',
        contentHTML: blog.contentHTML || '',
        contentText: blog.contentText || '',
        tags: blog.tags || []
      });
    } catch (error) {
      console.error('Error fetching blog:', error);
      setError('Failed to load blog data');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Auto-generate slug from title
    if (name === 'title' && !isEditMode) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(value)
      }));
    }
  };

  const handleContentChange = (content) => {
    // Strip HTML tags for plain text version
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';

    setFormData(prev => ({
      ...prev,
      contentHTML: content,
      contentText: plainText
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const blogData = {
        ...formData,
        categoryID: parseInt(formData.categoryID)
      };

      if (isEditMode) {
        await axios.put(`${API_BASE_URL}/Blog/${id}`, blogData, config);
        setSuccess('Blog updated successfully!');
      } else {
        await axios.post(`${API_BASE_URL}/Blog`, blogData, config);
        setSuccess('Blog created successfully!');
      }

      setTimeout(() => {
        navigate('/blogs');
      }, 1500);
    } catch (error) {
      console.error('Error saving blog:', error);
      setError(error.response?.data?.message || 'Failed to save blog');
    } finally {
      setLoading(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ]
  };

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'color', 'background',
    'align',
    'link', 'image', 'video'
  ];

  if (loading && isEditMode) {
    return (
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '400px', gap: 2 }}>
        <Box sx={{ 
          width: 60, 
          height: 60, 
          borderRadius: '50%', 
          border: '4px solid #e0e0e0',
          borderTopColor: '#2196F3',
          animation: 'spin 1s linear infinite',
          '@keyframes spin': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' }
          }
        }} />
        <Typography variant="h6" color="text.secondary">Loading blog data...</Typography>
      </Box>
    );
  }

  // Show loading if categories haven't loaded yet
  if (categories.length === 0 && !isEditMode) {
    return (
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '400px', gap: 2 }}>
        <Box sx={{ 
          width: 60, 
          height: 60, 
          borderRadius: '50%', 
          border: '4px solid #e0e0e0',
          borderTopColor: '#2196F3',
          animation: 'spin 1s linear infinite',
          '@keyframes spin': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' }
          }
        }} />
        <Typography variant="h6" color="text.secondary">Loading categories...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh' }}>
      {/* Header - Enhanced */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 'bold', background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 1 }}>
            {isEditMode ? '✏️ Edit Blog Post' : '✨ Create New Blog Post'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isEditMode ? 'Update your blog content and settings' : 'Share your thoughts with the world'}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<CancelIcon />}
          onClick={() => navigate('/blogs')}
          sx={{
            borderRadius: 2,
            borderWidth: 2,
            '&:hover': { borderWidth: 2 }
          }}
        >
          Back to List
        </Button>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: '1px solid rgba(33, 150, 243, 0.1)' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box sx={{ 
                    width: 48, 
                    height: 48, 
                    borderRadius: 2, 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Typography variant="h5" sx={{ color: 'white' }}>📝</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                      Basic Information
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Essential details about your blog post
                    </Typography>
                  </Box>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      label="Blog Title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      required
                      label="Slug (URL)"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      helperText="URL-friendly version of the title"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Category</InputLabel>
                      <Select
                        name="categoryID"
                        value={formData.categoryID}
                        onChange={handleChange}
                        label="Category"
                      >
                        {categories.map((category) => (
                          <MenuItem key={category.categoryID} value={category.categoryID}>
                            {category.categoryName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Excerpt"
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleChange}
                      helperText="Short description (shown in blog list)"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      required
                      label="Author"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      required
                      type="date"
                      label="Published Date"
                      name="publishedDate"
                      value={formData.publishedDate}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Read Time"
                      name="readTime"
                      value={formData.readTime}
                      onChange={handleChange}
                      placeholder="e.g., 5 min read"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Featured Image URL"
                      name="featuredImage"
                      value={formData.featuredImage}
                      onChange={handleChange}
                      placeholder="/uploads/blogs/image.jpg"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.isFeatured}
                          onChange={handleChange}
                          name="isFeatured"
                        />
                      }
                      label="Featured Blog"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.isPublished}
                          onChange={handleChange}
                          name="isPublished"
                        />
                      }
                      label="Published"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Content Editor */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: '1px solid rgba(33, 150, 243, 0.1)' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box sx={{ 
                    width: 48, 
                    height: 48, 
                    borderRadius: 2, 
                    background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Typography variant="h5" sx={{ color: 'white' }}>✍️</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                      Blog Content
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Write your blog content with rich formatting
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ '& .ql-container': { minHeight: '400px' } }}>
                  <ReactQuill
                    theme="snow"
                    value={formData.contentHTML}
                    onChange={handleContentChange}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Write your blog content here..."
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* SEO & Tags */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: '1px solid rgba(33, 150, 243, 0.1)' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box sx={{ 
                    width: 48, 
                    height: 48, 
                    borderRadius: 2, 
                    background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Typography variant="h5" sx={{ color: 'white' }}>🔍</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                      SEO & Tags
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Optimize your blog for search engines
                    </Typography>
                  </Box>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Meta Title"
                      name="metaTitle"
                      value={formData.metaTitle}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Meta Description"
                      name="metaDescription"
                      value={formData.metaDescription}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Meta Keywords"
                      name="metaKeywords"
                      value={formData.metaKeywords}
                      onChange={handleChange}
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <TextField
                        fullWidth
                        label="Add Tag"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                        placeholder="Type tag and press Enter"
                      />
                      <Button variant="contained" onClick={handleAddTag}>
                        Add
                      </Button>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {formData.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          onDelete={() => handleRemoveTag(tag)}
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ color: 'white', fontWeight: 500 }}>
                    {isEditMode ? '🔄 Ready to update your blog?' : '🚀 Ready to publish your blog?'}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={() => navigate('/blogs')}
                      sx={{
                        color: 'white',
                        borderColor: 'white',
                        borderRadius: 2,
                        borderWidth: 2,
                        '&:hover': {
                          borderColor: 'white',
                          borderWidth: 2,
                          background: 'rgba(255,255,255,0.1)'
                        }
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<SaveIcon />}
                      disabled={loading}
                      sx={{
                        background: 'white',
                        color: '#667eea',
                        borderRadius: 2,
                        fontWeight: 'bold',
                        px: 4,
                        '&:hover': {
                          background: '#f0f0f0',
                        },
                        '&:disabled': {
                          background: 'rgba(255,255,255,0.5)',
                          color: 'rgba(102, 126, 234, 0.5)'
                        }
                      }}
                    >
                      {loading ? '⏳ Saving...' : (isEditMode ? '✅ Update Blog' : '✨ Create Blog')}
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default BlogForm;
