
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { User, Mail, Lock, CreditCard, Building, ArrowLeft, Upload, Camera, FileText } from 'lucide-react';

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

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    ktpNumber: '',
    accountNumber: '',
    bankName: '',
    accountHolderName: ''
  });

  const [files, setFiles] = useState({
    ktpFile: null as File | null,
    kkFile: null as File | null,
    selfieFile: null as File | null
  });

  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFiles(prev => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName || !formData.email || !formData.password || 
        !formData.ktpNumber || !formData.accountNumber || !formData.bankName || 
        !formData.accountHolderName) {
      toast({
        title: "Error",
        description: "Harap isi semua field yang diperlukan",
        variant: "destructive",
      });
      return;
    }

    if (!files.ktpFile || !files.kkFile || !files.selfieFile) {
      toast({
        title: "Error",
        description: "Harap upload semua dokumen yang diperlukan (KTP, Kartu Keluarga, dan Foto Selfie)",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Password dan konfirmasi password tidak sama",
        variant: "destructive",
      });
      return;
    }

    if (formData.ktpNumber.length !== 16) {
      toast({
        title: "Error",
        description: "Nomor KTP harus 16 digit",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        ktpNumber: formData.ktpNumber,
        accountNumber: formData.accountNumber,
        bankName: formData.bankName,
        accountHolderName: formData.accountHolderName
      });
      
      if (success) {
        toast({
          title: "Registrasi Berhasil!",
          description: "Akun Anda telah dibuat dan mendapat limit pinjaman Rp 7,000,000",
        });
        navigate('/');
      } else {
        toast({
          title: "Registrasi Gagal",
          description: "Email sudah terdaftar atau terjadi kesalahan",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat registrasi",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen smartpay-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="flex items-center text-white mb-6">
          <Link to="/login" className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Daftar Akun Baru</h1>
            <p className="text-white/80">Bergabung dengan SmartPAY sekarang</p>
          </div>
        </div>

        {/* Register Form */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-gray-800">Informasi Pribadi</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Personal Info */}
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Nama Lengkap"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="pl-10 h-12 bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-800 placeholder:text-gray-500"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-10 h-12 bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-800 placeholder:text-gray-500"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="pl-10 h-12 bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-800 placeholder:text-gray-500"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Konfirmasi Password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="pl-10 h-12 bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-800 placeholder:text-gray-500"
                />
              </div>

              <div className="relative">
                <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Nomor KTP (16 digit)"
                  value={formData.ktpNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
                    handleInputChange('ktpNumber', value);
                  }}
                  className="pl-10 h-12 bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-800 placeholder:text-gray-500"
                />
              </div>

              {/* Document Upload Section */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Upload Dokumen</h3>
                
                {/* KTP Upload */}
                <div className="mb-3">
                  <Label className="text-sm text-gray-700 mb-2 block">Foto KTP</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange('ktpFile', e.target.files?.[0] || null)}
                      className="pl-10 h-12 bg-white border-2 border-gray-200 focus:border-blue-500 text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  {files.ktpFile && (
                    <p className="text-xs text-green-600 mt-1">✓ {files.ktpFile.name}</p>
                  )}
                </div>

                {/* Kartu Keluarga Upload */}
                <div className="mb-3">
                  <Label className="text-sm text-gray-700 mb-2 block">Foto Kartu Keluarga</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange('kkFile', e.target.files?.[0] || null)}
                      className="pl-10 h-12 bg-white border-2 border-gray-200 focus:border-blue-500 text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  {files.kkFile && (
                    <p className="text-xs text-green-600 mt-1">✓ {files.kkFile.name}</p>
                  )}
                </div>

                {/* Selfie Upload */}
                <div className="mb-4">
                  <Label className="text-sm text-gray-700 mb-2 block">Foto Selfie</Label>
                  <div className="relative">
                    <Camera className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange('selfieFile', e.target.files?.[0] || null)}
                      className="pl-10 h-12 bg-white border-2 border-gray-200 focus:border-blue-500 text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  {files.selfieFile && (
                    <p className="text-xs text-green-600 mt-1">✓ {files.selfieFile.name}</p>
                  )}
                </div>
              </div>

              {/* Banking Info */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Informasi Rekening</h3>
                
                <Select onValueChange={(value) => handleInputChange('bankName', value)}>
                  <SelectTrigger className="h-12 bg-white border-2 border-gray-200 focus:border-blue-500 text-gray-800">
                    <Building className="h-4 w-4 text-gray-400 mr-2" />
                    <SelectValue placeholder="Pilih Bank" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {indonesianBanks.map((bank) => (
                      <SelectItem key={bank} value={bank}>
                        {bank}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  type="text"
                  placeholder="Nomor Rekening"
                  value={formData.accountNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    handleInputChange('accountNumber', value);
                  }}
                  className="h-12 bg-white border-2 border-gray-200 focus:border-blue-500 text-gray-800 placeholder:text-gray-500 mt-3"
                />

                <Input
                  type="text"
                  placeholder="Nama Pemilik Rekening"
                  value={formData.accountHolderName}
                  onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                  className="h-12 bg-white border-2 border-gray-200 focus:border-blue-500 text-gray-800 placeholder:text-gray-500 mt-3"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 smartpay-gradient text-white font-semibold text-lg rounded-lg hover:opacity-90 transition-opacity mt-6 shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? "Mendaftarkan..." : "DAFTAR SEKARANG"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Sudah punya akun?{' '}
                <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                  Masuk di sini
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
