
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, User, Mail, CreditCard, Building, LogOut, Shield } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const profileData = [
    {
      label: 'Nama Lengkap',
      value: user?.fullName,
      icon: User
    },
    {
      label: 'Email',
      value: user?.email,
      icon: Mail
    },
    {
      label: 'Nomor KTP',
      value: user?.ktpNumber,
      icon: CreditCard
    },
    {
      label: 'Bank',
      value: user?.bankName,
      icon: Building
    },
    {
      label: 'Nomor Rekening',
      value: user?.accountNumber,
      icon: CreditCard
    },
    {
      label: 'Nama Pemilik Rekening',
      value: user?.accountHolderName,
      icon: User
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="smartpay-gradient px-6 py-6 text-white">
        <div className="flex items-center mb-4">
          <button onClick={() => navigate('/')} className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Profil Saya</h1>
            <p className="text-white/80 text-sm">Informasi akun dan data pribadi</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Profile Summary */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-smartpay-navy to-smartpay-navy-light text-white text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-10 w-10 text-smartpay-navy" />
            </div>
            <CardTitle className="text-xl">{user?.fullName}</CardTitle>
            <p className="text-white/80">{user?.email}</p>
            <div className="flex items-center justify-center mt-2">
              <Shield className="h-4 w-4 mr-1" />
              <span className="text-sm">Nasabah Terverifikasi</span>
            </div>
          </CardHeader>
        </Card>

        {/* Account Balance Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-smartpay-navy">Ringkasan Saldo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-600">Saldo Pinjaman</p>
                <p className="text-lg font-bold text-blue-600">
                  {formatCurrency(user?.loanBalance || 0)}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-600">Saldo Tabungan</p>
                <p className="text-lg font-bold text-green-600">
                  {formatCurrency(user?.savingsBalance || 0)}
                </p>
              </div>
            </div>
            <div className="mt-4 bg-yellow-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-600">Limit Pinjaman</p>
              <p className="text-xl font-bold text-smartpay-gold">
                {formatCurrency(user?.loanLimit || 0)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-smartpay-navy">Informasi Pribadi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profileData.map((item, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-smartpay-navy rounded-full flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600">{item.label}</p>
                  <p className="font-semibold text-gray-800">{item.value}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Account Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-smartpay-navy">Status Akun</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-xs text-gray-600">Status Verifikasi</p>
                <div className="flex items-center justify-center mt-1">
                  <Shield className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm font-semibold text-green-600">Terverifikasi</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600">Bergabung Sejak</p>
                <p className="text-sm font-semibold text-gray-800 mt-1">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID') : '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-smartpay-navy">Tindakan Akun</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-smartpay-navy mb-2">Keamanan Akun</h3>
              <p className="text-sm text-gray-600 mb-3">
                Akun Anda telah terverifikasi dan aman. Data pribadi Anda dilindungi dengan enkripsi tingkat tinggi.
              </p>
            </div>

            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full h-12 bg-red-500 hover:bg-red-600 text-white font-semibold"
            >
              <LogOut className="h-5 w-5 mr-2" />
              LOGOUT DARI AKUN
            </Button>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="text-center py-4">
          <p className="text-xs text-gray-500">
            SmartPAY - Platform Pinjaman Online Terpercaya
          </p>
          <p className="text-xs text-gray-400 mt-1">
            © 2024 SmartPAY. Semua hak dilindungi.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
