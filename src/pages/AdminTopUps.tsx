
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, PlusCircle, CheckCircle, XCircle, Clock } from 'lucide-react';

const AdminTopUps = () => {
  const navigate = useNavigate();
  const [topups, setTopups] = useState(() => {
    return JSON.parse(localStorage.getItem('topupTabungan') || '[]');
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleTopupAction = (topupId: string, action: 'approve' | 'reject') => {
    const updatedTopups = topups.map((topup: any) => 
      topup.id === topupId 
        ? { ...topup, status: action === 'approve' ? 'approved' : 'rejected' }
        : topup
    );
    
    setTopups(updatedTopups);
    localStorage.setItem('topupTabungan', JSON.stringify(updatedTopups));

    // If approved, update user's savings balance
    if (action === 'approve') {
      const approvedTopup = topups.find((t: any) => t.id === topupId);
      if (approvedTopup) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = users.map((user: any) => 
          user.id === approvedTopup.userId 
            ? { ...user, savingsBalance: (user.savingsBalance || 0) + approvedTopup.amount }
            : user
        );
        localStorage.setItem('users', JSON.stringify(updatedUsers));

        // Update loginUser if it's the current user
        const loginUser = JSON.parse(localStorage.getItem('loginUser') || 'null');
        if (loginUser && loginUser.id === approvedTopup.userId) {
          const updatedLoginUser = { ...loginUser, savingsBalance: (loginUser.savingsBalance || 0) + approvedTopup.amount };
          localStorage.setItem('loginUser', JSON.stringify(updatedLoginUser));
        }
      }
    }
    
    toast({
      title: "Berhasil",
      description: `Top up ${action === 'approve' ? 'disetujui' : 'ditolak'}`,
    });
  };

  const pendingTopups = topups.filter((t: any) => t.status === 'pending');
  const approvedTopups = topups.filter((t: any) => t.status === 'approved');
  const rejectedTopups = topups.filter((t: any) => t.status === 'rejected');

  const TopupCard: React.FC<{ topup: any }> = ({ topup }) => (
    <Card key={topup.id} className={`${
      topup.status === 'pending' ? 'border-orange-200 bg-orange-50' :
      topup.status === 'approved' ? 'border-green-200 bg-green-50' :
      'border-red-200 bg-red-50'
    }`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <PlusCircle className={`h-6 w-6 mr-3 ${
              topup.status === 'pending' ? 'text-orange-600' :
              topup.status === 'approved' ? 'text-green-600' :
              'text-red-600'
            }`} />
            <div>
              <p className="font-bold text-gray-800">{topup.userName}</p>
              <p className="text-sm text-gray-600 font-normal">
                {new Date(topup.createdAt).toLocaleDateString('id-ID')}
              </p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
            topup.status === 'pending' ? 'bg-orange-100 text-orange-700' :
            topup.status === 'approved' ? 'bg-green-100 text-green-700' :
            'bg-red-100 text-red-700'
          }`}>
            {topup.status === 'pending' ? 'PENDING' :
             topup.status === 'approved' ? 'DISETUJUI' : 'DITOLAK'}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-xs text-gray-600">Jumlah Top Up</p>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(topup.amount)}
          </p>
        </div>

        <div className="bg-gray-100 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-600">
            Permintaan top up saldo tabungan untuk memenuhi syarat penarikan dana.
          </p>
        </div>

        {topup.status === 'pending' && (
          <div className="flex space-x-2">
            <Button
              onClick={() => handleTopupAction(topup.id, 'approve')}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
              size="sm"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Setujui
            </Button>
            <Button
              onClick={() => handleTopupAction(topup.id, 'reject')}
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
            <h1 className="text-xl font-bold">Permintaan Top Up Tabungan</h1>
            <p className="text-white/80 text-sm">
              Kelola permintaan top up saldo tabungan nasabah
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">{pendingTopups.length}</p>
            <p className="text-xs text-white/80">Pending</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">{approvedTopups.length}</p>
            <p className="text-xs text-white/80">Disetujui</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">{rejectedTopups.length}</p>
            <p className="text-xs text-white/80">Ditolak</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Pending Top Ups */}
        {pendingTopups.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-smartpay-navy mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Menunggu Persetujuan ({pendingTopups.length})
            </h2>
            <div className="space-y-4">
              {pendingTopups.map((topup: any) => 
                <TopupCard key={topup.id} topup={topup} />
              )}
            </div>
          </div>
        )}

        {/* Approved Top Ups */}
        {approvedTopups.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-green-600 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Disetujui ({approvedTopups.length})
            </h2>
            <div className="space-y-4">
              {approvedTopups.map((topup: any) => 
                <TopupCard key={topup.id} topup={topup} />
              )}
            </div>
          </div>
        )}

        {/* Rejected Top Ups */}
        {rejectedTopups.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-red-600 mb-4 flex items-center">
              <XCircle className="h-5 w-5 mr-2" />
              Ditolak ({rejectedTopups.length})
            </h2>
            <div className="space-y-4">
              {rejectedTopups.map((topup: any) => 
                <TopupCard key={topup.id} topup={topup} />
              )}
            </div>
          </div>
        )}

        {topups.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <PlusCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Belum Ada Top Up</h3>
              <p className="text-gray-500">
                Belum ada permintaan top up dari nasabah
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminTopUps;
