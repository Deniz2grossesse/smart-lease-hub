
import { useNavigate } from 'react-router-dom';
import { UserType } from '@/types/auth';

export const useAuthNavigation = () => {
  const navigate = useNavigate();

  const redirectBasedOnUserType = (userType: UserType) => {
    console.log("Redirecting based on user type:", userType);
    
    const currentPath = window.location.pathname;
    const isOnCorrectPath = (
      (userType === 'tenant' && currentPath.startsWith('/tenant')) ||
      (userType === 'owner' && currentPath.startsWith('/owner')) ||
      (userType === 'agent' && currentPath.startsWith('/agent'))
    );
    
    if (isOnCorrectPath) {
      console.log("User already on correct path:", currentPath);
      return;
    }
    
    switch(userType) {
      case 'tenant':
        navigate('/tenant/dashboard');
        break;
      case 'owner':
        navigate('/owner/dashboard');
        break;
      case 'agent':
        navigate('/agent/dashboard');
        break;
      default:
        navigate('/');
    }
  };

  return { redirectBasedOnUserType };
};
