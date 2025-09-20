import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../Layout/Header';
import { Card } from '../Common/Card';
import { Button } from '../Common/Button';
import { ArrowLeft, Download, Share } from 'lucide-react';

interface ReportData {
  [key: string]: {
    title: string;
    image: string;
    date: string;
    uploadedBy: string;
  };
}

const reportData: ReportData = {
  'chest-xray': {
    title: 'Chest X-Ray Report',
    image: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    date: '20/08/2025',
    uploadedBy: 'Lab Technician – Mr. Rao'
  },
  'cbc': {
    title: 'CBC Report',
    image: 'https://images.pexels.com/photos/7089020/pexels-photo-7089020.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    date: '01/09/2025',
    uploadedBy: 'Lab Technician – Ms. Priya'
  },
  'blood-test': {
    title: 'Blood Test Report',
    image: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    date: '14/09/2025',
    uploadedBy: 'Lab Technician – Mr. Kumar'
  }
};

export const ReportImageViewer: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  
  const report = reportData[reportId || ''];
  
  if (!report) {
    return (
      <div className="min-h-screen bg-white">
        <Header title="Report Not Found" showBackButton />
        <div className="max-w-4xl mx-auto p-6">
          <Card className="text-center">
            <h2 className="text-xl font-semibold text-black mb-4">Report Not Found</h2>
            <p className="text-gray-600 mb-6">The requested report could not be found.</p>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header title={report.title} showBackButton />
      
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold text-black">{report.title}</h2>
                <p className="text-gray-600">Date: {report.date}</p>
                <p className="text-gray-600">Uploaded by: {report.uploadedBy}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download size={16} className="mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="sm">
                  <Share size={16} className="mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>

          {/* Report Image */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <img
              src={report.image}
              alt={report.title}
              className="w-full max-w-3xl mx-auto rounded-lg shadow-lg"
              style={{ maxHeight: '70vh', objectFit: 'contain' }}
            />
          </div>

          {/* Back Button */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Reports
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};