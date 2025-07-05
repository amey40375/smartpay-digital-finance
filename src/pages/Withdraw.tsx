import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowDownCircle, Building, CreditCard, User, AlertTriangle, CheckCircle, Loader2, X } from 'lucide-react';

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
    }, 1200);
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

    // Process withdrawal - Send to admin
    const withdrawalData = {
      id: `withdrawal-${Date.now()}`,
      userId: user?.id,
      userName: user?.fullName,
      amount: amount,
      bankName: formData.bankName,
      accountNumber: formData.accountNumber,
      accountHolderName: formData.accountHolderName,
      status: 'approved', // Auto approve for demo
      createdAt: new Date().toISOString()
    };

    const existingWithdrawals = JSON.parse(localStorage.getItem('penarikan') || '[]');
    existingWithdrawals.push(withdrawalData);
    localStorage.setItem('penarikan', JSON.stringify(existingWithdrawals));

    // IMPORTANT: Update user's loan balance by deducting the withdrawal amount
    updateUser({
      loanBalance: Math.max(0, (user?.loanBalance || 0) - amount)
    });

    setIsProcessing(false);
    setShowSuccessModal(true);
  };

  return (
    <div className="min-h-screen mobile-container">
      {/* Header */}
      <div className="smartpay-gradient px-6 py-8 text-white rounded-b-3xl">
        <div className="flex items-center mb-6">
          <button onClick={() => navigate('/')} className="mr-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold mb-1">Tarik Dana</h1>
            <p className="text-white/90 text-sm">Transfer dana ke rekening bank Anda</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Balance Info */}
        <Card className="elegant-card overflow-hidden">
          <div className="smartpay-reverse-gradient p-4 text-white">
            <h3 className="font-semibold text-lg mb-3">Informasi Saldo</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-white/80 text-sm">Saldo Pinjaman</p>
                <p className="text-xl font-bold">{formatCurrency(user?.loanBalance || 0)}</p>
              </div>
              <div>
                <p className="text-white/80 text-sm">Status Penarikan</p>
                <p className={`text-sm font-semibold ${isEligibleForWithdrawal ? 'text-green-200' : 'text-orange-200'}`}>
                  {isEligibleForWithdrawal ? '✅ Dapat Ditarik' : '⚠️ Tidak Memenuhi Syarat'}
                </p>
              </div>
            </div>
            <div className="mt-4 bg-white/20 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Persentase Tabungan</span>
                <span className="font-bold">{savingsPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-white/30 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    savingsPercentage >= 10 ? 'bg-green-400' : 'bg-orange-400'
                  }`}
                  style={{ width: `${Math.min(savingsPercentage, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-white/80 mt-1">
                Minimal 10% untuk dapat menarik dana
              </p>
            </div>
          </div>
        </Card>

        {/* Withdrawal Form */}
        <Card className="elegant-card">
          <CardHeader className="pb-4">
            <CardTitle className="gradient-text flex items-center text-xl">
              <ArrowDownCircle className="h-6 w-6 mr-3" />
              Formulir Penarikan Dana
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Jumlah Penarikan
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Masukkan jumlah"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    className="pl-12 h-14 text-lg border-2 border-blue-100 focus:border-blue-400 rounded-xl"
                    max={user?.loanBalance || 0}
                  />
                  <span className="absolute left-4 top-4 text-gray-500 font-medium">Rp</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Maksimal: {formatCurrency(user?.loanBalance || 0)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Nama Bank
                </label>
                <Select onValueChange={(value) => handleInputChange('bankName', value)}>
                  <SelectTrigger className="h-14 border-2 border-blue-100 focus:border-blue-400 rounded-xl">
                    <Building className="h-5 w-5 text-gray-400 mr-3" />
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
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Nomor Rekening
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Nomor rekening"
                    value={formData.accountNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      handleInputChange('accountNumber', value);
                    }}
                    className="pl-12 h-14 border-2 border-blue-100 focus:border-blue-400 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Nama Pemilik Rekening
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Nama sesuai rekening"
                    value={formData.accountHolderName}
                    onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                    className="pl-12 h-14 border-2 border-blue-100 focus:border-blue-400 rounded-xl"
                  />
                </div>
                <p className="text-xs text-orange-600 mt-2">
                  * Harus sesuai dengan nama pendaftaran: {user?.fullName}
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-14 smartpay-gradient text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                TRANSFER SEKARANG
              </Button>

              {!isEligibleForWithdrawal && (
                <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-400 rounded-lg p-4">
                  <p className="text-sm text-orange-700 font-medium">
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
        <DialogContent className="max-w-sm mx-4 rounded-2xl elegant-card">
          <DialogHeader>
            <DialogTitle className="text-center gradient-text text-xl">
              Memproses Transfer
            </DialogTitle>
          </DialogHeader>
          <div className="py-8 text-center">
            <Loader2 className="h-16 w-16 animate-spin mx-auto mb-6 text-blue-500" />
            <p className="text-lg font-semibold text-gray-700 mb-4">
              Sedang memproses transfer Anda...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
              <div
                className="smartpay-gradient h-4 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 font-medium">{progress}% selesai</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Insufficient Savings Modal - Updated message */}
      <Dialog open={showInsufficientSavings} onOpenChange={setShowInsufficientSavings}>
        <DialogContent className="max-w-sm mx-4 rounded-2xl elegant-card">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-center text-orange-600 flex items-center">
                <AlertTriangle className="h-6 w-6 mr-2" />
                Mohon Maaf
              </DialogTitle>
              <button 
                onClick={() => setShowInsufficientSavings(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </DialogHeader>
          <div className="py-6 text-center space-y-4">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4">
              <p className="text-sm text-gray-700 leading-relaxed font-medium">
                Maaf untuk bisa menarik Saldo Pinjaman maka Setidaknya anda Memiliki Saldo Tabungan Minimal 10% Dari Total Pinjaman anda
              </p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4">
              <p className="text-sm font-semibold gradient-text mb-2">
                Informasi Saldo Anda:
              </p>
              <p className="text-sm text-gray-600">
                Saldo Tabungan: {formatCurrency(user?.savingsBalance || 0)}
              </p>
              <p className="text-sm text-gray-600">
                Minimal Diperlukan: {formatCurrency((user?.loanBalance || 0) * 0.1)}
              </p>
              <p className="text-sm text-red-600 font-medium">
                Kekurangan: {formatCurrency(Math.max(0, (user?.loanBalance || 0) * 0.1 - (user?.savingsBalance || 0)))}
              </p>
            </div>
            <Button
              onClick={() => {
                setShowInsufficientSavings(false);
                navigate('/topup');
              }}
              className="w-full smartpay-gradient text-white font-semibold h-12 rounded-xl"
            >
              TOP UP TABUNGAN SEKARANG
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal - Updated with invoice */}
      <Dialog open={showSuccessModal} onOpenChange={() => {}}>
        <DialogContent className="max-w-sm mx-4 rounded-2xl elegant-card">
          <DialogHeader>
            <DialogTitle className="text-center gradient-text text-xl">
              Penarikan Berhasil!
            </DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center space-y-4">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto" />
            
            {/* Invoice Details - Changed from yellow to light blue */}
            <div className="bg-gradient-to-r from-sky-100 to-blue-100 rounded-xl p-4 text-left">
              <h4 className="font-bold text-blue-700 mb-3 text-center">Invoice Penarikan</h4>
              <div className="space-y-2 text-sm text-black">
                <div className="flex justify-between">
                  <span className="text-gray-700">Nama:</span>
                  <span className="font-medium">{user?.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Jumlah:</span>
                  <span className="font-medium">{formatCurrency(parseFloat(formData.amount || '0'))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Bank:</span>
                  <span className="font-medium">{formData.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">No. Rekening:</span>
                  <span className="font-medium">{formData.accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Status:</span>
                  <span className="font-medium text-green-600">Berhasil Diproses</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Tanggal:</span>
                  <span className="font-medium">{new Date().toLocaleDateString('id-ID')}</span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 leading-relaxed">
              Penarikan Anda telah berhasil diproses. Saldo pinjaman Anda telah dipotong sesuai nominal yang ditarik.
            </p>
            
            <Button
              onClick={() => {
                setShowSuccessModal(false);
                navigate('/balance');
              }}
              className="w-full smartpay-gradient text-white font-semibold h-12 rounded-xl"
            >
              LIHAT SALDO
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Withdraw;
