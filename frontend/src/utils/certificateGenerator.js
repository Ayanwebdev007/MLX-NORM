import { jsPDF } from 'jspdf';
import certificateBg from '../assets/norm certificate.png';
import { API_BASE_URL } from './config';

const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
  });
};

export const generateCertificatePDF = async (application) => {
  const fileName = `MLX_NORM_Certificate_${application.registrationNumber || application._id}.pdf`;

  try {
    // Load background template image first to get its dimensions
    const img = await loadImage(certificateBg);
    
    // Calculate aspect ratio and determine orientation
    const imgWidth = img.naturalWidth || img.width || 297;
    const imgHeight = img.naturalHeight || img.height || 210;
    const aspectRatio = imgWidth / imgHeight;
    
    let pageW, pageH, doc;
    let labelX, valueX, regX, regY, startY, lineGap, fontSizeLabel, fontSizeValue, fontSizeReg;
    let frameX, frameY, frameW, frameH;

    if (aspectRatio >= 1) {
      // Landscape layout
      const targetW = 297;
      const targetH = targetW / aspectRatio;
      
      doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [targetH, targetW], // [height, width] in landscape
      });

      pageW = doc.internal.pageSize.getWidth();
      pageH = doc.internal.pageSize.getHeight();

      labelX = 35;
      valueX = 75;
      regX = pageW - 45;
      regY = 28;
      startY = 120;
      lineGap = 6.8;
      fontSizeLabel = 11.0;
      fontSizeValue = 11.5;
      fontSizeReg = 10.5;

      frameX = 185;
      frameY = 113;
      frameW = 80;
      frameH = 78;
    } else {
      // Portrait layout
      const targetW = 210;
      const targetH = targetW / aspectRatio;

      doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [targetW, targetH], // [width, height] in portrait
      });

      pageW = doc.internal.pageSize.getWidth();
      pageH = doc.internal.pageSize.getHeight();

      labelX = 24;
      valueX = 64;
      regX = pageW - 35;
      regY = 28;
      startY = 132;
      lineGap = 6.8;
      fontSizeLabel = 10.5;
      fontSizeValue = 11.0;
      fontSizeReg = 10.0;

      frameX = 132.5;
      frameY = 124.5;
      frameW = 55;
      frameH = 53;
    }

    doc.addImage(img, 'PNG', 0, 0, pageW, pageH);

    // ──── Top Right: Registration Number ────
    doc.setFont('times', 'bold');
    doc.setFontSize(fontSizeReg);
    doc.setTextColor(0, 0, 0); // black
    doc.text('REGISTRATION NO.', regX, regY - 5.5, { align: 'center' });

    doc.setFont('times', 'bold');
    doc.setFontSize(fontSizeReg + 2); // slightly larger
    doc.text(application.registrationNumber || 'N/A', regX, regY, { align: 'center' });

    // ──── Left Side: Information List ────
    let currentY = startY;

    const approvalDate = new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const drawRow = (label, value) => {
      const isOwner = label === 'Owner Name:';

      if (isOwner) {
        doc.setFont('times', 'bold');
        doc.setFontSize(fontSizeLabel + 2.5);
        doc.setTextColor(114, 21, 21); // Maroon color for label
        doc.text(label, labelX, currentY);

        doc.setFont('times', 'bolditalic');
        doc.setFontSize(fontSizeValue + 3.0);
        doc.setTextColor(0, 0, 0); // Black color for value
        doc.text(String(value), valueX, currentY);

        currentY += lineGap + 2.0; // extra spacing after Owner Name
      } else {
        doc.setFont('times', 'bold');
        doc.setFontSize(fontSizeLabel);
        doc.setTextColor(114, 21, 21); // Maroon color for label
        doc.text(label, labelX, currentY);

        doc.setFont('times', 'normal');
        doc.setFontSize(fontSizeValue);
        doc.setTextColor(0, 0, 0); // Black color for value
        doc.text(String(value), valueX, currentY);

        currentY += lineGap;
      }
    };

    drawRow('Owner Name:', application.ownerDetails?.name || 'N/A');
    drawRow('Aadhar Number:', application.ownerDetails?.aadharCardNumber || 'N/A');
    drawRow('Article Shape:', application.articleDescription?.shape || 'N/A');
    drawRow('Dimensions:', application.articleDescription?.size || 'N/A');
    drawRow('Net Weight:', application.articleDescription?.weight || 'N/A');
    drawRow('Origin:', application.articleDescription?.origin || 'N/A');
    drawRow('Max Radiation:', application.articleDescription?.mr || 'N/A');
    drawRow('Authority Name:', application.workingAuthority?.name || 'N/A');
    drawRow('License No:', application.workingAuthority?.licenseNumber || 'N/A');
    drawRow('Approval Date:', approvalDate);

    // ──── Right Side: Antique/Article Image ────
    if (application.articleDescription?.imageUrl) {
      try {
        const articleImgUrl = `${API_BASE_URL}${application.articleDescription.imageUrl}`;
        const articleImg = await loadImage(articleImgUrl);
        const format = articleImgUrl.toLowerCase().endsWith('.png') ? 'PNG' : 'JPEG';
        doc.addImage(articleImg, format, frameX, frameY, frameW, frameH);
      } catch (err) {
        console.error('Failed to load or draw article image on certificate:', err);
      }
    }

    doc.save(fileName);
  } catch (error) {
    console.error('Failed to load certificate template image, using fallback styling:', error);
    
    // Fallback: Generate the certificate using the old programmatic layout
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const W = 297;
    const H = 210;

    // Outer border (double line)
    doc.setDrawColor(22, 163, 74); // green-600
    doc.setLineWidth(2);
    doc.rect(8, 8, W - 16, H - 16);
    doc.setLineWidth(0.5);
    doc.rect(12, 12, W - 24, H - 24);

    // Corner ornaments (small squares)
    const cornerSize = 6;
    doc.setFillColor(22, 163, 74);
    [[12, 12], [W - 12 - cornerSize, 12], [12, H - 12 - cornerSize], [W - 12 - cornerSize, H - 12 - cornerSize]].forEach(([x, y]) => {
      doc.rect(x, y, cornerSize, cornerSize, 'F');
    });

    let y = 35;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(22, 163, 74);
    doc.text('MLX NORM REGISTRATION AUTHORITY', W / 2, y, { align: 'center' });
    y += 12;

    doc.setFontSize(28);
    doc.setTextColor(30, 41, 59);
    doc.text('CERTIFICATE OF APPROVAL', W / 2, y, { align: 'center' });
    y += 10;

    doc.setDrawColor(22, 163, 74);
    doc.setLineWidth(1);
    doc.line(W / 2 - 50, y, W / 2 + 50, y);
    y += 6;
    doc.setLineWidth(0.3);
    doc.line(W / 2 - 35, y, W / 2 + 35, y);
    y += 12;

    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text('This is to certify that the article registration application submitted by', W / 2, y, { align: 'center' });
    y += 12;

    const applicantName = application.user?.name || application.ownerDetails?.name || 'Applicant';
    doc.setFontSize(22);
    doc.setTextColor(22, 163, 74);
    doc.text(applicantName, W / 2, y, { align: 'center' });
    y += 8;

    const nameWidth = doc.getTextWidth(applicantName);
    doc.setDrawColor(22, 163, 74);
    doc.setLineWidth(0.5);
    doc.line(W / 2 - nameWidth / 2, y, W / 2 + nameWidth / 2, y);
    y += 12;

    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text('has been reviewed and approved by the administrative authority.', W / 2, y, { align: 'center' });
    y += 16;

    doc.setFontSize(9);
    const leftCol = W / 2 - 70;
    const rightCol = W / 2 + 10;
    const lineH = 8;

    const details = [
      ['Registration Number', application.registrationNumber || 'N/A'],
      ['Application ID', application._id || 'N/A'],
      ['Article Shape', application.articleDescription?.shape || 'N/A'],
      ['Article Weight', application.articleDescription?.weight || 'N/A'],
      ['Origin', application.articleDescription?.origin || 'N/A'],
      ['Authority Type', application.workingAuthority?.authorityType || 'N/A'],
    ];

    for (let i = 0; i < details.length; i++) {
      const col = i < 3 ? leftCol : rightCol;
      const row = i < 3 ? i : i - 3;
      const yPos = y + row * lineH;

      doc.setTextColor(100, 116, 139);
      doc.text(details[i][0] + ':', col, yPos);
      doc.setTextColor(30, 41, 59);
      doc.text(details[i][1], col + 45, yPos);
    }

    y += 3 * lineH + 10;

    const approvalDate = new Date().toLocaleDateString('en-IN', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(20, y, W - 20, y);
    y += 10;

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Date of Approval: ${approvalDate}`, W / 2, y, { align: 'center' });
    y += 16;

    const sigY = y;
    doc.setDrawColor(148, 163, 184);
    doc.setLineWidth(0.3);

    doc.line(40, sigY, 110, sigY);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('Authorized Signatory', 75, sigY + 5, { align: 'center' });

    doc.line(W - 110, sigY, W - 40, sigY);
    doc.text('Administrative Officer', W - 75, sigY + 5, { align: 'center' });

    doc.setFontSize(7);
    doc.setTextColor(203, 213, 225);
    doc.text(
      'This certificate is digitally generated by MLX NORM Registration Portal. Verify authenticity at mlxnorm.gov.in',
      W / 2, H - 16, { align: 'center' }
    );

    doc.save(fileName);
  }
};
