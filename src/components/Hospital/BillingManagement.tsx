import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Layout/Header';
import { Card } from '../Common/Card';
import { Button } from '../Common/Button';
import { CreditCard, Search, Filter, Download, Send, Plus, Eye } from 'lucide-react';

interface Invoice {
  id: string;
  patientName: string;
  patientId: string;
  amount: number;
  status: 'Paid' | 'Unpaid' | 'Partial' | 'Overdue';
  dueDate: string;
  createdDate: string;
  paymentMethod?: string;
  items: Array<{
    description: string;
    amount: number;
  }>;
}

export const BillingManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDateRange, setFilterDateRange] = useState('');

  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 'INV-3001',
      patientName: 'Ravi Kumar',
      patientId: 'P-1001',
      amount: 1200,
      status: 'Unpaid',
      dueDate: '2025-01-25',
      createdDate: '2025-01-15',
      items: [
        { description: 'Consultation - Dermatology', amount: 500 },
        { description: 'CBC Test', amount: 400 },
        { description: 'Medicine Dispense', amount: 300 }
      ]
    },
    {
      id: 'INV-3002',
      patientName: 'Meena R.',
      patientId: 'P-1002',
      amount: 850,
      status: 'Paid',
      dueDate: '2025-01-20',
      createdDate: '2025-01-10',
      paymentMethod: 'Card',
      items: [
        { description: 'Consultation - Neurology', amount: 600 },
        { description: 'MRI Scan', amount: 250 }
      ]
    },
    {
      id: 'INV-3003',
      patientName: 'Arjun P.',
      patientId: 'P-1003',
      amount: 2500,
      status: 'Partial',
      dueDate: '2025-01-30',
      createdDate: '2025-01-18',
      paymentMethod: 'UPI',
      items: [
        { description: 'Surgery - Minor', amount: 2000 },
        { description: 'Post-op care', amount: 500 }
      ]
    },
    {
      id: 'INV-3004',
      patientName: 'Priya S.',
      patientId: 'P-1004',
      amount: 450,
      status: 'Overdue',
      dueDate: '2025-01-10',
      createdDate: '2025-01-05',
      items: [
        { description: 'Emergency consultation', amount: 450 }
      ]
    }
  ]);

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = !searchTerm || 
      invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filterStatus || invoice.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (invoiceId: string, newStatus: string) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === invoiceId 
        ? { ...inv, status: newStatus as Invoice['status'] }
        : inv
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Unpaid': return 'bg-yellow-100 text-yellow-800';
      case 'Partial': return 'bg-blue-100 text-blue-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const statuses = ['Paid', 'Unpaid', 'Partial', 'Overdue'];
  const totalRevenue = invoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = invoices.filter(inv => inv.status !== 'Paid').reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="min-h-screen bg-white">
      <Header title="Billing Management" showBackButton />
      
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <CreditCard size={24} className="text-black" />
            <h2 className="text-xl font-semibold text-black">Billing & Payments</h2>
          </div>
          <div className="flex gap-3">
            <Button>
              <Plus size={16} className="mr-2" />
              Create Invoice
            </Button>
            <Button variant="outline" onClick={() => navigate('/hospital/billing/view-all')}>
              <Eye size={16} className="mr-2" />
              View All
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="text-center" padding="sm">
            <h3 className="text-2xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</h3>
            <p className="text-gray-600">Total Revenue</p>
          </Card>
          <Card className="text-center" padding="sm">
            <h3 className="text-2xl font-bold text-yellow-600">₹{pendingAmount.toLocaleString()}</h3>
            <p className="text-gray-600">Pending Amount</p>
          </Card>
          <Card className="text-center" padding="sm">
            <h3 className="text-2xl font-bold text-blue-600">{invoices.length}</h3>
            <p className="text-gray-600">Total Invoices</p>
          </Card>
          <Card className="text-center" padding="sm">
            <h3 className="text-2xl font-bold text-red-600">
              {invoices.filter(inv => inv.status === 'Overdue').length}
            </h3>
            <p className="text-gray-600">Overdue</p>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search invoices..."
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
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <select
              value={filterDateRange}
              onChange={(e) => setFilterDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>

            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setFilterStatus('');
              setFilterDateRange('');
            }}>
              Clear Filters
            </Button>
          </div>
        </Card>

        {/* Invoices Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Invoice ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Patient</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Due Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Payment Method</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{invoice.id}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{invoice.patientName}</p>
                        <p className="text-sm text-gray-600">{invoice.patientId}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">₹{invoice.amount.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <select
                        value={invoice.status}
                        onChange={(e) => handleStatusChange(invoice.id, e.target.value)}
                        className={`px-2 py-1 text-xs rounded-full border-0 ${getStatusColor(invoice.status)}`}
                      >
                        {statuses.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{invoice.dueDate}</td>
                    <td className="py-3 px-4 text-gray-700">{invoice.paymentMethod || '-'}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate(`/billing/invoice/${invoice.id}`)}
                        >
                          <Eye size={14} className="mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download size={14} className="mr-1" />
                          PDF
                        </Button>
                        <Button size="sm" variant="outline">
                          <Send size={14} className="mr-1" />
                          Send
                        </Button>
                      </div>
                    </td>
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