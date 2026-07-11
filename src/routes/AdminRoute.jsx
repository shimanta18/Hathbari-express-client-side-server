// src/routes/AdminRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider'; // 🚀 Imported directly here

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // 🔒 Put your authorized admin Gmail addresses here
  const adminEmails = [
    'Grocheryadmin@gmail.com'
    
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="text-center font-bold text-gray-400 animate-pulse text-sm">
          Verifying security privileges...
        </div>
      </div>
    );
  }

  // Pass if logged in and email is in the admin array
  if (user && adminEmails.includes(user?.email)) {
    return children;
  }

  // Boot non-admins out to home page
  return <Navigate to="/" replace={true} />;
};

export default AdminRoute;