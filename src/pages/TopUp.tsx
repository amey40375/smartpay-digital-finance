
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, PlusCircle, Clock, CheckCircle } from 'lucide-react';

const TopUp = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const topupAmount = parseFloat(amount);
    
    if (!amount || topupAmount <= 0) {
      toast({
        title: "Error",
        description: "Harap masukkan nominal top up yang valid",
        variant: "destructive",
      });
      return;
    }

    if (topupAmount < 50000) {
      toast({
        title: "Error",
        description: "Minimal top up adalah Rp 50,000",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save top up request
      const topupData = {
        id: `topup-${Date.now()}`,
        userId: user?.id,
        userName: user?.fullName,
        amount: topupAmount,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      const existingTopUps = JSON.parse(localStorage.getItem('topupTabungan') || '[]');
      existingTopUps.push(topupData);
      localStorage.setItem('topupTabungan', JSON.stringify(existingTopUps));

      toast({
        title: "Berhasil!",
        description: "Permintaan top up telah dikirim dan menunggu persetujuan admin",
      });

      setAmount('');
      setTimeout(() => {
        navigate('/balance');
      }, 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat mengirim permintaan",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get pending top ups
  const pendingTopUps = JSON.parse(localStorage.getItem('topupTabungan') || '[]')
    .filter((topup: any) => topup.userId === user?.id && topup.status === 'pending');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="smartpay-gradient px-6 py-6 text-white">
        <div className="flex items-center mb-4">
          <button onClick={() => navigate('/')} className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Top Up Saldo Tabungan</h1>
            <p className="text-white/80 text-sm">Tambah saldo tabungan untuk syarat penarikan</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Current Balance */}
        <Card className="border-l-4 border-l-smartpay-gold">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600">Saldo Tabungan Saat Ini</p>
                <p className="text-lg font-bold text-green-600">{formatCurrency(user?.savingsBalance || 0)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Minimal untuk Penarikan</p>
                <p className="text-lg font-bold text-orange-600">
                  {formatCurrency((user?.loanBalance || 0) * 0.1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Up Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-smartpay-navy flex items-center">
              <PlusCircle className="h-5 w-5 mr-2" />
              Form Top Up Tabungan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nominal Top Up
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Masukkan nominal"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-12 h-12 text-lg"
                    min="50000"
                  />
                  <span className="absolute left-3 top-3 text-gray-500">Rp</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Minimal top up: Rp 50,000
                </p>
              </div>

              {/* Quick Amount Buttons */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Nominal Cepat:</p>
                <div className="grid grid-cols-2 gap-2">
                  {[100000, 250000, 500000, 1000000].map((quickAmount) => (
                    <Button
                      key={quickAmount}
                      type="button"
                      variant="outline"
                      className="h-10 text-sm"
                      onClick={() => setAmount(quickAmount.toString())}
                    >
                      {formatCurrency(quickAmount)}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 smartpay-gradient text-white font-semibold text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Mengirim Permintaan..." : "KIRIM PERMINTAAN TOP UP"}
              </Button>
            </form>

            {/* Info */}
            <div className="mt-6 bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-smartpay-navy mb-2">Informasi Top Up</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Permintaan akan diproses oleh admin</li>
                <li>• Saldo akan ditambahkan setelah disetujui</li>
                <li>• Minimal top up Rp 50,000</li>
                <li>• Saldo tabungan diperlukan untuk penarikan dana</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Pending Top Ups */}
        {pendingTopUps.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-smartpay-navy flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Permintaan Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingTopUps.map((topup: any) => (
                  <div key={topup.id} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-orange-700">{formatCurrency(topup.amount)}</p>
                        <p className="text-xs text-gray-600">
                          {new Date(topup.createdAt).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                      <div className="flex items-center text-orange-600">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">Pending</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TopUp;
