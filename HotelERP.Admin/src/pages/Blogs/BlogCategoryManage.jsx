import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
  Alert,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

const BlogCategoryManage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    categoryName: '',
    categorySlug: '',
    description: '',
    displayOrder: 0,
    isActive: true
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/Blog/categories`);
      // Show all categories (both active and inactive)
      const allCategories = response.data || [];
      // Sort by display order and then by name
      allCategories.sort((a, b) => {
        if (a.displayOrder !== b.displayOrder) {
          return a.displayOrder - b.displayOrder;
        }
        return a.categoryName.localeCompare(b.categoryName);
      });
      setCategories(allCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name) => {
    return name
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

    // Auto-generate slug from category name
    if (name === 'categoryName' && !editingCategory) {
      setFormData(prev => ({
        ...prev,
        categorySlug: generateSlug(value)
      }));
    }
  };

  const handleOpenDialog = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        categoryName: category.categoryName,
        categorySlug: category.categorySlug,
        description: category.description || '',
        displayOrder: category.displayOrder || 0,
        isActive: category.isActive
      });
    } else {
      setEditingCategory(null);
      setFormData({
        categoryName: '',
        categorySlug: '',
        description: '',
        displayOrder: 0,
        isActive: true
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCategory(null);
    setFormData({
      categoryName: '',
      categorySlug: '',
      description: '',
      displayOrder: 0,
      isActive: true
    });
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

      const categoryData = {
        ...formData,
        displayOrder: parseInt(formData.displayOrder) || 0,
        createdBy: 'Admin',
        modifiedBy: 'Admin'
      };

      if (editingCategory) {
        await axios.put(
          `${API_BASE_URL}/Blog/categories/${editingCategory.categoryID}`,
          { ...categoryData, categoryID: editingCategory.categoryID },
          config
        );
        setSuccess('Category updated successfully!');
      } else {
        await axios.post(`${API_BASE_URL}/Blog/categories`, categoryData, config);
        setSuccess('Category created successfully!');
      }

      handleCloseDialog();
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      setError(error.response?.data?.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (category) => {
    try {
      const token = localStorage.getItem('token');
      const updatedCategory = {
        ...category,
        isActive: !category.isActive,
        modifiedBy: 'Admin',
        modifiedDate: new Date().toISOString()
      };
      
      await axios.put(`${API_BASE_URL}/Blog/categories/${category.categoryID}`, updatedCategory, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccess(`Category ${updatedCategory.isActive ? 'activated' : 'deactivated'} successfully!`);
      fetchCategories();
    } catch (error) {
      console.error('Error toggling category status:', error);
      setError('Failed to update category status');
    }
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/Blog/categories/${categoryToDelete.categoryID}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Category deleted successfully!');
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      setError('Failed to delete category');
    }
  };

  return (
    <Box sx={{ p: 3, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh' }}>
      {/* Header - Enhanced */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 'bold', background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 1 }}>
            📚 Blog Categories
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Organize your blog posts with categories
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            color: 'white',
            '&:hover': {
              background: 'linear-gradient(45deg, #1976D2 30%, #00ACC1 90%)',
            }
          }}
        >
          Add Category
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

      {/* Categories Table - Enhanced */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>CATEGORY NAME</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>SLUG</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>DESCRIPTION</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ORDER</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>STATUS</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Loading...</TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No categories found</TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.categoryID} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CategoryIcon color="primary" />
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {category.categoryName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={category.categorySlug} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>{category.description || '-'}</TableCell>
                  <TableCell>{category.displayOrder}</TableCell>
                  <TableCell>
                    <Switch
                      checked={category.isActive}
                      onChange={() => handleToggleStatus(category)}
                      color="success"
                      size="small"
                    />
                    <Chip
                      label={category.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      color={category.isActive ? 'success' : 'error'}
                      sx={{ ml: 1 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(category)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(category)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog - Enhanced */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 12px 40px rgba(0,0,0,0.2)'
          }
        }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            color: 'white',
            py: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ 
                width: 40, 
                height: 40, 
                borderRadius: 2, 
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Typography variant="h6">{editingCategory ? '✏️' : '➕'}</Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Category Name"
                  name="categoryName"
                  value={formData.categoryName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Slug"
                  name="categorySlug"
                  value={formData.categorySlug}
                  onChange={handleChange}
                  helperText="URL-friendly version of the name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Display Order"
                  name="displayOrder"
                  value={formData.displayOrder}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={handleChange}
                      name="isActive"
                      color="primary"
                    />
                  }
                  label="Active Status"
                  sx={{ 
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    width: '100%',
                    ml: 0
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, background: '#f8f9fa' }}>
            <Button 
              onClick={handleCloseDialog}
              sx={{
                borderRadius: 2,
                px: 3
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 2,
                px: 4,
                fontWeight: 'bold',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #6a3d8f 100%)',
                }
              }}
            >
              {loading ? '⏳ Saving...' : (editingCategory ? '✅ Update' : '✨ Create')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the category "{categoryToDelete?.categoryName}"?
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

export default BlogCategoryManage;
