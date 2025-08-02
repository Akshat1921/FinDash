import './styles/App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Stocks from './components/Company/CompanySearch'
import { CompanyPage } from './components/Company/CompanyPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import QuickAddStockPage from './pages/QuickAddStockPage'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import AdminProtectedRoute from './components/AdminProtectedRoute'
import PortfolioPage from './pages/PortfolioPage'
import CartPage from './pages/CartPage'
import StockAnalysisPage from './pages/StockAnalysisPage'
import { PortfolioProvider } from './context/PortfolioContext'

function AppContent() {
  return (
    <>
      <main className="text-center">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/stocks" 
            element={
              <ProtectedRoute>
                <PortfolioProvider>
                  <Stocks />
                </PortfolioProvider>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/stocks/:symbol" 
            element={
              <ProtectedRoute>
                <CompanyPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/portfolio" 
            element={
              <ProtectedRoute>
                <PortfolioPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/cart" 
            element={
              <ProtectedRoute>
                <PortfolioProvider>
                  <CartPage />
                </PortfolioProvider>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/quick-add-stock" 
            element={
              <ProtectedRoute>
                <QuickAddStockPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/stocks/:symbol/analysis" 
            element={
              <ProtectedRoute>
                <StockAnalysisPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            } 
          />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
