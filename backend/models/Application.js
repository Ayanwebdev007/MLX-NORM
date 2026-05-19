import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    articleDescription: {
      date: { type: Date, required: true },
      shape: { type: String, required: true },
      size: { type: String, required: true },
      weight: { type: String, required: true },
      yearOfEstablishment: { type: String, required: true },
      mr: { type: String, required: true },
      rr: { type: String, required: true },
      conditionOfOperation: { type: String, required: true },
      origin: { type: String, required: true },
      imageUrl: { type: String, required: true },
    },
    ownerDetails: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      aadharCardNumber: { type: String, required: true },
      panCardNumber: { type: String, required: true },
      mobileNumber: { type: String, required: true },
      email: { type: String, required: true },
      ownerImageUrl: { type: String, required: true },
      signatureUrl: { type: String, required: true },
      mediaDetails: {
        name: { type: String, required: true },
        address: { type: String, required: true },
        aadharCardNumber: { type: String, required: true },
        panCardNumber: { type: String, required: true },
        mobileNumber: { type: String, required: true },
        email: { type: String, required: true },
        mediaType: { type: String, required: true },
        mediaDescription: { type: String, required: true },
        mediaUrl: { type: String, required: true },
      },
    },
    workingAuthority: {
      authorityType: { type: String, required: true, enum: ['Company', 'Auctioneer'] },
      name: { type: String, required: true },
      address: { type: String, required: true },
      workingCodeNumber: { type: String, required: true },
      contactNumber: { type: String, required: true },
      licenseNumber: { type: String, required: true },
    },
    scientistDetails: {
      closingScientist: {
        name: { type: String, required: true },
        institutionName: { type: String, required: true },
        idNumber: { type: String, required: true },
      },
      openingScientist: {
        name: { type: String, required: true },
        institutionName: { type: String, required: true },
        idNumber: { type: String, required: true },
      },
    },
    chemicalDetails: {
      closingChemicals: [{ type: String }],
      packingChemicals: [{ type: String }],
      openingChemicals: [{ type: String }],
    },
    registrationNumber: {
      type: String,
      unique: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Under Review', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    adminRemarks: {
      type: String,
      default: '',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Application = mongoose.model('Application', applicationSchema);

export default Application;
