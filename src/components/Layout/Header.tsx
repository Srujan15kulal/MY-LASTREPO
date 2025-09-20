import React from 'react';
import { ArrowLeft, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, showBackButton = false }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (location.pathname.includes('/patient/')) {
      navigate('/patient/dashboard');
    } else if (location.pathname.includes('/doctor/')) {
      navigate('/doctor/dashboard');
    } else if (location.pathname.includes('/hospital/')) {
      navigate('/hospital/dashboard');
    } else if (location.pathname.includes('/pharmacy/')) {
      navigate('/pharmacy/dashboard');
    } else if (location.pathname.includes('/lab/')) {
      navigate('/lab/dashboard');
    } else {
      navigate(-1);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleDisplayName = (role: string) => {
    const roleMap: { [key: string]: string } = {
      doctor: 'Doctor',
      patient: 'Patient',
      hospital: 'Receptionist',
      pharmacist: 'Pharmacist',
      lab_technician: 'Lab Technician'
    };
    return roleMap[role] || role;
  };

  return (
    <header className="bg-white border-b border-black px-4 py-4">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={20} className="text-black" />
            </button>
          )}
          <div>
            <h1 className="text-xl font-medium text-black">{title}</h1>
            {user && (
              <p className="text-sm text-gray-600">
                {getRoleDisplayName(user.role)} Portal
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-100">
                <User size={16} className="text-black" />
                <span className="text-sm text-black">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-black hover:bg-gray-100 transition-colors"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};