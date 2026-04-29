import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControlLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
  Alert,
  IconButton,
  Container,
  Stack,
  Divider,
  InputLabel,
  FormControl
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  ArrowBack as BackIcon,
  Close as CloseIcon,
  CloudUpload as UploadIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { API_BASE_URL } from '../../config/api';

const BlogFormNew = () => {
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
  const [uploading, setUploading] = useState(false);

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
        categoryID: blog.categoryID || blog.category?.categoryID || '',
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

    if (name === 'title' && !isEditMode) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(value)
      }));
    }
  };

  const handleContentChange = (value) => {
    setFormData(prev => ({
      ...prev,
      contentHTML: value,
      contentText: value.replace(/<[^>]*>/g, '')
    }));
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleTagDelete = (tagToDelete) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToDelete)
    }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('folder', 'Blogs');

      const response = await axios.post(`${API_BASE_URL}/Upload/image`, formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Update the featured image field with the uploaded image path
      setFormData(prev => ({
        ...prev,
        featuredImage: response.data.filePath || response.data.path || response.data.url
      }));
      
      setSuccess('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      setError(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
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
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/blogs')} sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}>
            <BackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            {isEditMode ? 'Edit Blog Post' : 'Create New Blog Post'}
          </Typography>
        </Box>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {/* Basic Information Card */}
        <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
              📝 Basic Information
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 3 }}>
              <TextField
                fullWidth
                label="Blog Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                variant="outlined"
              />
              
              <TextField
                fullWidth
                label="Slug (URL)"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                variant="outlined"
                helperText="URL-friendly version of the title"
              />
              
              <FormControl fullWidth variant="outlined">
                <InputLabel>Category</InputLabel>
                <Select
                  name="categoryID"
                  value={formData.categoryID}
                  onChange={handleChange}
                  label="Category"
                  required
                >
                  {categories.map((category) => (
                    <MenuItem key={category.categoryID} value={category.categoryID}>
                      {category.categoryName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 3 }}>
              <TextField
                fullWidth
                label="Author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                variant="outlined"
              />
              
              <TextField
                fullWidth
                label="Published Date"
                name="publishedDate"
                type="date"
                value={formData.publishedDate}
                onChange={handleChange}
                required
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
              
              <TextField
                fullWidth
                label="Read Time"
                name="readTime"
                value={formData.readTime}
                onChange={handleChange}
                placeholder="e.g., 5 min read"
                variant="outlined"
              />
            </Box>

            <TextField
              fullWidth
              label="Excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              multiline
              rows={3}
              variant="outlined"
              helperText="Short description shown in blog list"
            />
          </CardContent>
        </Card>

        {/* Blog Content Card */}
        <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
              ✍️ Blog Content
            </Typography>
            
            <Box sx={{ '& .quill': { bgcolor: 'white' }, '& .ql-container': { minHeight: '400px', fontSize: '16px' } }}>
              <ReactQuill
                theme="snow"
                value={formData.contentHTML}
                onChange={handleContentChange}
                modules={quillModules}
                placeholder="Write your blog content here..."
              />
            </Box>
          </CardContent>
        </Card>

        {/* Media & Settings Card */}
        <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
              🖼️ Media & Settings
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Featured Image
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <TextField
                  fullWidth
                  label="Featured Image URL"
                  name="featuredImage"
                  value={formData.featuredImage}
                  onChange={handleChange}
                  variant="outlined"
                  placeholder="/Uploads/Blogs/image.jpg or full URL"
                  helperText="Enter image path or upload a new image"
                />
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<UploadIcon />}
                  disabled={uploading}
                  sx={{
                    minWidth: '140px',
                    height: '56px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                    }
                  }}
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </Button>
              </Box>
              {formData.featuredImage && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={formData.featuredImage.startsWith('/') ? `https://api.thesintrahotel.com${formData.featuredImage}` : formData.featuredImage}
                    alt="Preview"
                    style={{
                      maxWidth: '200px',
                      maxHeight: '150px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                      border: '2px solid #e0e0e0'
                    }}
                  />
                </Box>
              )}
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isFeatured}
                      onChange={handleChange}
                      name="isFeatured"
                      color="warning"
                    />
                  }
                  label="Featured Blog"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isPublished}
                      onChange={handleChange}
                      name="isPublished"
                      color="success"
                    />
                  }
                  label="Published"
                />
              </Box>
          </CardContent>
        </Card>

        {/* SEO & Tags Card */}
        <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
              🔍 SEO & Tags
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 3 }}>
              <TextField
                fullWidth
                label="Meta Title"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleChange}
                variant="outlined"
              />
              
              <TextField
                fullWidth
                label="Meta Description"
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                variant="outlined"
              />
              
              <TextField
                fullWidth
                label="Meta Keywords"
                name="metaKeywords"
                value={formData.metaKeywords}
                onChange={handleChange}
                variant="outlined"
                placeholder="keyword1, keyword2"
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <TextField
                fullWidth
                label="Add Tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
                variant="outlined"
                placeholder="Type and press Enter"
              />
              <Button variant="contained" onClick={handleTagAdd} sx={{ minWidth: '100px', height: '56px' }}>
                ADD
              </Button>
            </Box>
            
            {formData.tags.length > 0 && (
              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {formData.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => handleTagDelete(tag)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', position: 'sticky', bottom: 20, bgcolor: 'background.paper', p: 2, borderRadius: 2, boxShadow: 3 }}>
          <Button
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={() => navigate('/blogs')}
            size="large"
          >
            CANCEL
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={loading}
            size="large"
            sx={{ minWidth: '150px' }}
          >
            {loading ? 'SAVING...' : isEditMode ? 'UPDATE BLOG' : 'CREATE BLOG'}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default BlogFormNew;
