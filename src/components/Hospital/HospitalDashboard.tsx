import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Layout/Header';
import { Card } from '../Common/Card';
import { Button } from '../Common/Button';
import { Users, UserPlus, Calendar, CreditCard, Building } from 'lucide-react';

export const HospitalDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Header title="Hospital Dashboard" />
      
      <div className="max-w-6xl mx-auto p-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="text-center">
            <UserPlus size={32} className="text-black mx-auto mb-3" />
            <h3 className="font-semibold text-black mb-2">Patient Registration</h3>
            <p className="text-sm text-gray-600 mb-4">Register new patient and assign doctor</p>
            <Button fullWidth onClick={() => navigate('/registration')}>
              Register Patient
            </Button>
          </Card>

          <Card className="text-center">
            <Users size={32} className="text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Manage Staff</h3>
            <p className="text-sm text-gray-600 mb-4">Doctors, Pharmacists, Lab Techs</p>
            <Button fullWidth variant="outline" onClick={() => navigate('/hospital/staff-management')}>
              Manage Staff
            </Button>
          </Card>

          <Card className="text-center">
            <Calendar size={32} className="text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Appointments</h3>
            <p className="text-sm text-gray-600 mb-4">Schedule by department</p>
            <Button fullWidth variant="outline" onClick={() => navigate('/hospital/appointments')}>
              View Schedules
            </Button>
          </Card>

          <Card className="text-center">
            <CreditCard size={32} className="text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Billing Management</h3>
            <p className="text-sm text-gray-600 mb-4">Invoices and payments</p>
            <Button fullWidth variant="outline" onClick={() => navigate('/hospital/billing')}>
              View Billing
            </Button>
          </Card>
        </div>

        {/* Patient Registrations & Department Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <UserPlus size={20} className="text-blue-600" />
              <h3 className="font-semibold text-gray-900">All Patient Registrations</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Ravi Kumar</h4>
                  <p className="text-sm text-gray-600">P-1001 • Registered at 08:45</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  Active
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Meena R.</h4>
                  <p className="text-sm text-gray-600">P-1002 • Registered at 09:15</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  Active
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Arjun P.</h4>
                  <p className="text-sm text-gray-600">P-1003 • Registered at 10:30</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  Active
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={20} className="text-blue-600" />
              <h3 className="font-semibold text-gray-900">Appointment Schedules by Department</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Dermatology</span>
                <span className="font-medium">12 appointments</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Neurology</span>
                <span className="font-medium">6 appointments</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Cardiology</span>
                <span className="font-medium">8 appointments</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">General Physician</span>
                <span className="font-medium">15 appointments</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Staff Management */}
        <Card className="mt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Building size={20} className="text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Staff Management</h3>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => navigate('/hospital/add-doctor')}>Add Doctor</Button>
              <Button size="sm" variant="outline" onClick={() => navigate('/hospital/add-staff')}>Add Staff</Button>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users size={20} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">Dr. Anita Sharma</h4>
                  <p className="text-sm text-gray-600">Doctor - Dermatology</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                Active
              </span>
            </div>
            
            <div className="flex justify-between items-center p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users size={20} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">Reception Staff</h4>
                  <p className="text-sm text-gray-600">Hospital Staff - Reception</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                Active
              </span>
            </div>
          </div>
        </Card>

        {/* Billing Overview */}
        <Card className="mt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <CreditCard size={20} className="text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Billing & Payments</h3>
            </div>
            <Button size="sm" variant="outline">View All</Button>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">INV-3001 - Ravi Kumar</h4>
                <p className="text-sm text-gray-600">Due: September 25, 2025</p>
              </div>
              <div className="text-right">
                <p className="font-medium">₹1,200</p>
                <span className="text-sm px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                  Unpaid
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};