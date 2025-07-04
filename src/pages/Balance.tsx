
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Wallet, PiggyBank, TrendingUp } from 'lucide-react';

const Balance = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const savingsPercentage = user?.loanBalance ? (user.savingsBalance / user.loanBalance) * 100 : 0;
  const isEligibleForWithdrawal = savingsPercentage >= 10;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="smartpay-gradient px-6 py-6 text-white">
        <div className="flex items-center mb-4">
          <button onClick={() => navigate('/')} className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Saldo Aplikasi</h1>
            <p className="text-white/80 text-sm">Kelola saldo dan keuangan Anda</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Loan Balance Card */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardTitle className="flex items-center text-lg">
              <Wallet className="h-6 w-6 mr-3" />
              Saldo Pinjaman
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600 mb-2">
                {formatCurrency(user?.loanBalance || 0)}
              </p>
              <p className="text-sm text-gray-600">
                Dana yang dapat ditarik dari pinjaman
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Savings Balance Card */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardTitle className="flex items-center text-lg">
              <PiggyBank className="h-6 w-6 mr-3" />
              Saldo Tabungan
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <p className="text-3xl font-bold text-green-600 mb-2">
                {formatCurrency(user?.savingsBalance || 0)}
              </p>
              <p className="text-sm text-gray-600">
                Tabungan aktif untuk syarat penarikan
              </p>
            </div>

            {/* Savings Percentage Indicator */}
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Persentase dari Pinjaman</span>
                <span className={`text-sm font-bold ${savingsPercentage >= 10 ? 'text-green-600' : 'text-orange-600'}`}>
                  {savingsPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    savingsPercentage >= 10 ? 'bg-green-500' : 'bg-orange-500'
                  }`}
                  style={{ width: `${Math.min(savingsPercentage, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {isEligibleForWithdrawal 
                  ? "✅ Memenuhi syarat untuk penarikan dana" 
                  : "⚠️ Minimal 10% untuk dapat menarik dana"
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-smartpay-navy">
              <TrendingUp className="h-5 w-5 mr-2" />
              Ringkasan Keuangan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-gray-600">Total Saldo</p>
                <p className="text-lg font-bold text-blue-600">
                  {formatCurrency((user?.loanBalance || 0) + (user?.savingsBalance || 0))}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs text-gray-600">Limit Tersisa</p>
                <p className="text-lg font-bold text-green-600">
                  {formatCurrency((user?.loanLimit || 0) - (user?.loanBalance || 0))}
                </p>
              </div>
            </div>

            {/* Status Penarikan */}
            <div className={`rounded-lg p-4 ${isEligibleForWithdrawal ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
              <h3 className={`font-semibold mb-2 ${isEligibleForWithdrawal ? 'text-green-700' : 'text-orange-700'}`}>
                Status Penarikan Dana
              </h3>
              {isEligibleForWithdrawal ? (
                <p className="text-sm text-green-600">
                  Selamat! Anda dapat melakukan penarikan dana karena saldo tabungan sudah mencukupi syarat minimum 10%.
                </p>
              ) : (
                <div className="text-sm text-orange-600">
                  <p className="mb-2">
                    Saldo tabungan Anda belum mencukupi syarat minimum untuk penarikan dana.
                  </p>
                  <p className="font-medium">
                    Minimal diperlukan: {formatCurrency((user?.loanBalance || 0) * 0.1)}
                  </p>
                  <p>
                    Kekurangan: {formatCurrency(Math.max(0, (user?.loanBalance || 0) * 0.1 - (user?.savingsBalance || 0)))}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Balance;
