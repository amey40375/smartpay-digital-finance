
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, Wallet, ArrowDownCircle, Receipt, PlusCircle, User, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentBanner, setCurrentBanner] = useState(0);

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
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      onClick: () => navigate('/loan-application')
    },
    {
      title: 'Saldo Aplikasi',
      icon: Wallet,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      onClick: () => navigate('/balance')
    },
    {
      title: 'Tarik Dana',
      icon: ArrowDownCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      onClick: () => navigate('/withdraw')
    },
    {
      title: 'Tagihan',
      icon: Receipt,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      onClick: () => navigate('/bills')
    },
    {
      title: 'Top Up Saldo',
      icon: PlusCircle,
      color: 'text-teal-600',
      bgColor: 'bg-teal-100',
      onClick: () => navigate('/topup')
    },
    {
      title: 'Profil Saya',
      icon: User,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      onClick: () => navigate('/profile')
    }
  ];

  const banners = [
    {
      title: "Pinjaman Cepat & Mudah",
      subtitle: "Ajukan pinjaman hingga Rp 10 juta dengan bunga 0.3%",
      bgColor: "bg-gradient-to-r from-blue-500 to-blue-600"
    },
    {
      title: "Proses Persetujuan Instan",
      subtitle: "Dapatkan persetujuan dalam hitungan menit",
      bgColor: "bg-gradient-to-r from-green-500 to-green-600"
    },
    {
      title: "Tenor Fleksibel",
      subtitle: "Pilih tenor 1-12 bulan sesuai kemampuan Anda",
      bgColor: "bg-gradient-to-r from-purple-500 to-purple-600"
    },
    {
      title: "Tanpa Agunan",
      subtitle: "Pinjaman tanpa jaminan, hanya dengan KTP",
      bgColor: "bg-gradient-to-r from-orange-500 to-orange-600"
    },
    {
      title: "Bunga Kompetitif 0.3%",
      subtitle: "Bunga rendah dan transparan tanpa biaya tersembunyi",
      bgColor: "bg-gradient-to-r from-teal-500 to-teal-600"
    },
    {
      title: "Pencairan 24 Jam",
      subtitle: "Dana langsung masuk ke rekening Anda",
      bgColor: "bg-gradient-to-r from-indigo-500 to-indigo-600"
    },
    {
      title: "Aplikasi Terpercaya",
      subtitle: "Sudah dipercaya ribuan nasabah di Indonesia",
      bgColor: "bg-gradient-to-r from-pink-500 to-pink-600"
    }
  ];

  // Auto slide banner every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="smartpay-gradient px-6 py-6 text-white">
        <div className="flex justify-between items-start mb-4">
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

        {/* Balance Card - Gojek Style */}
        <div className="gojek-balance-card">
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

      {/* Menu Grid - Horizontal 2 Rows */}
      <div className="px-6 py-6">
        <div className="gojek-menu-grid">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="gojek-menu-item"
              onClick={item.onClick}
            >
              <div className={`${item.bgColor} w-12 h-12 rounded-xl flex items-center justify-center mb-2`}>
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <span className="gojek-menu-text">{item.title}</span>
            </div>
          ))}
        </div>

        {/* Auto-sliding Banner */}
        <div className="mt-6">
          <div className="relative overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentBanner * 100}%)` }}
            >
              {banners.map((banner, index) => (
                <div
                  key={index}
                  className={`w-full flex-shrink-0 ${banner.bgColor} p-6 text-white`}
                >
                  <h3 className="text-xl font-bold mb-2">{banner.title}</h3>
                  <p className="text-white/90 text-sm">{banner.subtitle}</p>
                </div>
              ))}
            </div>
            
            {/* Banner Indicators */}
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentBanner ? 'bg-white' : 'bg-white/50'
                  }`}
                  onClick={() => setCurrentBanner(index)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Loan Limit Info */}
        <div className="mt-6">
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="font-semibold text-smartpay-navy mb-2">Limit Pinjaman Anda</h3>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(user?.loanLimit || 0)}</p>
            <p className="text-xs text-gray-600 mt-1">
              Ajukan pinjaman sesuai kebutuhan Anda dengan bunga kompetitif 0.3%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
