import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Backdrop,
  IconButton,
  Avatar,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  TrendingUp,
  TrendingDown,
  CalendarToday,
  FilterList,
  Download,
  AccountBalance,
  PieChart,
  Receipt,
  ShowChart,
} from '@mui/icons-material';
import api from '../utils/api';
import LineChart from '../components/charts/LineChart';
import BudgetComparisonChart from '../components/charts/BudgetComparisonChart';
import useDebounce from '../hooks/useDebounce';

const Reports = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    period: 'month',
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date(),
    category: '',
    minAmount: '',
    maxAmount: '',
    type: '',
    page: 1,
    limit: 10
  });

  // Create debounced values for min/max amount
  const debouncedMinAmount = useDebounce(filters.minAmount, 500);
  const debouncedMaxAmount = useDebounce(filters.maxAmount, 500);

  const [reportData, setReportData] = useState({
    summary: {
      totalIncome: 0,
      totalExpenses: 0,
      balance: 0
    },
    incomeExpense: [],
    categorySpending: [],
    transactions: [],
    total: 0,
    page: 1,
    pages: 1
  });
  const [categories, setCategories] = useState([]);

  // Effect for fetching categories
  useEffect(() => {
    fetchCategories();
  }, []);

  // Effect for fetching report data
  useEffect(() => {
    fetchReportData();
  }, [
    filters.period,
    filters.startDate,
    filters.endDate,
    filters.category,
    filters.type,
    filters.page,
    filters.limit,
    debouncedMinAmount,
    debouncedMaxAmount
  ]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError('');

      const params = {
        ...filters,
        startDate: filters.startDate?.toISOString().split('T')[0],
        endDate: filters.endDate?.toISOString().split('T')[0],
        minAmount: debouncedMinAmount,
        maxAmount: debouncedMaxAmount
      };

      const [summary, categorySpending, transactions] = await Promise.all([
        api.get('/api/reports/summary', { params }),
        api.get('/api/reports/category-spending', { params }),
        api.get('/api/reports/transactions', { params })
      ]);

      if (!transactions.data || !Array.isArray(transactions.data.transactions)) {
        throw new Error('Invalid transactions data received from server');
      }

      // Group transactions by date
      const dateGroups = {};
      
      // Get all unique dates from transactions
      transactions.data.transactions.forEach(transaction => {
        const date = new Date(transaction.date).toLocaleDateString('en-US', { 
          month: 'short',
          day: 'numeric'
        });
        
        if (!dateGroups[date]) {
          dateGroups[date] = {
            date,
            income: 0,
            expense: 0
          };
        }

        if (transaction.type === 'income') {
          dateGroups[date].income += transaction.amount;
        } else {
          dateGroups[date].expense += transaction.amount;
        }
      });

      // Convert to array and sort by date
      const transformedData = Object.values(dateGroups).sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });

      setReportData({
        summary: summary.data || { totalIncome: 0, totalExpenses: 0, balance: 0 },
        incomeExpense: transformedData,
        categorySpending: categorySpending.data || [],
        transactions: transactions.data.transactions,
        total: transactions.data.total || 0,
        page: transactions.data.page || 1,
        pages: transactions.data.pages || 1
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
      setError(error.response?.data?.message || error.message || 'Error fetching report data. Please try again.');
      setReportData(prev => ({
        ...prev,
        transactions: [],
        total: 0,
        page: 1,
        pages: 1
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field) => (event) => {
    setFilters(prev => ({
      ...prev,
      [field]: event.target.value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handleDateChange = (field) => (date) => {
    setFilters(prev => ({
      ...prev,
      [field]: date,
      page: 1 // Reset to first page when date changes
    }));
  };

  const handlePageChange = (event, newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage + 1
    }));
  };

  const handleRowsPerPageChange = (event) => {
    setFilters(prev => ({
      ...prev,
      limit: parseInt(event.target.value, 10),
      page: 1
    }));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box 
        sx={{ 
          p: { xs: 2, md: 3 },
          backgroundColor: 'background.default',
          minHeight: '100vh'
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ color: 'white', mb: 1, fontWeight: 600 }}>
            Financial Reports
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Analyze your financial data and track your spending patterns
          </Typography>
        </Box>

        {/* Filters Section */}
        <Paper
          sx={{
            p: 3,
            mb: 4,
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(24, 24, 24, 0.9) 0%, rgba(18, 18, 18, 0.8) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <FilterList sx={{ color: 'primary.main', mr: 1 }} />
            <Typography variant="h6" sx={{ color: 'white' }}>
              Filters
            </Typography>
          </Box>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                label="Period"
                value={filters.period}
                onChange={handleFilterChange('period')}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  }
                }}
              >
                <MenuItem value="week">This Week</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
                <MenuItem value="quarter">This Quarter</MenuItem>
                <MenuItem value="year">This Year</MenuItem>
                <MenuItem value="custom">Custom Range</MenuItem>
              </TextField>
            </Grid>

            {filters.period === 'custom' && (
              <>
                <Grid item xs={12} sm={6} md={2}>
                  <DatePicker
                    label="Start Date"
                    value={filters.startDate}
                    onChange={handleDateChange('startDate')}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          }
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <DatePicker
                    label="End Date"
                    value={filters.endDate}
                    onChange={handleDateChange('endDate')}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          }
                        }}
                      />
                    )}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                label="Category"
                value={filters.category}
                onChange={handleFilterChange('category')}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  }
                }}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category.name}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                label="Type"
                value={filters.type}
                onChange={handleFilterChange('type')}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  }
                }}
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label="Min Amount"
                value={filters.minAmount}
                onChange={handleFilterChange('minAmount')}
                type="number"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label="Max Amount"
                value={filters.maxAmount}
                onChange={handleFilterChange('maxAmount')}
                type="number"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  }
                }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Main Dashboard Grid */}
        <Grid container spacing={3}>
          {/* Summary Cards Row */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              {/* Total Income Card */}
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: '24px',
                    background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(76, 175, 80, 0.2)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: 'rgba(76, 175, 80, 0.2)',
                        color: '#4CAF50',
                        mr: 2
                      }}
                    >
                      <TrendingUp />
                    </Avatar>
                    <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Total Income
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ color: '#4CAF50', fontWeight: 600 }}>
                    ₹{reportData.summary.totalIncome.toLocaleString('en-IN')}
                  </Typography>
                </Paper>
              </Grid>

              {/* Total Expenses Card */}
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: '24px',
                    background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(244, 67, 54, 0.05) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(244, 67, 54, 0.2)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: 'rgba(244, 67, 54, 0.2)',
                        color: '#f44336',
                        mr: 2
                      }}
                    >
                      <TrendingDown />
                    </Avatar>
                    <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Total Expenses
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ color: '#f44336', fontWeight: 600 }}>
                    ₹{reportData.summary.totalExpenses.toLocaleString('en-IN')}
                  </Typography>
                </Paper>
              </Grid>

              {/* Net Balance Card */}
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: '24px',
                    background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.05) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(33, 150, 243, 0.2)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: 'rgba(33, 150, 243, 0.2)',
                        color: '#2196f3',
                        mr: 2
                      }}
                    >
                      <AccountBalance />
                    </Avatar>
                    <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Net Balance
                    </Typography>
                  </Box>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      color: reportData.summary.balance >= 0 ? '#4CAF50' : '#f44336',
                      fontWeight: 600 
                    }}
                  >
                    ₹{Math.abs(reportData.summary.balance).toLocaleString('en-IN')}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          {/* Charts Row */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              {/* Category Income vs Expenses Chart */}
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 1.5,
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(24, 24, 24, 0.9) 0%, rgba(18, 18, 18, 0.8) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    height: '200px'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <ShowChart sx={{ color: 'primary.main', mr: 1, fontSize: '1.2rem' }} />
                    <Typography variant="h6" sx={{ color: 'white', fontSize: '0.9rem' }}>
                      Income vs Expenses Trend
                    </Typography>
                  </Box>
                  <Box sx={{ height: 'calc(100% - 30px)' }}>
                    <LineChart data={reportData.incomeExpense} />
                  </Box>
                </Paper>
              </Grid>

              {/* Budget Comparison Chart */}
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 1.5,
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(24, 24, 24, 0.9) 0%, rgba(18, 18, 18, 0.8) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    height: '200px'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <AccountBalance sx={{ color: 'primary.main', mr: 1, fontSize: '1.2rem' }} />
                    <Typography variant="h6" sx={{ color: 'white', fontSize: '0.9rem' }}>
                      Budget vs Actual Expenses (This Month)
                    </Typography>
                  </Box>
                  <Box sx={{ height: 'calc(100% - 30px)' }}>
                    <BudgetComparisonChart 
                      data={categories
                        .filter(cat => cat.type === 'expense' && cat.budgetLimit)
                        .map(category => ({
                          category: category.name,
                          budget: category.budgetLimit,
                          actual: reportData.categorySpending.find(
                            c => c.name === category.name
                          )?.amount || 0
                        }))}
                    />
                  </Box>
                </Paper>
              </Grid>

              {/* Budget vs Actual Expenses */}
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(24, 24, 24, 0.9) 0%, rgba(18, 18, 18, 0.8) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccountBalance sx={{ color: 'primary.main', mr: 1 }} />
                    <Typography variant="h6" sx={{ color: 'white' }}>
                      Budget vs Actual Expenses
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    {categories
                      .filter(cat => cat.type === 'expense' && cat.budgetLimit)
                      .map((category) => {
                        const actualExpense = reportData.categorySpending.find(
                          c => c.name === category.name
                        )?.amount || 0;
                        
                        const percentage = (actualExpense / category.budgetLimit) * 100;
                        const isOverBudget = percentage > 100;

                        return (
                          <Grid item xs={12} sm={6} md={4} key={category._id}>
                            <Box
                              sx={{
                                p: 2,
                                borderRadius: '12px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Typography variant="subtitle1" sx={{ color: 'white', flex: 1 }}>
                                  {category.name}
                                </Typography>
                                <Chip
                                  size="small"
                                  label={isOverBudget ? 'Over Budget' : 'Within Budget'}
                                  sx={{
                                    bgcolor: isOverBudget ? 'rgba(244, 67, 54, 0.2)' : 'rgba(76, 175, 80, 0.2)',
                                    color: isOverBudget ? '#f44336' : '#4CAF50',
                                  }}
                                />
                              </Box>

                              <Box sx={{ mb: 1 }}>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 0.5 }}>
                                  Budget: ₹{category.budgetLimit.toLocaleString('en-IN')}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                  Actual: ₹{actualExpense.toLocaleString('en-IN')}
                                </Typography>
                              </Box>

                              <Box sx={{ position: 'relative', height: 4, bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2 }}>
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    height: '100%',
                                    width: `${Math.min(percentage, 100)}%`,
                                    bgcolor: isOverBudget ? '#f44336' : '#4CAF50',
                                    borderRadius: 2,
                                    transition: 'width 0.5s ease-in-out',
                                  }}
                                />
                              </Box>
                              
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  color: isOverBudget ? '#f44336' : '#4CAF50',
                                  display: 'block',
                                  textAlign: 'right',
                                  mt: 0.5
                                }}
                              >
                                {percentage.toFixed(1)}%
                              </Typography>
                            </Box>
                          </Grid>
                        );
                      })}
                  </Grid>

                  {categories.filter(cat => cat.type === 'expense' && cat.budgetLimit).length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 4, color: 'rgba(255, 255, 255, 0.5)' }}>
                      <Typography>
                        No budget limits set. Set budget limits in the Categories section.
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          {/* Transactions Table */}
          <Grid item xs={12}>
            <Paper
              sx={{
                borderRadius: '24px',
                background: 'linear-gradient(135deg, rgba(24, 24, 24, 0.9) 0%, rgba(18, 18, 18, 0.8) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                overflow: 'hidden'
              }}
            >
              <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Receipt sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: 'white' }}>
                    Recent Transactions
                  </Typography>
                </Box>
                <IconButton 
                  sx={{ 
                    color: 'primary.main',
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  <Download />
                </IconButton>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Date</TableCell>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Description</TableCell>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Category</TableCell>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Type</TableCell>
                      <TableCell align="right" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportData.transactions.map((transaction) => (
                      <TableRow
                        key={transaction._id}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          }
                        }}
                      >
                        <TableCell sx={{ color: 'white' }}>
                          {new Date(transaction.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell sx={{ color: 'white' }}>
                          {transaction.description}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={transaction.category?.name}
                            size="small"
                            sx={{
                              bgcolor: 'rgba(255, 255, 255, 0.1)',
                              color: 'white',
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={transaction.type}
                            size="small"
                            sx={{
                              bgcolor: transaction.type === 'income' 
                                ? 'rgba(76, 175, 80, 0.2)' 
                                : 'rgba(244, 67, 54, 0.2)',
                              color: transaction.type === 'income' ? '#4CAF50' : '#f44336',
                            }}
                          />
                        </TableCell>
                        <TableCell 
                          align="right"
                          sx={{
                            color: transaction.type === 'income' ? '#4CAF50' : '#f44336',
                            fontWeight: 600
                          }}
                        >
                          {transaction.type === 'income' ? '+' : '-'}
                          ₹{transaction.amount.toLocaleString('en-IN')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={reportData.total}
                page={filters.page - 1}
                onPageChange={handlePageChange}
                rowsPerPage={filters.limit}
                onRowsPerPageChange={handleRowsPerPageChange}
                sx={{
                  color: 'white',
                  '.MuiTablePagination-select': {
                    color: 'white'
                  },
                  '.MuiTablePagination-selectIcon': {
                    color: 'white'
                  }
                }}
              />
            </Paper>
          </Grid>
        </Grid>

        <Backdrop
          sx={{ 
            color: 'primary.main', 
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: 'rgba(0, 0, 0, 0.8)'
          }}
          open={loading}
        >
          <CircularProgress color="primary" />
        </Backdrop>
      </Box>
    </LocalizationProvider>
  );
};

export default Reports; 