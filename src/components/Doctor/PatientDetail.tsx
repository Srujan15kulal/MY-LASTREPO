import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../Layout/Header';
import { Card } from '../Common/Card';
import { Button } from '../Common/Button';
import { User, FileText, TestTube, Activity, AlertCircle, Stethoscope } from 'lucide-react';
import { mockPatients } from '../../data/mockData';

export const PatientDetail: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const [showActionModal, setShowActionModal] = useState<string | null>(null);

  const patient = mockPatients.find(p => p.patient_id === patientId) || mockPatients[0];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'history', label: 'History', icon: FileText },
    { id: 'reports', label: 'Reports', icon: Activity },
    { id: 'allergies', label: 'Allergies', icon: AlertCircle }
  ];

  const actions = [
    { id: 'blood_test', label: 'Request Blood Test', options: ['CBC', 'Blood Sugar', 'Lipid Profile', 'Liver Function'] },
    { id: 'radiology', label: 'Request Radiology', options: ['X-Ray', 'Ultrasound', 'CT Scan', 'MRI'] },
    { id: 'physiotherapy', label: 'Request Physiotherapy' },
    { id: 'psychiatry', label: 'Request Psychiatry' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Patient Name</label>
                <p className="text-gray-900">{patient.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Patient ID</label>
                <p className="text-gray-900">{patient.patient_id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Age</label>
                <p className="text-gray-900">{patient.age} years</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Gender</label>
                <p className="text-gray-900">{patient.gender}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Phone</label>
                <p className="text-gray-900">{patient.phone_number}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Aadhar</label>
                <p className="text-gray-900">{patient.aadhar_number}</p>
              </div>
            </div>
          </div>
        );
      case 'history':
        return (
          <div>
            <p className="text-gray-700">Past conditions: hypertension (2019). No surgeries. Family history: diabetes.</p>
          </div>
        );
      case 'reports':
        return (
          <div className="space-y-3">
            {[
              { report_name: 'CBC', date: '2025-09-01', status: 'Available' },
              { report_name: 'Chest X-Ray', date: '2025-08-20', status: 'Available' }
            ].map((report, index) => (
              <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{report.report_name}</h4>
                  <p className="text-sm text-gray-600">{report.date}</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  {report.status}
                </span>
              </div>
            ))}
            
            <div className="flex gap-2 mt-4">
              <Button variant="confirm" fullWidth size="sm">
                Confirm Treatment
              </Button>
              <Button variant="cancel" fullWidth size="sm">
                Cancel
              </Button>
            </div>
          </div>
        );
      case 'allergies':
        return (
          <div className="space-y-2">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">Penicillin</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const ActionModal = () => {
    if (!showActionModal) return null;

    const action = actions.find(a => a.id === showActionModal);
    if (!action) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">{action.label}</h3>
          
          {action.options ? (
            <div className="space-y-3">
              {action.options.map((option) => (
                <Button key={option} variant="outline" fullWidth>
                  {option}
                </Button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Add notes..."
                rows={4}
              />
              <Button fullWidth>Submit</Button>
            </div>
          )}
          
          <Button 
            variant="outline" 
            fullWidth 
            className="mt-3"
            onClick={() => setShowActionModal(null)}
          >
            Cancel
          </Button>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Header title={`Patient: ${patient.name}`} showBackButton />
      
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Info and Tabs */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-black">
                <div className="w-16 h-16 border border-black flex items-center justify-center">
                  <User size={32} className="text-black" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-black">{patient.name}</h2>
                  <p className="text-gray-600">{patient.age} years • {patient.gender}</p>
                  <p className="text-sm text-black">{patient.patient_id}</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-black mb-6">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-black text-black'
                          : 'border-transparent text-gray-600 hover:text-black'
                      }`}
                    >
                      <IconComponent size={16} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              {renderTabContent()}
            </Card>
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-4">
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Stethoscope size={20} className="text-blue-600" />
                <h3 className="font-semibold text-gray-900">Quick Actions</h3>
              </div>
              <div className="space-y-3">
                {actions.map((action) => (
                  <Button
                    key={action.id}
                    variant="outline"
                    fullWidth
                    size="sm"
                    onClick={() => setShowActionModal(action.id)}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </Card>

            {/* Current Problem */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-3">Current Problem</h3>
              <p className="text-sm text-gray-700">{patient.problem_description}</p>
            </Card>
          </div>
        </div>
      </div>

      <ActionModal />
    </div>
  );
};