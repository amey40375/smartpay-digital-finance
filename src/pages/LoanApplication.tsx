
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Calculator, FileText, CheckCircle, Loader2 } from 'lucide-react';

const LoanApplication = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [showInvoice, setShowInvoice] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const interest = 0.003; // 0.3%
  const interestAmount = loanAmount * interest;
  const totalLoan = loanAmount + interestAmount;
  const monthlyInstallment = totalLoan / 6;
  const loanDate = new Date().toLocaleDateString('id-ID');

  const generateInstallmentTable = () => {
    const installments = [];
    const startDate = new Date();
    
    for (let i = 1; i <= 6; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(startDate.getMonth() + i);
      
      installments.push({
        month: i,
        dueDate: dueDate.toLocaleDateString('id-ID'),
        amount: monthlyInstallment
      });
    }
    return installments;
  };

  const handleSubmitLoan = () => {
    if (loanAmount < 5000000 || loanAmount > (user?.loanLimit || 0)) {
      toast({
        title: "Error",
        description: `Jumlah pinjaman harus antara Rp 5,000,000 - ${formatCurrency(user?.loanLimit || 0)}`,
        variant: "destructive",
      });
      return;
    }
    setShowInvoice(true);
  };

  const handleAgreement = async () => {
    setIsProcessing(true);
    
    // Simulate processing time (1 minute = 60 seconds)
    await new Promise(resolve => setTimeout(resolve, 60000));
    
    // Save loan data
    const loanData = {
      id: `loan-${Date.now()}`,
      userId: user?.id,
      userName: user?.fullName,
      amount: loanAmount,
      interest: interestAmount,
      totalAmount: totalLoan,
      monthlyInstallment,
      installments: generateInstallmentTable(),
      status: 'approved',
      loanDate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    const existingLoans = JSON.parse(localStorage.getItem('pinjaman') || '[]');
    existingLoans.push(loanData);
    localStorage.setItem('pinjaman', JSON.stringify(existingLoans));

    // Update user's loan balance
    updateUser({
      loanBalance: (user?.loanBalance || 0) + loanAmount
    });

    // Create tagihan (bill) record
    const billData = {
      id: `bill-${Date.now()}`,
      userId: user?.id,
      loanId: loanData.id,
      userName: user?.fullName,
      totalAmount: totalLoan,
      monthlyInstallment,
      remainingInstallments: 6,
      nextDueDate: generateInstallmentTable()[0].dueDate,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    const existingBills = JSON.parse(localStorage.getItem('tagihan') || '[]');
    existingBills.push(billData);
    localStorage.setItem('tagihan', JSON.stringify(existingBills));

    setIsProcessing(false);
    setIsApproved(true);
    
    setTimeout(() => {
      setShowInvoice(false);
      setIsApproved(false);
      navigate('/');
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
            <h1 className="text-xl font-bold">Ajukan Pinjaman</h1>
            <p className="text-white/80 text-sm">Tentukan nominal pinjaman Anda</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Loan Limit Info */}
        <Card className="mb-6 border-l-4 border-l-smartpay-gold">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Limit Pinjaman Anda</p>
                <p className="text-2xl font-bold text-smartpay-navy">{formatCurrency(user?.loanLimit || 0)}</p>
              </div>
              <Calculator className="h-8 w-8 text-smartpay-gold" />
            </div>
          </CardContent>
        </Card>

        {/* Loan Amount Input */}
        <Card>
          <CardHeader>
            <CardTitle className="text-smartpay-navy flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Formulir Pinjaman
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Jumlah Pinjaman
              </label>
              <Input
                type="number"
                min="5000000"
                max={user?.loanLimit || 0}
                step="100000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="h-12 text-lg font-semibold"
                placeholder="Minimum Rp 5,000,000"
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum: Rp 5,000,000 | Maximum: {formatCurrency(user?.loanLimit || 0)}
              </p>
            </div>

            {/* Loan Preview */}
            <div className="bg-blue-50 rounded-xl p-4">
              <h3 className="font-semibold text-smartpay-navy mb-3">Rincian Pinjaman</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Jumlah Pinjaman:</span>
                  <span className="font-semibold">{formatCurrency(loanAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bunga (0.3%):</span>
                  <span className="font-semibold">{formatCurrency(interestAmount)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-semibold">Total Pinjaman:</span>
                  <span className="font-bold text-smartpay-navy">{formatCurrency(totalLoan)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Angsuran per Bulan:</span>
                  <span className="font-semibold text-smartpay-gold">{formatCurrency(monthlyInstallment)}</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleSubmitLoan}
              className="w-full h-12 smartpay-gradient text-white font-semibold text-lg"
            >
              AJUKAN PINJAMAN
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Invoice Modal */}
      <Dialog open={showInvoice} onOpenChange={setShowInvoice}>
        <DialogContent className="max-w-sm mx-4 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-center text-smartpay-navy">
              {isApproved ? "Pinjaman Disetujui!" : isProcessing ? "Memproses..." : "Invoice Pinjaman"}
            </DialogTitle>
          </DialogHeader>
          
          {isProcessing ? (
            <div className="py-8 text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-smartpay-navy" />
              <p className="text-lg font-semibold text-smartpay-navy mb-2">
                Mohon tunggu, pengajuan sedang diproses...
              </p>
              <div className="loading-bar rounded-full mt-4"></div>
            </div>
          ) : isApproved ? (
            <div className="py-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <p className="text-lg font-semibold text-green-600 mb-2">
                Selamat!
              </p>
              <p className="text-sm text-gray-600">
                Pinjaman atas nama <strong>{user?.fullName}</strong> sebesar{' '}
                <strong>{formatCurrency(loanAmount)}</strong> telah disetujui.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Jumlah Pinjaman:</span>
                  <span className="font-semibold">{formatCurrency(loanAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Bunga:</span>
                  <span className="font-semibold">0.3%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Pinjaman:</span>
                  <span className="font-semibold">{formatCurrency(totalLoan)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Tanggal Pinjaman:</span>
                  <span className="font-semibold">{loanDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Angsuran per Bulan:</span>
                  <span className="font-semibold text-smartpay-gold">{formatCurrency(monthlyInstallment)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Nama Peminjam:</span>
                  <span className="font-semibold">{user?.fullName}</span>
                </div>
              </div>

              {/* Installment Table */}
              <div>
                <h4 className="font-semibold text-sm mb-2">Rincian Angsuran:</h4>
                <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
                  {generateInstallmentTable().map((installment) => (
                    <div key={installment.month} className="flex justify-between text-xs py-1">
                      <span>Bulan {installment.month} ({installment.dueDate})</span>
                      <span>{formatCurrency(installment.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleAgreement}
                className="w-full smartpay-gradient text-white font-semibold"
              >
                SAYA SETUJU
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoanApplication;
