import { jsPDF } from 'jspdf';
import { FeePayment, Student, WebsiteSettings } from '../types';

export function generateFeeReceiptPDF(
  payment: FeePayment,
  student: Student,
  courseName: string,
  batchName: string,
  settings: WebsiteSettings
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const primaryColor = '#1e3a8a'; // Deep blue
  const slateDark = '#1e293b';
  const slateMuted = '#64748b';
  const borderGray = '#e2e8f0';

  // Outer Border Frame
  doc.setDrawColor(200, 210, 230);
  doc.setLineWidth(0.8);
  doc.rect(10, 10, 190, 277);

  // Top Header Banner
  doc.setFillColor(30, 58, 138); // #1e3a8a
  doc.rect(12, 12, 186, 28, 'F');

  // Institute Name in Header
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(settings.instituteName.toUpperCase(), 105, 22, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(settings.tagline, 105, 28, { align: 'center' });
  doc.text(`Govt. Reg. No: ${settings.regNumber} | Phone: ${settings.phone} | Email: ${settings.email}`, 105, 34, { align: 'center' });

  // Receipt Header Badge
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, 45, 180, 18, 2, 2, 'FD');

  doc.setTextColor(30, 58, 138);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('OFFICIAL TUITION FEE RECEIPT', 20, 56);

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Receipt No: `, 130, 53);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text(payment.receiptNo, 155, 53);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Date of Issue: `, 130, 59);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text(payment.paymentDate, 155, 59);

  // Student Details Card
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, 68, 180, 48, 2, 2, 'FD');

  doc.setTextColor(30, 58, 138);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('STUDENT & COURSE INFORMATION', 20, 76);

  // Left Column
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Student ID:', 20, 84);
  doc.text('Student Name:', 20, 91);
  doc.text('Parent / Guardian:', 20, 98);
  doc.text('Contact Phone:', 20, 105);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text(student.studentId, 55, 84);
  doc.text(student.name, 55, 91);
  doc.text(student.parentName, 55, 98);
  doc.text(student.phone, 55, 105);

  // Right Column
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Class / Grade:', 110, 84);
  doc.text('Course Enrolled:', 110, 91);
  doc.text('Assigned Batch:', 110, 98);
  doc.text('Roll Number:', 110, 105);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text(student.studentClass, 145, 84);
  doc.text(courseName.length > 22 ? courseName.slice(0, 20) + '...' : courseName, 145, 91);
  doc.text(batchName.length > 22 ? batchName.slice(0, 20) + '...' : batchName, 145, 98);
  doc.text(student.rollNo || 'APX-01', 145, 105);

  // Payment Breakdown Table
  // Table Header
  doc.setFillColor(30, 58, 138);
  doc.rect(15, 124, 180, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('SL', 20, 129);
  doc.text('DESCRIPTION / PARTICULARS', 35, 129);
  doc.text('BILLING PERIOD', 115, 129);
  doc.text('AMOUNT (INR)', 170, 129, { align: 'right' });

  // Table Row 1
  doc.setFillColor(255, 255, 255);
  doc.rect(15, 132, 180, 12, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.line(15, 144, 195, 144);

  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('1.', 20, 139);
  doc.setFont('helvetica', 'bold');
  doc.text('Monthly Classroom Tuition & Faculty Mentorship Fee', 35, 139);
  doc.setFont('helvetica', 'normal');
  doc.text(payment.feeMonth, 115, 139);
  doc.setFont('helvetica', 'bold');
  doc.text(`INR ${payment.amount.toLocaleString('en-IN')}`, 190, 139, { align: 'right' });

  // Payment Summary Box
  const summaryTop = 152;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, summaryTop, 90, 45, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 58, 138);
  doc.text('TRANSACTION DETAILS', 20, summaryTop + 7);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Payment Mode:', 20, summaryTop + 15);
  doc.text('Transaction Ref ID:', 20, summaryTop + 22);
  doc.text('Authorized Collector:', 20, summaryTop + 29);
  doc.text('Status:', 20, summaryTop + 36);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text(payment.paymentMode, 55, summaryTop + 15);
  doc.text(payment.transactionRef || 'OFFLINE-CASH', 55, summaryTop + 22);
  doc.text(payment.collectedBy || 'Accounts Office', 55, summaryTop + 29);
  doc.setTextColor(16, 185, 129); // Green
  doc.text('CONFIRMED / PAID', 55, summaryTop + 36);

  // Financial Breakdown Box (Right Side)
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(110, summaryTop, 85, 45, 2, 2, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Tuition Fee:', 115, summaryTop + 10);
  doc.text('Previous Outstanding:', 115, summaryTop + 18);
  doc.text('Total Paid Amount:', 115, summaryTop + 26);
  doc.text('Remaining Balance Due:', 115, summaryTop + 36);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text(`INR ${payment.amount.toLocaleString('en-IN')}`, 190, summaryTop + 10, { align: 'right' });
  doc.text(`INR ${payment.previousDue.toLocaleString('en-IN')}`, 190, summaryTop + 18, { align: 'right' });
  
  doc.setTextColor(30, 58, 138);
  doc.setFontSize(11);
  doc.text(`INR ${payment.amount.toLocaleString('en-IN')}`, 190, summaryTop + 26, { align: 'right' });

  doc.setFontSize(9);
  doc.setTextColor(payment.remainingBalance > 0 ? 220 : 16, payment.remainingBalance > 0 ? 38 : 185, payment.remainingBalance > 0 ? 38 : 129);
  doc.text(`INR ${payment.remainingBalance.toLocaleString('en-IN')}`, 190, summaryTop + 36, { align: 'right' });

  // Terms & Rules
  const termsTop = 205;
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('TERMS & CONDITIONS:', 15, termsTop);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('1. Fees once paid for offline physical batches are strictly non-refundable and non-transferable.', 15, termsTop + 5);
  doc.text('2. Please retain this official digital fee receipt for all future administrative and batch verification purposes.', 15, termsTop + 9);
  doc.text('3. Monthly tuition fees must be cleared by the 10th of every calendar month to maintain active classroom attendance.', 15, termsTop + 13);
  doc.text('4. This is an authenticated computer-generated payment voucher issued by Apex Tuition Management System.', 15, termsTop + 17);

  // Signatures Section
  const sigTop = 240;
  doc.setDrawColor(200, 210, 230);
  doc.line(20, sigTop + 18, 75, sigTop + 18);
  doc.line(135, sigTop + 18, 190, sigTop + 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("Student / Parent Signature", 30, sigTop + 23);
  doc.text("Authorized Institute Seal & Signature", 140, sigTop + 23);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 138);
  doc.text(`[ APEX TUITION VERIFIED ]`, 145, sigTop + 14);

  // Footer Note
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`${settings.address}, ${settings.city}, ${settings.state} - ${settings.pincode} | Office: ${settings.officeHours}`, 105, 275, { align: 'center' });

  return doc;
}

