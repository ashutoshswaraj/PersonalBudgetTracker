import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Typography,
  CircularProgress,
  Alert,
  Avatar,
  Grid,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ShoppingBag,
  Restaurant,
  LocalGroceryStore,
  LocalGasStation,
  Home,
  Work,
  School,
  LocalHospital,
  FlightTakeoff,
  LocalTaxi,
  SportsEsports,
  Pets,
  ShoppingCart,
  CardGiftcard,
  LocalAtm,
  Savings,
  AccountBalance,
  AttachMoney,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { ChromePicker } from 'react-color';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

// All available icons for categories
const AVAILABLE_ICONS = [
  { name: 'Shopping', icon: <ShoppingBag /> },
  { name: 'Food', icon: <Restaurant /> },
  { name: 'Groceries', icon: <LocalGroceryStore /> },
  { name: 'Transport', icon: <LocalTaxi /> },
  { name: 'Home', icon: <Home /> },
  { name: 'Utilities', icon: <LocalGasStation /> },
  { name: 'Health', icon: <LocalHospital /> },
  { name: 'Education', icon: <School /> },
  { name: 'Entertainment', icon: <SportsEsports /> },
  { name: 'Travel', icon: <FlightTakeoff /> },
  { name: 'Pets', icon: <Pets /> },
  { name: 'Gifts', icon: <CardGiftcard /> },
  { name: 'Work', icon: <Work /> },
  { name: 'Money', icon: <AttachMoney /> },
  { name: 'Investments', icon: <TrendingUp /> },
  { name: 'Savings', icon: <Savings /> },
  { name: 'Bank', icon: <AccountBalance /> },
];

// Default colors for categories
const DEFAULT_COLORS = [
  '#4CAF50', '#2196F3', '#FFC107', '#9C27B0',
  '#FF5722', '#00BCD4', '#E91E63', '#8BC34A',
  '#3F51B5', '#FF9800', '#009688', '#673AB7',
  '#795548', '#607D8B', '#F44336', '#00BCD4'
];

const Categories = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense',
    budgetLimit: '',
    color: DEFAULT_COLORS[0],
    icon: 'Shopping',
  });
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/categories');
      setCategories(response.data);
    } catch (err) {
      setError('Failed to load categories');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        type: category.type,
        budgetLimit: category.budgetLimit || '',
        color: category.color || DEFAULT_COLORS[0],
        icon: category.icon || 'Shopping',
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        type: 'expense',
        budgetLimit: '',
        color: DEFAULT_COLORS[0],
        icon: 'Shopping',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategory(null);
    setShowColorPicker(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        budgetLimit: formData.budgetLimit ? parseFloat(formData.budgetLimit) : undefined,
      };

      if (editingCategory) {
        await api.put(`/api/categories/${editingCategory._id}`, payload);
      } else {
        await api.post('/api/categories', payload);
      }
      await fetchCategories();
      handleCloseDialog();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save category');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.delete(`/api/categories/${id}`);
        await fetchCategories();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete category');
      }
    }
  };

  const getIconComponent = (iconName) => {
    const icon = AVAILABLE_ICONS.find(i => i.name === iconName);
    return icon ? icon.icon : <ShoppingCart />;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Categories</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Category
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Budget Limit</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category._id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: category.color || DEFAULT_COLORS[0],
                        width: 32,
                        height: 32,
                      }}
                    >
                      {getIconComponent(category.icon)}
                    </Avatar>
                    {category.name}
                  </Box>
                </TableCell>
                <TableCell>{category.type}</TableCell>
                <TableCell>{category.budgetLimit ? `$${category.budgetLimit}` : '-'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(category)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(category._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCategory ? 'Edit Category' : 'Add Category'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              select
              label="Type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              margin="normal"
              required
            >
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
            </TextField>

            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              select
              label="Icon"
              name="icon"
              value={formData.icon}
              onChange={handleInputChange}
              margin="normal"
              required
            >
              {AVAILABLE_ICONS.map((icon) => (
                <MenuItem key={icon.name} value={icon.name}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: formData.color,
                        width: 24,
                        height: 24,
                      }}
                    >
                      {icon.icon}
                    </Avatar>
                    {icon.name}
                  </Box>
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Color"
              name="color"
              value={formData.color}
              onClick={() => setShowColorPicker(!showColorPicker)}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: formData.color,
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    />
                  </InputAdornment>
                ),
              }}
            />

            {showColorPicker && (
              <Box sx={{ mt: 2, mb: 2 }}>
                <ChromePicker
                  color={formData.color}
                  onChange={(color) => {
                    setFormData(prev => ({
                      ...prev,
                      color: color.hex,
                    }));
                  }}
                />
              </Box>
            )}

            <TextField
              fullWidth
              label="Budget Limit"
              name="budgetLimit"
              type="number"
              value={formData.budgetLimit}
              onChange={handleInputChange}
              margin="normal"
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingCategory ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Categories; 