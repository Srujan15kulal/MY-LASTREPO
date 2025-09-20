// API utility functions with mock implementations

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface FulfillPayload {
  fulfilled_by: string;
  fulfilled_date: string;
  notes?: string;
}

export interface DispenseItem {
  medicine_id: string;
  medicine_name: string;
  dispensed_qty: number;
  batch_no: string;
  expiry_date: string;
}

// Mock API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API responses
export const prescriptionApi = {
  async fulfill(prescriptionId: string, payload: FulfillPayload): Promise<ApiResponse> {
    await delay(1000);
    
    // Simulate random failures (10% chance)
    if (Math.random() < 0.1) {
      throw new Error('Network error: Failed to fulfill prescription');
    }
    
    // Update localStorage
    const stored = localStorage.getItem('prescriptions');
    const prescriptions = stored ? JSON.parse(stored) : [];
    const updated = prescriptions.map((p: any) => 
      p.prescription_id === prescriptionId 
        ? { 
            ...p, 
            status: 'Dispensed',
            fulfilled_by: payload.fulfilled_by,
            fulfilled_date: payload.fulfilled_date,
            fulfilled_notes: payload.notes
          }
        : p
    );
    localStorage.setItem('prescriptions', JSON.stringify(updated));
    
    return {
      success: true,
      data: {
        prescription: updated.find((p: any) => p.prescription_id === prescriptionId)
      },
      message: 'Prescription fulfilled successfully'
    };
  },

  async uploadDispenseDetails(prescriptionId: string, formData: FormData): Promise<ApiResponse> {
    await delay(1500);
    
    // Simulate random failures (5% chance)
    if (Math.random() < 0.05) {
      throw new Error('Upload failed: Server error');
    }
    
    const dispenseId = `D-${Math.floor(Math.random() * 9000) + 1000}`;
    
    // Parse form data (in real implementation, this would be handled by the server)
    const dispenseItems = JSON.parse(formData.get('dispense_items') as string || '[]');
    
    // Update localStorage
    const stored = localStorage.getItem('prescriptions');
    const prescriptions = stored ? JSON.parse(stored) : [];
    const updated = prescriptions.map((p: any) => 
      p.prescription_id === prescriptionId 
        ? { 
            ...p, 
            status: 'Dispensed',
            dispense_id: dispenseId,
            dispense_items: dispenseItems,
            dispense_uploaded_at: new Date().toISOString()
          }
        : p
    );
    localStorage.setItem('prescriptions', JSON.stringify(updated));
    
    return {
      success: true,
      data: {
        prescription: updated.find((p: any) => p.prescription_id === prescriptionId),
        dispense_id: dispenseId
      },
      message: 'Dispense details uploaded successfully'
    };
  },

  async getAll(filters?: {
    status?: string;
    search?: string;
    dateRange?: string;
  }): Promise<ApiResponse> {
    await delay(500);
    
    const stored = localStorage.getItem('prescriptions');
    let prescriptions = stored ? JSON.parse(stored) : [];
    
    // Apply filters
    if (filters?.status && filters.status !== 'all') {
      prescriptions = prescriptions.filter((p: any) => p.status === filters.status);
    }
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      prescriptions = prescriptions.filter((p: any) => 
        p.patient_name.toLowerCase().includes(search) ||
        p.prescription_id.toLowerCase().includes(search)
      );
    }
    
    // Date range filtering would be implemented here
    
    return {
      success: true,
      data: {
        prescriptions,
        total: prescriptions.length,
        filtered: prescriptions.length
      }
    };
  },

  async getById(prescriptionId: string): Promise<ApiResponse> {
    await delay(300);
    
    const stored = localStorage.getItem('prescriptions');
    const prescriptions = stored ? JSON.parse(stored) : [];
    const prescription = prescriptions.find((p: any) => p.prescription_id === prescriptionId);
    
    if (!prescription) {
      throw new Error('Prescription not found');
    }
    
    return {
      success: true,
      data: { prescription }
    };
  }
};

// File validation utilities
export const fileValidation = {
  validateImage(file: File): { valid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    
    if (file.size > maxSize) {
      return { valid: false, error: `${file.name} is too large (max 5MB)` };
    }
    
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: `${file.name} is not a valid image format` };
    }
    
    return { valid: true };
  },

  validatePDF(file: File): { valid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (file.size > maxSize) {
      return { valid: false, error: `${file.name} is too large (max 10MB)` };
    }
    
    if (file.type !== 'application/pdf') {
      return { valid: false, error: `${file.name} is not a PDF file` };
    }
    
    return { valid: true };
  },

  validateFiles(files: File[], type: 'images' | 'documents'): { valid: File[]; errors: string[] } {
    const valid: File[] = [];
    const errors: string[] = [];
    
    for (const file of files) {
      const validation = type === 'images' 
        ? this.validateImage(file)
        : this.validatePDF(file);
      
      if (validation.valid) {
        valid.push(file);
      } else if (validation.error) {
        errors.push(validation.error);
      }
    }
    
    return { valid, errors };
  }
};