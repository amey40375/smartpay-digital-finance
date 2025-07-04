
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Users, Shield, ShieldOff, Eye, User } from 'lucide-react';

const AdminCustomers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState(() => {
    return JSON.parse(localStorage.getItem('users') || '[]')
      .filter((u: any) => u.role === 'customer');
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleBlockUnblock = (userId: string, currentBlockStatus: boolean) => {
    const updatedCustomers = customers.map((customer: any) => 
      customer.id === userId 
        ? { ...customer, isBlocked: !currentBlockStatus }
        : customer
    );
    
    setCustomers(updatedCustomers);
    
    // Update in localStorage
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedAllUsers = allUsers.map((user: any) => 
      user.id === userId 
        ? { ...user, isBlocked: !currentBlockStatus }
        : user
    );
    localStorage.setItem('users', JSON.stringify(updatedAllUsers));
    
    toast({
      title: "Berhasil",
      description: `Customer ${!currentBlockStatus ? 'diblokir' : 'dibuka blokir'}`,
    });
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
            <h1 className="text-xl font-bold">Daftar Nasabah</h1>
            <p className="text-white/80 text-sm">
              Kelola data dan status nasabah ({customers.length} nasabah)
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {customers.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Belum Ada Nasabah</h3>
              <p className="text-gray-500">
                Belum ada nasabah yang terdaftar di sistem
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {customers.map((customer: any) => (
              <Card key={customer.id} className={`${customer.isBlocked ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center text-lg">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                        customer.isBlocked ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        <User className={`h-5 w-5 ${customer.isBlocked ? 'text-red-600' : 'text-blue-600'}`} />
                      </div>
                      <div>
                        <p className={`font-bold ${customer.isBlocked ? 'text-red-700' : 'text-gray-800'}`}>
                          {customer.fullName}
                        </p>
                        <p className="text-sm text-gray-600 font-normal">
                          {customer.email}
                        </p>
                      </div>
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        customer.isBlocked 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {customer.isBlocked ? 'DIBLOKIR' : 'AKTIF'}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-600">Saldo Pinjaman</p>
                      <p className="text-sm font-semibold text-blue-600">
                        {formatCurrency(customer.loanBalance)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Saldo Tabungan</p>
                      <p className="text-sm font-semibold text-green-600">
                        {formatCurrency(customer.savingsBalance)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Limit Pinjaman</p>
                      <p className="text-sm font-semibold text-smartpay-gold">
                        {formatCurrency(customer.loanLimit)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Bergabung</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {new Date(customer.createdAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="grid grid-cols-1 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">KTP:</span>
                        <span className="font-medium">{customer.ktpNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bank:</span>
                        <span className="font-medium">{customer.bankName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">No. Rekening:</span>
                        <span className="font-medium">{customer.accountNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nama Rekening:</span>
                        <span className="font-medium">{customer.accountHolderName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleBlockUnblock(customer.id, customer.isBlocked)}
                      variant={customer.isBlocked ? "default" : "destructive"}
                      size="sm"
                      className="flex-1"
                    >
                      {customer.isBlocked ? (
                        <>
                          <Shield className="h-4 w-4 mr-1" />
                          Buka Blokir
                        </>
                      ) : (
                        <>
                          <ShieldOff className="h-4 w-4 mr-1" />
                          Blokir
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCustomers;
