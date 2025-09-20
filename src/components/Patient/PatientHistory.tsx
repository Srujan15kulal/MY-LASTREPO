import React from 'react';
import { Header } from '../Layout/Header';
import { Card } from '../Common/Card';
import { Pill, Calendar, User } from 'lucide-react';
import { getPatientHistory } from '../../data/patientData';
import { useAuth } from '../../context/AuthContext';

export const PatientHistory: React.FC = () => {
  const { user } = useAuth();
  const history = getPatientHistory(user?.id || 'P-1001');

  return (
    <div className="min-h-screen bg-white">
      <Header title="Prescription History" showBackButton />
      
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <Pill size={20} className="text-black" />
            <h2 className="text-lg font-medium text-black">Medical History & Prescriptions</h2>
          </div>
          
          <div className="mb-6 p-4 bg-gray-50">
            <h3 className="font-medium text-gray-900 mb-2">Medical History</h3>
            <p className="text-gray-700">{history.medicalHistory}</p>
          </div>
          
          <div className="space-y-3">
            {history.prescriptions.map((prescription, index) => (
              <div key={index} className="p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Pill size={16} className="text-black" />
                      <h3 className="font-medium text-black">{prescription.medicine}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Quantity: {prescription.quantity}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        <span>Prescribed by {prescription.prescribedBy}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{prescription.dateTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};