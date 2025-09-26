import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/supabase';
import { Header } from '../Layout/Header';
import { Card } from '../Common/Card';
import { Button } from '../Common/Button';
import { Toast, useToast } from '../Common/Toast';
import { Calendar, Clock, User, Users, FileText, Search, TestTube, Activity, AlertCircle, Stethoscope } from 'lucide-react';

interface RegularMedication {
  id: string;
  patient_id: string;
  medicine_name: string;
  dosage: string;
  frequency: string;
  prescribed_by: string;
  start_date: string;
  end_date: string | null;
  created_at: string;
}

export const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { toast, showToast, hideToast } = useToast();
  
  // State
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showActionModal, setShowActionModal] = useState<string | null>(null);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [showMedicationModal, setShowMedicationModal] = useState(false);
  const [medicationForm, setMedicationForm] = useState({
    medicine_name: '',
    dosage: '',
    frequency: '',
    prescribed_by: profile?.full_name || '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: ''
  });

  // Load data on component mount
  useEffect(() => {
    if (profile) {
      loadDashboardData();
    }
  }, [profile]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load appointments for this doctor
      const appointmentsData = await db.getAppointments(profile.id);
      setAppointments(appointmentsData || []);
      
      // Load all patients (in a real app, you might want to limit this)
      const patientsData = await db.getPatients();
      setPatients(patientsData || []);
      
    } catch (error: any) {
      showToast(error.message || 'Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient => 
    patient.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePatientSelect = (patient: any) => {
    setSelectedPatient(patient);
    setActiveTab('overview');
    setSearchTerm('');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'history', label: 'History', icon: FileText },
    { id: 'reports', label: 'Reports', icon: Activity },
    { id: 'allergies', label: 'Allergies', icon: AlertCircle },
    { id: 'medications', label: 'Regular Medications', icon: TestTube }
  ];

  const actions = [
    { id: 'blood_test', label: 'Request Blood Test', options: ['CBC', 'Blood Sugar', 'Lipid Profile', 'Liver Function'] },
    { id: 'radiology', label: 'Request Radiology', options: ['X-Ray', 'Ultrasound', 'CT Scan', 'MRI'] },
    { id: 'physiotherapy', label: 'Request Physiotherapy' },
    { id: 'psychiatry', label: 'Request Psychiatry' }
  ];

  const handleAddMedication = () => {
    if (!selectedPatient) return;
    
    const addMedication = async () => {
      try {
        await db.addMedication({
          patient_id: selectedPatient.id,
          prescribed_by: profile.id,
          name: medicationForm.medicine_name,
          dose: medicationForm.dosage,
          frequency: medicationForm.frequency,
          start_date: medicationForm.start_date,
          end_date: medicationForm.end_date || null
        });
        
        showToast('Medication added successfully!', 'success');
        setShowMedicationModal(false);
        setMedicationForm({
          medicine_name: '', 
          dosage: '', 
          frequency: '', 
          prescribed_by: profile?.full_name || '',
          start_date: new Date().toISOString().split('T')[0], 
          end_date: ''
        });
        
      } catch (error: any) {
        showToast(error.message || 'Failed to add medication', 'error');
      }
    };
    
    addMedication();
  };

  const renderTabContent = () => {
    if (!selectedPatient) return null;

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Patient Name</label>
                <p className="text-gray-900">{selectedPatient.display_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Patient ID</label>
                <p className="text-gray-900">{selectedPatient.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Gender</label>
                <p className="text-gray-900">{selectedPatient.gender}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Phone</label>
                <p className="text-gray-900">{selectedPatient.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                <p className="text-gray-900">{selectedPatient.dob}</p>
              </div>
            </div>
          </div>
        );
      case 'history':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Medical History</h4>
              <p className="text-gray-700 mb-4">Medical history will be loaded from database...</p>
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className="space-y-3">
            <p className="text-gray-600">Lab reports will be loaded from database...</p>
          </div>
        );
      case 'allergies':
        return (
          <div className="space-y-2">
            <p className="text-gray-600">Patient allergies will be loaded from database...</p>
          </div>
        );
      case 'medications':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-900">Current Regular Medications</h4>
              <button
                onClick={() => setShowMedicationModal(true)}
                className="px-3 py-1 bg-black text-white text-sm hover:bg-gray-800 transition-colors"
              >
                + Add Medication
              </button>
            </div>
            <p className="text-gray-600">Patient medications will be loaded from database...</p>
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

    const handleTestSelection = (test: string) => {
      setSelectedTests(prev => 
        prev.includes(test) 
          ? prev.filter(t => t !== test)
          : [...prev, test]
      );
    };

    const handleConfirmTests = () => {
      if (selectedTests.length > 0 && selectedPatient) {
        // Create lab request
        const createLabRequest = async () => {
          try {
            await db.createLabRequest({
              patient_id: selectedPatient.id,
              requested_by: profile.id,
              tests: selectedTests
            });
            
            showToast(`Successfully requested ${selectedTests.join(', ')} for ${selectedPatient.display_name}`, 'success');
          } catch (error: any) {
            showToast(error.message || 'Failed to create lab request', 'error');
          }
        };
        
        createLabRequest();
        setSelectedTests([]);
        setShowActionModal(null);
      }
    };

    const handleCloseModal = () => {
      setSelectedTests([]);
      setShowActionModal(null);
    };
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">{action.label}</h3>
          
          {action.options ? (
            <div className="space-y-3">
              {action.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleTestSelection(option)}
                  className={`w-full px-4 py-2 text-left border transition-colors ${
                    selectedTests.includes(option)
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-black border-black hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {selectedTests.includes(option) && (
                      <span className="text-sm">✓</span>
                    )}
                  </div>
                </button>
              ))}
              
              {selectedTests.length > 0 && (
                <div className="mt-4 p-3 bg-gray-50 border">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Selected Tests ({selectedTests.length}):
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedTests.join(', ')}
                  </p>
                </div>
              )}
              
              <div className="flex gap-2 mt-4">
                <Button 
                  fullWidth 
                  onClick={handleConfirmTests}
                  disabled={selectedTests.length === 0}
                >
                  Confirm Request ({selectedTests.length})
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <textarea
                className="w-full p-3 bg-white focus:outline-none focus:ring-2 focus:ring-gray-500"
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
            onClick={handleCloseModal}
          >
            Cancel
          </Button>
        </Card>
      </div>
    );
  };

  const MedicationModal = () => {
    if (!showMedicationModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full">
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Add Regular Medication</h3>
            <button
              onClick={() => setShowMedicationModal(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name *</label>
              <input
                type="text"
                value={medicationForm.medicine_name}
                onChange={(e) => setMedicationForm(prev => ({ ...prev, medicine_name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="e.g., Metformin"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dosage *</label>
              <input
                type="text"
                value={medicationForm.dosage}
                onChange={(e) => setMedicationForm(prev => ({ ...prev, dosage: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="e.g., 500mg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frequency *</label>
              <input
                type="text"
                value={medicationForm.frequency}
                onChange={(e) => setMedicationForm(prev => ({ ...prev, frequency: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="e.g., Twice daily"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
              <input
                type="date"
                value={medicationForm.start_date}
                onChange={(e) => setMedicationForm(prev => ({ ...prev, start_date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date (Optional)</label>
              <input
                type="date"
                value={medicationForm.end_date}
                onChange={(e) => setMedicationForm(prev => ({ ...prev, end_date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
          </div>
          <div className="flex gap-3 p-6 border-t">
            <button
              onClick={handleAddMedication}
              className="flex-1 px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
              disabled={!medicationForm.medicine_name || !medicationForm.dosage || !medicationForm.frequency}
            >
              Add Medication
            </button>
            <button
              onClick={() => setShowMedicationModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Header title="Doctor Dashboard" />
      
      <div className="max-w-6xl mx-auto p-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        ) : (
          <>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          {/* Doctor Profile */}
          <Card>
            <div className="flex items-center gap-2 mb-4"> 
              <User size={20} className="text-black" />
              <h3 className="font-semibold text-black">Doctor Profile</h3>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                <User size={32} className="text-gray-600" />
              </div>
              <h4 className="font-medium text-black mb-1">{profile?.full_name}</h4>
              <p className="text-sm text-gray-600 mb-2">{profile?.role}</p>
              <p className="text-sm text-gray-600">{profile?.email}</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => navigate('/doctor/profile')}>
                View Profile
              </Button>
            </div>
          </Card>

          {/* Patient Search */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Search size={20} className="text-black" />
              <h3 className="font-semibold text-black">Search Patient</h3>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter patient name or ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              {searchTerm && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-lg max-h-40 overflow-y-auto z-10">
                  {filteredPatients.map((patient) => (
                    <div
                      key={patient.patient_id}
                      className="p-2 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handlePatientSelect(patient)}
                    >
                      <p className="font-medium">{patient.display_name}</p>
                      <p className="text-sm text-gray-600">{patient.id}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Appointments */}
          <Card>
            <div className="flex items-center gap-2 mb-4"> 
              <Calendar size={20} className="text-black" />
              <h3 className="font-semibold text-black">Appointments</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Appointments</span>
                <span className="font-medium">{appointments.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Completed</span>
                <span className="font-medium">{appointments.filter(a => a.status === 'completed').length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Pending</span>
                <span className="font-medium">{appointments.filter(a => a.status === 'waiting').length}</span>
              </div>
            </div>
          </Card>

          {/* Schedule */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Clock size={20} className="text-gray-700" />
              <h3 className="font-semibold text-gray-900">Schedule</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Working Hours</span>
                <span className="font-medium text-sm">9:00 AM - 5:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Next Available</span>
                <span className="font-medium text-sm">11:00 AM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Break Time</span>
                <span className="font-medium text-sm">1:00 - 2:00 PM</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Patient Details Section */}
        {selectedPatient && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <Card>
                <div className="flex items-center gap-4 mb-6 pb-6">
                  <div className="w-16 h-16 bg-gray-100 flex items-center justify-center">
                    <User size={32} className="text-black" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-black">{selectedPatient.name}</h2>
                    <p className="text-gray-600">{selectedPatient.age} years • {selectedPatient.gender}</p>
                    <p className="text-sm text-black">{selectedPatient.patient_id}</p>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex mb-6">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 transition-colors ${
                          activeTab === tab.id
                            ? 'bg-black text-white'
                            : 'text-gray-600 hover:text-black hover:bg-gray-50'
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
                <p className="text-sm text-gray-700">{selectedPatient.problem_description || 'No current problems recorded'}</p>
              </Card>
            </div>
          </div>
        )}

        {/* Today's Appointments */}
        <Card className="mt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Clock size={20} className="text-gray-700" />
              <h3 className="text-lg font-semibold text-gray-900">Today's Appointments</h3>
            </div>
            <Button variant="outline" size="sm">View All</Button>
          </div>

          <div className="space-y-4">
            {appointments.slice(0, 5).map((appointment) => (
              <div
                key={appointment.appointment_id}
                className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => {
                  const patient = patients.find(p => p.id === appointment.patient_id);
                  if (patient) handlePatientSelect(patient);
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-200 flex items-center justify-center">
                    <User size={20} className="text-gray-700" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{appointment.patients?.display_name}</h4>
                    <p className="text-sm text-gray-600">{appointment.problem_summary}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{new Date(appointment.scheduled_at).toLocaleTimeString()}</p>
                  <p className="text-sm text-gray-600">{appointment.status}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
        </>
        )}
      </div>

      <ActionModal />
      <MedicationModal />
      
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};