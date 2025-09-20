import React from 'react';
import { Header } from '../Layout/Header';
import { Card } from '../Common/Card';
import { AlertTriangle } from 'lucide-react';
import { getPatientAllergies } from '../../data/patientData';
import { useAuth } from '../../context/AuthContext';

export const PatientAllergies: React.FC = () => {
  const { user } = useAuth();
  const allergies = getPatientAllergies(user?.id || 'P-1001');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'bg-red-50';
      case 'Medium':
        return 'bg-yellow-50';
      case 'Low':
        return 'bg-green-50';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header title="Allergies & Reactions" showBackButton />
      
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle size={20} className="text-black" />
            <h2 className="text-lg font-medium text-black">Known Allergies</h2>
          </div>
          
          <div className="space-y-4">
            {allergies.map((allergy, index) => (
              <div key={index} className={`p-4 ${getSeverityColor(allergy.severity)}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={16} className="text-black" />
                    <h3 className="font-medium text-black">{allergy.name}</h3>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-black text-white">
                    {allergy.severity} Risk
                  </span>
                </div>
                <p className="text-sm text-gray-600">{allergy.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gray-50">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={16} className="text-black" />
              <h3 className="font-medium text-black">Important Notice</h3>
            </div>
            <p className="text-sm text-gray-600">
              Please inform all healthcare providers about these allergies before any treatment or medication is administered.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};