import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { API_BASE_URL } from '../utils/config';

const ApplicationContext = createContext();

export const useApplication = () => useContext(ApplicationContext);

export const ApplicationProvider = ({ children }) => {
  const { user } = useAuth();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Draft form data to preserve user step inputs between refreshes
  const [draftData, setDraftData] = useState(() => {
    const saved = localStorage.getItem('mlx_application_draft');
    return saved ? JSON.parse(saved) : {
      personalDetails: { fullName: '', dob: '', gender: '', phone: '' },
      addressDetails: { streetAddress: '', city: '', state: '', postalCode: '', country: '' },
      professionalDetails: { educationLevel: '', occupation: '', monthlyIncome: '', skills: '' },
      programDetails: { selectedProgram: '', purposeOfApplication: '', statementOfIntent: '' },
      declarationDetails: { documentType: 'Aadhaar Card', documentNumber: '', signatureName: '', agreedToTerms: false }
    };
  });

  // Sync draft data to localStorage
  useEffect(() => {
    localStorage.setItem('mlx_application_draft', JSON.stringify(draftData));
  }, [draftData]);

  // Fetch current user's submission
  const fetchMyApplication = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/applications/my`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setApplication(data);
      } else {
        setError(data.message || 'Failed to fetch application');
      }
    } catch (err) {
      setError(err.message || 'Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Submit the 5-step form
  const submitApplication = async (formData) => {
    if (!user) return { success: false, message: 'Please log in' };
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setApplication(data);
        // Clear draft on successful submission
        localStorage.removeItem('mlx_application_draft');
        return { success: true, data };
      } else {
        return { success: false, message: data.message || 'Submission failed' };
      }
    } catch (err) {
      return { success: false, message: err.message || 'Network error occurred' };
    } finally {
      setLoading(false);
    }
  };

  // Fetch application status when user changes
  useEffect(() => {
    if (user) {
      fetchMyApplication();
    } else {
      setApplication(null);
    }
  }, [user]);

  const updateDraft = (stepKey, stepData) => {
    setDraftData(prev => ({
      ...prev,
      [stepKey]: {
        ...prev[stepKey],
        ...stepData
      }
    }));
  };

  const resetDraft = () => {
    const defaultData = {
      personalDetails: { fullName: '', dob: '', gender: '', phone: '' },
      addressDetails: { streetAddress: '', city: '', state: '', postalCode: '', country: '' },
      professionalDetails: { educationLevel: '', occupation: '', monthlyIncome: '', skills: '' },
      programDetails: { selectedProgram: '', purposeOfApplication: '', statementOfIntent: '' },
      declarationDetails: { documentType: 'Aadhaar Card', documentNumber: '', signatureName: '', agreedToTerms: false }
    };
    setDraftData(defaultData);
    localStorage.removeItem('mlx_application_draft');
  };

  return (
    <ApplicationContext.Provider value={{
      application,
      loading,
      error,
      draftData,
      updateDraft,
      resetDraft,
      fetchMyApplication,
      submitApplication
    }}>
      {children}
    </ApplicationContext.Provider>
  );
};
