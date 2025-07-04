
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Receipt, User, Calendar, DollarSign } from 'lucide-react';

const AdminBills = () => {
  const navigate = useNavigate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Get all bills and loans for complete overview
  const bills = JSON.parse(localStorage.getItem('tagihan') || '[]');
  const loans = JSON.parse(localStorage.getItem('pinjaman') || '[]').filter((loan: any) => loan.status === 'approved');
  const users = JSON.parse(localStorage.getItem('users') || '[]');

  const activeBills = bills.filter((bill: any) => bill.status === 'active');
  const completedBills = bills.filter((bill: any) => bill.status === 'completed');

  const BillCard: React.FC<{ bill: any }> = ({ bill }) => {
    const user = users.find((u: any) => u.id === bill.userId);
    const loan = loans.find((l: any) => l.id === bill.loanId);
    
    return (
      <Card key={bill.id} className={`${
        bill.status === 'active' ? 'border-blue-200 bg-blue-50' : 'border-green-200 bg-green-50'
      }`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Receipt className={`h-6 w-6 mr-3 ${
                bill.status === 'active' ? 'text-blue-600' : 'text-green-600'
              }`} />
              <div>
                <p className="font-bold text-gray-800">{bill.userName}</p>
                <p className="text-sm text-gray-600 font-normal">
                  {new Date(bill.createdAt).toLocaleDateString('id-ID')}
                </p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
              bill.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
            }`}>
              {bill.status === 'active' ? 'AKTIF' : 'LUNAS'}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-600">Total Pinjaman</p>
              <p className="text-lg font-bold text-blue-600">
                {formatCurrency(bill.totalAmount)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Angsuran/Bulan</p>
              <p className="text-lg font-bold text-smartpay-gold">
                {formatCurrency(bill.monthlyInstallment)}
              </p>
            </div>
          </div>

          <div className="bg-gray-100 rounded-lg p-3 mb-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Sisa Angsuran:</p>
                <p className="font-semibold">{bill.remainingInstallments} bulan</p>
              </div>
              <div>
                <p className="text-gray-600">Jatuh Tempo:</p>
                <p className="font-semibold text-red-600">{bill.nextDueDate}</p>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <div className="grid grid-cols-1 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bank:</span>
                <span className="font-medium">{user?.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">No. Rekening:</span>
                <span className="font-medium">{user?.accountNumber}</span>
              </div>
            </div>
          </div>

          {/* Original Loan Info */}
          {loan && (
            <div className="bg-blue-50 rounded-lg p-3">
              <h4 className="text-xs font-semibold text-blue-700 mb-2">Detail Pinjaman Awal:</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-600">Jumlah Pokok:</span>
                  <p className="font-semibold">{formatCurrency(loan.amount)}</p>
                </div>
                <div>
                  <span className="text-gray-600">Bunga (0.3%):</span>
                  <p className="font-semibold">{formatCurrency(loan.interest)}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="smartpay-gradient px-6 py-6 text-white">
        <div className="flex items-center mb-4">
          <button onClick={() => navigate('/admin')} className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Data Tagihan</h1>
            <p className="text-white/80 text-sm">
              Monitor tagihan dan status angsuran nasabah
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">{bills.length}</p>
            <p className="text-xs text-white/80">Total Tagihan</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">{activeBills.length}</p>
            <p className="text-xs text-white/80">Aktif</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">{completedBills.length}</p>
            <p className="text-xs text-white/80">Lunas</p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <p className="text-xs text-white/80">Total Outstanding</p>
            <p className="text-lg font-bold">
              {formatCurrency(activeBills.reduce((sum: number, bill: any) => 
                sum + (bill.monthlyInstallment * bill.remainingInstallments), 0
              ))}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <p className="text-xs text-white/80">Angsuran/Bulan</p>
            <p className="text-lg font-bold">
              {formatCurrency(activeBills.reduce((sum: number, bill: any) => 
                sum + bill.monthlyInstallment, 0
              ))}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Active Bills */}
        {activeBills.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-smartpay-navy mb-4 flex items-center">
              <Receipt className="h-5 w-5 mr-2" />
              Tagihan Aktif ({activeBills.length})
            </h2>
            <div className="space-y-4">
              {activeBills.map((bill: any) => 
                <BillCard key={bill.id} bill={bill} />
              )}
            </div>
          </div>
        )}

        {/* Completed Bills */}
        {completedBills.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-green-600 mb-4 flex items-center">
              <Receipt className="h-5 w-5 mr-2" />
              Tagihan Lunas ({completedBills.length})
            </h2>
            <div className="space-y-4">
              {completedBills.map((bill: any) => 
                <BillCard key={bill.id} bill={bill} />
              )}
            </div>
          </div>
        )}

        {bills.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Receipt className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Belum Ada Tagihan</h3>
              <p className="text-gray-500">
                Belum ada tagihan pinjaman dari nasabah
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminBills;
