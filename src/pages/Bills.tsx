
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Receipt, Calendar, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';

const Bills = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Get user's bills
  const bills = JSON.parse(localStorage.getItem('tagihan') || '[]')
    .filter((bill: any) => bill.userId === user?.id);

  // Get user's loans
  const loans = JSON.parse(localStorage.getItem('pinjaman') || '[]')
    .filter((loan: any) => loan.userId === user?.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="smartpay-gradient px-6 py-6 text-white">
        <div className="flex items-center mb-4">
          <button onClick={() => navigate('/')} className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Tagihan</h1>
            <p className="text-white/80 text-sm">Kelola tagihan dan angsuran Anda</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {bills.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Receipt className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Belum Ada Tagihan</h3>
              <p className="text-gray-500">
                Anda belum memiliki tagihan pinjaman aktif
              </p>
            </CardContent>
          </Card>
        ) : (
          bills.map((bill: any) => {
            const relatedLoan = loans.find((loan: any) => loan.id === bill.loanId);
            
            return (
              <Card key={bill.id} className="overflow-hidden">
                <CardHeader className={`${bill.status === 'active' ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-green-500 to-green-600'} text-white`}>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Receipt className="h-6 w-6 mr-3" />
                      <div>
                        <p className="text-lg font-bold">Tagihan Pinjaman</p>
                        <p className="text-white/80 text-sm">
                          {new Date(bill.createdAt).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {bill.status === 'active' ? (
                        <AlertCircle className="h-5 w-5" />
                      ) : (
                        <CheckCircle className="h-5 w-5" />
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {/* Loan Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600">Jumlah Pinjaman</p>
                      <p className="text-lg font-bold text-smartpay-navy">
                        {formatCurrency(relatedLoan?.amount || 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Total dengan Bunga</p>
                      <p className="text-lg font-bold text-smartpay-gold">
                        {formatCurrency(bill.totalAmount)}
                      </p>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-600">Angsuran per Bulan</p>
                        <p className="text-xl font-bold text-blue-600">
                          {formatCurrency(bill.monthlyInstallment)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Sisa Angsuran</p>
                        <p className="text-xl font-bold text-orange-600">
                          {bill.remainingInstallments} bulan
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-600">Tanggal Mulai</p>
                        <p className="text-sm font-semibold">
                          {relatedLoan ? new Date(relatedLoan.loanDate).toLocaleDateString('id-ID') : '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Jatuh Tempo Berikutnya</p>
                        <p className="text-sm font-semibold text-red-600">
                          {bill.nextDueDate}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className={`rounded-lg p-4 ${bill.status === 'active' ? 'bg-blue-50 border border-blue-200' : 'bg-green-50 border border-green-200'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className={`font-semibold ${bill.status === 'active' ? 'text-blue-700' : 'text-green-700'}`}>
                          Status Tagihan
                        </h3>
                        <p className={`text-sm ${bill.status === 'active' ? 'text-blue-600' : 'text-green-600'}`}>
                          {bill.status === 'active' ? 'Aktif - Sedang Berjalan' : 'Lunas'}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        bill.status === 'active' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {bill.status === 'active' ? 'AKTIF' : 'LUNAS'}
                      </div>
                    </div>
                  </div>

                  {/* Installment Schedule Preview */}
                  {relatedLoan && relatedLoan.installments && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2 text-gray-700">Jadwal Angsuran:</h4>
                      <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
                        {relatedLoan.installments.slice(0, 3).map((installment: any, index: number) => (
                          <div key={index} className="flex justify-between text-xs py-1 border-b border-gray-200 last:border-b-0">
                            <span>Bulan {installment.month} - {installment.dueDate}</span>
                            <span className="font-semibold">{formatCurrency(installment.amount)}</span>
                          </div>
                        ))}
                        {relatedLoan.installments.length > 3 && (
                          <p className="text-xs text-gray-500 text-center pt-2">
                            +{relatedLoan.installments.length - 3} angsuran lainnya
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}

        {/* Payment Reminder */}
        {bills.some((bill: any) => bill.status === 'active') && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-orange-600 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-orange-700 mb-1">Pengingat Pembayaran</h3>
                  <p className="text-sm text-orange-600">
                    Pastikan untuk melakukan pembayaran angsuran tepat waktu untuk menghindari denda keterlambatan.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Bills;
