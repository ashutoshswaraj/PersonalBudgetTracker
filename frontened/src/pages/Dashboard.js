import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
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
  CalendarToday,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import WeeklyChart from '../components/WeeklyChart';
import api from '../utils/api';

// Predefined categories with icons and colors
const PREDEFINED_CATEGORIES = {
  expense: [
    { name: 'Shopping', icon: <ShoppingBag />, color: '#4CAF50' },
    { name: 'Food & Dining', icon: <Restaurant />, color: '#FF9800' },
    { name: 'Groceries', icon: <LocalGroceryStore />, color: '#2196F3' },
    { name: 'Transportation', icon: <LocalTaxi />, color: '#9C27B0' },
    { name: 'Housing', icon: <Home />, color: '#E91E63' },
    { name: 'Utilities', icon: <LocalGasStation />, color: '#00BCD4' },
    { name: 'Healthcare', icon: <LocalHospital />, color: '#F44336' },
    { name: 'Education', icon: <School />, color: '#673AB7' },
    { name: 'Entertainment', icon: <SportsEsports />, color: '#FF5722' },
    { name: 'Travel', icon: <FlightTakeoff />, color: '#009688' },
    { name: 'Pets', icon: <Pets />, color: '#795548' },
    { name: 'Gifts', icon: <CardGiftcard />, color: '#FFC107' },
  ],
  income: [
    { name: 'Salary', icon: <Work />, color: '#4CAF50' },
    { name: 'Freelance', icon: <AttachMoney />, color: '#2196F3' },
    { name: 'Investments', icon: <TrendingUp />, color: '#9C27B0' },
    { name: 'Gifts', icon: <CardGiftcard />, color: '#FF9800' },
    { name: 'Savings', icon: <Savings />, color: '#00BCD4' },
    { name: 'Other Income', icon: <AccountBalance />, color: '#673AB7' },
  ]
};

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    summary: {
      totalIncome: 0,
      totalExpenses: 0,
      balance: 0
    },
    categorySpending: [],
    recentTransactions: []
  });
  const [weeklyData, setWeeklyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get dashboard data
        const { data: dashboardResult } = await api.get('/api/dashboard');
        setDashboardData(dashboardResult);

        // Get all transactions for weekly chart
        const { data: transactions } = await api.get('/api/transactions');
        
        // Process last 7 days of transactions for the chart
        const today = new Date();
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        // Create a map for daily totals
        const dailyTotals = transactions
          .filter(t => {
            const date = new Date(t.date);
            return date >= weekAgo && date <= today;
          })
          .reduce((acc, t) => {
            const day = new Date(t.date).toLocaleDateString('en-US', { weekday: 'short' });
            acc[day] = (acc[day] || 0) + (t.type === 'income' ? t.amount : -t.amount);
            return acc;
          }, {});

        // Ensure we have all days represented
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const chartData = days.map(day => ({
          day,
          amount: Math.abs(dailyTotals[day] || 0)
        }));

        setWeeklyData(chartData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper function to get icon and color for category
  const getCategoryDetails = (categoryName) => {
    // Search in both expense and income categories
    const expenseCategory = PREDEFINED_CATEGORIES.expense.find(cat => cat.name === categoryName);
    const incomeCategory = PREDEFINED_CATEGORIES.income.find(cat => cat.name === categoryName);
    
    return expenseCategory || incomeCategory || { icon: <ShoppingCart />, color: 'rgba(255, 255, 255, 0.1)' };
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 700, 
          color: '#fff',
          mb: 1 
        }}>
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Here's your financial summary
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Balance Card */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: '24px',
              background: 'linear-gradient(135deg, rgba(24, 24, 24, 0.9) 0%, rgba(18, 18, 18, 0.8) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Total Balance
              </Typography>
              <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                <CalendarToday fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="h3" sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.8) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}>
              ₹{dashboardData.summary.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Income
                </Typography>
                <Typography variant="h6" sx={{ color: '#4CAF50' }}>
                  +₹{dashboardData.summary.totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Expenses
                </Typography>
                <Typography variant="h6" sx={{ color: '#f44336' }}>
                  -₹{dashboardData.summary.totalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Weekly Chart */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              borderRadius: '24px',
              background: 'linear-gradient(135deg, rgba(24, 24, 24, 0.9) 0%, rgba(18, 18, 18, 0.8) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              height: '100%',
              minHeight: '300px'
            }}
          >
            <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
              Weekly Overview
            </Typography>
            <WeeklyChart data={weeklyData} />
          </Paper>
        </Grid>

        {/* Categories */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              borderRadius: '24px',
              background: 'linear-gradient(135deg, rgba(24, 24, 24, 0.9) 0%, rgba(18, 18, 18, 0.8) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
              Top Categories
            </Typography>
            <Grid container spacing={2}>
              {dashboardData.categorySpending.map((category, index) => {
                const categoryDetails = getCategoryDetails(category.name);
                return (
                  <Grid item xs={12} sm={4} key={category.name}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: '16px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar
                          sx={{
                            bgcolor: categoryDetails.color,
                            width: 40,
                            height: 40,
                            mr: 2,
                          }}
                        >
                          {categoryDetails.icon}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ color: '#fff' }}>
                            {category.name}
                          </Typography>
                          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                            ₹{category.amount.toLocaleString('en-IN')}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Paper>
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              borderRadius: '24px',
              background: 'linear-gradient(135deg, rgba(24, 24, 24, 0.9) 0%, rgba(18, 18, 18, 0.8) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ color: 'white' }}>
                Recent Transactions
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#4CAF50',
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
                onClick={() => {/* TODO: Navigate to transactions page */}}
              >
                View All
              </Typography>
            </Box>

            <List sx={{ 
              bgcolor: 'rgba(0, 0, 0, 0.2)', 
              borderRadius: 2,
              p: 0,
              '& > *:not(:last-child)': {
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
              }
            }}>
              {dashboardData.recentTransactions.map((transaction) => (
                <ListItem
                  key={transaction._id}
                  sx={{
                    px: 2,
                    py: 1.5,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      transform: 'translateX(8px)'
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    {/* Left: Icon */}
                    <Avatar
                      sx={{
                        bgcolor: transaction.type === 'income' 
                          ? 'rgba(76, 175, 80, 0.2)' 
                          : 'rgba(244, 67, 54, 0.2)',
                        color: transaction.type === 'income' ? '#4CAF50' : '#f44336',
                        width: 48,
                        height: 48,
                        mr: 2,
                      }}
                    >
                      {transaction.type === 'income' ? <ArrowUpward /> : <ArrowDownward />}
                    </Avatar>

                    {/* Middle: Transaction Details */}
                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          color: '#fff',
                          fontWeight: 600,
                          mb: 0.5
                        }}
                      >
                        {transaction.description}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {transaction.category && (
                          <Chip
                            label={transaction.category.name}
                            size="small"
                            sx={{
                              bgcolor: 'rgba(255, 255, 255, 0.1)',
                              color: 'rgba(255, 255, 255, 0.7)',
                              height: '24px',
                              '& .MuiChip-label': {
                                px: 1,
                                fontSize: '0.75rem'
                              }
                            }}
                          />
                        )}
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: 'rgba(255, 255, 255, 0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                          }}
                        >
                          <CalendarToday sx={{ fontSize: 12 }} />
                          {new Date(transaction.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Right: Amount */}
                    <Box sx={{ textAlign: 'right', ml: 2 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: transaction.type === 'income' ? '#4CAF50' : '#f44336',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5
                        }}
                      >
                        {transaction.type === 'income' ? '+' : '-'}
                        ₹{transaction.amount.toLocaleString('en-IN')}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: transaction.type === 'income' 
                            ? 'rgba(76, 175, 80, 0.7)' 
                            : 'rgba(244, 67, 54, 0.7)',
                        }}
                      >
                        {transaction.type === 'income' ? 'Income' : 'Expense'}
                      </Typography>
                    </Box>
                  </Box>
                </ListItem>
              ))}
            </List>

            {dashboardData.recentTransactions.length === 0 && (
              <Box 
                sx={{ 
                  textAlign: 'center', 
                  py: 4,
                  color: 'rgba(255, 255, 255, 0.5)'
                }}
              >
                <Typography variant="body1">
                  No recent transactions
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 