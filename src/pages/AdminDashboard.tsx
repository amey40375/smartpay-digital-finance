
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Users, FileText, ArrowUpCircle, PlusCircle, Receipt, LogOut, Shield } from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      title: 'Daftar Nasabah',
      icon: Users,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      onClick: () => navigate('/admin/customers')
    },
    {
      title: 'Permintaan Pinjaman',
      icon: FileText,
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      onClick: () => navigate('/admin/loans')
    },
    {
      title: 'Permintaan Penarikan',
      icon: ArrowUpCircle,
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      onClick: () => navigate('/admin/withdrawals')
    },
    {
      title: 'Permintaan Top Up Tabungan',
      icon: PlusCircle,
      color: 'bg-gradient-to-br from-teal-500 to-teal-600',
      onClick: () => navigate('/admin/topups')
    },
    {
      title: 'Data Tagihan',
      icon: Receipt,
      color: 'bg-gradient-to-br from-orange-500 to-orange-600',
      onClick: () => navigate('/admin/bills')
    }
  ];

  // Get statistics
  const users = JSON.parse(localStorage.getItem('users') || '[]').filter((u: any) => u.role === 'customer');
  const loans = JSON.parse(localStorage.getItem('pinjaman') || '[]');
  const withdrawals = JSON.parse(localStorage.getItem('penarikan') || '[]');
  const topups = JSON.parse(localStorage.getItem('topupTabungan') || '[]');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="smartpay-gradient px-6 py-8 text-white">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center mb-2">
              <Shield className="h-6 w-6 mr-2" />
              <h1 className="text-2xl font-bold">Admin Panel</h1>
            </div>
            <p className="text-white/80">Selamat datang, {user?.fullName}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>

        {/* Statistics */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-white/70 text-sm">Total Nasabah</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
            <div>
              <p className="text-white/70 text-sm">Pinjaman Aktif</p>
              <p className="text-2xl font-bold">{loans.filter((l: any) => l.status === 'approved').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="px-6 py-8">
        <h2 className="text-xl font-bold text-smartpay-navy mb-6">Menu Administrasi</h2>
        
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

      {/* Quick Actions */}
      <div className="px-6 pb-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="font-semibold text-smartpay-navy mb-1">Pending Loans</h3>
            <p className="text-2xl font-bold text-smartpay-gold">
              {loans.filter((l: any) => l.status === 'pending').length}
            </p>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <h3 className="font-semibold text-green-700 mb-1">Pending Withdrawals</h3>
            <p className="text-2xl font-bold text-green-600">
              {withdrawals.filter((w: any) => w.status === 'pending').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
