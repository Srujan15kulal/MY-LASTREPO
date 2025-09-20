import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Layout/Header';
import { Card } from '../Common/Card';
import { Button } from '../Common/Button';
import { FormField } from '../Common/FormField';
import { UserPlus, Upload } from 'lucide-react';

export const AddStaff: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    qualification: '',
    experience: '',
    address: '',
    emergency_contact: '',
    emergency_phone: '',
    salary: '',
    joining_date: '',
    working_hours_start: '09:00',
    working_hours_end: '17:00',
    working_days: [] as string[],
    shift: 'Day'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleWorkingDaysChange = (day: string) => {
    setFormData(prev => ({
      ...prev,
      working_days: prev.working_days.includes(day)
        ? prev.working_days.filter(d => d !== day)
        : [...prev.working_days, day]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const staffId = `S-${Math.floor(Math.random() * 9000) + 1000}`;
    alert(`Staff member added successfully!\nStaff ID: ${staffId}\nName: ${formData.name}`);
    navigate('/hospital/staff-management');
  };

  const roles = ['Nurse', 'Receptionist', 'Lab Technician', 'Pharmacist', 'Cleaner', 'Security', 'Administrator'];
  const departments = ['General', 'Emergency', 'ICU', 'Pharmacy', 'Laboratory', 'Administration', 'Maintenance'];
  const shifts = ['Day', 'Night', 'Rotating'];
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="min-h-screen bg-white">
      <Header title="Add New Staff" showBackButton />
      
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <UserPlus size={24} className="text-black" />
            <h2 className="text-xl font-semibold text-black">Staff Registration Form</h2>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-black mb-4 border-b border-gray-200 pb-2">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Full Name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                
                <FormField
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="john.doe@hospital.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                
                <FormField
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  placeholder="+91 98XXXXXXXX"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
                
                <FormField
                  label="Role"
                  name="role"
                  type="select"
                  value={formData.role}
                  onChange={handleInputChange}
                  options={roles}
                  required
                />
              </div>
              
              <FormField
                label="Address"
                name="address"
                type="textarea"
                placeholder="Complete address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Professional Information */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-black mb-4 border-b border-gray-200 pb-2">Professional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  label="Qualification"
                  name="qualification"
                  type="text"
                  placeholder="Relevant qualification"
                  value={formData.qualification}
                  onChange={handleInputChange}
                  required
                />
                
                <FormField
                  label="Years of Experience"
                  name="experience"
                  type="number"
                  placeholder="2"
                  value={formData.experience}
                  onChange={handleInputChange}
                  required
                />
                
                <FormField
                  label="Shift"
                  name="shift"
                  type="select"
                  value={formData.shift}
                  onChange={handleInputChange}
                  options={shifts}
                  required
                />
              </div>
            </div>

            {/* Working Schedule */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-black mb-4 border-b border-gray-200 pb-2">Working Schedule</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <FormField
                  label="Working Hours - Start"
                  name="working_hours_start"
                  type="time"
                  value={formData.working_hours_start}
                  onChange={handleInputChange}
                  required
                />
                
                <FormField
                  label="Working Hours - End"
                  name="working_hours_end"
                  type="time"
                  value={formData.working_hours_end}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Working Days <span className="text-black">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {weekDays.map((day) => (
                    <label key={day} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.working_days.includes(day)}
                        onChange={() => handleWorkingDaysChange(day)}
                        className="mr-2"
                      />
                      <span className="text-sm">{day}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Emergency Contact & Employment */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-black mb-4 border-b border-gray-200 pb-2">Emergency Contact & Employment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Emergency Contact Name"
                  name="emergency_contact"
                  type="text"
                  placeholder="Contact person name"
                  value={formData.emergency_contact}
                  onChange={handleInputChange}
                  required
                />
                
                <FormField
                  label="Emergency Contact Phone"
                  name="emergency_phone"
                  type="tel"
                  placeholder="+91 98XXXXXXXX"
                  value={formData.emergency_phone}
                  onChange={handleInputChange}
                  required
                />
                
                <FormField
                  label="Monthly Salary"
                  name="salary"
                  type="number"
                  placeholder="25000"
                  value={formData.salary}
                  onChange={handleInputChange}
                  required
                />
                
                <FormField
                  label="Joining Date"
                  name="joining_date"
                  type="date"
                  value={formData.joining_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Document Upload */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-black mb-4 border-b border-gray-200 pb-2">Document Upload</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Resume/CV</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload size={24} className="text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Upload resume</p>
                    <Button variant="outline" size="sm" className="mt-2">Browse Files</Button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload size={24} className="text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Upload profile photo</p>
                    <Button variant="outline" size="sm" className="mt-2">Browse Files</Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                Add Staff Member
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/hospital/staff-management')}
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