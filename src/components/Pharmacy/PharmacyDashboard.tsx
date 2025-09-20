import React, { useState, useEffect, useRef } from 'react';
import { Header } from '../Layout/Header';
import { Card } from '../Common/Card';
import { Button } from '../Common/Button';
import { Pill, Package, CheckCircle, AlertTriangle, X, Upload, Calendar, User, FileText, Search, Filter } from 'lucide-react';
import { mockPrescriptions } from '../../data/mockData';

interface Prescription {
  prescription_id: string;
  patient_id: string;
  patient_name: string;
  medicines: string[];
  status: 'Pending' | 'Dispensed';
  date: string;
  doctor?: string;
  priority?: 'Normal' | 'High' | 'Urgent';
  notes?: string;
  dispense_id?: string;
}

interface DispenseItem {
  medicine_id: string;
  medicine_name: string;
  dispensed_qty: number;
  batch_no: string;
  expiry_date: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Accessible Modal Component
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();
      document.body.style.overflow = 'hidden';
      
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
        previousFocusRef.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        ref={modalRef}
        className={`bg-white rounded-lg ${sizeClasses[size]} w-full max-h-[90vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-200`}
        tabIndex={-1}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 id="modal-title" className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close modal"
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

// API Functions (with localStorage fallback)
const api = {
  async fulfillPrescription(id: string, payload: any) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Store in localStorage for persistence
    const stored = localStorage.getItem('prescriptions');
    const prescriptions = stored ? JSON.parse(stored) : [];
    const updated = prescriptions.map((p: Prescription) => 
      p.prescription_id === id 
        ? { ...p, status: 'Dispensed', fulfilled_by: payload.fulfilled_by, fulfilled_date: payload.fulfilled_date }
        : p
    );
    localStorage.setItem('prescriptions', JSON.stringify(updated));
    
    // Emit analytics event
    console.log('Analytics: fulfill_success', { prescription_id: id, user_id: 'current_user' });
    
    return { success: true, prescription: updated.find((p: Prescription) => p.prescription_id === id) };
  },

  async uploadDispenseDetails(id: string, formData: FormData) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const dispenseId = `D-${Math.floor(Math.random() * 9000) + 1000}`;
    
    // Store in localStorage
    const stored = localStorage.getItem('prescriptions');
    const prescriptions = stored ? JSON.parse(stored) : [];
    const updated = prescriptions.map((p: Prescription) => 
      p.prescription_id === id 
        ? { ...p, dispense_id: dispenseId, status: 'Dispensed' }
        : p
    );
    localStorage.setItem('prescriptions', JSON.stringify(updated));
    
    // Emit analytics event
    console.log('Analytics: dispense_upload_success', { prescription_id: id, dispense_id: dispenseId });
    
    return { success: true, prescription: updated.find((p: Prescription) => p.prescription_id === id), dispense_id: dispenseId };
  },

  async getAllPrescriptions(filters?: any) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const stored = localStorage.getItem('prescriptions');
    let prescriptions = stored ? JSON.parse(stored) : mockPrescriptions.map(p => ({
      ...p,
      doctor: 'Dr. Smith',
      priority: 'Normal'
    }));
    
    // Apply filters
    if (filters?.status && filters.status !== 'all') {
      prescriptions = prescriptions.filter((p: Prescription) => p.status === filters.status);
    }
    if (filters?.search) {
      prescriptions = prescriptions.filter((p: Prescription) => 
        p.patient_name.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.prescription_id.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    return { prescriptions, total: prescriptions.length };
  }
};

