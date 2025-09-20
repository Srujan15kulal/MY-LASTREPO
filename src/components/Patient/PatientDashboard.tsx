import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Layout/Header';
import { Card } from '../Common/Card';
import { Button } from '../Common/Button';
import { User, Calendar, FileText, CreditCard, TestTube, Pill, AlertTriangle } from 'lucide-react';
import { mockPatients, mockDoctors } from '../../data/mockData';

export const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const patient = mockPatients[0]; // Current patient
  const assignedDoctor = mockDoctors[0]; // Assigned doctor

  return (
    <div className="min-h-screen bg-white">
      <Header title="Patient Dashboard" />
      
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Profile */}
          <Card>
            <div className="flex items-center gap-2 mb-4"> 
              <User size={20} className="text-black" />
              <h3 className="font-semibold text-black">Profile</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-black">Name</label>
                <p className="text-black">{patient.name}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Age</label>
                <p className="text-gray-900">{patient.age} years</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Gender</label>
                <p className="text-gray-900">{patient.gender}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Phone</label>
                <p className="text-gray-900">{patient.phone_number}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Aadhar</label>
                <p className="text-gray-900">{patient.aadhar_number}</p>
              </div>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => navigate('/patient/profile')}>
                Edit Profile
              </Button>
            </div>
          </Card>

          {/* Assigned Doctor */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <User size={20} className="text-blue-600" />
              <h3 className="font-semibold text-gray-900">Assigned Doctor</h3>
            </div>
            <div className="text-center">
              <img
                src={assignedDoctor.photo_url}
                alt={assignedDoctor.name}
                className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
              />
              <h4 className="font-medium text-gray-900">{assignedDoctor.name}</h4>
              <p className="text-sm text-blue-600">{assignedDoctor.department}</p>
              <p className="text-sm text-gray-600">{assignedDoctor.contact_number}</p>
            </div>
          </Card>

          {/* Medical History Summary */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <FileText size={20} className="text-gray-700" />
              <h3 className="font-semibold text-gray-900">Medical History</h3>
            </div>
            <p className="text-sm text-gray-700">No major surgeries. Chronic: hypertension.</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => navigate('/patient/history')}>
              View Full History
            </Button>
          </Card>
        </div>

        {/* Appointments */}
        <Card className="mt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
            </div>
            <Button variant="outline" size="sm">Schedule New</Button>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-green-900">September 18, 2025 - 09:00 AM</h4>
                <p className="text-green-700">Dr. Anita Sharma - Dermatology</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                Confirmed
              </span>
            </div>
          </div>
        </Card>

        {/* Test Reports & Prescriptions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <TestTube size={20} className="text-gray-700" />
                <h3 className="font-semibold text-gray-900">Test Reports</h3>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/patient/reports')}>View All</Button>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">CBC Test</h4>
                  <p className="text-sm text-gray-600">September 1, 2025</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => navigate('/patient/reports')}>View</Button>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Pill size={20} className="text-gray-700" />
                <h3 className="font-semibold text-gray-900">Recent Prescriptions</h3>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/patient/history')}>View All</Button>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium">RX-2001</h4>
                <p className="text-sm text-gray-600">September 10, 2025</p>
                <p className="text-sm text-gray-700 mt-1">Paracetamol 500mg - 1 tab 8hr</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Allergies Section */}
        <Card className="mt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <AlertTriangle size={20} className="text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Allergies & Reactions</h3>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/patient/allergies')}>View All</Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-red-50 text-red-800 text-sm rounded-full border border-red-200">
              Penicillin
            </span>
            <span className="px-3 py-1 bg-red-50 text-red-800 text-sm rounded-full border border-red-200">
              Peanuts
            </span>
            <span className="px-3 py-1 bg-yellow-50 text-yellow-800 text-sm rounded-full border border-yellow-200">
              Pollen
            </span>
          </div>
        </Card>

        {/* Billing Summary */}
        <Card className="mt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <CreditCard size={20} className="text-gray-700" />
              <h3 className="text-lg font-semibold text-gray-900">Billing Summary</h3>
            </div>
            <Button variant="outline" size="sm">View All Bills</Button>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-yellow-900">Invoice INV-3001</h4>
                <p className="text-yellow-700">Due: September 25, 2025</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-yellow-900">₹1,200</p>
                <Button size="sm">Pay Now</Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};