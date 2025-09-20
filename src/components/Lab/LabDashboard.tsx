import React, { useState } from 'react';
import { Header } from '../Layout/Header';
import { Card } from '../Common/Card';
import { Button } from '../Common/Button';
import { TestTube, Upload, FileText, Clock, X, Check, AlertCircle, Calendar, User } from 'lucide-react';
import { mockTestRequests } from '../../data/mockData';

interface TestRequest {
  request_id: string;
  patient_id: string;
  patient_name: string;
  test_type: string;
  status: 'Requested' | 'Sample Collected' | 'In Progress' | 'Completed';
  date: string;
  priority?: 'Normal' | 'High' | 'Urgent';
  doctor?: string;
  notes?: string;
}

interface PatientReport {
  id: string;
  testName: string;
  patientName: string;
  completedDate: string;
  reportUrl?: string;
  results?: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export const LabDashboard: React.FC = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedTest, setSelectedTest] = useState<TestRequest | null>(null);
  const [selectedReport, setSelectedReport] = useState<PatientReport | null>(null);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [testRequests, setTestRequests] = useState<TestRequest[]>([
    ...mockTestRequests.map(req => ({
      ...req,
      priority: 'Normal' as const,
      doctor: 'Dr. Sharma',
      notes: 'Standard procedure required'
    })),
    {
      request_id: 'LR-4002',
      patient_id: 'P-1002',
      patient_name: 'Meena R.',
      test_type: 'Lipid Profile',
      status: 'In Progress' as const,
      date: '2025-09-16',
      priority: 'High' as const,
      doctor: 'Dr. Patel',
      notes: 'Patient has family history of heart disease'
    },
    {
      request_id: 'LR-4003',
      patient_id: 'P-1003',
      patient_name: 'Arjun P.',
      test_type: 'Blood Sugar',
      status: 'Requested' as const,
      date: '2025-09-17',
      priority: 'Normal' as const,
      doctor: 'Dr. Kumar',
      notes: 'Fasting required'
    }
  ]);

  const [patientReports] = useState<PatientReport[]>([
    {
      id: 'RPT-001',
      testName: 'CBC',
      patientName: 'Ravi Kumar',
      completedDate: 'September 1, 2025',
      results: 'All parameters within normal range. Hemoglobin: 14.2 g/dL, WBC: 7,200/μL, Platelets: 250,000/μL'
    },
    {
      id: 'RPT-002',
      testName: 'Lipid Profile',
      patientName: 'Meena R.',
      completedDate: 'August 28, 2025',
      results: 'Total Cholesterol: 180 mg/dL, HDL: 45 mg/dL, LDL: 110 mg/dL, Triglycerides: 125 mg/dL'
    },
    {
      id: 'RPT-003',
      testName: 'Blood Sugar',
      patientName: 'Arjun P.',
      completedDate: 'August 25, 2025',
      results: 'Fasting Glucose: 95 mg/dL (Normal), HbA1c: 5.4% (Normal)'
    },
    {
      id: 'RPT-004',
      testName: 'Urine Test',
      patientName: 'Priya S.',
      completedDate: 'August 22, 2025',
      results: 'No abnormal findings. Specific gravity: 1.020, Protein: Negative, Glucose: Negative'
    }
  ]);

  const openModal = (modalType: string, test?: TestRequest, report?: PatientReport) => {
    setActiveModal(modalType);
    if (test) setSelectedTest(test);
    if (report) setSelectedReport(report);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedTest(null);
    setSelectedReport(null);
    setUploadFiles([]);
  };

  const handleStatusUpdate = (requestId: string, newStatus: TestRequest['status']) => {
    setTestRequests(prev => prev.map(req => 
      req.request_id === requestId ? { ...req, status: newStatus } : req
    ));
    closeModal();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadFiles(files);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Requested': return 'bg-blue-100 text-blue-800';
      case 'Sample Collected': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-orange-100 text-orange-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-orange-600';
      case 'Urgent': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header title="Lab Dashboard" />
      
      <div className="max-w-6xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="text-center" padding="sm">
            <TestTube size={24} className="text-black mx-auto mb-2" />
            <h3 className="text-xl font-bold text-black">8</h3>
            <p className="text-sm text-gray-600">Test Requests</p>
          </Card>

          <Card className="text-center" padding="sm">
            <Upload size={24} className="text-green-600 mx-auto mb-2" />
            <h3 className="text-xl font-bold text-gray-900">12</h3>
            <p className="text-sm text-gray-600">Upload Results</p>
          </Card>

          <Card className="text-center" padding="sm">
            <FileText size={24} className="text-purple-600 mx-auto mb-2" />
            <h3 className="text-xl font-bold text-gray-900">25</h3>
            <p className="text-sm text-gray-600">Patient Reports</p>
          </Card>
        </div>

        {/* Test Requests */}
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TestTube size={20} className="text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Test Requests Panel</h3>
            </div>
            <Button variant="outline" size="sm" onClick={() => openModal('viewAll')}>View All</Button>
          </div>

          <div className="space-y-4">
            {testRequests.map((request) => (
              <div key={request.request_id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {request.request_id} - {request.test_type}
                    </h4>
                    <p className="text-sm text-gray-600">Patient: {request.patient_name}</p>
                    <p className="text-sm text-gray-600">Date: {request.date}</p>
                    {request.priority && (
                      <p className={`text-sm font-medium ${getPriorityColor(request.priority)}`}>
                        Priority: {request.priority}
                      </p>
                    )}
                  </div>
                  <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  {request.status === 'Requested' && (
                    <Button size="sm" onClick={() => openModal('collectSample', request)}>
                      Collect Sample
                    </Button>
                  )}
                  {request.status === 'Sample Collected' && (
                    <Button size="sm" onClick={() => openModal('startProcessing', request)}>
                      Start Processing
                    </Button>
                  )}
                  {request.status === 'In Progress' && (
                    <Button size="sm" onClick={() => openModal('uploadResults', request)}>
                      Upload Results
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => openModal('viewDetails', request)}>
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Upload Test Results & Patient Report History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Upload size={20} className="text-blue-600" />
              <h3 className="font-semibold text-gray-900">Upload Test Results</h3>
            </div>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload size={32} className="text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">Drag & drop PDF files here</p>
                <Button variant="outline" onClick={() => openModal('browseFiles')}>
                  Browse Files
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button fullWidth onClick={() => openModal('uploadComplete')}>
                  Upload & Mark Complete
                </Button>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-4">
              <FileText size={20} className="text-blue-600" />
              <h3 className="font-semibold text-gray-900">Patient Report History</h3>
            </div>
            
            <div className="space-y-3">
              {patientReports.map((report) => (
                <div key={report.id} className="flex justify-between items-center p-3 border rounded-lg bg-green-50">
                  <div>
                    <h4 className="font-medium">{report.testName} - {report.patientName}</h4>
                    <p className="text-sm text-gray-600">Completed {report.completedDate}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => openModal('viewReport', undefined, report)}>
                    View
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Modals */}
      
      {/* View Details Modal */}
      <Modal
        isOpen={activeModal === 'viewDetails'}
        onClose={closeModal}
        title="Test Request Details"
      >
        {selectedTest && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Test ID</label>
                <p className="text-gray-900 font-medium">{selectedTest.request_id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Test Type</label>
                <p className="text-gray-900">{selectedTest.test_type}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Patient Name</label>
                <p className="text-gray-900">{selectedTest.patient_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Patient ID</label>
                <p className="text-gray-900">{selectedTest.patient_id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date Requested</label>
                <p className="text-gray-900">{selectedTest.date}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(selectedTest.status)}`}>
                  {selectedTest.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Priority</label>
                <p className={`font-medium ${getPriorityColor(selectedTest.priority || 'Normal')}`}>
                  {selectedTest.priority || 'Normal'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Requesting Doctor</label>
                <p className="text-gray-900">{selectedTest.doctor || 'Not specified'}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                {selectedTest.notes || 'No additional notes'}
              </p>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={closeModal} className="flex-1">Close</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Collect Sample Modal */}
      <Modal
        isOpen={activeModal === 'collectSample'}
        onClose={closeModal}
        title="Collect Sample"
      >
        {selectedTest && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Sample Collection for {selectedTest.test_type}</h4>
              <p className="text-blue-800">Patient: {selectedTest.patient_name} ({selectedTest.patient_id})</p>
              <p className="text-blue-800">Test ID: {selectedTest.request_id}</p>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Collection Time</label>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue={new Date().toISOString().slice(0, 16)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Collected By</label>
                <input
                  type="text"
                  placeholder="Lab Technician Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sample Notes</label>
                <textarea
                  rows={3}
                  placeholder="Any observations about the sample collection..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={() => handleStatusUpdate(selectedTest.request_id, 'Sample Collected')}
                className="flex-1"
              >
                <Check size={16} className="mr-2" />
                Confirm Collection
              </Button>
              <Button variant="outline" onClick={closeModal}>Cancel</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Start Processing Modal */}
      <Modal
        isOpen={activeModal === 'startProcessing'}
        onClose={closeModal}
        title="Start Processing"
      >
        {selectedTest && (
          <div className="space-y-4">
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-medium text-orange-900 mb-2">Begin Processing: {selectedTest.test_type}</h4>
              <p className="text-orange-800">Patient: {selectedTest.patient_name}</p>
              <p className="text-orange-800">Test ID: {selectedTest.request_id}</p>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Processing Started By</label>
                <input
                  type="text"
                  placeholder="Lab Technician Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Completion Time</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="2">2 hours</option>
                  <option value="4">4 hours</option>
                  <option value="8">8 hours</option>
                  <option value="24">24 hours</option>
                  <option value="48">48 hours</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Processing Notes</label>
                <textarea
                  rows={3}
                  placeholder="Any special processing requirements or observations..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={() => handleStatusUpdate(selectedTest.request_id, 'In Progress')}
                className="flex-1"
              >
                <Clock size={16} className="mr-2" />
                Start Processing
              </Button>
              <Button variant="outline" onClick={closeModal}>Cancel</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Upload Results Modal */}
      <Modal
        isOpen={activeModal === 'uploadResults'}
        onClose={closeModal}
        title="Upload Test Results"
      >
        {selectedTest && (
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Upload Results: {selectedTest.test_type}</h4>
              <p className="text-green-800">Patient: {selectedTest.patient_name}</p>
              <p className="text-green-800">Test ID: {selectedTest.request_id}</p>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Result Files</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload size={32} className="text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-3">Drag & drop PDF files or click to browse</p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outline" size="sm">Browse Files</Button>
                  </label>
                </div>
                {uploadFiles.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Selected files:</p>
                    <ul className="text-sm text-gray-800">
                      {uploadFiles.map((file, index) => (
                        <li key={index}>• {file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Result Summary</label>
                <textarea
                  rows={4}
                  placeholder="Brief summary of test results..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Processed By</label>
                <input
                  type="text"
                  placeholder="Lab Technician Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={() => handleStatusUpdate(selectedTest.request_id, 'Completed')}
                className="flex-1"
              >
                <Upload size={16} className="mr-2" />
                Upload & Complete
              </Button>
              <Button variant="outline" onClick={closeModal}>Cancel</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Browse Files Modal */}
      <Modal
        isOpen={activeModal === 'browseFiles'}
        onClose={closeModal}
        title="Upload Test Results"
      >
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Select PDF files to upload</p>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              className="hidden"
              id="bulk-file-upload"
            />
            <label htmlFor="bulk-file-upload">
              <Button variant="outline">Choose Files</Button>
            </label>
          </div>
          
          {uploadFiles.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Selected Files ({uploadFiles.length})</h4>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {uploadFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-800">{file.name}</span>
                    <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex gap-2 pt-4">
            <Button className="flex-1" disabled={uploadFiles.length === 0}>
              Upload {uploadFiles.length} File{uploadFiles.length !== 1 ? 's' : ''}
            </Button>
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
          </div>
        </div>
      </Modal>

      {/* Upload Complete Modal */}
      <Modal
        isOpen={activeModal === 'uploadComplete'}
        onClose={closeModal}
        title="Upload & Mark Complete"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Bulk Upload & Complete</h4>
            <p className="text-blue-800">Upload multiple test results and mark them as completed</p>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Test Results to Complete</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {testRequests.filter(req => req.status === 'In Progress').map((request) => (
                  <label key={request.request_id} className="flex items-center p-2 border rounded-lg hover:bg-gray-50">
                    <input type="checkbox" className="mr-3" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{request.request_id} - {request.test_type}</p>
                      <p className="text-xs text-gray-600">{request.patient_name}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload size={32} className="text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-3">Upload result files</p>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
                id="complete-file-upload"
              />
              <label htmlFor="complete-file-upload">
                <Button variant="outline" size="sm">Browse Files</Button>
              </label>
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button className="flex-1">
              <Check size={16} className="mr-2" />
              Upload & Mark Complete
            </Button>
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
          </div>
        </div>
      </Modal>

      {/* View Report Modal */}
      <Modal
        isOpen={activeModal === 'viewReport'}
        onClose={closeModal}
        title="Patient Report Details"
      >
        {selectedReport && (
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">{selectedReport.testName} Report</h4>
              <p className="text-green-800">Patient: {selectedReport.patientName}</p>
              <p className="text-green-800">Completed: {selectedReport.completedDate}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Test Results</label>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900">{selectedReport.results}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Report ID</label>
                <p className="text-gray-900 font-medium">{selectedReport.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800">
                  Completed
                </span>
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1">
                <FileText size={16} className="mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" className="flex-1">
                Print Report
              </Button>
              <Button onClick={closeModal}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* View All Modal */}
      <Modal
        isOpen={activeModal === 'viewAll'}
        onClose={closeModal}
        title="All Test Requests"
      >
        <div className="space-y-4">
          <div className="max-h-96 overflow-y-auto">
            <div className="space-y-3">
              {testRequests.map((request) => (
                <div key={request.request_id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">
                        {request.request_id} - {request.test_type}
                      </h4>
                      <p className="text-xs text-gray-600">Patient: {request.patient_name}</p>
                      <p className="text-xs text-gray-600">Date: {request.date}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => {
                      setSelectedTest(request);
                      setActiveModal('viewDetails');
                    }}>
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={closeModal} className="flex-1">Close</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};