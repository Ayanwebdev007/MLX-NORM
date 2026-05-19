import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { API_BASE_URL } from '../utils/config';

const RegistrationContext = createContext();

export const useRegistration = () => useContext(RegistrationContext);

export const RegistrationProvider = ({ children }) => {
  const { user } = useAuth();

  // Dashboard & Application States
  const [application, setApplication] = useState(null);
  const [loadingApp, setLoadingApp] = useState(true);
  const [dashError, setDashError] = useState('');

  // Wizard state: 'welcome' | 'step1' | 'step2' | 'step3' | 'step4' | 'step5' | 'submitted'
  const [wizardState, setWizardState] = useState('welcome');

  // Step 1 Form fields
  const [date, setDate] = useState('');
  const [shape, setShape] = useState('');
  const [size, setSize] = useState('');
  const [weight, setWeight] = useState('');
  const [yearOfEstablishment, setYearOfEstablishment] = useState('');
  const [mr, setMr] = useState('');
  const [rr, setRr] = useState('');
  const [conditionOfOperation, setConditionOfOperation] = useState('Normal Pack');
  const [origin, setOrigin] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Step 2 Form fields
  const [ownerName, setOwnerName] = useState('');
  const [ownerAddress, setOwnerAddress] = useState('');
  const [aadharCardNumber, setAadharCardNumber] = useState('');
  const [panCardNumber, setPanCardNumber] = useState('');
  const [ownerMobile, setOwnerMobile] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerImageUrl, setOwnerImageUrl] = useState('');
  const [ownerSignatureUrl, setOwnerSignatureUrl] = useState('');

  // Media Details
  const [mediaName, setMediaName] = useState('');
  const [mediaAddress, setMediaAddress] = useState('');
  const [mediaAadharCardNumber, setMediaAadharCardNumber] = useState('');
  const [mediaPanCardNumber, setMediaPanCardNumber] = useState('');
  const [mediaMobile, setMediaMobile] = useState('');
  const [mediaEmail, setMediaEmail] = useState('');
  const [mediaType, setMediaType] = useState('Image');
  const [mediaDescription, setMediaDescription] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');

  // Step 3 Working Authority Form fields
  const [authorityType, setAuthorityType] = useState('Company');
  const [authorityName, setAuthorityName] = useState('');
  const [authorityAddress, setAuthorityAddress] = useState('');
  const [workingCodeNumber, setWorkingCodeNumber] = useState('');
  const [authorityContact, setAuthorityContact] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');

  // Step 4 Scientist Details Form fields
  const [closingScientistName, setClosingScientistName] = useState('');
  const [closingScientistInstitution, setClosingScientistInstitution] = useState('');
  const [closingScientistId, setClosingScientistId] = useState('');

  const [openingScientistName, setOpeningScientistName] = useState('');
  const [openingScientistInstitution, setOpeningScientistInstitution] = useState('');
  const [openingScientistId, setOpeningScientistId] = useState('');

  // Step 5 Chemical Details Form fields
  const [closingChemicals, setClosingChemicals] = useState(['', '', '', '']);
  const [packingChemicals, setPackingChemicals] = useState(['', '', '', '']);
  const [openingChemicals, setOpeningChemicals] = useState(['', '', '', '']);

  // Uploading states
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadingOwnerImage, setUploadingOwnerImage] = useState(false);
  const [uploadingSignature, setUploadingSignature] = useState(false);
  const [uploadingMediaFile, setUploadingMediaFile] = useState(false);
  const [ownerImageError, setOwnerImageError] = useState('');
  const [signatureError, setSignatureError] = useState('');
  const [mediaFileError, setMediaFileError] = useState('');

  // Submit status states
  const [submittingForm, setSubmittingForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [deletingApp, setDeletingApp] = useState(false);

  // Methods
  const handleChemicalChange = (category, index, val) => {
    if (category === 'closing') {
      const next = [...closingChemicals];
      next[index] = val;
      setClosingChemicals(next);
    } else if (category === 'packing') {
      const next = [...packingChemicals];
      next[index] = val;
      setPackingChemicals(next);
    } else if (category === 'opening') {
      const next = [...openingChemicals];
      next[index] = val;
      setOpeningChemicals(next);
    }
  };

  const addChemicalField = (category) => {
    if (category === 'closing') {
      if (closingChemicals.length >= 20) return;
      setClosingChemicals([...closingChemicals, '']);
    } else if (category === 'packing') {
      if (packingChemicals.length >= 20) return;
      setPackingChemicals([...packingChemicals, '']);
    } else if (category === 'opening') {
      if (openingChemicals.length >= 20) return;
      setOpeningChemicals([...openingChemicals, '']);
    }
  };

  const removeChemicalField = (category, index) => {
    if (category === 'closing') {
      const next = closingChemicals.filter((_, idx) => idx !== index);
      setClosingChemicals(next);
    } else if (category === 'packing') {
      const next = packingChemicals.filter((_, idx) => idx !== index);
      setPackingChemicals(next);
    } else if (category === 'opening') {
      const next = openingChemicals.filter((_, idx) => idx !== index);
      setOpeningChemicals(next);
    }
  };

  const fetchMyApplication = async () => {
    if (!user) return;
    setLoadingApp(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/applications/my`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const data = await response.json();
      if (response.ok && data) {
        setApplication(data);
        setWizardState('submitted');
        
        // Prefill details
        const desc = data.articleDescription;
        if (desc) {
          setDate(desc.date ? desc.date.substring(0, 10) : '');
          setShape(desc.shape || '');
          setSize(desc.size || '');
          setWeight(desc.weight || '');
          setYearOfEstablishment(desc.yearOfEstablishment || '');
          setMr(desc.mr || '');
          setRr(desc.rr || '');
          setConditionOfOperation(desc.conditionOfOperation || 'Normal Pack');
          setOrigin(desc.origin || '');
          setImageUrl(desc.imageUrl || '');
        }

        const owner = data.ownerDetails;
        if (owner) {
          setOwnerName(owner.name || '');
          setOwnerAddress(owner.address || '');
          setAadharCardNumber(owner.aadharCardNumber || '');
          setPanCardNumber(owner.panCardNumber || '');
          setOwnerMobile(owner.mobileNumber || '');
          setOwnerEmail(owner.email || '');
          setOwnerImageUrl(owner.ownerImageUrl || '');
          setOwnerSignatureUrl(owner.signatureUrl || '');
          if (owner.mediaDetails) {
            setMediaName(owner.mediaDetails.name || '');
            setMediaAddress(owner.mediaDetails.address || '');
            setMediaAadharCardNumber(owner.mediaDetails.aadharCardNumber || '');
            setMediaPanCardNumber(owner.mediaDetails.panCardNumber || '');
            setMediaMobile(owner.mediaDetails.mobileNumber || '');
            setMediaEmail(owner.mediaDetails.email || '');
            setMediaType(owner.mediaDetails.mediaType || 'Image');
            setMediaDescription(owner.mediaDetails.mediaDescription || '');
            setMediaUrl(owner.mediaDetails.mediaUrl || '');
          }
        }

        const auth = data.workingAuthority;
        if (auth) {
          setAuthorityType(auth.authorityType || 'Company');
          setAuthorityName(auth.name || '');
          setAuthorityAddress(auth.address || '');
          setWorkingCodeNumber(auth.workingCodeNumber || '');
          setAuthorityContact(auth.contactNumber || '');
          setLicenseNumber(auth.licenseNumber || '');
        }

        const sc = data.scientistDetails;
        if (sc) {
          if (sc.closingScientist) {
            setClosingScientistName(sc.closingScientist.name || '');
            setClosingScientistInstitution(sc.closingScientist.institutionName || '');
            setClosingScientistId(sc.closingScientist.idNumber || '');
          }
          if (sc.openingScientist) {
            setOpeningScientistName(sc.openingScientist.name || '');
            setOpeningScientistInstitution(sc.openingScientist.institutionName || '');
            setOpeningScientistId(sc.openingScientist.idNumber || '');
          }
        }

        const chem = data.chemicalDetails;
        if (chem) {
          const mapChem = (arr) => {
            if (!arr || !Array.isArray(arr)) return ['', '', '', ''];
            const res = [...arr];
            while (res.length < 4) res.push('');
            return res;
          };
          setClosingChemicals(mapChem(chem.closingChemicals));
          setPackingChemicals(mapChem(chem.packingChemicals));
          setOpeningChemicals(mapChem(chem.openingChemicals));
        }
      } else {
        setApplication(null);
        setWizardState('welcome');
      }
    } catch (err) {
      console.error('Error fetching application:', err);
      setDashError('Network error occurred while fetching registration details.');
    } finally {
      setLoadingApp(false);
    }
  };

  useEffect(() => {
    fetchMyApplication();
  }, [user]);

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      const sizeMsg = 'Image file exceeds the 5MB size limit.';
      if (type === 'article') setUploadError(sizeMsg);
      if (type === 'owner') setOwnerImageError(sizeMsg);
      if (type === 'signature') setSignatureError(sizeMsg);
      if (type === 'media') setMediaFileError(sizeMsg);
      return;
    }

    if (type === 'article') { setUploadingImage(true); setUploadError(''); }
    if (type === 'owner') { setUploadingOwnerImage(true); setOwnerImageError(''); }
    if (type === 'signature') { setUploadingSignature(true); setSignatureError(''); }
    if (type === 'media') { setUploadingMediaFile(true); setMediaFileError(''); }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        if (type === 'article') setImageUrl(data.imageUrl);
        if (type === 'owner') setOwnerImageUrl(data.imageUrl);
        if (type === 'signature') setOwnerSignatureUrl(data.imageUrl);
        if (type === 'media') setMediaUrl(data.imageUrl);
      } else {
        const errMsg = data.message || 'Image upload failed. Ensure it is a valid graphic file.';
        if (type === 'article') setUploadError(errMsg);
        if (type === 'owner') setOwnerImageError(errMsg);
        if (type === 'signature') setSignatureError(errMsg);
        if (type === 'media') setMediaFileError(errMsg);
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      const errMsg = 'Failed to upload file due to network error.';
      if (type === 'article') setUploadError(errMsg);
      if (type === 'owner') setOwnerImageError(errMsg);
      if (type === 'signature') setSignatureError(errMsg);
      if (type === 'media') setMediaFileError(errMsg);
    } finally {
      if (type === 'article') setUploadingImage(false);
      if (type === 'owner') setUploadingOwnerImage(false);
      if (type === 'signature') setUploadingSignature(false);
      if (type === 'media') setUploadingMediaFile(false);
    }
  };

  const handleSubmitRegistration = async (e) => {
    if (e) e.preventDefault();
    if (
      !date || !shape || !size || !weight || !yearOfEstablishment || !mr || !rr || !conditionOfOperation || !origin || !imageUrl ||
      !ownerName || !ownerAddress || !aadharCardNumber || !panCardNumber || !ownerMobile || !ownerEmail || !ownerImageUrl || !ownerSignatureUrl ||
      !mediaName || !mediaAddress || !mediaAadharCardNumber || !mediaPanCardNumber || !mediaMobile || !mediaEmail ||
      !mediaType || !mediaDescription || !mediaUrl ||
      !authorityType || !authorityName || !authorityAddress || !workingCodeNumber || !authorityContact || !licenseNumber ||
      !closingScientistName || !closingScientistInstitution || !closingScientistId ||
      !openingScientistName || !openingScientistInstitution || !openingScientistId
    ) {
      setFormError('Please fill out all registration fields, including all files, signatures, Working Authority, and Scientist details.');
      return;
    }

    setSubmittingForm(true);
    setFormError('');

    try {
      const payload = {
        articleDescription: {
          date, shape, size, weight, yearOfEstablishment, mr, rr, conditionOfOperation, origin, imageUrl
        },
        ownerDetails: {
          name: ownerName,
          address: ownerAddress,
          aadharCardNumber,
          panCardNumber,
          mobileNumber: ownerMobile,
          email: ownerEmail,
          ownerImageUrl,
          signatureUrl: ownerSignatureUrl,
          mediaDetails: {
            name: mediaName,
            address: mediaAddress,
            aadharCardNumber: mediaAadharCardNumber,
            panCardNumber: mediaPanCardNumber,
            mobileNumber: mediaMobile,
            email: mediaEmail,
            mediaType,
            mediaDescription,
            mediaUrl
          }
        },
        workingAuthority: {
          authorityType,
          name: authorityName,
          address: authorityAddress,
          workingCodeNumber,
          contactNumber: authorityContact,
          licenseNumber
        },
        scientistDetails: {
          closingScientist: {
            name: closingScientistName,
            institutionName: closingScientistInstitution,
            idNumber: closingScientistId
          },
          openingScientist: {
            name: openingScientistName,
            institutionName: openingScientistInstitution,
            idNumber: openingScientistId
          }
        },
        chemicalDetails: {
          closingChemicals: closingChemicals.filter(c => c.trim() !== ''),
          packingChemicals: packingChemicals.filter(c => c.trim() !== ''),
          openingChemicals: openingChemicals.filter(c => c.trim() !== '')
        }
      };

      const response = await fetch(`${API_BASE_URL}/api/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        setApplication(data);
        setWizardState('submitted');
        fetchMyApplication();
      } else {
        setFormError(data.message || 'Failed to submit registration form.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setFormError('An error occurred during registration. Check server status.');
    } finally {
      setSubmittingForm(false);
    }
  };

  const handleDeleteApplication = async () => {
    if (!window.confirm("Are you absolutely sure you want to permanently delete your registration application? This will discard all inputs, and you will have to fill a fresh form.")) {
      return;
    }

    setDeletingApp(true);
    setFormError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/applications/my`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        // Clear all form inputs
        setDate(''); setShape(''); setSize(''); setWeight(''); setYearOfEstablishment(''); setMr(''); setRr(''); setConditionOfOperation('Normal Pack'); setOrigin(''); setImageUrl('');
        setOwnerName(''); setOwnerAddress(''); setAadharCardNumber(''); setPanCardNumber(''); setOwnerMobile(''); setOwnerEmail(''); setOwnerImageUrl(''); setOwnerSignatureUrl('');
        setMediaName(''); setMediaAddress(''); setMediaAadharCardNumber(''); setMediaPanCardNumber(''); setMediaMobile(''); setMediaEmail(''); setMediaType('Image'); setMediaDescription(''); setMediaUrl('');
        setAuthorityType('Company'); setAuthorityName(''); setAuthorityAddress(''); setWorkingCodeNumber(''); setAuthorityContact(''); setLicenseNumber('');
        setClosingScientistName(''); setClosingScientistInstitution(''); setClosingScientistId('');
        setOpeningScientistName(''); setOpeningScientistInstitution(''); setOpeningScientistId('');
        setClosingChemicals(['', '', '', '']); setPackingChemicals(['', '', '', '']); setOpeningChemicals(['', '', '', '']);

        setApplication(null);
        setWizardState('welcome');
      } else {
        setFormError(data.message || 'Failed to delete application.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setFormError('An error occurred during application deletion.');
    } finally {
      setDeletingApp(false);
    }
  };

  const startRegistration = () => setWizardState('step1');

  const cancelRegistration = () => {
    if (application) {
      setWizardState('submitted');
    } else {
      setWizardState('welcome');
    }
    setFormError('');
  };

  const isStepFilled = (stepKey) => {
    if (stepKey === 'step1') {
      return date && shape && size && weight && yearOfEstablishment && mr && rr && conditionOfOperation && origin && imageUrl;
    }
    if (stepKey === 'step2') {
      return ownerName && ownerAddress && aadharCardNumber && panCardNumber && ownerMobile && ownerEmail && ownerImageUrl && ownerSignatureUrl &&
             mediaName && mediaAddress && mediaAadharCardNumber && mediaPanCardNumber && mediaMobile && mediaEmail && mediaType && mediaDescription && mediaUrl;
    }
    if (stepKey === 'step3') {
      return authorityType && authorityName && authorityAddress && workingCodeNumber && authorityContact && licenseNumber;
    }
    if (stepKey === 'step4') {
      return closingScientistName && closingScientistInstitution && closingScientistId &&
             openingScientistName && openingScientistInstitution && openingScientistId;
    }
    return false;
  };

  const steps = [
    { num: 1, name: 'Article Desc', key: 'step1' },
    { num: 2, name: 'Owner Details', key: 'step2' },
    { num: 3, name: 'Working Auth', key: 'step3' },
    { num: 4, name: 'Scientists', key: 'step4' },
    { num: 5, name: 'Chemicals', key: 'step5' }
  ];

  const getStepIndex = (st) => steps.findIndex(s => s.key === st);
  const currentStepIndex = getStepIndex(wizardState);
  const isFormWizard = currentStepIndex >= 0;

  const value = {
    application, loadingApp, dashError, wizardState, setWizardState,
    date, setDate, shape, setShape, size, setSize, weight, setWeight, yearOfEstablishment, setYearOfEstablishment, mr, setMr, rr, setRr, conditionOfOperation, setConditionOfOperation, origin, setOrigin, imageUrl, setImageUrl,
    ownerName, setOwnerName, ownerAddress, setOwnerAddress, aadharCardNumber, setAadharCardNumber, panCardNumber, setPanCardNumber, ownerMobile, setOwnerMobile, ownerEmail, setOwnerEmail, ownerImageUrl, setOwnerImageUrl, ownerSignatureUrl, setOwnerSignatureUrl,
    mediaName, setMediaName, mediaAddress, setMediaAddress, mediaAadharCardNumber, setMediaAadharCardNumber, mediaPanCardNumber, setMediaPanCardNumber, mediaMobile, setMediaMobile, mediaEmail, setMediaEmail, mediaType, setMediaType, mediaDescription, setMediaDescription, mediaUrl, setMediaUrl,
    authorityType, setAuthorityType, authorityName, setAuthorityName, authorityAddress, setAuthorityAddress, workingCodeNumber, setWorkingCodeNumber, authorityContact, setAuthorityContact, licenseNumber, setLicenseNumber,
    closingScientistName, setClosingScientistName, closingScientistInstitution, setClosingScientistInstitution, closingScientistId, setClosingScientistId,
    openingScientistName, setOpeningScientistName, openingScientistInstitution, setOpeningScientistInstitution, openingScientistId, setOpeningScientistId,
    closingChemicals, packingChemicals, openingChemicals, handleChemicalChange, addChemicalField, removeChemicalField,
    uploadingImage, uploadError, uploadingOwnerImage, ownerImageError, uploadingSignature, signatureError, uploadingMediaFile, mediaFileError,
    submittingForm, formError, setFormError, deletingApp,
    handleFileUpload, handleSubmitRegistration, handleDeleteApplication, startRegistration, cancelRegistration, isStepFilled,
    steps, currentStepIndex, isFormWizard
  };

  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
};
