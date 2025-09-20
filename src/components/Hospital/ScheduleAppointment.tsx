import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Layout/Header';
import { Card } from '../Common/Card';
import { Button } from '../Common/Button';
import { FormField } from '../Common/FormField';
import { Calendar, Clock, User, Stethoscope } from 'lucide-react';

export const ScheduleAppointment: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patientName: '',
    patientId: '',
    patientPhone: '',
    patientAge: '',
    patientGender: '',
    appointmentDate: '',
    appointmentTime: '',
    doctor: '',
    department: '',
    appointmentType: 'Regular',
    reason: '',
    priority: 'Normal',
    notes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const appointmentId = `A-${Math.floor(Math.random() * 9000) + 2000}`;
    alert(`Appointment scheduled successfully!\nAppointment ID: ${appointmentId}\nPatient: ${formData.patientName}\nDate: ${formData.appointmentDate} at ${formData.appointmentTime}`);
    navigate('/hospital/appointments');
  };

  const doctors = [
    'Dr. Anita Sharma - Dermatology',
    'Dr. Rajesh Kumar - Neurology', 
    'Dr. Priya Patel - Cardiology',
    'Dr. Amit Singh - General Medicine',
    'Dr. Sunita Rao - Pediatrics',
    'Dr. Vikram Mehta - Orthopedics'
  ];

  const departments = ['Dermatology', 'Neurology', 'Cardiology', 'General Medicine', 'Pediatrics', 'Orthopedics', 'Emergency'];
  const appointmentTypes = ['Regular', 'Emergency', 'Follow-up', 'Consultation'];
  const priorities = ['Normal', 'High', 'Urgent'];
  const genders = ['Male', 'Female', 'Other'];

  // Generate time slots from 9 AM to 5 PM
  const timeSlots = [];
  for (let hour = 9; hour <= 17; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const displayTime = new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      timeSlots.push({ value: time, display: displayTime });
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header title="Schedule New Appointment" showBackButton />
      
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <Calendar size={24} className="text-black" />
            <h2 className="text-xl font-semibold text-black">New Appointment Details</h2>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* Patient Information */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-black mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
                <User size={20} />
                Patient Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Patient Name"
                  name="patientName"
                  type="text"
                  placeholder="Enter patient full name"
                  value={formData.patientName}
                  onChange={handleInputChange}
                  required
                />
                
                <FormField
                  label="Patient ID (if existing)"
                  name="patientId"
                  type="text"
                  placeholder="P-1001 (optional)"
                  value={formData.patientId}
                  onChange={handleInputChange}
                />
                
                <FormField
                  label="Phone Number"
                  name="patientPhone"
                  type="tel"
                  placeholder="+91 98XXXXXXXX"
                  value={formData.patientPhone}
                  onChange={handleInputChange}
                  required
                />
                
                <FormField
                  label="Age"
                  name="patientAge"
                  type="number"
                  placeholder="25"
                  value={formData.patientAge}
                  onChange={handleInputChange}
                  required
                />
                
                <FormField
                  label="Gender"
                  name="patientGender"
                  type="select"
                  value={formData.patientGender}
                  onChange={handleInputChange}
                  options={genders}
                  required
                />
              </div>
            </div>

            {/* Appointment Details */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-black mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
                <Calendar size={20} />
                Appointment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Appointment Date"
                  name="appointmentDate"
                  type="date"
                  value={formData.appointmentDate}
                  onChange={handleInputChange}
                  required
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Appointment Time <span className="text-black">*</span>
                  </label>
                  <select
                    name="appointmentTime"
                    value={formData.appointmentTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  >
                    <option value="">Select Time</option>
                    {timeSlots.map((slot) => (
                      <option key={slot.value} value={slot.value}>
                        {slot.display}
                      </option>
                    ))}
                  </select>
                </div>
                
                <FormField
                  label="Department"
                  name="department"
                  type="select"
                  value={formData.department}
                  onChange={handleInputChange}
                  options={departments}
                  required
                />
                
                <FormField
                  label="Assign Doctor"
                  name="doctor"
                  type="select"
                  value={formData.doctor}
                  onChange={handleInputChange}
                  options={doctors}
                  required
                />
                
                <FormField
                  label="Appointment Type"
                  name="appointmentType"
                  type="select"
                  value={formData.appointmentType}
                  onChange={handleInputChange}
                  options={appointmentTypes}
                  required
                />
                
                <FormField
                  label="Priority"
                  name="priority"
                  type="select"
                  value={formData.priority}
                  onChange={handleInputChange}
                  options={priorities}
                  required
                />
              </div>
            </div>

            {/* Medical Information */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-black mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
                <Stethoscope size={20} />
                Medical Information
              </h3>
              <div className="space-y-4">
                <FormField
                  label="Reason for Visit"
                  name="reason"
                  type="textarea"
                  placeholder="Describe the patient's symptoms or reason for appointment"
                  value={formData.reason}
                  onChange={handleInputChange}
                  required
                />
                
                <FormField
                  label="Additional Notes"
                  name="notes"
                  type="textarea"
                  placeholder="Any additional information or special instructions"
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Appointment Summary */}
            <div className="mb-8 p-4 bg-gray-50 border border-gray-200">
              <h3 className="text-lg font-medium text-black mb-3">Appointment Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Patient:</span>
                  <span className="ml-2 text-gray-900">{formData.patientName || 'Not specified'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Date & Time:</span>
                  <span className="ml-2 text-gray-900">
                    {formData.appointmentDate && formData.appointmentTime 
                      ? `${formData.appointmentDate} at ${timeSlots.find(slot => slot.value === formData.appointmentTime)?.display || formData.appointmentTime}`
                      : 'Not specified'
                    }
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Doctor:</span>
                  <span className="ml-2 text-gray-900">{formData.doctor || 'Not assigned'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Department:</span>
                  <span className="ml-2 text-gray-900">{formData.department || 'Not specified'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Type:</span>
                  <span className="ml-2 text-gray-900">{formData.appointmentType}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Priority:</span>
                  <span className="ml-2 text-gray-900">{formData.priority}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                <Calendar size={16} className="mr-2" />
                Schedule Appointment
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/hospital/appointments')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};