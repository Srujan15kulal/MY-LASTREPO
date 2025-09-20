import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Layout/Header';
import { Card } from '../Common/Card';
import { Button } from '../Common/Button';
import { Calendar, Clock, User, Filter, Search, Plus, ArrowLeft } from 'lucide-react';

interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No Show';
  reason: string;
  type: 'Regular' | 'Emergency' | 'Follow-up';
}

export const AppointmentManagement: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduleFormData, setScheduleFormData] = useState({
    patientName: 'Rahul Verma',
    doctor: 'Dr. Mehta - Cardiology',
    department: 'Cardiology',
    date: '2025-09-25',
    time: '10:45 AM'
  });

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 'A-2001',
      patientName: 'Arjun P.',
      patientId: 'P-1003',
      doctorName: 'Dr. Mehta',
      department: 'Cardiology',
      date: '2025-09-20',
      time: '09:30 AM',
      status: 'Scheduled',
      reason: 'Follow-up Checkup',
      type: 'Follow-up'
    },
    {
      id: 'A-2002',
      patientName: 'Ravi Kumar',
      patientId: 'P-1001',
      doctorName: 'Dr. Iyer', 
      department: 'Neurology',
      date: '2025-09-20',
      time: '11:00 AM',
      status: 'Scheduled',
      reason: 'Migraine Evaluation',
      type: 'Regular'
    },
    {
      id: 'A-2003',
      patientName: 'Priya S.',
      patientId: 'P-1004',
      doctorName: 'Dr. Sharma',
      department: 'Dermatology',
      date: '2025-09-20',
      time: '01:15 PM',
      status: 'Scheduled',
      reason: 'Skin Allergy',
      type: 'Regular'
    }
  ]);

  const filteredAppointments = appointments.filter(appointment => {
    const matchesDate = appointment.date === selectedDate;
    const matchesDepartment = !filterDepartment || appointment.department === filterDepartment;
    const matchesStatus = !filterStatus || appointment.status === filterStatus;
    const matchesSearch = !searchTerm || 
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesDate && matchesDepartment && matchesStatus && matchesSearch;
  });

  const handleStatusChange = (appointmentId: string, newStatus: string) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointmentId 
        ? { ...apt, status: newStatus as Appointment['status'] }
        : apt
    ));
  };

  const handleScheduleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setScheduleFormData({
      ...scheduleFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleConfirmAppointment = () => {
    // Add confirmation animation logic here
    alert(`Appointment confirmed!\nPatient: ${scheduleFormData.patientName}\nDoctor: ${scheduleFormData.doctor}\nDate: ${scheduleFormData.date} at ${scheduleFormData.time}`);
    setShowScheduleForm(false);
  };

  const handleCancelSchedule = () => {
    setShowScheduleForm(false);
  };

  const departments = ['Dermatology', 'Neurology', 'Cardiology', 'Orthopedics', 'Pediatrics'];
  const statuses = ['Scheduled', 'Completed', 'Cancelled', 'No Show'];
  const doctorOptions = ['Dr. Mehta - Cardiology', 'Dr. Iyer - Neurology', 'Dr. Sharma - Dermatology'];
  const departmentOptions = ['Cardiology', 'Neurology', 'Dermatology'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'No Show': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Emergency': return 'bg-red-100 text-red-800';
      case 'Follow-up': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  // Schedule New Appointment Form
  if (showScheduleForm) {
    return (
      <div className="min-h-screen bg-white">
        <Header title="Schedule New Appointment" showBackButton />
        
        <div className="max-w-4xl mx-auto p-6">
          <Card>
            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={() => setShowScheduleForm(false)}
                className="p-2 hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft size={20} className="text-black" />
              </button>
              <h2 className="text-xl font-semibold text-black">Schedule New Appointment</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                <input
                  type="text"
                  name="patientName"
                  value={scheduleFormData.patientName}
                  onChange={handleScheduleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                <select
                  name="doctor"
                  value={scheduleFormData.doctor}
                  onChange={handleScheduleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  {doctorOptions.map(doctor => (
                    <option key={doctor} value={doctor}>{doctor}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  name="department"
                  value={scheduleFormData.department}
                  onChange={handleScheduleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  {departmentOptions.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={scheduleFormData.date}
                  onChange={handleScheduleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="text"
                  name="time"
                  value={scheduleFormData.time}
                  onChange={handleScheduleFormChange}
                  placeholder="10:45 AM"
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
              
              <div className="flex gap-4 pt-6">
                <Button 
                  onClick={handleConfirmAppointment}
                  className="flex-1 bg-black text-white hover:bg-gray-800 transform hover:scale-105 active:scale-95 transition-transform"
                >
                  Confirm
                </Button>
                <Button 
                  onClick={handleCancelSchedule}
                  variant="cancel"
                  className="flex-1 bg-black text-white hover:bg-gray-800"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header title="Appointment Management" showBackButton />
      
      <div className="max-w-6xl mx-auto p-6">
        {/* Summary Cards - Moved to Top */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="text-center" padding="sm">
            <h3 className="text-2xl font-bold text-black">{appointments.length}</h3>
            <p className="text-gray-600">Total Today</p>
          </Card>
          <Card className="text-center" padding="sm">
            <h3 className="text-2xl font-bold text-blue-600">
              {appointments.filter(a => a.status === 'Scheduled').length}
            </h3>
            <p className="text-gray-600">Scheduled</p>
          </Card>
          <Card className="text-center" padding="sm">
            <h3 className="text-2xl font-bold text-green-600">
              {appointments.filter(a => a.status === 'Completed').length}
            </h3>
            <p className="text-gray-600">Completed</p>
          </Card>
          <Card className="text-center" padding="sm">
            <h3 className="text-2xl font-bold text-red-600">
              {appointments.filter(a => a.status === 'Cancelled').length}
            </h3>
            <p className="text-gray-600">Cancelled</p>
          </Card>
        </div>

        {/* Appointment Scheduling Section */}
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Calendar size={24} className="text-black" />
              <h2 className="text-xl font-semibold text-black">Appointment Scheduling</h2>
            </div>
            <Button onClick={() => setShowScheduleForm(true)}>
              <Plus size={16} className="mr-2" />
              Schedule New
            </Button>
          </div>
          
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-500" />
                    <span className="font-medium">{appointment.time}</span>
                  </div>
                  <span className="text-gray-600">–</span>
                  <span className="font-medium">Patient: {appointment.patientName}</span>
                  <span className="text-gray-600">–</span>
                  <span className="font-medium">Doctor: {appointment.doctorName}</span>
                  <span className="text-gray-600">–</span>
                  <span className="text-blue-600 font-medium">{appointment.department}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Header */}
        <Card className="mb-6">
          <h3 className="text-lg font-semibold text-black mb-4">Manage All Appointments</h3>
        </Card>

        {/* Filters */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <Search size={16} className="absolute left-3 top-9 text-gray-400" />
              <input
                type="text"
                placeholder="Patient or Doctor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <option value="">All Status</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" onClick={() => {
                setFilterDepartment('');
                setFilterStatus('');
                setSearchTerm('');
              }}>
                Clear Filters
              </Button>
            </div>
          </div>
        </Card>

        {/* Appointments List */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Time</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Patient</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Doctor</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Department</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Reason</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-500" />
                        <span className="font-medium">{appointment.time}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{appointment.patientName}</p>
                        <p className="text-sm text-gray-600">{appointment.patientId}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{appointment.doctorName}</td>
                    <td className="py-3 px-4 text-gray-700">{appointment.department}</td>
                    <td className="py-3 px-4 text-gray-700">{appointment.reason}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(appointment.type)}`}>
                        {appointment.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={appointment.status}
                        onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                        className={`px-2 py-1 text-xs rounded-full border-0 ${getStatusColor(appointment.status)}`}
                      >
                        {statuses.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm" variant="outline">Reschedule</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};