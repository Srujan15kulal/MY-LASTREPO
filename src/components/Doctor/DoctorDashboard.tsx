import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Layout/Header';
import { Card } from '../Common/Card';
import { Button } from '../Common/Button';
import { Calendar, Clock, User, Users, FileText, Search, TestTube, Activity, AlertCircle, Stethoscope } from 'lucide-react';
import { mockDoctors, mockAppointments, mockPatients } from '../../data/mockData';
import { getPatientHistory, getPatientReports, getPatientAllergies, getPatientMedications } from '../../data/patientData';

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
  const doctor = mockDoctors[0];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showActionModal, setShowActionModal] = useState<string | null>(null);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [requestedTests, setRequestedTests] = useState<{patientId: string, tests: string[], timestamp: string}[]>([]);
  const [showMedicationModal, setShowMedicationModal] = useState(false);
  const [medicationForm, setMedicationForm] = useState({
    medicine_name: '',
    dosage: '',
    frequency: '',
    prescribed_by: 'Dr. Ramesh',
    start_date: new Date().toISOString().split('T')[0],
    end_date: ''
  });

  const filteredPatients = mockPatients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.patient_id.toLowerCase().includes(searchTerm.toLowerCase())
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
    
    // Simulate API call to add medication
    const newMedication = {
      id: `med-${Date.now()}`,
      patient_id: selectedPatient.patient_id,
      ...medicationForm,
      created_at: new Date().toISOString()
    };
    
    alert(`Medication added successfully!\nMedicine: ${medicationForm.medicine_name}\nDosage: ${medicationForm.dosage}\nFrequency: ${medicationForm.frequency}`);
    
    setShowMedicationModal(false);
    setMedicationForm({
      medicine_name: '', dosage: '', frequency: '', prescribed_by: 'Dr. Ramesh',
      start_date: new Date().toISOString().split('T')[0], end_date: ''
    });
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
                <p className="text-gray-900">{selectedPatient.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Patient ID</label>
                <p className="text-gray-900">{selectedPatient.patient_id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Age</label>
                <p className="text-gray-900">{selectedPatient.age} years</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Gender</label>
                <p className="text-gray-900">{selectedPatient.gender}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Phone</label>
                <p className="text-gray-900">{selectedPatient.phone_number}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Aadhar</label>
                <p className="text-gray-900">{selectedPatient.aadhar_number}</p>
              </div>
            </div>
          </div>
        );
      case 'history':
        const history = getPatientHistory(selectedPatient.patient_id);
        return (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Medical History</h4>
              <p className="text-gray-700 mb-4">{history.medicalHistory}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Recent Prescriptions</h4>
              <div className="space-y-3">
                {history.prescriptions.map((prescription, index) => (
                  <div key={index} className="p-3 bg-gray-50">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{prescription.medicine}</span>
                    </div>
                    <p className="text-sm text-gray-600">Quantity: {prescription.quantity}</p>
                    <p className="text-sm text-gray-500">Prescribed by {prescription.prescribedBy} on {prescription.dateTime}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'reports':
        const reports = getPatientReports(selectedPatient.patient_id);
        return (
          <div className="space-y-3">
            {reports.map((report, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50">
                <div>
                  <h4 className="font-medium">{report.name}</h4>
                  <p className="text-sm text-gray-600">{report.date}</p>
                  <p className="text-sm text-gray-500">Uploaded by {report.uploadedBy}</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm">
                    {report.status}
                  </span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => navigate(`/report/${report.reportId}`)}
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        );
      case 'allergies':
        const allergies = getPatientAllergies(selectedPatient.patient_id);
        return (
          <div className="space-y-2">
            {allergies.map((allergy, index) => (
              <div key={index} className="p-3 bg-red-50">
                <div className="flex items-center justify-between">
                  <p className="text-red-800 font-medium">{allergy.name}</p>
                  <span className="text-xs text-red-600">{allergy.severity} Risk</span>
                </div>
                <p className="text-sm text-red-700 mt-1">{allergy.description}</p>
              </div>
            ))}
          </div>
        );
      case 'medications':
        const medications = getPatientMedications(selectedPatient.patient_id);
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
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 font-medium text-gray-700">Medicine</th>
                    <th className="text-left py-2 font-medium text-gray-700">Dosage</th>
                    <th className="text-left py-2 font-medium text-gray-700">Frequency</th>
                    <th className="text-left py-2 font-medium text-gray-700">Prescribed By</th>
                    <th className="text-left py-2 font-medium text-gray-700">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {medications.map((medication) => (
                    <tr key={medication.id} className="border-b border-gray-100">
                      <td className="py-3 font-medium text-gray-900">{medication.medicine_name}</td>
                      <td className="py-3 text-gray-700">{medication.dosage}</td>
                      <td className="py-3 text-gray-700">{medication.frequency}</td>
                      <td className="py-3 text-gray-700">{medication.prescribed_by}</td>
                      <td className="py-3 text-gray-700">
                        {medication.start_date} {medication.end_date ? `- ${medication.end_date}` : '- Ongoing'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

    const handleTestSelection = (test: string) => {
      setSelectedTests(prev => 
        prev.includes(test) 
          ? prev.filter(t => t !== test)
          : [...prev, test]
      );
    };

    const handleConfirmTests = () => {
      if (selectedTests.length > 0 && selectedPatient) {
        const newRequest = {
          patientId: selectedPatient.patient_id,
          tests: [...selectedTests],
          timestamp: new Date().toLocaleString()
        };
        setRequestedTests(prev => [...prev, newRequest]);
        alert(`Successfully requested ${selectedTests.join(', ')} for ${selectedPatient.name}`);
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          {/* Doctor Profile */}
          <Card>
            <div className="flex items-center gap-2 mb-4"> 
              <User size={20} className="text-black" />
              <h3 className="font-semibold text-black">Doctor Profile</h3>
            </div>
            <div className="text-center">
              <img
                src={doctor.photo_url}
                alt={doctor.name}
                className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
              />
              <h4 className="font-medium text-black mb-1">{doctor.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{doctor.qualification}</p>
              <p className="text-sm font-medium text-black mb-2">{doctor.department}</p>
              <p className="text-sm text-gray-600">{doctor.contact_number}</p>
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
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-gray-600">{patient.patient_id}</p>
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
                <span className="font-medium">{mockAppointments.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Completed</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Pending</span>
                <span className="font-medium">4</span>
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
                <p className="text-sm text-gray-700">{selectedPatient.problem_description}</p>
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
            {mockAppointments.map((appointment) => (
              <div
                key={appointment.appointment_id}
                className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => {
                  const patient = mockPatients.find(p => p.patient_id === appointment.patient_id);
                  if (patient) handlePatientSelect(patient);
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-200 flex items-center justify-center">
                    <User size={20} className="text-gray-700" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{appointment.patient_name}</h4>
                    <p className="text-sm text-gray-600">{appointment.reason}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{appointment.time}</p>
                  <p className="text-sm text-gray-600">Age: {appointment.age}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <ActionModal />
      <MedicationModal />
    </div>
  );
};