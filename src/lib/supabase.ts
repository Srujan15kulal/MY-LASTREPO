import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const auth = {
  async signUp(email: string, password: string, userData: { full_name: string; role: string }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    
    if (error) throw error;
    
    // Create profile after successful signup
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          auth_uid: data.user.id,
          role: userData.role,
          full_name: userData.full_name,
          email: email
        }]);
      
      if (profileError) throw profileError;
    }
    
    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  async getUserProfile() {
    const user = await this.getCurrentUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('auth_uid', user.id)
      .single();

    if (error) throw error;
    return data;
  }
};

// Database helpers
export const db = {
  // Patient operations
  async createPatient(patientData: {
    profile_id?: string;
    hospital_id?: string;
    display_name: string;
    phone?: string;
    dob?: string;
    gender?: string;
  }) {
    const { data, error } = await supabase
      .from('patients')
      .insert([patientData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getPatients() {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Appointment operations
  async createAppointment(appointmentData: {
    patient_id: string;
    doctor_profile_id: string;
    receptionist_profile_id?: string;
    scheduled_at: string;
    problem_summary?: string;
  }) {
    const { data, error } = await supabase
      .from('appointments')
      .insert([appointmentData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAppointments(doctorProfileId?: string) {
    let query = supabase
      .from('appointments')
      .select(`
        *,
        patients (display_name, phone, dob, gender),
        profiles!appointments_doctor_profile_id_fkey (full_name)
      `)
      .order('scheduled_at', { ascending: true });

    if (doctorProfileId) {
      query = query.eq('doctor_profile_id', doctorProfileId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Lab request operations
  async createLabRequest(labRequestData: {
    patient_id: string;
    requested_by: string;
    tests: any;
    appointment_id?: string;
  }) {
    const { data, error } = await supabase
      .from('lab_requests')
      .insert([labRequestData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getLabRequests(status?: string) {
    let query = supabase
      .from('lab_requests')
      .select(`
        *,
        patients (display_name, phone),
        profiles!lab_requests_requested_by_fkey (full_name)
      `)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Prescription operations
  async createPrescription(prescriptionData: {
    patient_id: string;
    doctor_profile_id: string;
    appointment_id?: string;
    content: any;
  }) {
    const { data, error } = await supabase
      .from('prescriptions')
      .insert([prescriptionData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getPrescriptions(patientId?: string) {
    let query = supabase
      .from('prescriptions')
      .select(`
        *,
        patients (display_name, phone),
        profiles!prescriptions_doctor_profile_id_fkey (full_name)
      `)
      .order('created_at', { ascending: false });

    if (patientId) {
      query = query.eq('patient_id', patientId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Medication operations
  async addMedication(medicationData: {
    patient_id: string;
    prescribed_by: string;
    name: string;
    dose?: string;
    frequency?: string;
    start_date?: string;
    end_date?: string;
    notes?: string;
  }) {
    const { data, error } = await supabase
      .from('medications')
      .insert([medicationData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getPatientMedications(patientId: string) {
    const { data, error } = await supabase
      .from('medications')
      .select(`
        *,
        profiles!medications_prescribed_by_fkey (full_name)
      `)
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Allergy operations
  async addAllergy(allergyData: {
    patient_id: string;
    allergen: string;
    reaction?: string;
    severity?: string;
    added_by: string;
  }) {
    const { data, error } = await supabase
      .from('allergies')
      .insert([allergyData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getPatientAllergies(patientId: string) {
    const { data, error } = await supabase
      .from('allergies')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};

// File storage helpers
export const storage = {
  async uploadLabReport(file: File, patientId: string) {
    const fileName = `${patientId}/${Date.now()}-${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('lab-reports')
      .upload(fileName, file);

    if (error) throw error;
    return data;
  },

  async getLabReportUrl(filePath: string) {
    const { data } = supabase.storage
      .from('lab-reports')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  async uploadPrescriptionDocument(file: File, prescriptionId: string) {
    const fileName = `${prescriptionId}/${Date.now()}-${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('prescriptions')
      .upload(fileName, file);

    if (error) throw error;
    return data;
  }
};