export function downloadFeeReceipt(
  payment: FeePayment,
  student: Student,
  courseName: string,
  batchName: string,
  settings: WebsiteSettings
) {
  const doc = generateFeeReceiptPDF(payment, student, courseName, batchName, settings);
  doc.save(`FeeReceipt_${payment.receiptNo}_${student.studentId}.pdf`);
}

export function generateFeeReceiptPdf(
  payment: FeePayment,
  student: Student,
  settingsOrCourse?: any,
  batchName?: string,
  settings?: WebsiteSettings
) {
  let finalSettings = settings;
  let cName = typeof settingsOrCourse === 'string' ? settingsOrCourse : 'Class Course';
  let bName = batchName || 'Standard Batch';
  if (typeof settingsOrCourse === 'object' && settingsOrCourse !== null && !finalSettings) {
    finalSettings = settingsOrCourse as WebsiteSettings;
  }
  const defaultSettings: WebsiteSettings = finalSettings || {
    instituteName: 'APEX SCIENCE & COMMERCE ACADEMY',
    tagline: 'Premier Offline Tuition & Coaching Institute',
    foundedYear: '2012',
    phone: '+91 98765 43210',
    altPhone: '+91 98765 43211',
    email: 'admissions@apextuition.com',
    address: 'Plot 42, Knowledge Park, Near Central Metro',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302015',
    landmark: 'Opposite State Library',
    officeHours: 'Mon - Sat: 08:00 AM - 08:00 PM',
    regNumber: 'RJ/COACH/2026/9182',
    lightLogo: '',
    darkLogo: '',
    favicon: '',
    heroTitle: '',
    heroSubtitle: '',
    heroBadge: '',
    primaryColor: '#1e3a8a',
    stats: {
      studentsTaught: '4,500+',
      successRate: '98.4%',
      expertFaculty: '18+',
      topRanks: '120+',
      batchSizeLimit: '25 Max',
    },
    results: [],
    testimonials: [],
    gallery: [],
    socialLinks: {},
  };

  const doc = generateFeeReceiptPDF(payment, student, cName, bName, defaultSettings);
  doc.save(`FeeReceipt_${payment.receiptNo || 'REC'}_${student.studentId || student.rollNo || 'STU'}.pdf`);
}
