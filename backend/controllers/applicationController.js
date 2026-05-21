import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Application from '../models/Application.js';

// Helper to delete an uploaded file from server disk
const deleteFile = (fileUrl) => {
  if (!fileUrl) return;
  try {
    const filename = path.basename(fileUrl);
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const filePath = path.join(__dirname, '..', 'uploads', filename);
    
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Failed to delete file at ${filePath}:`, err.message);
      } else {
        console.log(`Successfully deleted file at ${filePath}`);
      }
    });
  } catch (err) {
    console.error(`Error constructed path or deleting file:`, err.message);
  }
};

// @desc    Submit or update multi-step application form
// @route   POST /api/applications
// @access  Private
const submitApplication = async (req, res, next) => {
  try {
    const { articleDescription, ownerDetails, workingAuthority, scientistDetails, chemicalDetails } = req.body;

    if (!articleDescription || !ownerDetails || !workingAuthority || !scientistDetails || !chemicalDetails) {
      res.status(400);
      throw new Error('Please fill in all Article Description, Owner Details, Working Authority, Scientist details, and Chemical details');
    }

    const {
      date,
      shape,
      size,
      weight,
      yearOfEstablishment,
      mr,
      rr,
      conditionOfOperation,
      origin,
      imageUrl,
    } = articleDescription;

    if (
      !date ||
      !shape ||
      !size ||
      !weight ||
      !yearOfEstablishment ||
      !mr ||
      !rr ||
      !conditionOfOperation ||
      !origin ||
      !imageUrl
    ) {
      res.status(400);
      throw new Error('Please fill in all Step 1 fields, including the article image.');
    }

    const {
      name,
      address,
      aadharCardNumber,
      panCardNumber,
      mobileNumber,
      email,
      ownerImageUrl,
      signatureUrl,
    } = ownerDetails;

    if (
      !name ||
      !address ||
      !aadharCardNumber ||
      !panCardNumber ||
      !mobileNumber ||
      !email ||
      !ownerImageUrl ||
      !signatureUrl
    ) {
      res.status(400);
      throw new Error('Please fill in all Step 2 Owner details fields.');
    }

    if (
      !workingAuthority ||
      !workingAuthority.authorityType ||
      !workingAuthority.name ||
      !workingAuthority.address ||
      !workingAuthority.workingCodeNumber ||
      !workingAuthority.contactNumber ||
      !workingAuthority.licenseNumber
    ) {
      res.status(400);
      throw new Error('Please fill out all Step 3 Working Authority details.');
    }

    if (
      !scientistDetails ||
      !scientistDetails.closingScientist ||
      !scientistDetails.closingScientist.name ||
      !scientistDetails.closingScientist.institutionName ||
      !scientistDetails.closingScientist.idNumber ||
      !scientistDetails.openingScientist ||
      !scientistDetails.openingScientist.name ||
      !scientistDetails.openingScientist.institutionName ||
      !scientistDetails.openingScientist.idNumber
    ) {
      res.status(400);
      throw new Error('Please fill out all Step 4 Scientist details.');
    }

    if (
      !chemicalDetails ||
      !Array.isArray(chemicalDetails.closingChemicals) ||
      !Array.isArray(chemicalDetails.packingChemicals) ||
      !Array.isArray(chemicalDetails.openingChemicals)
    ) {
      res.status(400);
      throw new Error('Please fill out all Step 5 Chemical details.');
    }

    // Find if user already submitted an application
    let application = await Application.findOne({ user: req.user._id });

    // Generate unique 16-digit registration number if not present
    let registrationNumber = application ? application.registrationNumber : '';
    if (!registrationNumber) {
      let isUnique = false;
      while (!isUnique) {
        registrationNumber = '';
        for (let i = 0; i < 16; i++) {
          registrationNumber += Math.floor(Math.random() * 10).toString();
        }
        const existing = await Application.findOne({ registrationNumber });
        if (!existing) {
          isUnique = true;
        }
      }
    }

    if (application) {
      // If it's already approved, lock editing
      if (application.status === 'Approved') {
        res.status(400);
        throw new Error('Your registration is already approved and locked for modifications');
      }

      // Update existing application
      application.articleDescription = articleDescription;
      application.ownerDetails = ownerDetails;
      application.workingAuthority = workingAuthority;
      application.scientistDetails = scientistDetails;
      application.chemicalDetails = chemicalDetails;
      application.registrationNumber = registrationNumber;
      application.status = 'Pending'; // Reset to pending on update
      application.adminRemarks = ''; // Clear prior admin remarks

      const updatedApp = await application.save();
      res.json(updatedApp);
    } else {
      // Create new application
      const newApp = new Application({
        user: req.user._id,
        articleDescription,
        ownerDetails,
        workingAuthority,
        scientistDetails,
        chemicalDetails,
        registrationNumber,
      });

      const createdApp = await newApp.save();
      res.status(201).json(createdApp);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's multi-step application
// @route   GET /api/applications/my
// @access  Private
const getMyApplication = async (req, res, next) => {
  try {
    const application = await Application.findOne({ user: req.user._id });
    if (application) {
      res.json(application);
    } else {
      res.json(null); // Return null instead of error so frontend can check existence
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all multi-step applications
// @route   GET /api/applications
// @access  Private/Admin
const getAllApplications = async (req, res, next) => {
  try {
    // Query all submissions, populating user details
    const applications = await Application.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    next(error);
  }
};

// @desc    Update application review status and admin feedback
// @route   PUT /api/applications/:id/status
// @access  Private/Admin
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, adminRemarks } = req.body;

    if (!status) {
      res.status(400);
      throw new Error('Please provide status state parameter');
    }

    const application = await Application.findById(req.params.id);

    if (application) {
      application.status = status;
      if (adminRemarks !== undefined) {
        application.adminRemarks = adminRemarks;
      }

      const updatedApp = await application.save();
      res.json(updatedApp);
    } else {
      res.status(404);
      throw new Error('Submission record not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete current user's multi-step application
// @route   DELETE /api/applications/my
// @access  Private
const deleteMyApplication = async (req, res, next) => {
  try {
    const application = await Application.findOne({ user: req.user._id });
    if (application) {
      // Lock deletion of approved registrations
      if (application.status === 'Approved') {
        res.status(400);
        throw new Error('Your registration has already been approved and cannot be deleted.');
      }

      // Delete associated image files from disk
      if (application.articleDescription && application.articleDescription.imageUrl) {
        deleteFile(application.articleDescription.imageUrl);
      }
      if (application.ownerDetails) {
        if (application.ownerDetails.ownerImageUrl) {
          deleteFile(application.ownerDetails.ownerImageUrl);
        }
        if (application.ownerDetails.signatureUrl) {
          deleteFile(application.ownerDetails.signatureUrl);
        }
      }

      await Application.deleteOne({ user: req.user._id });
      res.json({ message: 'Application and associated images deleted successfully' });
    } else {
      res.status(404);
      throw new Error('No registration record found to delete');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Admin delete any application by ID
// @route   DELETE /api/applications/:id
// @access  Private/Admin
const deleteApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      res.status(404);
      throw new Error('Application not found.');
    }

    // Delete associated image files from disk
    if (application.articleDescription && application.articleDescription.imageUrl) {
      deleteFile(application.articleDescription.imageUrl);
    }
    if (application.ownerDetails) {
      if (application.ownerDetails.ownerImageUrl) {
        deleteFile(application.ownerDetails.ownerImageUrl);
      }
      if (application.ownerDetails.signatureUrl) {
        deleteFile(application.ownerDetails.signatureUrl);
      }
    }

    await Application.deleteOne({ _id: req.params.id });
    res.json({ message: 'Application deleted successfully by admin.' });
  } catch (error) {
    next(error);
  }
};

export {
  submitApplication,
  getMyApplication,
  getAllApplications,
  updateApplicationStatus,
  deleteMyApplication,
  deleteApplicationById,
};
