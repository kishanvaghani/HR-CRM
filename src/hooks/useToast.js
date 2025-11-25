// hooks/useToast.js
import { toast } from 'react-toastify';

const useToast = () => {
  const showSuccess = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const showError = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 4000,
    });
  };

  const showWarning = (message) => {
    toast.warning(message, {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const showInfo = (message) => {
    toast.info(message, {
      position: "top-right",
      autoClose: 3000,
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};

export default useToast;