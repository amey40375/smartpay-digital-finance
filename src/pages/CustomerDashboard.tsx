
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, Wallet, ArrowDownCircle, Receipt, PlusCircle, User, LogOut } from 'lucide-react';

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      title: 'Ajukan Pinjaman',
      icon: CreditCard,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      onClick: () => navigate('/loan-application')
    },
    {
      title: 'Saldo Aplikasi',
      icon: Wallet,
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      onClick: () => navigate('/balance')
    },
    {
      title: 'Tarik Dana',
      icon: ArrowDownCircle,
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      onClick: () => navigate('/withdraw')
    },
    {
      title: 'Tagihan',
      icon: Receipt,
      color: 'bg-gradient-to-br from-orange-500 to-orange-600',
      onClick: () => navigate('/bills')
    },
    {
      title: 'Top Up Saldo Tabungan',
      icon: PlusCircle,
      color: 'bg-gradient-to-br from-teal-500 to-teal-600',
      onClick: () => navigate('/topup')
    },
    {
      title: 'Profil Saya',
      icon: User,
      color: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
      onClick: () => navigate('/profile')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="smartpay-gradient px-6 py-8 text-white">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">SmartPAY</h1>
            <p className="text-white/80">Selamat datang, {user?.fullName}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Balance Display */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-white/70 text-sm">Saldo Pinjaman</p>
              <p className="text-xl font-bold">{formatCurrency(user?.loanBalance || 0)}</p>
            </div>
            <div>
              <p className="text-white/70 text-sm">Saldo Tabungan</p>
              <p className="text-xl font-bold">{formatCurrency(user?.savingsBalance || 0)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="px-6 py-8">
        <h2 className="text-xl font-bold text-smartpay-navy mb-6">Menu Layanan</h2>
        
        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item, index) => (
            <Card
              key={index}
              className="menu-card cursor-pointer group overflow-hidden"
              onClick={item.onClick}
            >
              <CardContent className="p-4 text-center">
                <div className={`${item.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm leading-tight">
                  {item.title}
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Logout Card */}
        <Card
          className="menu-card cursor-pointer group overflow-hidden mt-4 border-red-200"
          onClick={handleLogout}
        >
          <CardContent className="p-4 text-center">
            <div className="bg-gradient-to-br from-red-500 to-red-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
              <LogOut className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-semibold text-red-600 text-sm">
              Logout
            </h3>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Info */}
      <div className="px-6 pb-8">
        <div className="bg-blue-50 rounded-xl p-4">
          <h3 className="font-semibold text-smartpay-navy mb-2">Limit Pinjaman Anda</h3>
          <p className="text-2xl font-bold text-smartpay-gold">{formatCurrency(user?.loanLimit || 0)}</p>
          <p className="text-xs text-gray-600 mt-1">
            Ajukan pinjaman sesuai kebutuhan Anda dengan bunga kompetitif 0.3%
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
