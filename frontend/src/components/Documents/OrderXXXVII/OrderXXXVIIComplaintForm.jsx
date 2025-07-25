import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderXXXVIIComplaintForm.css';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { OrderXXXVIIComplaintPDF } from './OrderXXXVIIComplaintPDF';
import OrderXXXVIIPdfPreviewModal from './OrderXXXVIIPdfPreviewModal';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
} from 'docx';
import { saveAs } from 'file-saver';

function OrderXXXVIIComplaintForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pdfData, setPdfData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    // Plaintiff Details
    plaintiffCompanyName: '',
    plaintiffRegisteredOffice: '',
    plaintiffDirectorName: '',
    plaintiffPhone: '',
    plaintiffEmail: '',
    plaintiffBusinessType: '',
    
    // Defendant Details
    defendantCompanyName: '',
    defendantRegisteredOffice: '',
    defendantDirectorName: '',
    defendantPhone: '',
    defendantBusinessType: '',
    
    // Court Details
    district: '',
    state: '',
    suitNumber: '',
    suitYear: '',
    
    // Financial Details
    principalAmount: '',
    principalAmountWords: '',
    interestRate: '',
    interestFrom: '',
    totalClaimAmount: '',
    
    // Contract/Agreement Details
    contractDate: '',
    contractType: '',
    contractDescription: '',
    workCompletionDate: '',
    deliveryDate: '',
    
    // Bill/Invoice Details
    billNumber: '',
    billDate: '',
    billAmount: '',
    billDescription: '',
    
    // Payment Terms
    paymentTerms: '',
    paymentDueDate: '',
    gracePeriod: '',
    
    // Demand Details
    firstDemandDate: '',
    demandNoticeDate: '',
    demandNoticeMode: 'registered_post',
    demandTrackingNumber: '',
    finalDemandDate: '',
    
    // Jurisdiction Details
    causeOfAction: '',
    jurisdictionReason: '',
    contractPlace: '',
    
    // Legal Details
    advocateName: '',
    limitationPeriod: '',
    courtFeeValue: '',
    
    // Relief Details
    interestClaimed: '',
    compensationAmount: '',
    additionalDamages: '',
    otherReliefs: '',
    
    // Supporting Documents
    contractDocuments: '',
    billCopies: '',
    correspondenceRecords: '',
    witnessDetails: '',
    additionalEvidence: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPdfData(null);

    try {
      const response = await fetch('https://mishratejass01.app.n8n.cloud/webhook/order37-suit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setPdfData(Array.isArray(data) ? data[0] : data);
        setShowPreview(true);
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      setError('Failed to generate suit. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleWordDownload = (pdfData) => {
    if (!pdfData) return;

    const doc = new Document({
      numbering: {
        config: [
          {
            reference: "order37-numbering",
            levels: [
              {
                level: 0,
                format: "decimal",
                text: "%1.",
                alignment: AlignmentType.START,
                style: {
                  paragraph: {
                    indent: { left: 720, hanging: 360 },
                  },
                },
              },
            ],
          },
        ],
      },
      sections: [{
        children: [
          // Header
          new Paragraph({
            alignment: AlignmentType.CENTER,
            style: "strong",
            spacing: { before: 300, after: 200 },
            children: [new TextRun({
              text: "CIVIL PLEADINGS",
              bold: true,
              underline: { type: "single" },
            })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            style: "strong",
            spacing: { after: 300 },
            children: [new TextRun({
              text: "SUIT FOR RECOVERY UNDER ORDER XXXVII OF CPC",
              bold: true,
              underline: { type: "single" },
            })],
          }),
          
          // Court details
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [new TextRun({
              text: `IN THE COURT OF DISTRICT JUDGE (DISTRICT ${pdfData.courtDetails.district.toUpperCase()}), ${pdfData.courtDetails.state.toUpperCase()}`,
              bold: true,
            })],
          }),
          
          // Suit number
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [new TextRun({
              text: `SUIT NO ${pdfData.courtDetails.suitNumber} OF ${pdfData.courtDetails.suitYear}`,
              bold: true,
            })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [new TextRun({
              text: "(SUIT UNDER ORDER XXXVII OF THE CODE OF CIVIL PROCEDURE, 1908)",
              bold: true,
            })],
          }),
          
          new Paragraph({ 
            text: "IN THE MATTER OF:",
            spacing: { after: 200 },
            style: "strong"
          }),
          
          // Plaintiff details
          new Paragraph(`${pdfData.parties.plaintiff.companyName}`),
          new Paragraph("A Company Incorporated Under the"),
          new Paragraph("Companies Act, Having Its Registered Office"),
          new Paragraph(`At ${pdfData.parties.plaintiff.registeredOffice}`),
          new Paragraph("Through its Director"),
          new Paragraph(`Shri.${pdfData.parties.plaintiff.directorName}`),
          new Paragraph({
            text: "........... PLAINTIFF",
            alignment: AlignmentType.END,
            spacing: { before: 200, after: 300 },
            style: "strong"
          }),
          
          new Paragraph({
            text: "VERSUS",
            alignment: AlignmentType.CENTER,
            style: "strong",
            spacing: { before: 200, after: 200 }
          }),
          
          // Defendant details
          new Paragraph(`${pdfData.parties.defendant.companyName}`),
          new Paragraph("A Company Incorporated Under The"),
          new Paragraph("Companies Act, Having Its Registered Office"),
          new Paragraph(`At ${pdfData.parties.defendant.registeredOffice}`),
          new Paragraph("Through its Director"),
          new Paragraph(`Shri.${pdfData.parties.defendant.directorName}`),
          new Paragraph({
            text: "........ DEFENDANT",
            alignment: AlignmentType.END,
            spacing: { before: 200, after: 400 },
            style: "strong"
          }),
          
          // Suit title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            style: "strong",
            spacing: { before: 300, after: 300 },
            children: [new TextRun({
              text: `SUIT FOR RECOVERY OF RS. ${pdfData.financialDetails.principalAmount}/-(${pdfData.financialDetails.principalAmountWords}) UNDER ORDER XXXVII OF CODE OF CIVIL PROCEDURE, 1908`,
              bold: true,
              underline: { type: "single" },
            })],
          }),
          
          new Paragraph({
            style: "strong",
            spacing: { before: 200, after: 200 },
            children: [new TextRun({ text: "MOST RESPECTFULLY SHOWETH:", bold: true })],
          }),

          // Facts
          ...pdfData.facts.map((fact, index) => new Paragraph({
            children: [new TextRun({ text: fact })],
            numbering: {
              reference: "order37-numbering",
              level: 0,
            },
            spacing: { before: 200, after: 200 }
          })),

          // Prayer
          new Paragraph({ 
            children: [new TextRun({ text: "PRAYER:", bold: true })],
            style: "strong", 
            spacing: { before: 300, after: 150 } 
          }),
          new Paragraph({ text: "It is, therefore most respectfully prayed that this Hon'ble Court may be pleased to :-" }),
          new Paragraph({
            children: [new TextRun({ text: pdfData.prayer.reliefs })],
            spacing: { before: 200, after: 200 }
          }),

          // Footer
          new Table({
            columnWidths: [4500, 4500],
            width: { size: 9000, type: WidthType.DXA },
            spacing: { before: 400 },
            borders: {
              top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ 
                    children: [new Paragraph(`Place: ${pdfData.footer.place}`)] 
                  }),
                  new TableCell({ 
                    children: [new Paragraph({ text: "Plaintiff", alignment: AlignmentType.END })] 
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ 
                    children: [new Paragraph(`Date: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`)] 
                  }),
                  new TableCell({ 
                    children: [new Paragraph({ text: "Through", alignment: AlignmentType.END })] 
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [] }),
                  new TableCell({
                    children: [
                      new Paragraph({ text: pdfData.footer.advocateName, alignment: AlignmentType.END }),
                      new Paragraph({ text: "Advocate", style: "strong", alignment: AlignmentType.END }),
                    ]
                  }),
                ],
              }),
            ],
          }),
          
          // Verification
          new Paragraph({ 
            text: "VERIFICATION:", 
            style: "strong",
            spacing: { before: 300, after: 200 } 
          }),
          new Paragraph({ text: pdfData.footer.verification }),
          new Paragraph({ text: "Plaintiff", alignment: AlignmentType.END, spacing: { before: 300 } }),
          new Paragraph({ text: "[NOTE : The above plaint must be supported by an Affidavit]", spacing: { before: 400 } }),
          new Paragraph({ text: "* * * * *", alignment: AlignmentType.CENTER, spacing: { before: 200 } }),
        ],
      }],
      styles: {
        paragraph: {
          run: {
            size: 22,
            font: "Times New Roman",
          },
        },
        strong: {
          run: {
            bold: true,
          },
        },
      },
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, `Order_XXXVII_Suit_${pdfData.parties.plaintiff.companyName.replace(/\s+/g, '_')}.docx`);
    });
  };

  return (
    <div className="form-container">
      <h1>Order XXXVII Suit Form</h1>
      <form onSubmit={handleSubmit}>
        
        {/* Plaintiff Details Section */}
        <section className="form-section">
          <h2>Plaintiff Company Details</h2>
          <div className="form-group">
            <label htmlFor="plaintiffCompanyName">Company Name</label>
            <input
              type="text"
              id="plaintiffCompanyName"
              name="plaintiffCompanyName"
              value={formData.plaintiffCompanyName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="plaintiffRegisteredOffice">Registered Office Address</label>
            <textarea
              id="plaintiffRegisteredOffice"
              name="plaintiffRegisteredOffice"
              value={formData.plaintiffRegisteredOffice}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="plaintiffDirectorName">Director's Name</label>
            <input
              type="text"
              id="plaintiffDirectorName"
              name="plaintiffDirectorName"
              value={formData.plaintiffDirectorName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="plaintiffPhone">Phone Number</label>
            <input
              type="tel"
              id="plaintiffPhone"
              name="plaintiffPhone"
              value={formData.plaintiffPhone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="plaintiffEmail">Email Address</label>
            <input
              type="email"
              id="plaintiffEmail"
              name="plaintiffEmail"
              value={formData.plaintiffEmail}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="plaintiffBusinessType">Business Type</label>
            <input
              type="text"
              id="plaintiffBusinessType"
              name="plaintiffBusinessType"
              value={formData.plaintiffBusinessType}
              onChange={handleChange}
              placeholder="e.g., construction, engineering and designing"
              required
            />
          </div>
        </section>

        {/* Defendant Details Section */}
        <section className="form-section">
          <h2>Defendant Company Details</h2>
          <div className="form-group">
            <label htmlFor="defendantCompanyName">Company Name</label>
            <input
              type="text"
              id="defendantCompanyName"
              name="defendantCompanyName"
              value={formData.defendantCompanyName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="defendantRegisteredOffice">Registered Office Address</label>
            <textarea
              id="defendantRegisteredOffice"
              name="defendantRegisteredOffice"
              value={formData.defendantRegisteredOffice}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="defendantDirectorName">Director's Name</label>
            <input
              type="text"
              id="defendantDirectorName"
              name="defendantDirectorName"
              value={formData.defendantDirectorName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="defendantPhone">Phone Number (if known)</label>
            <input
              type="tel"
              id="defendantPhone"
              name="defendantPhone"
              value={formData.defendantPhone}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="defendantBusinessType">Business Type</label>
            <input
              type="text"
              id="defendantBusinessType"
              name="defendantBusinessType"
              value={formData.defendantBusinessType}
              onChange={handleChange}
              placeholder="e.g., paper mill manufacturing"
            />
          </div>
        </section>

        {/* Court Details Section */}
        <section className="form-section">
          <h2>Court Details</h2>
          <div className="form-group">
            <label htmlFor="district">District</label>
            <input
              type="text"
              id="district"
              name="district"
              value={formData.district}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="state">State</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="suitNumber">Suit Number</label>
            <input
              type="text"
              id="suitNumber"
              name="suitNumber"
              value={formData.suitNumber}
              onChange={handleChange}
              placeholder="e.g., 4109"
            />
          </div>
          <div className="form-group">
            <label htmlFor="suitYear">Suit Year</label>
            <input
              type="number"
              id="suitYear"
              name="suitYear"
              value={formData.suitYear}
              onChange={handleChange}
              min="2000"
              max="2030"
              placeholder="2025"
            />
          </div>
        </section>

        {/* Financial Details Section */}
        <section className="form-section">
          <h2>Financial Details</h2>
          <div className="form-group">
            <label htmlFor="principalAmount">Principal Amount (₹)</label>
            <input
              type="number"
              id="principalAmount"
              name="principalAmount"
              value={formData.principalAmount}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label htmlFor="principalAmountWords">Principal Amount (in words)</label>
            <input
              type="text"
              id="principalAmountWords"
              name="principalAmountWords"
              value={formData.principalAmountWords}
              onChange={handleChange}
              required
              placeholder="e.g., Four Lakhs Nineteen Thousand Two Hundred Only"
            />
          </div>
          <div className="form-group">
            <label htmlFor="interestRate">Interest Rate (%)</label>
            <input
              type="number"
              id="interestRate"
              name="interestRate"
              value={formData.interestRate}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.01"
              placeholder="18"
            />
          </div>
          <div className="form-group">
            <label htmlFor="interestFrom">Interest From Date</label>
            <input
              type="date"
              id="interestFrom"
              name="interestFrom"
              value={formData.interestFrom}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="totalClaimAmount">Total Claim Amount (₹)</label>
            <input
              type="number"
              id="totalClaimAmount"
              name="totalClaimAmount"
              value={formData.totalClaimAmount}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div>
        </section>

        {/* Contract/Agreement Details Section */}
        <section className="form-section">
          <h2>Contract/Agreement Details</h2>
          <div className="form-group">
            <label htmlFor="contractDate">Contract/Agreement Date</label>
            <input
              type="date"
              id="contractDate"
              name="contractDate"
              value={formData.contractDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="contractType">Type of Contract</label>
            <select
              id="contractType"
              name="contractType"
              value={formData.contractType}
              onChange={handleChange}
              required
            >
              <option value="">Select Contract Type</option>
              <option value="construction">Construction Contract</option>
              <option value="supply">Supply Contract</option>
              <option value="service">Service Contract</option>
              <option value="manufacturing">Manufacturing Contract</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="contractDescription">Contract Description</label>
            <textarea
              id="contractDescription"
              name="contractDescription"
              value={formData.contractDescription}
              onChange={handleChange}
              placeholder="Describe the work/service agreed upon"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="workCompletionDate">Work Completion Date</label>
            <input
              type="date"
              id="workCompletionDate"
              name="workCompletionDate"
              value={formData.workCompletionDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="deliveryDate">Delivery/Handover Date</label>
            <input
              type="date"
              id="deliveryDate"
              name="deliveryDate"
              value={formData.deliveryDate}
              onChange={handleChange}
            />
          </div>
        </section>

        {/* Bill/Invoice Details Section */}
        <section className="form-section">
          <h2>Bill/Invoice Details</h2>
          <div className="form-group">
            <label htmlFor="billNumber">Bill/Invoice Number</label>
            <input
              type="text"
              id="billNumber"
              name="billNumber"
              value={formData.billNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="billDate">Bill/Invoice Date</label>
            <input
              type="date"
              id="billDate"
              name="billDate"
              value={formData.billDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="billAmount">Bill Amount (₹)</label>
            <input
              type="number"
              id="billAmount"
              name="billAmount"
              value={formData.billAmount}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label htmlFor="billDescription">Bill Description</label>
            <textarea
              id="billDescription"
              name="billDescription"
              value={formData.billDescription}
              onChange={handleChange}
              placeholder="Description of the final bill raised"
            />
          </div>
        </section>

        {/* Payment Terms Section */}
        <section className="form-section">
          <h2>Payment Terms</h2>
          <div className="form-group">
            <label htmlFor="paymentTerms">Payment Terms</label>
            <textarea
              id="paymentTerms"
              name="paymentTerms"
              value={formData.paymentTerms}
              onChange={handleChange}
              placeholder="Describe the agreed payment terms"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="paymentDueDate">Payment Due Date</label>
            <input
              type="date"
              id="paymentDueDate"
              name="paymentDueDate"
              value={formData.paymentDueDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="gracePeriod">Grace Period (days)</label>
            <input
              type="number"
              id="gracePeriod"
              name="gracePeriod"
              value={formData.gracePeriod}
              onChange={handleChange}
              min="0"
              placeholder="30"
            />
          </div>
        </section>

        {/* Demand Details Section */}
        <section className="form-section">
          <h2>Demand Details</h2>
          <div className="form-group">
            <label htmlFor="firstDemandDate">First Demand Date</label>
            <input
              type="date"
              id="firstDemandDate"
              name="firstDemandDate"
              value={formData.firstDemandDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="demandNoticeDate">Legal Demand Notice Date</label>
            <input
              type="date"
              id="demandNoticeDate"
              name="demandNoticeDate"
              value={formData.demandNoticeDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="demandNoticeMode">Mode of Sending Notice</label>
            <select
              id="demandNoticeMode"
              name="demandNoticeMode"
              value={formData.demandNoticeMode}
              onChange={handleChange}
              required
            >
              <option value="registered_post">Registered Post</option>
              <option value="speed_post">Speed Post</option>
              <option value="courier">Courier</option>
              <option value="email">Email</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="demandTrackingNumber">Tracking/Receipt Number</label>
            <input
              type="text"
              id="demandTrackingNumber"
              name="demandTrackingNumber"
              value={formData.demandTrackingNumber}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="finalDemandDate">Final Demand Date</label>
            <input
              type="date"
              id="finalDemandDate"
              name="finalDemandDate"
              value={formData.finalDemandDate}
              onChange={handleChange}
            />
          </div>
        </section>

        {/* Jurisdiction Details Section */}
        <section className="form-section">
          <h2>Jurisdiction Details</h2>
          <div className="form-group">
            <label htmlFor="causeOfAction">Cause of Action</label>
            <textarea
              id="causeOfAction"
              name="causeOfAction"
              value={formData.causeOfAction}
              onChange={handleChange}
              placeholder="Explain when and where the cause of action arose"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="jurisdictionReason">Jurisdiction Reason</label>
            <textarea
              id="jurisdictionReason"
              name="jurisdictionReason"
              value={formData.jurisdictionReason}
              onChange={handleChange}
              placeholder="Explain why this court has jurisdiction"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="contractPlace">Place of Contract Execution</label>
            <input
              type="text"
              id="contractPlace"
              name="contractPlace"
              value={formData.contractPlace}
              onChange={handleChange}
              required
            />
          </div>
        </section>

        {/* Legal Details Section */}
        <section className="form-section">
          <h2>Legal Details</h2>
          <div className="form-group">
            <label htmlFor="advocateName">Advocate's Name</label>
            <input
              type="text"
              id="advocateName"
              name="advocateName"
              value={formData.advocateName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="limitationPeriod">Limitation Period Status</label>
            <textarea
              id="limitationPeriod"
              name="limitationPeriod"
              value={formData.limitationPeriod}
              onChange={handleChange}
              placeholder="Confirm the suit is within limitation period"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="courtFeeValue">Court Fee Valuation (₹)</label>
            <input
              type="number"
              id="courtFeeValue"
              name="courtFeeValue"
              value={formData.courtFeeValue}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div>
        </section>

        {/* Relief Details Section */}
        <section className="form-section">
          <h2>Relief Sought</h2>
          <div className="form-group">
            <label htmlFor="interestClaimed">Interest Claimed</label>
            <textarea
              id="interestClaimed"
              name="interestClaimed"
              value={formData.interestClaimed}
              onChange={handleChange}
              placeholder="Details of interest claimed including rate and period"
            />
          </div>
          <div className="form-group">
            <label htmlFor="compensationAmount">Compensation Amount (₹)</label>
            <input
              type="number"
              id="compensationAmount"
              name="compensationAmount"
              value={formData.compensationAmount}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label htmlFor="additionalDamages">Additional Damages (₹)</label>
            <input
              type="number"
              id="additionalDamages"
              name="additionalDamages"
              value={formData.additionalDamages}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label htmlFor="otherReliefs">Other Reliefs Sought</label>
            <textarea
              id="otherReliefs"
              name="otherReliefs"
              value={formData.otherReliefs}
              onChange={handleChange}
              placeholder="Any other reliefs or orders sought"
            />
          </div>
        </section>

        {/* Supporting Documents Section */}
        <section className="form-section">
          <h2>Supporting Documents</h2>
          <div className="form-group">
            <label htmlFor="contractDocuments">Contract/Agreement Documents</label>
            <textarea
              id="contractDocuments"
              name="contractDocuments"
              value={formData.contractDocuments}
              onChange={handleChange}
              placeholder="List of contract documents available"
            />
          </div>
          <div className="form-group">
            <label htmlFor="billCopies">Bill/Invoice Copies</label>
            <textarea
              id="billCopies"
              name="billCopies"
              value={formData.billCopies}
              onChange={handleChange}
              placeholder="Details of bills and invoices"
            />
          </div>
          <div className="form-group">
            <label htmlFor="correspondenceRecords">Correspondence Records</label>
            <textarea
              id="correspondenceRecords"
              name="correspondenceRecords"
              value={formData.correspondenceRecords}
              onChange={handleChange}
              placeholder="Email, letter exchanges, etc."
            />
          </div>
          <div className="form-group">
            <label htmlFor="witnessDetails">Witness Details</label>
            <textarea
              id="witnessDetails"
              name="witnessDetails"
              value={formData.witnessDetails}
              onChange={handleChange}
              placeholder="Details of any witnesses"
            />
          </div>
          <div className="form-group">
            <label htmlFor="additionalEvidence">Additional Evidence</label>
            <textarea
              id="additionalEvidence"
              name="additionalEvidence"
              value={formData.additionalEvidence}
              onChange={handleChange}
              placeholder="Any other supporting evidence"
            />
          </div>
        </section>

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/documents')}>
            Cancel
          </button>
          <button type="submit" disabled={loading}>
            {loading ? 'Generating Document...' : 'Submit Suit'}
          </button>
        </div>
      </form>
      
      {showPreview && pdfData && (
        <OrderXXXVIIPdfPreviewModal
          data={pdfData}
          onClose={() => setShowPreview(false)}
          onWordDownload={() => handleWordDownload(pdfData)}
        />
      )}
      
      {pdfData && (
        <div className="download-section">
          <h2>Suit Ready</h2>
          <p>Your Order XXXVII suit has been generated successfully.</p>
          <div className="download-buttons-row">
            <PDFDownloadLink
              document={<OrderXXXVIIComplaintPDF data={pdfData} />}
              fileName={`Order_XXXVII_Suit_${pdfData.parties?.plaintiff?.companyName?.replace(/\s+/g, '_') || 'document'}.pdf`}
            >
              {({ loading: pdfLoading }) => (
                <button className="download-btn" disabled={pdfLoading}>
                  {pdfLoading ? 'Loading document...' : '📄 Download PDF'}
                </button>
              )}
            </PDFDownloadLink>
            <button className="download-btn" onClick={() => handleWordDownload(pdfData)}>
              📝 Download Word Document
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderXXXVIIComplaintForm;