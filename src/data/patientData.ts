// Centralized patient data for consistency across doctor and patient portals

export const getPatientHistory = (patientId: string) => {
  return {
    medicalHistory: "Past conditions: hypertension (2019). No surgeries. Family history: diabetes.",
    prescriptions: [
      {
        medicine: 'Paracetamol 500mg',
        quantity: '10 tablets',
        prescribedBy: 'Dr. Sharma',
        dateTime: '15/09/2025 10:30 AM'
      },
      {
        medicine: 'Amoxicillin 250mg',
        quantity: '6 tablets',
        prescribedBy: 'Dr. Reddy',
        dateTime: '12/09/2025 03:15 PM'
      },
      {
        medicine: 'Ibuprofen 400mg',
        quantity: '8 tablets',
        prescribedBy: 'Dr. Patel',
        dateTime: '08/09/2025 11:00 AM'
      },
      {
        medicine: 'Cetirizine 10mg',
        quantity: '5 tablets',
        prescribedBy: 'Dr. Mehta',
        dateTime: '05/09/2025 02:00 PM'
      },
      {
        medicine: 'Vitamin D3',
        quantity: '20 tablets',
        prescribedBy: 'Dr. Khan',
        dateTime: '01/09/2025 09:45 AM'
      }
    ]
  };
};

export const getPatientReports = (patientId: string) => {
  return [
    {
      name: 'Chest X-Ray',
      date: '20/08/2025',
      uploadedBy: 'Lab Technician – Mr. Rao',
      status: 'Available',
      imageUrl: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      reportId: 'chest-xray'
    },
    {
      name: 'CBC',
      date: '01/09/2025',
      uploadedBy: 'Lab Technician – Ms. Priya',
      status: 'Available',
      imageUrl: 'https://images.pexels.com/photos/7089020/pexels-photo-7089020.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      reportId: 'cbc'
    },
    {
      name: 'Blood Test Report',
      date: '14/09/2025',
      uploadedBy: 'Lab Technician – Mr. Kumar',
      status: 'Available',
      imageUrl: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      reportId: 'blood-test'
    }
  ];
};

export const getPatientMedications = (patientId: string) => {
  return [
    {
      id: 'med-001',
      patient_id: patientId,
      medicine_name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      prescribed_by: 'Dr. A. Sharma',
      start_date: '2023-01-15',
      end_date: null,
      created_at: '2023-01-15T10:00:00Z'
    },
    {
      id: 'med-002',
      patient_id: patientId,
      medicine_name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      prescribed_by: 'Dr. R. Kumar',
      start_date: '2023-03-20',
      end_date: null,
      created_at: '2023-03-20T14:30:00Z'
    },
    {
      id: 'med-003',
      patient_id: patientId,
      medicine_name: 'Atorvastatin',
      dosage: '20mg',
      frequency: 'Once daily (evening)',
      prescribed_by: 'Dr. P. Patel',
      start_date: '2023-06-10',
      end_date: '2024-06-10',
      created_at: '2023-06-10T09:15:00Z'
    },
    {
      id: 'med-004',
      patient_id: patientId,
      medicine_name: 'Vitamin D3',
      dosage: '1000 IU',
      frequency: 'Once daily',
      prescribed_by: 'Dr. S. Mehta',
      start_date: '2024-01-05',
      end_date: null,
      created_at: '2024-01-05T11:45:00Z'
    }
  ];
};

export const getPatientAllergies = (patientId: string) => {
  return [
    {
      name: 'Peanuts',
      severity: 'High',
      description: 'Severe allergic reaction to peanuts and peanut products'
    },
    {
      name: 'Penicillin',
      severity: 'High',
      description: 'Severe allergic reaction to penicillin-based antibiotics'
    },
    {
      name: 'Dust',
      severity: 'Medium',
      description: 'Allergic reaction to dust mites and particles'
    },
    {
      name: 'Pollen',
      severity: 'Low',
      description: 'Seasonal allergic rhinitis from tree and grass pollen'
    }
  ];
};