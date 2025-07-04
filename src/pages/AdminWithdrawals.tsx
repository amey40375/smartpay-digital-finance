
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowUpCircle, CheckCircle, XCircle, Clock } from 'lucide-react';

const AdminWithdrawals = () => {
  const navigate = useNavigate();
  const [withdrawals, setWithdrawals] = useState(() => {
    return JSON.parse(localStorage.getItem('penarikan') || '[]');
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleWithdrawalAction = (withdrawalId: string, action: 'approve' | 'reject') => {
    const updatedWithdrawals = withdrawals.map((withdrawal: any) => 
      withdrawal.id === withdrawalId 
        ? { ...withdrawal, status: action === 'approve' ? 'approved' : 'rejected' }
        : withdrawal
    );
    
    setWithdrawals(updatedWithdrawals);
    localStorage.setItem('penarikan', JSON.stringify(updatedWithdrawals));
    
    toast({
      title: "Berhasil",
      description: `Penarikan ${action === 'approve' ? 'disetujui' : 'ditolak'}`,
    });
  };

  const pendingWithdrawals = withdrawals.filter((w: any) => w.status === 'pending');
  const approvedWithdrawals = withdrawals.filter((w: any) => w.status === 'approved');
  const rejectedWithdrawals = withdrawals.filter((w: any) => w.status === 'rejected');

  const WithdrawalCard: React.FC<{ withdrawal: any }> = ({ withdrawal }) => (
    <Card key={withdrawal.id} className={`${
      withdrawal.status === 'pending' ? 'border-orange-200 bg-orange-50' :
      withdrawal.status === 'approved' ? 'border-green-200 bg-green-50' :
      'border-red-200 bg-red-50'
    }`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <ArrowUpCircle className={`h-6 w-6 mr-3 ${
              withdrawal.status === 'pending' ? 'text-orange-600' :
              withdrawal.status === 'approved' ? 'text-green-600' :
              'text-red-600'
            }`} />
            <div>
              <p className="font-bold text-gray-800">{withdrawal.userName}</p>
              <p className="text-sm text-gray-600 font-normal">
                {new Date(withdrawal.createdAt).toLocaleDateString('id-ID')}
              </p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
            withdrawal.status === 'pending' ? 'bg-orange-100 text-orange-700' :
            withdrawal.status === 'approved' ? 'bg-green-100 text-green-700' :
            'bg-red-100 text-red-700'
          }`}>
            {withdrawal.status === 'pending' ? 'PENDING' :
             withdrawal.status === 'approved' ? 'DISETUJUI' : 'DITOLAK'}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-xs text-gray-600">Jumlah Penarikan</p>
          <p className="text-2xl font-bold text-blue-600">
            {formatCurrency(withdrawal.amount)}
          </p>
        </div>

        <div className="bg-gray-100 rounded-lg p-3 mb-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Bank:</span>
              <span className="font-semibold">{withdrawal.bankName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">No. Rekening:</span>
              <span className="font-semibold">{withdrawal.accountNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Nama Rekening:</span>
              <span className="font-semibold">{withdrawal.accountHolderName}</span>
            </div>
          </div>
        </div>

        {withdrawal.status === 'pending' && (
          <div className="flex space-x-2">
            <Button
              onClick={() => handleWithdrawalAction(withdrawal.id, 'approve')}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
              size="sm"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Transfer
            </Button>
            <Button
              onClick={() => handleWithdrawalAction(withdrawal.id, 'reject')}
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
            <h1 className="text-xl font-bold">Permintaan Penarikan</h1>
            <p className="text-white/80 text-sm">
              Kelola permintaan transfer dana nasabah
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">{pendingWithdrawals.length}</p>
            <p className="text-xs text-white/80">Pending</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">{approvedWithdrawals.length}</p>
            <p className="text-xs text-white/80">Disetujui</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">{rejectedWithdrawals.length}</p>
            <p className="text-xs text-white/80">Ditolak</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Pending Withdrawals */}
        {pendingWithdrawals.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-smartpay-navy mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Menunggu Persetujuan ({pendingWithdrawals.length})
            </h2>
            <div className="space-y-4">
              {pendingWithdrawals.map((withdrawal: any) => 
                <WithdrawalCard key={withdrawal.id} withdrawal={withdrawal} />
              )}
            </div>
          </div>
        )}

        {/* Approved Withdrawals */}
        {approvedWithdrawals.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-green-600 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Disetujui ({approvedWithdrawals.length})
            </h2>
            <div className="space-y-4">
              {approvedWithdrawals.map((withdrawal: any) => 
                <WithdrawalCard key={withdrawal.id} withdrawal={withdrawal} />
              )}
            </div>
          </div>
        )}

        {/* Rejected Withdrawals */}
        {rejectedWithdrawals.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-red-600 mb-4 flex items-center">
              <XCircle className="h-5 w-5 mr-2" />
              Ditolak ({rejectedWithdrawals.length})
            </h2>
            <div className="space-y-4">
              {rejectedWithdrawals.map((withdrawal: any) => 
                <WithdrawalCard key={withdrawal.id} withdrawal={withdrawal} />
              )}
            </div>
          </div>
        )}

        {withdrawals.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <ArrowUpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Belum Ada Penarikan</h3>
              <p className="text-gray-500">
                Belum ada permintaan penarikan dari nasabah
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminWithdrawals;
