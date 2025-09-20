export interface User {
  id: string;
  role: 'doctor' | 'patient' | 'hospital' | 'pharmacist' | 'lab_technician';
  name: string;
  [key: string]: any;
}

export interface Patient {
  patient_id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone_number: string;
  aadhar_number: string;
  problem_description?: string;
  assigned_doctor?: string;
}

export interface Doctor {
  doctor_id: string;
  name: string;
  qualification: string;
  department: string;
  contact_number: string;
  photo_url: string;
}

export interface Appointment {
  appointment_id: string;
  time: string;
  patient_name: string;
  patient_id: string;
  age: number;
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface Invoice {
  invoice_id: string;
  patient_id: string;
  patient_name: string;
  items: Array<{
    description: string;
    amount: number;
  }>;
  total_amount: number;
  payment_status: 'Unpaid' | 'Paid' | 'Partial';
  due_date: string;
}

export interface Prescription {
  prescription_id: string;
  patient_id: string;
  patient_name: string;
  medicines: string[];
  status: 'Pending' | 'Dispensed';
  date: string;
}

export interface TestRequest {
  request_id: string;
  patient_id: string;
  patient_name: string;
  test_type: string;
  status: 'Requested' | 'Sample Collected' | 'In Progress' | 'Completed';
  date: string;
}