export const PharmacyDashboard: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [fulfillForm, setFulfillForm] = useState({
    fulfilled_by: 'Pharmacy Staff',
    fulfilled_date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  
  const [dispenseForm, setDispenseForm] = useState<{
    items: DispenseItem[];
    photos: File[];
    documents: File[];
  }>({
    items: [],
    photos: [],
    documents: []
  });
  
  const [viewAllFilters, setViewAllFilters] = useState({
    search: '',
    status: 'all',
    dateRange: 'all'
  });

  // Initialize prescriptions
  useEffect(() => {
    const stored = localStorage.getItem('prescriptions');
    if (stored) {
      setPrescriptions(JSON.parse(stored));
    } else {
      const initialPrescriptions = mockPrescriptions.map(p => ({
        ...p,
        doctor: 'Dr. Smith',
        priority: 'Normal' as const
      }));
      setPrescriptions(initialPrescriptions);
      localStorage.setItem('prescriptions', JSON.stringify(initialPrescriptions));
    }
  }, []);

  // Modal handlers
  const openModal = (modalType: string, prescription?: Prescription) => {
    setActiveModal(modalType);
    setSelectedPrescription(prescription || null);
    setError(null);
    
    if (prescription && modalType === 'dispense') {
      // Initialize dispense form with prescription medicines
      const items = prescription.medicines.map((medicine, index) => ({
        medicine_id: `med_${index}`,
        medicine_name: medicine,
        dispensed_qty: 1,
        batch_no: '',
        expiry_date: ''
      }));
      setDispenseForm(prev => ({ ...prev, items }));
    }
    
    // Emit analytics
    console.log('Analytics: modal_open', { modal_type: modalType, prescription_id: prescription?.prescription_id });
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedPrescription(null);
    setError(null);
    setFulfillForm({
      fulfilled_by: 'Pharmacy Staff',
      fulfilled_date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setDispenseForm({
      items: [],
      photos: [],
      documents: []
    });
  };

  // Form handlers
  const handleFulfillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPrescription) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.fulfillPrescription(selectedPrescription.prescription_id, fulfillForm);
      
      // Update local state
      setPrescriptions(prev => prev.map(p => 
        p.prescription_id === selectedPrescription.prescription_id 
          ? { ...p, status: 'Dispensed' as const }
          : p
      ));
      
      closeModal();
      
      // Show success toast
      alert('Prescription marked as fulfilled successfully!');
      
    } catch (err) {
      setError('Failed to fulfill prescription. Please try again.');
      console.log('Analytics: fulfill_failure', { prescription_id: selectedPrescription.prescription_id });
    } finally {
      setLoading(false);
    }
  };

  const handleDispenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPrescription) return;
    
    // Validate form
    const errors = [];
    dispenseForm.items.forEach((item, index) => {
      if (item.dispensed_qty <= 0) errors.push(`Item ${index + 1}: Quantity must be positive`);
      if (!item.batch_no.trim()) errors.push(`Item ${index + 1}: Batch number is required`);
      if (!item.expiry_date) errors.push(`Item ${index + 1}: Expiry date is required`);
      if (new Date(item.expiry_date) <= new Date()) errors.push(`Item ${index + 1}: Expiry date must be in the future`);
    });
    
    if (errors.length > 0) {
      setError(errors.join('\n'));
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('dispense_items', JSON.stringify(dispenseForm.items));
      
      dispenseForm.photos.forEach((file, index) => {
        formData.append(`photos`, file);
      });
      
      dispenseForm.documents.forEach((file, index) => {
        formData.append(`documents`, file);
      });
      
      const result = await api.uploadDispenseDetails(selectedPrescription.prescription_id, formData);
      
      // Update local state
      setPrescriptions(prev => prev.map(p => 
        p.prescription_id === selectedPrescription.prescription_id 
          ? { ...p, status: 'Dispensed' as const, dispense_id: result.dispense_id }
          : p
      ));
      
      closeModal();
      
      // Show success toast
      alert(`Dispense details uploaded successfully! Dispense ID: ${result.dispense_id}`);
      
    } catch (err) {
      setError('Failed to upload dispense details. Please try again.');
      console.log('Analytics: dispense_upload_failure', { prescription_id: selectedPrescription.prescription_id });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (files: FileList | null, type: 'photos' | 'documents') => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validFiles = [];
    const errors = [];
    
    for (const file of fileArray) {
      if (file.size > maxSize) {
        errors.push(`${file.name} is too large (max 5MB)`);
        continue;
      }
      
      if (type === 'photos' && !file.type.startsWith('image/')) {
        errors.push(`${file.name} is not a valid image`);
        continue;
      }
      
      if (type === 'documents' && file.type !== 'application/pdf') {
        errors.push(`${file.name} is not a PDF`);
        continue;
      }
      
      validFiles.push(file);
    }
    
    if (errors.length > 0) {
      setError(errors.join('\n'));
      return;
    }
    
    setDispenseForm(prev => ({
      ...prev,
      [type]: type === 'photos' && prev.photos.length + validFiles.length > 5 
        ? prev.photos.slice(0, 5 - validFiles.length).concat(validFiles)
        : [...prev[type], ...validFiles]
    }));
  };

  const updateDispenseItem = (index: number, field: keyof DispenseItem, value: string | number) => {
    setDispenseForm(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  // Get current prescriptions (filter out fulfilled ones for main view)
  const pendingPrescriptions = prescriptions.filter(p => p.status === 'Pending');
  const recentDispensed = prescriptions.filter(p => p.status === 'Dispensed').slice(0, 2);

  return (
    <div className="min-h-screen bg-white">
      <Header title="Pharmacy Dashboard" />
      
      <div className="max-w-6xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="text-center">
            <Pill size={32} className="text-black mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-black">{prescriptions.length}</h3>
            <p className="text-gray-600">Prescription List</p>
          </Card>

          <Card className="text-center">
            <Package size={32} className="text-green-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">145</h3>
            <p className="text-gray-600">Stock/Inventory</p>
          </Card>

          <Card className="text-center">
            <CheckCircle size={32} className="text-purple-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">{prescriptions.filter(p => p.status === 'Dispensed').length}</h3>
            <p className="text-gray-600">Fulfilled Today</p>
          </Card>

          <Card className="text-center">
            <AlertTriangle size={32} className="text-orange-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">25</h3>
            <p className="text-gray-600">Dispense Details</p>
          </Card>
        </div>

        {/* Prescriptions Queue */}
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Pill size={20} className="text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Prescriptions to Fulfill</h3>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => openModal('viewAll')}
            >
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {pendingPrescriptions.map((prescription) => (
              <div 
                key={prescription.prescription_id} 
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => openModal('details', prescription)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal('details', prescription);
                  }
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {prescription.prescription_id} - {prescription.patient_name}
                    </h4>
                    <p className="text-sm text-gray-600">Date: {prescription.date}</p>
                    {prescription.dispense_id && (
                      <p className="text-sm text-green-600 font-medium">Dispense: {prescription.dispense_id}</p>
                    )}
                  </div>
                  <span className={`px-3 py-1 text-sm rounded-full ${
                    prescription.status === 'Pending' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {prescription.status}
                  </span>
                </div>
                
                <div className="mb-4">
                  <h5 className="font-medium text-gray-700 mb-2">Medicines:</h5>
                  <ul className="space-y-1">
                    {prescription.medicines.map((medicine, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        {medicine}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button 
                    size="sm" 
                    onClick={() => openModal('fulfill', prescription)}
                    disabled={prescription.status === 'Dispensed'}
                  >
                    Mark as Fulfilled
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => openModal('dispense', prescription)}
                  >
                    Upload Dispense Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Inventory Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Package size={20} className="text-blue-600" />
              <h3 className="font-semibold text-gray-900">Current Stock</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Paracetamol 500mg</h4>
                  <p className="text-sm text-gray-600">Tablets</p>
                </div>
                <span className="font-medium text-green-600">120 units</span>
              </div>
              
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Ibuprofen 200mg</h4>
                  <p className="text-sm text-gray-600">Tablets</p>
                </div>
                <span className="font-medium text-green-600">85 units</span>
              </div>
              
              <div className="flex justify-between items-center p-3 border rounded-lg bg-orange-50">
                <div>
                  <h4 className="font-medium">Amoxicillin 250mg</h4>
                  <p className="text-sm text-gray-600">Capsules</p>
                </div>
                <span className="font-medium text-orange-600">15 units</span>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle size={20} className="text-blue-600" />
              <h3 className="font-semibold text-gray-900">Recent Dispensed</h3>
            </div>
            
            <div className="space-y-3">
              {recentDispensed.map((prescription) => (
                <div key={prescription.prescription_id} className="p-3 border rounded-lg bg-green-50">
                  <h4 className="font-medium text-gray-900">{prescription.prescription_id}</h4>
                  <p className="text-sm text-gray-600">Dispensed today</p>
                  <p className="text-sm text-green-700">Patient: {prescription.patient_name}</p>
                  {prescription.dispense_id && (
                    <p className="text-sm text-green-600">Dispense ID: {prescription.dispense_id}</p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Mark as Fulfilled Modal */}
      <Modal
        isOpen={activeModal === 'fulfill'}
        onClose={closeModal}
        title="Confirm Fulfillment"
        size="md"
      >
        {selectedPrescription && (
          <form onSubmit={handleFulfillSubmit} className="space-y-6">
            {/* Prescription Summary */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Prescription Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-800">ID:</span>
                  <span className="ml-2 text-blue-700">{selectedPrescription.prescription_id}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Patient:</span>
                  <span className="ml-2 text-blue-700">{selectedPrescription.patient_name}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Date:</span>
                  <span className="ml-2 text-blue-700">{selectedPrescription.date}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Status:</span>
                  <span className="ml-2 text-blue-700">{selectedPrescription.status}</span>
                </div>
              </div>
              
              <div className="mt-3">
                <span className="font-medium text-blue-800">Medicines:</span>
                <ul className="mt-1 space-y-1">
                  {selectedPrescription.medicines.map((medicine, index) => (
                    <li key={index} className="text-sm text-blue-700 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                      {medicine}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label htmlFor="fulfilled_date" className="block text-sm font-medium text-gray-700 mb-1">
                  Fulfillment Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="fulfilled_date"
                  value={fulfillForm.fulfilled_date}
                  onChange={(e) => setFulfillForm(prev => ({ ...prev, fulfilled_date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="fulfilled_by" className="block text-sm font-medium text-gray-700 mb-1">
                  Fulfilled By <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fulfilled_by"
                  value={fulfillForm.fulfilled_by}
                  onChange={(e) => setFulfillForm(prev => ({ ...prev, fulfilled_by: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter pharmacist name"
                  required
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={fulfillForm.notes}
                  onChange={(e) => setFulfillForm(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any additional notes..."
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-800 text-sm whitespace-pre-line">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button 
                type="submit" 
                className="flex-1"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Confirm Fulfillment'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={closeModal}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Upload Dispense Details Modal */}
      <Modal
        isOpen={activeModal === 'dispense'}
        onClose={closeModal}
        title="Upload Dispense Details"
        size="lg"
      >
        {selectedPrescription && (
          <form onSubmit={handleDispenseSubmit} className="space-y-6">
            {/* Prescription Summary */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">
                {selectedPrescription.prescription_id} - {selectedPrescription.patient_name}
              </h4>
              <p className="text-green-800 text-sm">Date: {selectedPrescription.date}</p>
            </div>

            {/* Medicine Items */}
            <div>
              <h5 className="font-medium text-gray-900 mb-3">Dispense Details for Each Medicine</h5>
              <div className="space-y-4">
                {dispenseForm.items.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h6 className="font-medium text-gray-800 mb-3">{item.medicine_name}</h6>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dispensed Quantity <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={item.dispensed_qty}
                          onChange={(e) => updateDispenseItem(index, 'dispensed_qty', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Batch Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={item.batch_no}
                          onChange={(e) => updateDispenseItem(index, 'batch_no', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., BT2025001"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={item.expiry_date}
                          onChange={(e) => updateDispenseItem(index, 'expiry_date', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* File Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Photos Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photos (Max 5 files, 5MB each)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload size={24} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm mb-2">Drag & drop images or click to browse</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files, 'photos')}
                    className="hidden"
                    id="photos-upload"
                  />
                  <label htmlFor="photos-upload">
                    <Button type="button" variant="outline" size="sm">Browse Images</Button>
                  </label>
                </div>
                {dispenseForm.photos.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-1">Selected photos ({dispenseForm.photos.length}/5):</p>
                    <div className="space-y-1">
                      {dispenseForm.photos.map((file, index) => (
                        <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                          <span className="truncate">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => setDispenseForm(prev => ({
                              ...prev,
                              photos: prev.photos.filter((_, i) => i !== index)
                            }))}
                            className="text-red-600 hover:text-red-800 ml-2"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Documents Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Documents (PDF only)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <FileText size={24} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm mb-2">Upload PDF documents</p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf"
                    onChange={(e) => handleFileUpload(e.target.files, 'documents')}
                    className="hidden"
                    id="documents-upload"
                  />
                  <label htmlFor="documents-upload">
                    <Button type="button" variant="outline" size="sm">Browse PDFs</Button>
                  </label>
                </div>
                {dispenseForm.documents.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-1">Selected documents:</p>
                    <div className="space-y-1">
                      {dispenseForm.documents.map((file, index) => (
                        <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                          <span className="truncate">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => setDispenseForm(prev => ({
                              ...prev,
                              documents: prev.documents.filter((_, i) => i !== index)
                            }))}
                            className="text-red-600 hover:text-red-800 ml-2"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-800 text-sm whitespace-pre-line">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button 
                type="submit" 
                className="flex-1"
                disabled={loading}
              >
                {loading ? 'Uploading...' : 'Upload Details'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={closeModal}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* View All Prescriptions Modal */}
      <Modal
        isOpen={activeModal === 'viewAll'}
        onClose={closeModal}
        title="All Prescriptions"
        size="xl"
      >
        <div className="space-y-6">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Patient name or prescription ID..."
                  value={viewAllFilters.search}
                  onChange={(e) => setViewAllFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={viewAllFilters.status}
                onChange={(e) => setViewAllFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Dispensed">Dispensed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select
                value={viewAllFilters.dateRange}
                onChange={(e) => setViewAllFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>

          {/* Prescriptions List */}
          <div className="max-h-96 overflow-y-auto">
            <div className="space-y-3">
              {prescriptions
                .filter(p => {
                  if (viewAllFilters.status !== 'all' && p.status !== viewAllFilters.status) return false;
                  if (viewAllFilters.search && !p.patient_name.toLowerCase().includes(viewAllFilters.search.toLowerCase()) && !p.prescription_id.toLowerCase().includes(viewAllFilters.search.toLowerCase())) return false;
                  return true;
                })
                .map((prescription) => (
                <div key={prescription.prescription_id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {prescription.prescription_id} - {prescription.patient_name}
                      </h4>
                      <p className="text-sm text-gray-600">Date: {prescription.date}</p>
                      {prescription.dispense_id && (
                        <p className="text-sm text-green-600">Dispense: {prescription.dispense_id}</p>
                      )}
                    </div>
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      prescription.status === 'Pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {prescription.status}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm text-gray-600">
                      Medicines: {prescription.medicines.join(', ')}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setActiveModal('details');
                        setSelectedPrescription(prescription);
                      }}
                    >
                      View
                    </Button>
                    {prescription.status === 'Pending' && (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => {
                            setActiveModal('fulfill');
                            setSelectedPrescription(prescription);
                          }}
                        >
                          Fulfill
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setActiveModal('dispense');
                            setSelectedPrescription(prescription);
                          }}
                        >
                          Upload
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={closeModal}>Close</Button>
          </div>
        </div>
      </Modal>

      {/* Prescription Details Modal */}
      <Modal
        isOpen={activeModal === 'details'}
        onClose={closeModal}
        title="Prescription Details"
        size="lg"
      >
        {selectedPrescription && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-blue-900 text-lg">
                    {selectedPrescription.prescription_id}
                  </h4>
                  <p className="text-blue-800">Patient: {selectedPrescription.patient_name}</p>
                  <p className="text-blue-800">Date: {selectedPrescription.date}</p>
                </div>
                <span className={`px-3 py-1 text-sm rounded-full ${
                  selectedPrescription.status === 'Pending' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {selectedPrescription.status}
                </span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-gray-900 mb-3">Patient Information</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Patient ID:</span>
                    <span className="font-medium">{selectedPrescription.patient_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{selectedPrescription.patient_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prescription Date:</span>
                    <span className="font-medium">{selectedPrescription.date}</span>
                  </div>
                  {selectedPrescription.doctor && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Prescribed by:</span>
                      <span className="font-medium">{selectedPrescription.doctor}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 mb-3">Status Information</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Status:</span>
                    <span className="font-medium">{selectedPrescription.status}</span>
                  </div>
                  {selectedPrescription.priority && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Priority:</span>
                      <span className="font-medium">{selectedPrescription.priority}</span>
                    </div>
                  )}
                  {selectedPrescription.dispense_id && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dispense ID:</span>
                      <span className="font-medium text-green-600">{selectedPrescription.dispense_id}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Medicines */}
            <div>
              <h5 className="font-medium text-gray-900 mb-3">Prescribed Medicines</h5>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="space-y-2">
                  {selectedPrescription.medicines.map((medicine, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span className="text-gray-800">{medicine}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Notes */}
            {selectedPrescription.notes && (
              <div>
                <h5 className="font-medium text-gray-900 mb-3">Notes</h5>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-800">{selectedPrescription.notes}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              {selectedPrescription.status === 'Pending' && (
                <>
                  <Button 
                    onClick={() => {
                      setActiveModal('fulfill');
                    }}
                    className="flex-1"
                  >
                    Mark as Fulfilled
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setActiveModal('dispense');
                    }}
                    className="flex-1"
                  >
                    Upload Dispense Details
                  </Button>
                </>
              )}
              <Button 
                variant="outline" 
                onClick={closeModal}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};