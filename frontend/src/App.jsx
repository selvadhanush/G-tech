import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Projects from './pages/Projects';
import Testimonials from './pages/Testimonials';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

const MainLayout = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin') || location.pathname.startsWith('/login') || location.pathname.startsWith('/register');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdmin && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          
          {/* Protected Customer Routes */}
          <Route 
            path="/cart" 
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER', 'GTECH_ADMIN']}>
                <Cart />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER', 'GTECH_ADMIN']}>
                <Checkout />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-orders" 
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER', 'GTECH_ADMIN']}>
                <MyOrders />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER', 'GTECH_ADMIN']}>
                <Profile />
              </ProtectedRoute>
            } 
          />

          {/* Protected Admin Console */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['GTECH_ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <WhatsAppButton />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <MainLayout />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
