import { Doctor, Patient, Appointment, Invoice, Prescription, TestRequest } from '../types';

export const mockDoctors: Doctor[] = [
  {
    doctor_id: 'D-501', 
    name: 'Dr. Ramesh',
    qualification: 'MD, Dermatology',
    department: 'Dermatology',
    contact_number: '9999999999',
    photo_url: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop'
  },
  {
    doctor_id: 'D-502',
    name: 'Dr. Rajesh Kumar',
    qualification: 'MBBS, MD (Neurology)',
    department: 'Neurology',
    contact_number: '+91 9876501235',
    photo_url: 'https://images.pexels.com/photos/582750/pexels-photo-582750.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop'
  }
];

export const mockPatients: Patient[] = [
  {
    patient_id: 'P-1001',
    name: 'Ravi Kumar',
    age: 28,
    gender: 'Male',
    phone_number: '+91 9876543210',
    aadhar_number: '1234-5678-9012',
    problem_description: 'Severe headache and dizziness for 3 days',
    assigned_doctor: 'Dr. Anita Sharma'
  },
  {
    patient_id: 'P-1002',
    name: 'Meena R.',
    age: 42,
    gender: 'Female',
    phone_number: '+91 9876543211',
    aadhar_number: '1234-5678-9013',
    problem_description: 'Persistent skin rash',
    assigned_doctor: 'Dr. Anita Sharma'
  }
];

export const mockAppointments: Appointment[] = [
  {
    appointment_id: 'A-2001',
    time: '09:00 AM',
    patient_name: 'Ravi Kumar',
    patient_id: 'P-1001',
    age: 28,
    reason: 'Headache',
    status: 'scheduled'
  },
  {
    appointment_id: 'A-2002',
    time: '09:30 AM',
    patient_name: 'Meena R.',
    patient_id: 'P-1002',
    age: 42,
    reason: 'Skin rash',
    status: 'scheduled'
  },
  {
    appointment_id: 'A-2003',
    time: '10:00 AM',
    patient_name: 'Arjun P.',
    patient_id: 'P-1003',
    age: 55,
    reason: 'Follow-up',
    status: 'scheduled'
  }
];

export const mockInvoices: Invoice[] = [
  {
    invoice_id: 'INV-3001',
    patient_id: 'P-1001',
    patient_name: 'Ravi Kumar',
    items: [
      { description: 'Consultation - Dermatology', amount: 500 },
      { description: 'CBC Test', amount: 400 },
      { description: 'Medicine Dispense', amount: 300 }
    ],
    total_amount: 1200,
    payment_status: 'Unpaid',
    due_date: '2025-09-25'
  }
];

export const mockPrescriptions: Prescription[] = [
  {
    prescription_id: 'RX-2001',
    patient_id: 'P-1001',
    patient_name: 'Ravi Kumar',
    medicines: ['Paracetamol 500mg - 1 tab 8hr', 'Ibuprofen 200mg - 1 tab 12hr'],
    status: 'Pending',
    date: '2025-09-10'
  }
];

export const mockTestRequests: TestRequest[] = [
  {
    request_id: 'LR-4001',
    patient_id: 'P-1001',
    patient_name: 'Ravi Kumar',
    test_type: 'CBC',
    status: 'Sample Collected',
    date: '2025-09-15'
  }
];