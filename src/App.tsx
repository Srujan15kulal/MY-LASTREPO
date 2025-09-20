import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import { UnifiedLoginForm } from './components/Auth/UnifiedLoginForm';
import { DoctorDashboard } from './components/Doctor/DoctorDashboard';
import { DoctorProfile } from './components/Doctor/DoctorProfile';
import { PatientDetail } from './components/Doctor/PatientDetail';
import { PatientDashboard } from './components/Patient/PatientDashboard';
import { PatientHistory } from './components/Patient/PatientHistory';
import { PatientReports } from './components/Patient/PatientReports';
import { PatientAllergies } from './components/Patient/PatientAllergies';
import { PatientProfile } from './components/Patient/PatientProfile';
import { HospitalDashboard } from './components/Hospital/HospitalDashboard';
import { PatientRegistration } from './components/Hospital/PatientRegistration';
import { StaffManagement } from './components/Hospital/StaffManagement';
import { AddDoctor } from './components/Hospital/AddDoctor';
import { AddStaff } from './components/Hospital/AddStaff';
import { AppointmentManagement } from './components/Hospital/AppointmentManagement';
import { BillingManagement } from './components/Hospital/BillingManagement';
import { ViewAllBilling } from './components/Hospital/ViewAllBilling';
import { ScheduleAppointment } from './components/Hospital/ScheduleAppointment';
import { PharmacyDashboard } from './components/Pharmacy/PharmacyDashboard';
import { LabDashboard } from './components/Lab/LabDashboard';
import { BillingPage } from './components/Billing/BillingPage';
import { ReportImageViewer } from './components/Common/ReportImageViewer';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles: string[] }> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Home Route */}
      <Route path="/" element={<UnifiedLoginForm />} />
      
      {/* Doctor Routes */}
      <Route 
        path="/doctor/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/doctor/profile" 
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorProfile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/doctor/patient/:patientId" 
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <PatientDetail />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/report/:reportId" 
        element={
          <ProtectedRoute allowedRoles={['doctor', 'patient']}>
            <ReportImageViewer />
          </ProtectedRoute>
        } 
      />
      
      {/* Patient Routes */}
      <Route 
        path="/patient/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <PatientDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/patient/history" 
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <PatientHistory />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/patient/reports" 
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <PatientReports />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/patient/allergies" 
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <PatientAllergies />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/patient/profile" 
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <PatientProfile />
          </ProtectedRoute>
        } 
      />
      
      {/* Hospital Routes */}
      <Route 
        path="/hospital/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['hospital']}>
            <HospitalDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/registration" 
        element={
          <ProtectedRoute allowedRoles={['hospital']}>
            <PatientRegistration />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/hospital/staff-management" 
        element={
          <ProtectedRoute allowedRoles={['hospital']}>
            <StaffManagement />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/hospital/add-doctor" 
        element={
          <ProtectedRoute allowedRoles={['hospital']}>
            <AddDoctor />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/hospital/add-staff" 
        element={
          <ProtectedRoute allowedRoles={['hospital']}>
            <AddStaff />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/hospital/appointments" 
        element={
          <ProtectedRoute allowedRoles={['hospital']}>
            <AppointmentManagement />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/hospital/billing" 
        element={
          <ProtectedRoute allowedRoles={['hospital']}>
            <BillingManagement />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/hospital/billing/view-all" 
        element={
          <ProtectedRoute allowedRoles={['hospital']}>
            <ViewAllBilling />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/hospital/schedule-appointment" 
        element={
          <ProtectedRoute allowedRoles={['hospital']}>
            <ScheduleAppointment />
          </ProtectedRoute>
        } 
      />
      
      {/* Pharmacy Routes */}
      <Route 
        path="/pharmacy/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['pharmacist']}>
            <PharmacyDashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Lab Routes */}
      <Route 
        path="/lab/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['lab_technician']}>
            <LabDashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Billing Routes */}
      <Route 
        path="/billing/invoice/:invoiceId" 
        element={
          <ProtectedRoute allowedRoles={['hospital', 'patient', 'pharmacist']}>
            <BillingPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;