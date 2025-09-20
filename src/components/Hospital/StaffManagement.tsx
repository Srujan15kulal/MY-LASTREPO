import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Layout/Header';
import { Card } from '../Common/Card';
import { Button } from '../Common/Button';
import { FormField } from '../Common/FormField';
import { Users, UserPlus, Edit3, Trash2, Search, Filter } from 'lucide-react';

interface Staff {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
  joinDate: string;
}

export const StaffManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');

  const [staffList, setStaffList] = useState<Staff[]>([
    {
      id: 'D-501',
      name: 'Dr. Anita Sharma',
      role: 'Doctor',
      department: 'Dermatology',
      email: 'anita.sharma@hospital.com',
      phone: '+91 9876543210',
      status: 'Active',
      joinDate: '2020-01-15'
    },
    {
      id: 'D-502',
      name: 'Dr. Rajesh Kumar',
      role: 'Doctor',
      department: 'Neurology',
      email: 'rajesh.kumar@hospital.com',
      phone: '+91 9876543211',
      status: 'Active',
      joinDate: '2019-03-20'
    },
    {
      id: 'N-101',
      name: 'Priya Patel',
      role: 'Nurse',
      department: 'General',
      email: 'priya.patel@hospital.com',
      phone: '+91 9876543212',
      status: 'Active',
      joinDate: '2021-06-10'
    },
    {
      id: 'P-201',
      name: 'Amit Singh',
      role: 'Pharmacist',
      department: 'Pharmacy',
      email: 'amit.singh@hospital.com',
      phone: '+91 9876543213',
      status: 'Active',
      joinDate: '2020-11-05'
    },
    {
      id: 'L-301',
      name: 'Sunita Rao',
      role: 'Lab Technician',
      department: 'Laboratory',
      email: 'sunita.rao@hospital.com',
      phone: '+91 9876543214',
      status: 'Inactive',
      joinDate: '2018-08-12'
    }
  ]);

  const filteredStaff = staffList.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || staff.role === filterRole;
    const matchesDepartment = !filterDepartment || staff.department === filterDepartment;
    
    return matchesSearch && matchesRole && matchesDepartment;
  });

  const handleStatusToggle = (id: string) => {
    setStaffList(prev => prev.map(staff => 
      staff.id === id 
        ? { ...staff, status: staff.status === 'Active' ? 'Inactive' : 'Active' }
        : staff
    ));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      setStaffList(prev => prev.filter(staff => staff.id !== id));
    }
  };

  const roles = ['Doctor', 'Nurse', 'Pharmacist', 'Lab Technician', 'Receptionist'];
  const departments = ['Dermatology', 'Neurology', 'Cardiology', 'General', 'Pharmacy', 'Laboratory'];

  return (
    <div className="min-h-screen bg-white">
      <Header title="Staff Management" showBackButton />
      
      <div className="max-w-6xl mx-auto p-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Users size={24} className="text-black" />
            <h2 className="text-xl font-semibold text-black">Manage Staff</h2>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate('/hospital/add-doctor')}>
              <UserPlus size={16} className="mr-2" />
              Add Doctor
            </Button>
            <Button variant="outline" onClick={() => navigate('/hospital/add-staff')}>
              <UserPlus size={16} className="mr-2" />
              Add Staff
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="">All Roles</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>

            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setFilterRole('');
              setFilterDepartment('');
            }}>
              Clear Filters
            </Button>
          </div>
        </Card>

        {/* Staff List */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Staff ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Department</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Contact</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((staff) => (
                  <tr key={staff.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{staff.id}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{staff.name}</p>
                        <p className="text-sm text-gray-600">{staff.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{staff.role}</td>
                    <td className="py-3 px-4 text-gray-700">{staff.department}</td>
                    <td className="py-3 px-4 text-gray-700">{staff.phone}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleStatusToggle(staff.id)}
                        className={`px-3 py-1 text-sm rounded-full ${
                          staff.status === 'Active'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {staff.status}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="p-1 text-gray-600 hover:text-blue-600">
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(staff.id)}
                          className="p-1 text-gray-600 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <Card className="text-center" padding="sm">
            <h3 className="text-2xl font-bold text-black">{staffList.length}</h3>
            <p className="text-gray-600">Total Staff</p>
          </Card>
          <Card className="text-center" padding="sm">
            <h3 className="text-2xl font-bold text-green-600">{staffList.filter(s => s.status === 'Active').length}</h3>
            <p className="text-gray-600">Active</p>
          </Card>
          <Card className="text-center" padding="sm">
            <h3 className="text-2xl font-bold text-blue-600">{staffList.filter(s => s.role === 'Doctor').length}</h3>
            <p className="text-gray-600">Doctors</p>
          </Card>
          <Card className="text-center" padding="sm">
            <h3 className="text-2xl font-bold text-purple-600">{departments.length}</h3>
            <p className="text-gray-600">Departments</p>
          </Card>
        </div>
      </div>
    </div>
  );
};