
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowDownCircle, Building, CreditCard, User, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

const indonesianBanks = [
  "Bank Central Asia (BCA)",
  "Bank Rakyat Indonesia (BRI)",
  "Bank Negara Indonesia (BNI)",
  "Bank Mandiri",
  "Bank Danamon",
  "Bank CIMB Niaga",
  "Bank Permata",
  "Bank Maybank Indonesia",
  "Bank Syariah Indonesia (BSI)",
  "Bank BTN"
];

const Withdraw = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: '',
    bankName: '',
    accountNumber: '',
    accountHolderName: ''
  });
  const [showInsufficientSavings, setShowInsufficientSavings] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const savingsPercentage = user?.loanBalance ? (user.savingsBalance / user.loanBalance) * 100 : 0;
  const isEligibleForWithdrawal = savingsPercentage >= 10;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 1200); // 60 seconds total (100 / 2 = 50 intervals * 1.2s = 60s)
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(formData.amount);
    
    // Validation
    if (!formData.amount || !formData.bankName || !formData.accountNumber || !formData.accountHolderName) {
      toast({
        title: "Error",
        description: "Harap isi semua field yang diperlukan",
        variant: "destructive",
      });
      return;
    }

    if (amount <= 0 || amount > (user?.loanBalance || 0)) {
      toast({
        title: "Error",
        description: "Jumlah penarikan tidak valid",
        variant: "destructive",
      });
      return;
    }

    if (formData.accountHolderName.toLowerCase() !== user?.fullName.toLowerCase()) {
      toast({
        title: "Error",
        description: "Nama pemilik rekening harus sesuai dengan nama pendaftaran",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    simulateProgress();
    
    // Wait for progress to complete (60 seconds)
    await new Promise(resolve => setTimeout(resolve, 60000));

    if (!isEligibleForWithdrawal) {
      setIsProcessing(false);
      setShowInsufficientSavings(true);
      return;
    }

    // Process withdrawal
    const withdrawalData = {
      id: `withdrawal-${Date.now()}`,
      userId: user?.id,
      userName: user?.fullName,
      amount: amount,
      bankName: formData.bankName,
      accountNumber: formData.accountNumber,
      accountHolderName: formData.accountHolderName,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const existingWithdrawals = JSON.parse(localStorage.getItem('penarikan') || '[]');
    existingWithdrawals.push(withdrawalData);
    localStorage.setItem('penarikan', JSON.stringify(existingWithdrawals));

    // Update user's loan balance
    updateUser({
      loanBalance: (user?.loanBalance || 0) - amount
    });

    setIsProcessing(false);
    setShowSuccessModal(true);
    
    setTimeout(() => {
      setShowSuccessModal(false);
      navigate('/balance');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="smartpay-gradient px-6 py-6 text-white">
        <div className="flex items-center mb-4">
          <button onClick={() => navigate('/')} className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Tarik Dana</h1>
            <p className="text-white/80 text-sm">Transfer dana ke rekening bank Anda</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Balance Info */}
        <Card className="mb-6 border-l-4 border-l-smartpay-gold">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600">Saldo Pinjaman</p>
                <p className="text-lg font-bold text-smartpay-navy">{formatCurrency(user?.loanBalance || 0)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Status Penarikan</p>
                <p className={`text-sm font-semibold ${isEligibleForWithdrawal ? 'text-green-600' : 'text-orange-600'}`}>
                  {isEligibleForWithdrawal ? '✅ Dapat Ditarik' : '⚠️ Tidak Memenuhi Syarat'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Withdrawal Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-smartpay-navy flex items-center">
              <ArrowDownCircle className="h-5 w-5 mr-2" />
              Formulir Penarikan Dana
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Jumlah Penarikan
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Masukkan jumlah"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    className="pl-12 h-12 text-lg"
                    max={user?.loanBalance || 0}
                  />
                  <span className="absolute left-3 top-3 text-gray-500">Rp</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Maksimal: {formatCurrency(user?.loanBalance || 0)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Bank
                </label>
                <Select onValueChange={(value) => handleInputChange('bankName', value)}>
                  <SelectTrigger className="h-12">
                    <Building className="h-4 w-4 text-gray-400 mr-2" />
                    <SelectValue placeholder="Pilih Bank" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    {indonesianBanks.map((bank) => (
                      <SelectItem key={bank} value={bank}>
                        {bank}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nomor Rekening
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Nomor rekening"
                    value={formData.accountNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      handleInputChange('accountNumber', value);
                    }}
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Pemilik Rekening
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Nama sesuai rekening"
                    value={formData.accountHolderName}
                    onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
                <p className="text-xs text-orange-600 mt-1">
                  * Harus sesuai dengan nama pendaftaran: {user?.fullName}
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-12 smartpay-gradient text-white font-semibold text-lg"
                disabled={!isEligibleForWithdrawal}
              >
                TRANSFER SEKARANG
              </Button>

              {!isEligibleForWithdrawal && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-sm text-orange-700">
                    Saldo tabungan Anda belum mencukupi syarat minimum 10% untuk melakukan penarikan dana.
                  </p>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Processing Modal */}
      <Dialog open={isProcessing} onOpenChange={() => {}}>
        <DialogContent className="max-w-sm mx-4 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-center text-smartpay-navy">
              Memproses Transfer
            </DialogTitle>
          </DialogHeader>
          <div className="py-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-smartpay-navy" />
            <p className="text-lg font-semibold text-smartpay-navy mb-4">
              Sedang memproses transfer Anda...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div
                className="bg-gradient-to-r from-smartpay-navy to-smartpay-gold h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">{progress}% selesai</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Insufficient Savings Modal */}
      <Dialog open={showInsufficientSavings} onOpenChange={setShowInsufficientSavings}>
        <DialogContent className="max-w-sm mx-4 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-center text-orange-600 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 mr-2" />
              Mohon Maaf
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center space-y-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              Saldo tabungan Anda saat ini belum mencukupi syarat minimum penarikan dana.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Untuk melanjutkan proses penarikan, Anda wajib memiliki tabungan minimal <strong>10%</strong> dari total pinjaman Anda.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Hal ini merupakan bagian dari ketentuan aktif sebagai nasabah kami.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Jangan khawatir, saldo tabungan Anda tidak akan terpotong. Ini hanya sebagai syarat pengaktifan.
            </p>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm font-semibold text-smartpay-navy">
                Yuk, top up tabungan Anda untuk menikmati layanan penuh dari SmartPAY!
              </p>
            </div>
            <Button
              onClick={() => {
                setShowInsufficientSavings(false);
                navigate('/topup');
              }}
              className="w-full smartpay-gradient text-white font-semibold"
            >
              TOP UP SEKARANG
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={() => {}}>
        <DialogContent className="max-w-sm mx-4 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-center text-green-600">
              Transfer Berhasil!
            </DialogTitle>
          </DialogHeader>
          <div className="py-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-semibold text-green-600 mb-2">
              Permintaan Dikirim ke Admin
            </p>
            <p className="text-sm text-gray-600">
              Transfer sebesar {formatCurrency(parseFloat(formData.amount || '0'))} akan diproses segera oleh admin.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Withdraw;
