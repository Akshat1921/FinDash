import './styles/App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Stocks from './components/Company/CompanySearch'
import { CompanyPage } from './components/Company/CompanyPage'
function AppContent() {

  return (
    <>
      <main className="mt-20 text-center">
        <h1 className="text-3xl font-bold">Personal Portfolio Health Tracker</h1>
        <Routes>
          <Route path="/" element={<Stocks />} />
          <Route path="/stocks" element={<Stocks />} />
          <Route path="/stocks/:symbol" element={<CompanyPage />} />
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
