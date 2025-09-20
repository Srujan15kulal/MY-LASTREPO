import React from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../Layout/Header';
import { Card } from '../Common/Card';
import { Button } from '../Common/Button';
import { CreditCard, Download, Send } from 'lucide-react';
import { mockInvoices } from '../../data/mockData';

export const BillingPage: React.FC = () => {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const invoice = mockInvoices.find(inv => inv.invoice_id === invoiceId) || mockInvoices[0];

  const paymentMethods = ['Cash', 'Card', 'UPI', 'Insurance'];

  return (
    <div className="min-h-screen bg-white">
      <Header title={`Invoice ${invoice.invoice_id}`} showBackButton />
      
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <div className="mb-6 pb-6 border-b">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-black">Invoice {invoice.invoice_id}</h2>
                <p className="text-gray-600">Patient: {invoice.patient_name}</p>
                <p className="text-sm text-gray-500">Due Date: {invoice.due_date}</p>
              </div>
              <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
                invoice.payment_status === 'Paid' 
                  ? 'bg-green-100 text-green-800'
                  : invoice.payment_status === 'Partial'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {invoice.payment_status}
              </span>
            </div>
          </div>

          {/* Create Invoices */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Invoice Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium text-gray-700">Description</th>
                    <th className="text-right py-2 font-medium text-gray-700">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 text-gray-900">{item.description}</td>
                      <td className="py-3 text-right font-medium">₹{item.amount}</td>
                    </tr>
                  ))}
                  <tr className="border-b-2 border-gray-300">
                    <td className="py-3 font-semibold text-gray-900">Total Amount</td>
                    <td className="py-3 text-right font-bold text-lg">₹{invoice.total_amount}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* View Payment Status */}
          {invoice.payment_status !== 'Paid' && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Payment Status & Methods</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {paymentMethods.map((method) => (
                  <Button key={method} variant="outline" className="justify-center">
                    <CreditCard size={16} className="mr-2" />
                    {method}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t">
            {invoice.payment_status !== 'Paid' && (
              <Button className="flex-1">
                <CreditCard size={16} className="mr-2" />
                Mark as Paid
              </Button>
            )}
            <Button variant="outline" className="flex-1">
              <Download size={16} className="mr-2" />
              Download PDF
            </Button>
            <Button variant="outline" className="flex-1">
              <Send size={16} className="mr-2" />
              Send Receipt
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};