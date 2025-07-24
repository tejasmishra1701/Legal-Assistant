import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Section138ComplaintForm.css';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Section138ComplaintPDF } from './Section138ComplaintPDF';
import Section138PdfPreviewModal from './Section138PdfPreviewModal';
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

function Section138ComplaintForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pdfData, setPdfData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    // Complainant Details
    complainantName: '',
    complainantAddress: '',
    complainantPhone: '',
    complainantEmail: '',
    complainantOccupation: '',
    // Accused Details
    accusedName: '',
    accusedAddress: '',
    accusedPhone: '',
    accusedOccupation: '',
    // Cheque Particulars
    chequeNumber: '',
    chequeDate: '',
    chequeAmount: '',
    chequeAmountWords: '',
    bankName: '',
    bankBranch: '',
    accountNumber: '',
    // Facts of Dishonour
    presentationDate: '',
    dishonourDate: '',
    dishonourReason: '',
    bankMemoDate: '',
    // Demand Notice Details
    noticeDate: '',
    noticeMode: 'registered_post',
    noticeTrackingNumber: '',
    noticeDeliveryDate: '',
    // Non-Payment Details
    paymentDueDate: '',
    nonPaymentConfirmation: '',
    // Jurisdiction Details
    causeOfAction: '',
    courtJurisdiction: '',
    district: '',
    state: '',
    // Case Details
    caseNumber: '',
    advocateName: '',
    // Relief Details
    compensationAmount: '',
    additionalReliefs: '',
    // Transaction Details
    transactionPurpose: '',
    transactionDate: '',
    witnessDetails: '',
    additionalInfo: ''
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
      const response = await fetch('https://mishratejass01.app.n8n.cloud/webhook/section138-complaint', {
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
      setError('Failed to generate complaint. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleWordDownload = (pdfData) => {
    if (!pdfData) return;

    const { courtDetails, parties, complaintTitle, complaintBody, prayer, footer } = pdfData;
    
    const doc = new Document({
      numbering: {
        config: [
          {
            reference: "section138-numbering",
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
          new Paragraph({
            alignment: AlignmentType.CENTER,
            style: "strong",
            heading: "Heading2",
            spacing: { before: 300, after: 300 },
            children: [new TextRun({
              text: `IN THE COURT OF ${pdfData.courtDetails.courtType} (DISTRICT ${pdfData.courtDetails.district}), ${pdfData.courtDetails.state}`,
              color: "#000000",
              bold: true,
            })],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `${pdfData.courtDetails.complaintType} NO. ${pdfData.courtDetails.complaintNumber} OF ${pdfData.courtDetails.complaintYear}`,
                bold: true,
              }),
            ],
            alignment: AlignmentType.END,
            spacing: { after: 200 },
          }),
          new Paragraph({ text: "IN THE MATTER OF:", spacing: { after: 200 } }),
          
          // Complainant table
          new Table({
            columnWidths: [4500, 4500],
            width: { size: 9000, type: WidthType.DXA },
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
                    children: [
                      new Paragraph(pdfData.parties.complainant.name),
                      new Paragraph(`R/o ${pdfData.parties.complainant.address}`),
                    ],
                  }),
                  new TableCell({
                    children: [new Paragraph({ 
                      style: "strong", 
                      alignment: AlignmentType.END, 
                      children: [new TextRun({ text: ".....COMPLAINANT", bold: true })],
                    })],
                    verticalAlign: "center",
                  }),
                ],
              }),
            ],
          }),
          
          new Paragraph({
            alignment: AlignmentType.CENTER,
            style: "strong",
            children: [new TextRun({ text: "VERSUS", bold: true, spacing: { before: 300, after: 300 } })]
          }),
          
          // Accused table
          new Table({
            columnWidths: [4500, 4500],
            width: { size: 9000, type: WidthType.DXA },
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
                    children: [
                      new Paragraph(pdfData.parties.accused.name),
                      new Paragraph(`R/o ${pdfData.parties.accused.address}`),
                    ],
                  }),
                  new TableCell({
                    children: [new Paragraph({
                      style: "strong",
                      alignment: AlignmentType.END,
                      children: [new TextRun({ text: ".....ACCUSED", bold: true })],
                    })],
                    verticalAlign: "center",
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            style: "strong",
            heading: "Heading3",
            spacing: { before: 300, after: 300 },
            children: [
              new TextRun({
                text: complaintTitle,
                bold: true,
                underline: { type: "single" },
                color: "#000000",
              }),
            ],
          }),

          new Paragraph({
            style: "strong",
            spacing: { before: 200, after: 200 },
            children: [new TextRun({ text: complaintBody.introduction, bold: true })],
          }),

          ...complaintBody.facts.map(fact => new Paragraph({
            children: [new TextRun({ text: fact })],
            numbering: {
              reference: "section138-numbering",
              level: 0,
            },
            spacing: { before: 200, after: 200 }
          })),

          new Paragraph({ 
            children: [new TextRun({ text: prayer.heading, bold: true })],
            style: "strong", 
            spacing: { before: 300, after: 150 } 
          }),
          new Paragraph({
            children: [new TextRun({ text: prayer.text })],
            spacing: { after: 200 }
          }),

          // Footer table
          new Table({
            columnWidths: [4500, 4500],
            width: { size: 9000, type: WidthType.DXA },
            spacing: { before: 200, after: 200 },
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
                    spacing: { before: 200, after: 200 }, 
                    children: [new Paragraph(`Place: ${pdfData.footer.place}`)] 
                  }),
                  new TableCell({ 
                    spacing: { before: 200, after: 200 }, 
                    children: [new Paragraph({ text: "COMPLAINANT", style: "strong", alignment: AlignmentType.END })] 
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ 
                    spacing: { before: 200, after: 200 }, 
                    children: [new Paragraph(`Date: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`)] 
                  }),
                  new TableCell({ 
                    spacing: { before: 200, after: 200 }, 
                    children: [new Paragraph({ text: "THROUGH", alignment: AlignmentType.END })] 
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [] }),
                  new TableCell({
                    children: [
                      new Paragraph({ text: pdfData.footer.advocateName, alignment: AlignmentType.END }),
                      new Paragraph({ text: "ADVOCATE", style: "strong", alignment: AlignmentType.END }),
                    ]
                  }),
                ],
              }),
            ],
          }),
          
          new Paragraph({ text: pdfData.footer.verification, spacing: { before: 200 } }),
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
        heading1: {
          run: {
            size: 24,
            bold: true,
          },
        },
      },
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, `Section_138_Complaint_${pdfData.parties.complainant.name.replace(/\s+/g, '_')}.docx`);
    });
  };

  return (
    <div className="form-container">
      <h1>Section 138 Complaint Form</h1>
      <form onSubmit={handleSubmit}>
        {/* Complainant Details Section */}
        <section className="form-section">
          <h2>Complainant Details</h2>
          <div className="form-group">
            <label htmlFor="complainantName">Full Name of Complainant</label>
            <input
              type="text"
              id="complainantName"
              name="complainantName"
              value={formData.complainantName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="complainantAddress">Complete Address</label>
            <textarea
              id="complainantAddress"
              name="complainantAddress"
              value={formData.complainantAddress}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="complainantPhone">Phone Number</label>
            <input
              type="tel"
              id="complainantPhone"
              name="complainantPhone"
              value={formData.complainantPhone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="complainantEmail">Email Address</label>
            <input
              type="email"
              id="complainantEmail"
              name="complainantEmail"
              value={formData.complainantEmail}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="complainantOccupation">Occupation</label>
            <input
              type="text"
              id="complainantOccupation"
              name="complainantOccupation"
              value={formData.complainantOccupation}
              onChange={handleChange}
              required
            />
          </div>
        </section>

        {/* Accused Details Section */}
        <section className="form-section">
          <h2>Accused Details</h2>
          <div className="form-group">
            <label htmlFor="accusedName">Full Name of Accused</label>
            <input
              type="text"
              id="accusedName"
              name="accusedName"
              value={formData.accusedName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="accusedAddress">Complete Address</label>
            <textarea
              id="accusedAddress"
              name="accusedAddress"
              value={formData.accusedAddress}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="accusedPhone">Phone Number (if known)</label>
            <input
              type="tel"
              id="accusedPhone"
              name="accusedPhone"
              value={formData.accusedPhone}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="accusedOccupation">Occupation (if known)</label>
            <input
              type="text"
              id="accusedOccupation"
              name="accusedOccupation"
              value={formData.accusedOccupation}
              onChange={handleChange}
            />
          </div>
        </section>

        {/* Cheque Particulars Section */}
        <section className="form-section">
          <h2>Cheque Particulars</h2>
          <div className="form-group">
            <label htmlFor="chequeNumber">Cheque Number</label>
            <input
              type="text"
              id="chequeNumber"
              name="chequeNumber"
              value={formData.chequeNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="chequeDate">Cheque Date</label>
            <input
              type="date"
              id="chequeDate"
              name="chequeDate"
              value={formData.chequeDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="chequeAmount">Cheque Amount (in figures)</label>
            <input
              type="number"
              id="chequeAmount"
              name="chequeAmount"
              value={formData.chequeAmount}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label htmlFor="chequeAmountWords">Cheque Amount (in words)</label>
            <input
              type="text"
              id="chequeAmountWords"
              name="chequeAmountWords"
              value={formData.chequeAmountWords}
              onChange={handleChange}
              required
              placeholder="e.g., One Lakh Only"
            />
          </div>
          <div className="form-group">
            <label htmlFor="bankName">Bank Name</label>
            <input
              type="text"
              id="bankName"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="bankBranch">Bank Branch</label>
            <input
              type="text"
              id="bankBranch"
              name="bankBranch"
              value={formData.bankBranch}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="accountNumber">Account Number</label>
            <input
              type="text"
              id="accountNumber"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              required
            />
          </div>
        </section>

        {/* Transaction Details Section */}
        <section className="form-section">
          <h2>Transaction Details</h2>
          <div className="form-group">
            <label htmlFor="transactionPurpose">Purpose of Transaction</label>
            <textarea
              id="transactionPurpose"
              name="transactionPurpose"
              value={formData.transactionPurpose}
              onChange={handleChange}
              placeholder="Describe the purpose for which the cheque was given"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="transactionDate">Transaction Date</label>
            <input
              type="date"
              id="transactionDate"
              name="transactionDate"
              value={formData.transactionDate}
              onChange={handleChange}
              required
            />
          </div>
        </section>

        {/* Facts of Dishonour Section */}
        <section className="form-section">
          <h2>Facts of Dishonour</h2>
          <div className="form-group">
            <label htmlFor="presentationDate">Date of Presentation for Encashment</label>
            <input
              type="date"
              id="presentationDate"
              name="presentationDate"
              value={formData.presentationDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="dishonourDate">Date of Dishonour</label>
            <input
              type="date"
              id="dishonourDate"
              name="dishonourDate"
              value={formData.dishonourDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="dishonourReason">Reason for Dishonour</label>
            <select
              id="dishonourReason"
              name="dishonourReason"
              value={formData.dishonourReason}
              onChange={handleChange}
              required
            >
              <option value="">Select Reason</option>
              <option value="insufficient_funds">Insufficient Funds</option>
              <option value="account_closed">Account Closed</option>
              <option value="signature_mismatch">Signature Mismatch</option>
              <option value="amount_differs">Amount Differs</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="bankMemoDate">Bank Memo/Return Date</label>
            <input
              type="date"
              id="bankMemoDate"
              name="bankMemoDate"
              value={formData.bankMemoDate}
              onChange={handleChange}
              required
            />
          </div>
        </section>

        {/* Demand Notice Section */}
        <section className="form-section">
          <h2>Demand Notice Details</h2>
          <div className="form-group">
            <label htmlFor="noticeDate">Notice Dispatch Date</label>
            <input
              type="date"
              id="noticeDate"
              name="noticeDate"
              value={formData.noticeDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="noticeMode">Mode of Sending Notice</label>
            <select
              id="noticeMode"
              name="noticeMode"
              value={formData.noticeMode}
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
            <label htmlFor="noticeTrackingNumber">Tracking/Receipt Number</label>
            <input
              type="text"
              id="noticeTrackingNumber"
              name="noticeTrackingNumber"
              value={formData.noticeTrackingNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="noticeDeliveryDate">Notice Delivery Date</label>
            <input
              type="date"
              id="noticeDeliveryDate"
              name="noticeDeliveryDate"
              value={formData.noticeDeliveryDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="paymentDueDate">Payment Due Date (15 days from notice)</label>
            <input
              type="date"
              id="paymentDueDate"
              name="paymentDueDate"
              value={formData.paymentDueDate}
              onChange={handleChange}
              required
            />
          </div>
        </section>

        {/* Non-Payment Details Section */}
        <section className="form-section">
          <h2>Non-Payment Details</h2>
          <div className="form-group">
            <label htmlFor="nonPaymentConfirmation">Confirmation of Non-Payment</label>
            <textarea
              id="nonPaymentConfirmation"
              name="nonPaymentConfirmation"
              value={formData.nonPaymentConfirmation}
              onChange={handleChange}
              placeholder="Confirm that the accused failed to pay within 15 days"
              required
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
              placeholder="Explain why this court has jurisdiction"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="courtJurisdiction">Court Jurisdiction Details</label>
            <textarea
              id="courtJurisdiction"
              name="courtJurisdiction"
              value={formData.courtJurisdiction}
              onChange={handleChange}
              required
            />
          </div>
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
        </section>

        {/* Case Details Section */}
        <section className="form-section">
          <h2>Case Details</h2>
          <div className="form-group">
            <label htmlFor="caseNumber">Case Number (if filed)</label>
            <input
              type="text"
              id="caseNumber"
              name="caseNumber"
              value={formData.caseNumber}
              onChange={handleChange}
            />
          </div>
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
        </section>

        {/* Relief Details Section */}
        <section className="form-section">
          <h2>Relief Sought</h2>
          <div className="form-group">
            <label htmlFor="compensationAmount">Compensation Amount Sought</label>
            <input
              type="number"
              id="compensationAmount"
              name="compensationAmount"
              value={formData.compensationAmount}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="Amount sought as compensation"
            />
          </div>
          <div className="form-group">
            <label htmlFor="additionalReliefs">Additional Reliefs Sought</label>
            <textarea
              id="additionalReliefs"
              name="additionalReliefs"
              value={formData.additionalReliefs}
              onChange={handleChange}
              placeholder="Any additional reliefs or damages sought"
            />
          </div>
        </section>

        {/* Additional Information Section */}
        <section className="form-section">
          <h2>Additional Information</h2>
          <div className="form-group">
            <label htmlFor="witnessDetails">Witness Details (if any)</label>
            <textarea
              id="witnessDetails"
              name="witnessDetails"
              value={formData.witnessDetails}
              onChange={handleChange}
              placeholder="Details of any witnesses to the transaction"
            />
          </div>
          <div className="form-group">
            <label htmlFor="additionalInfo">Additional Information</label>
            <textarea
              id="additionalInfo"
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              placeholder="Any other relevant information"
            />
          </div>
        </section>

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/documents')}>
            Cancel
          </button>
          <button type="submit" disabled={loading}>
            {loading ? 'Generating Document...' : 'Submit Complaint'}
          </button>
        </div>
      </form>
      
      {showPreview && pdfData && (
        <Section138PdfPreviewModal
          data={pdfData}
          onClose={() => setShowPreview(false)}
          onWordDownload={() => handleWordDownload(pdfData)}
        />
      )}
      
      {pdfData && (
        <div className="download-section">
          <h2>Complaint Ready</h2>
          <p>Your Section 138 complaint has been generated successfully.</p>
          <div className="download-buttons-row">
            <PDFDownloadLink
              document={<Section138ComplaintPDF data={pdfData} />}
              fileName={`Section_138_Complaint_${pdfData.parties?.complainant?.name?.replace(/\s+/g, '_') || 'document'}.pdf`}
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

export default Section138ComplaintForm;