# Personal Budget Tracker

A comprehensive personal finance management application that helps users track their income, expenses, and financial goals.
🔑 Credentials
Test Account: (For review purposes only)
📧 Email: ashutosh@gmail.com
🔒 Password: 123456


## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Authentication](#authentication)
- [Dependencies](#dependencies)
- [Development](#development)
- [Deployment](#deployment)
- [Contributions](#contributions)
- [Assumptions](#assumptions)
- [Credits](#credits)

## Features
- User authentication and authorization
- Dashboard with financial overview
- Transaction management (income and expenses)
- Category management
- Financial reports and analytics
- Profile management
- Responsive design with modern UI

## Tech Stack
### Frontend
- React.js
- Material-UI (MUI) for UI components
- React Router for navigation
- Axios for API calls
- Recharts for data visualization
- Date-fns for date manipulation

### Backend
- Node.js
- Express.js
- MongoDB
- JWT for authentication

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation
1. Clone the repository:
```bash
git clone https://github.com/yourusername/personal-budget-tracker.git
cd personal-budget-tracker
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backened
npm install

# Install frontend dependencies
cd ../frontened
npm install
```

3. Set up environment variables:
Create `.env` files in both frontend and backend directories with the following variables:

Backend (.env):
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

Frontend (.env):
```
REACT_APP_API_URL=http://localhost:5000
```

4. Start the development servers:
```bash
# Start backend server
cd backened
npm start

# Start frontend server
cd ../frontened
npm start
```

## Project Structure
```
personal-budget-tracker/
├── backened/           # Backend server code
│   ├── controllers/    # Route controllers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   └── middleware/     # Custom middleware
├── frontened/          # Frontend React application
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Page components
│   │   ├── contexts/   # React contexts
│   │   ├── hooks/      # Custom hooks
│   │   └── utils/      # Utility functions
```

## Authentication
The application uses JWT (JSON Web Tokens) for authentication. Users can:
- Register with email and password
- Login with credentials
- Access protected routes
- Manage their profile

## Dependencies
### Frontend
- @mui/material: UI component library
- @mui/x-date-pickers: Date picker components
- react-router-dom: Routing
- axios: HTTP client
- recharts: Data visualization
- date-fns: Date manipulation

### Backend
- express: Web framework
- mongoose: MongoDB ODM
- jsonwebtoken: JWT authentication
- bcryptjs: Password hashing
- cors: Cross-origin resource sharing

## Development
- Frontend runs on http://localhost:3000
- Backend runs on http://localhost:5000
- Hot reloading enabled for both servers
- ESLint for code linting
- Prettier for code formatting

## Deployment
The application can be deployed using:
- Frontend: Vercel, Netlify, or any static hosting
- Backend: Heroku, DigitalOcean, or any Node.js hosting
- Database: MongoDB Atlas

## Contributions
This project was developed with the assistance of AI language models for:
- Code suggestions and optimizations
- Documentation generation
- Bug fixes and troubleshooting

All code has been reviewed and understood by the developer, and the developer is prepared to discuss any part of the codebase in detail.

## Assumptions
1. Users will primarily access the application through a web browser
2. Users will have basic understanding of personal finance concepts
3. All monetary values are stored in a single currency (USD)
4. Users will want to track both income and expenses
5. Users will need basic reporting features for financial analysis

## Credits
### Libraries and Frameworks
- [React](https://reactjs.org/)
- [Material-UI](https://mui.com/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Recharts](https://recharts.org/)

### Development Tools
- [Create React App](https://create-react-app.dev/)
- [Node.js](https://nodejs.org/)
- [Visual Studio Code](https://code.visualstudio.com/)

## License
This project is licensed under the MIT License - see the LICENSE file for details.


