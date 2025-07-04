
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        // User is already on customer dashboard (this is the root route)
      }
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  // Show customer dashboard content directly since this is the root route
  if (user && user.role === 'customer') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-smartpay-navy mx-auto mb-4"></div>
          <p className="text-smartpay-navy font-semibold">Loading SmartPAY...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-smartpay-navy mx-auto mb-4"></div>
        <p className="text-smartpay-navy font-semibold">Loading SmartPAY...</p>
      </div>
    </div>
  );
};

export default Index;
