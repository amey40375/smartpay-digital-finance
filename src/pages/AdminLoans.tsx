
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';

const AdminLoans = () => {
  const navigate = useNavigate();
  const [loans, setLoans] = useState(() => {
    return JSON.parse(localStorage.getItem('pinjaman') || '[]');
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleLoanAction = (loanId: string, action: 'approve' | 'reject') => {
    const updatedLoans = loans.map((loan: any) => 
      loan.id === loanId 
        ? { ...loan, status: action === 'approve' ? 'approved' : 'rejected' }
        : loan
    );
    
    setLoans(updatedLoans);
    localStorage.setItem('pinjaman', JSON.stringify(updatedLoans));
    
    toast({
      title: "Berhasil",
      description: `Pinjaman ${action === 'approve' ? 'disetujui' : 'ditolak'}`,
    });
  };

  const pendingLoans = loans.filter((loan: any) => loan.status === 'pending');
  const approvedLoans = loans.filter((loan: any) => loan.status === 'approved');
  const rejectedLoans = loans.filter((loan: any) => loan.status === 'rejected');

  const LoanCard: React.FC<{ loan: any }> = ({ loan }) => (
    <Card key={loan.id} className={`${
      loan.status === 'pending' ? 'border-orange-200 bg-orange-50' :
      loan.status === 'approved' ? 'border-green-200 bg-green-50' :
      'border-red-200 bg-red-50'
    }`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className={`h-6 w-6 mr-3 ${
              loan.status === 'pending' ? 'text-orange-600' :
              loan.status === 'approved' ? 'text-green-600' :
              'text-red-600'
            }`} />
            <div>
              <p className="font-bold text-gray-800">{loan.userName}</p>
              <p className="text-sm text-gray-600 font-normal">
                {new Date(loan.createdAt).toLocaleDateString('id-ID')}
              </p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
            loan.status === 'pending' ? 'bg-orange-100 text-orange-700' :
            loan.status === 'approved' ? 'bg-green-100 text-green-700' :
            'bg-red-100 text-red-700'
          }`}>
            {loan.status === 'pending' ? 'PENDING' :
             loan.status === 'approved' ? 'DISETUJUI' : 'DITOLAK'}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-600">Jumlah Pinjaman</p>
            <p className="text-lg font-bold text-blue-600">
              {formatCurrency(loan.amount)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Total + Bunga</p>
            <p className="text-lg font-bold text-smartpay-gold">
              {formatCurrency(loan.totalAmount)}
            </p>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-3 mb-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Bunga:</p>
              <p className="font-semibold">{formatCurrency(loan.interest)} (0.3%)</p>
            </div>
            <div>
              <p className="text-gray-600">Angsuran/Bulan:</p>
              <p className="font-semibold">{formatCurrency(loan.monthlyInstallment)}</p>
            </div>
          </div>
        </div>

        {loan.status === 'pending' && (
          <div className="flex space-x-2">
            <Button
              onClick={() => handleLoanAction(loan.id, 'approve')}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
              size="sm"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Setujui
            </Button>
            <Button
              onClick={() => handleLoanAction(loan.id, 'reject')}
              variant="destructive"
              size="sm"
              className="flex-1"
            >
              <XCircle className="h-4 w-4 mr-1" />
              Tolak
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="smartpay-gradient px-6 py-6 text-white">
        <div className="flex items-center mb-4">
          <button onClick={() => navigate('/admin')} className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Permintaan Pinjaman</h1>
            <p className="text-white/80 text-sm">
              Kelola persetujuan pinjaman nasabah
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">{pendingLoans.length}</p>
            <p className="text-xs text-white/80">Pending</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">{approvedLoans.length}</p>
            <p className="text-xs text-white/80">Disetujui</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">{rejectedLoans.length}</p>
            <p className="text-xs text-white/80">Ditolak</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Pending Loans */}
        {pendingLoans.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-smartpay-navy mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Menunggu Persetujuan ({pendingLoans.length})
            </h2>
            <div className="space-y-4">
              {pendingLoans.map((loan: any) => <LoanCard key={loan.id} loan={loan} />)}
            </div>
          </div>
        )}

        {/* Approved Loans */}
        {approvedLoans.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-green-600 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Disetujui ({approvedLoans.length})
            </h2>
            <div className="space-y-4">
              {approvedLoans.map((loan: any) => <LoanCard key={loan.id} loan={loan} />)}
            </div>
          </div>
        )}

        {/* Rejected Loans */}
        {rejectedLoans.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-red-600 mb-4 flex items-center">
              <XCircle className="h-5 w-5 mr-2" />
              Ditolak ({rejectedLoans.length})
            </h2>
            <div className="space-y-4">
              {rejectedLoans.map((loan: any) => <LoanCard key={loan.id} loan={loan} />)}
            </div>
          </div>
        )}

        {loans.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Belum Ada Pinjaman</h3>
              <p className="text-gray-500">
                Belum ada permintaan pinjaman dari nasabah
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminLoans;
