import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Layout/Header';
import { Card } from '../Common/Card';
import { Button } from '../Common/Button';
import { CreditCard, Search, Download, Send, Eye, Calendar, TrendingUp, TrendingDown } from 'lucide-react';

interface PaymentRecord {
  id: string;
  invoiceId: string;
  patientName: string;
  patientId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  status: 'Completed' | 'Failed' | 'Pending' | 'Refunded';
  transactionId?: string;
}

export const ViewAllBilling: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('invoices');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [dateRange, setDateRange] = useState('month');

  const [paymentRecords] = useState<PaymentRecord[]>([
    {
      id: 'PAY-001',
      invoiceId: 'INV-3002',
      patientName: 'Meena R.',
      patientId: 'P-1002',
      amount: 850,
      paymentDate: '2025-01-15',
      paymentMethod: 'Credit Card',
      status: 'Completed',
      transactionId: 'TXN123456789'
    },
    {
      id: 'PAY-002',
      invoiceId: 'INV-3003',
      patientName: 'Arjun P.',
      patientId: 'P-1003',
      amount: 1250,
      paymentDate: '2025-01-18',
      paymentMethod: 'UPI',
      status: 'Completed',
      transactionId: 'UPI987654321'
    },
    {
      id: 'PAY-003',
      invoiceId: 'INV-3005',
      patientName: 'Sunita K.',
      patientId: 'P-1005',
      amount: 300,
      paymentDate: '2025-01-19',
      paymentMethod: 'Cash',
      status: 'Completed'
    },
    {
      id: 'PAY-004',
      invoiceId: 'INV-3006',
      patientName: 'Raj M.',
      patientId: 'P-1006',
      amount: 750,
      paymentDate: '2025-01-20',
      paymentMethod: 'Net Banking',
      status: 'Failed'
    }
  ]);

  const invoices = [
    {
      id: 'INV-3001',
      patientName: 'Ravi Kumar',
      patientId: 'P-1001',
      amount: 1200,
      status: 'Unpaid',
      dueDate: '2025-01-25',
      createdDate: '2025-01-15'
    },
    {
      id: 'INV-3002',
      patientName: 'Meena R.',
      patientId: 'P-1002',
      amount: 850,
      status: 'Paid',
      dueDate: '2025-01-20',
      createdDate: '2025-01-10'
    },
    {
      id: 'INV-3003',
      patientName: 'Arjun P.',
      patientId: 'P-1003',
      amount: 2500,
      status: 'Partial',
      dueDate: '2025-01-30',
      createdDate: '2025-01-18'
    },
    {
      id: 'INV-3004',
      patientName: 'Priya S.',
      patientId: 'P-1004',
      amount: 450,
      status: 'Overdue',
      dueDate: '2025-01-10',
      createdDate: '2025-01-05'
    },
    {
      id: 'INV-3005',
      patientName: 'Sunita K.',
      patientId: 'P-1005',
      amount: 300,
      status: 'Paid',
      dueDate: '2025-01-19',
      createdDate: '2025-01-12'
    }
  ];

  const filteredData = activeTab === 'invoices' 
    ? invoices.filter(item => 
        (!searchTerm || item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
         item.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!filterStatus || item.status === filterStatus)
      )
    : paymentRecords.filter(item => 
        (!searchTerm || item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
         item.invoiceId.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!filterStatus || item.status === filterStatus)
      );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Unpaid':
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Partial': return 'bg-blue-100 text-blue-800';
      case 'Overdue':
      case 'Failed': return 'bg-red-100 text-red-800';
      case 'Refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalRevenue = paymentRecords.filter(p => p.status === 'Completed').reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = invoices.filter(inv => inv.status !== 'Paid').reduce((sum, inv) => sum + inv.amount, 0);
  const monthlyGrowth = 12.5; // Mock data

  return (
    <div className="min-h-screen bg-white">
      <Header title="All Billing Records" showBackButton />
      
      <div className="max-w-6xl mx-auto p-6">
        {/* Summary Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="text-center" padding="sm">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp size={20} className="text-green-600" />
              <h3 className="text-2xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</h3>
            </div>
            <p className="text-gray-600">Total Revenue</p>
            <p className="text-xs text-green-600 mt-1">+{monthlyGrowth}% this month</p>
          </Card>
          
          <Card className="text-center" padding="sm">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingDown size={20} className="text-yellow-600" />
              <h3 className="text-2xl font-bold text-yellow-600">₹{pendingAmount.toLocaleString()}</h3>
            </div>
            <p className="text-gray-600">Pending Amount</p>
            <p className="text-xs text-yellow-600 mt-1">{invoices.filter(i => i.status !== 'Paid').length} invoices</p>
          </Card>
          
          <Card className="text-center" padding="sm">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar size={20} className="text-blue-600" />
              <h3 className="text-2xl font-bold text-blue-600">{paymentRecords.length}</h3>
            </div>
            <p className="text-gray-600">Total Transactions</p>
            <p className="text-xs text-blue-600 mt-1">This month</p>
          </Card>
          
          <Card className="text-center" padding="sm">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CreditCard size={20} className="text-purple-600" />
              <h3 className="text-2xl font-bold text-purple-600">
                {((paymentRecords.filter(p => p.status === 'Completed').length / paymentRecords.length) * 100).toFixed(1)}%
              </h3>
            </div>
            <p className="text-gray-600">Success Rate</p>
            <p className="text-xs text-purple-600 mt-1">Payment success</p>
          </Card>
        </div>

        {/* Tabs */}
        <Card className="mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('invoices')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'invoices'
                  ? 'border-b-2 border-black text-black'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              All Invoices ({invoices.length})
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'payments'
                  ? 'border-b-2 border-black text-black'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Payment History ({paymentRecords.length})
            </button>
          </div>
        </Card>

        {/* Filters */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="">All Status</option>
              {activeTab === 'invoices' ? (
                <>
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                  <option value="Partial">Partial</option>
                  <option value="Overdue">Overdue</option>
                </>
              ) : (
                <>
                  <option value="Completed">Completed</option>
                  <option value="Failed">Failed</option>
                  <option value="Pending">Pending</option>
                  <option value="Refunded">Refunded</option>
                </>
              )}
            </select>

            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                setFilterStatus('');
              }}>
                Clear
              </Button>
              <Button variant="outline">
                <Download size={16} className="mr-2" />
                Export
              </Button>
            </div>
          </div>
        </Card>

        {/* Data Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  {activeTab === 'invoices' ? (
                    <>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Invoice ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Patient</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Due Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Created</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                    </>
                  ) : (
                    <>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Payment ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Invoice</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Patient</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Method</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item: any) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    {activeTab === 'invoices' ? (
                      <>
                        <td className="py-3 px-4 font-medium text-gray-900">{item.id}</td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{item.patientName}</p>
                            <p className="text-sm text-gray-600">{item.patientId}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-900">₹{item.amount.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-700">{item.dueDate}</td>
                        <td className="py-3 px-4 text-gray-700">{item.createdDate}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => navigate(`/billing/invoice/${item.id}`)}
                            >
                              <Eye size={14} />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Send size={14} />
                            </Button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 px-4 font-medium text-gray-900">{item.id}</td>
                        <td className="py-3 px-4 text-gray-700">{item.invoiceId}</td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{item.patientName}</p>
                            <p className="text-sm text-gray-600">{item.patientId}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-900">₹{item.amount.toLocaleString()}</td>
                        <td className="py-3 px-4 text-gray-700">{item.paymentMethod}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-700">{item.paymentDate}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye size={14} />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download size={14} />
                            </Button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};