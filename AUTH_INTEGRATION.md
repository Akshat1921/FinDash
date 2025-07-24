# FinDash - Financial Dashboard Authentication Integration

This document explains the authentication system that has been integrated into your React + Tailwind + Vite financial dashboard application.

## 🚀 What's New

The application now includes a complete authentication system with:

- **Login Page** (`/login`) - User authentication
- **Signup Page** (`/signup`) - New user registration  
- **Dashboard Page** (`/dashboard`) - Protected user dashboard
- **Protected Routes** - Authentication required for stocks and company pages
- **Responsive Design** - Full Tailwind CSS integration
- **Authentication Context** - Centralized auth state management

## 📁 New File Structure

```
src/
├── pages/
│   ├── LoginPage.tsx          # Login page component
│   ├── SignupPage.tsx         # Signup page component
│   └── DashboardPage.tsx      # User dashboard
├── components/
│   └── ProtectedRoute.tsx     # Route protection component
├── context/
│   └── AuthContext.tsx        # Authentication context (optional)
└── ...existing files
```

## 🛣️ Updated Routes

| Route | Component | Access | Description |
|-------|-----------|--------|-------------|
| `/` | LoginPage | Public | Default landing page (login) |
| `/login` | LoginPage | Public | User login |
| `/signup` | SignupPage | Public | User registration |
| `/dashboard` | DashboardPage | Protected | User dashboard |
| `/stocks` | CompanySearch | Protected | Stock search and listing |
| `/stocks/:symbol` | CompanyPage | Protected | Individual company details |

## 🔐 Authentication Flow

### Login Process
1. User enters email and password
2. POST request to `http://localhost:8081/auth/signin`
3. On success: Token stored in localStorage, redirect to `/stocks`
4. On failure: Error message displayed

### Signup Process
1. User fills registration form (name, email, password, mobile, role)
2. Password confirmation validation
3. POST request to `http://localhost:8081/auth/signup`
4. On success: Token stored in localStorage, redirect to `/stocks`
5. On failure: Error message displayed

### Route Protection
- Protected routes check for `authToken` in localStorage
- Unauthenticated users redirected to `/login`
- Navigation updates based on authentication status

## 🎨 Design Features

### Tailwind CSS Integration
- **Consistent Styling**: Matches your existing design system
- **Dark Mode Support**: All components support dark/light themes
- **Responsive Design**: Mobile-first approach
- **Smooth Transitions**: Hover effects and loading states
- **Form Validation**: Visual feedback for errors and loading

### Key Styling Elements
- Blue color scheme (`blue-600`, `blue-700`) matching existing brand
- Gray backgrounds for consistency
- Rounded corners and shadows for modern look
- Focus states for accessibility
- Loading spinners for better UX

## 🔧 API Integration

### Expected Backend Endpoints

**Login Endpoint:**
```
POST http://localhost:8081/auth/signin
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "userpassword"
}
```

**Signup Endpoint:**
```
POST http://localhost:8081/auth/signup
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com", 
  "password": "password123",
  "role": "ROLE_CUSTOMER",
  "mobile": "1234567890"
}
```

### Expected Response Format
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "ROLE_CUSTOMER"
  }
}
```

## 🔄 Navigation Updates

### Updated Navbar Components
- **DefaultNavbar**: Shows Login/Signup for guests, Dashboard/Logout for authenticated users
- **CompanyPageNavbar**: Authentication-aware navigation with company tabs
- **Dynamic Branding**: FinDash logo links to appropriate home page

### Authentication States
- **Guest**: Login and Signup buttons
- **Authenticated**: Dashboard link and Logout button

## 💾 Local Storage Usage

The application uses localStorage for:
- `authToken`: JWT token for API authentication
- `userData`: User profile information (optional)

## 🚦 Getting Started

1. **Start your backend server** on `http://localhost:8081`
2. **Ensure auth endpoints** are implemented and working
3. **Run the development server**:
   ```bash
   npm run dev
   ```
4. **Navigate to** `http://localhost:5173`
5. **Test the flow**:
   - Try accessing `/stocks` (should redirect to login)
   - Create a new account via `/signup`
   - Login with credentials
   - Access protected routes

## 🔨 Customization Options

### Styling
- Modify colors in Tailwind classes throughout components
- Update form layouts in LoginPage.tsx and SignupPage.tsx
- Customize dashboard cards in DashboardPage.tsx

### API Integration
- Update API endpoints in login/signup handlers
- Modify request/response data structures
- Add additional authentication logic

### Features
- Add "Remember Me" functionality
- Implement password reset flow
- Add user profile management
- Enhanced error handling

## 🐛 Troubleshooting

### Common Issues

1. **Backend not running**: Ensure your Spring Boot server is running on port 8081
2. **CORS errors**: Configure CORS in your backend to allow frontend origin
3. **Token persistence**: Check localStorage in browser dev tools
4. **Route protection**: Verify ProtectedRoute component is wrapping protected routes

### Testing Authentication
1. Open browser dev tools
2. Check localStorage for `authToken`
3. Try accessing protected routes directly
4. Monitor network requests for auth API calls

## 📋 Next Steps

Consider implementing:
- [ ] Password strength validation
- [ ] Email verification
- [ ] Password reset functionality
- [ ] User profile management
- [ ] Session timeout handling
- [ ] Remember me functionality
- [ ] OAuth integration (Google, GitHub, etc.)

## 🤝 Integration Notes

- **No Breaking Changes**: Existing company and stock functionality unchanged
- **Backward Compatible**: All existing routes still work when authenticated
- **Scalable Architecture**: Easy to add new protected routes
- **Clean Separation**: Authentication logic separated from business logic

The authentication system is now fully integrated with your existing Tailwind CSS setup and maintains the same design language throughout the application.
