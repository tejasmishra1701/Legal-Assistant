import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SpecificPerformanceForm.css';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { SpecificPerformanceApplicationPDF } from './SpecificPerformanceApplicationPDF';
import SpecificPerformancePdfPreviewModal from './SpecificPerformancePDFPreviewModal.jsx';
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

function SpecificPerformanceForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pdfData, setPdfData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    // Plaintiff Information
    plaintiffName: '',
    plaintiffAge: '',
    plaintiffGuardianName: '',
    plaintiffGuardianRelation: 'father',
    plaintiffAddress: '',
    plaintiffOccupation: '',
    
    // Defendant Information
    defendantName: '',
    defendantAge: '',
    defendantGuardianName: '',
    defendantGuardianRelation: 'father',
    defendantAddress: '',
    defendantOccupation: '',
    
    // Court Details
    courtType: '',
    district: '',
    state: '',
    suitNumber: '',
    suitYear: '',
    advocateName: '',
    
    // Property Details
    propertyDescription: '',
    propertyBearingNumber: '',
    
    // Contract Details
    contractDate: '',
    contractAmount: '',
    earnestMoney: '',
    balanceAmount: '',
    saleExecutionDate: '',
    agreementTerms: '',
    
    // Performance Details
    plaintiffReadiness: '',
    defendantRefusal: '',
    legalNoticeDate: '',
    legalNoticeDetails: '',
    defendantResponse: '',
    
    // Cause of Action
    causeOfActionDate: '',
    additionalCauseOfAction: '',
    continuingCause: '',
    
    // Legal Grounds
    jurisdictionReason: '',
    limitationPeriod: '',
    courtFeesDetails: '',
    
    // Relief Sought
    specificPerformanceRelief: '',
    costOfSuit: '',
    additionalRelief: '',
    
    // Additional Information
    previousNegotiations: '',
    witnessDetails: '',
    supportingDocuments: '',
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
      const response = await fetch('https://mishratejass01.app.n8n.cloud/webhook/specific-performance', {
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
      setError('Failed to generate application. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleWordDownload = (pdfData) => {
    if (!pdfData) return;

    const { courtDetails, parties, applicationTitle, applicationSubtitle, applicationBody, prayer, footer, verification } = pdfData;
    console.log('Generating Word document with data:', pdfData);
    
    const doc = new Document({
      numbering: {
        config: [
          {
            reference: "specific-performance-numbering",
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
          {
            reference: "prayer-numbering",
            levels: [
              {
                level: 0,
                format: "lowerLetter",
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
            spacing: { before: 300, after: 150 },
            children: [new TextRun({
              text: pdfData.applicationTitle,
              color: "#000000",
              bold: true,
              underline: { type: "single" },
            })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            style: "strong",
            spacing: { after: 300 },
            children: [new TextRun({
              text: `IN THE COURT OF ${pdfData.courtDetails.courtType} COURT (DIST ${pdfData.courtDetails.district}), ${pdfData.courtDetails.state}`,
              color: "#000000",
              bold: true,
            })],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `SUIT NO. ${pdfData.courtDetails.suitNumber} OF ${pdfData.courtDetails.suitYear}`,
                bold: false,
              }),
            ],
            alignment: AlignmentType.END,
            spacing: { after: 200 },
          }),
          new Paragraph({ text: "IN THE MATTER OF :", spacing: { after: 200 } }),
          
          // Plaintiff details
          new Paragraph(`X ${pdfData.parties.plaintiff.name}`),
          new Paragraph(`S/o ${pdfData.parties.plaintiff.guardianName}`),
          new Paragraph(`R/o ${pdfData.parties.plaintiff.address}`),
          
          new Paragraph({
            children: [new TextRun({ text: "...PLAINTIFF", bold: true })],
            alignment: AlignmentType.END,
            spacing: { before: 100, after: 200 },
          }),
          
          new Paragraph({
            alignment: AlignmentType.CENTER,
            style: "strong",
            children: [new TextRun({ text: "Versus", bold: true, spacing: { before: 300, after: 300 } })]
          }),
          
          // Defendant details
          new Paragraph(`Y ${pdfData.parties.defendant.name}`),
          new Paragraph(`S/o ${pdfData.parties.defendant.guardianName}`),
          new Paragraph(`R/o ${pdfData.parties.defendant.address}`),
          
          new Paragraph({
            children: [new TextRun({ text: "...DEFENDANT", bold: true })],
            alignment: AlignmentType.END,
            spacing: { before: 100, after: 300 },
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            style: "strong",
            heading: "Heading3",
            spacing: { before: 300, after: 300 },
            children: [
              new TextRun({
                text: pdfData.applicationSubtitle,
                bold: true,
                underline: { type: "single" },
                color: "#000000",
              }),
            ],
          }),

          new Paragraph({
            style: "strong",
            spacing: { before: 200, after: 200 },
            children: [new TextRun({ text: "MOST RESPECTFULLY SHOWETH:", bold: true })],
          }),

          ...pdfData.applicationBody.grounds.map(ground => new Paragraph({
            children: [new TextRun({ text: ground })],
            numbering: {
              reference: "specific-performance-numbering",
              level: 0,
            },
            spacing: { before: 200, after: 200 }
          })),

          new Paragraph({ 
            children: [new TextRun({ text: "PRAYER:", bold: true })],
            style: "strong", 
            spacing: { before: 300, after: 150 } 
          }),
          new Paragraph({
            children: [new TextRun({ text: "It is, therefore most respectfully prayed that this Hon'ble Court may be pleased to:" })],
            spacing: { after: 200 }
          }),

          ...pdfData.prayer.items.map(item => new Paragraph({
            children: [new TextRun({ text: item })],
            numbering: {
              reference: "prayer-numbering",
              level: 0,
            },
            spacing: { before: 100, after: 100 }
          })),

          // Footer table
          new Table({
            columnWidths: [4500, 4500],
            width: { size: 9000, type: WidthType.DXA },
            spacing: { before: 400, after: 200 },
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
                    children: [new Paragraph("Place:")] 
                  }),
                  new TableCell({ 
                    spacing: { before: 200, after: 200 }, 
                    children: [new Paragraph({ text: "Plaintiff", style: "strong", alignment: AlignmentType.END })] 
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ 
                    spacing: { before: 200, after: 200 }, 
                    children: [new Paragraph("Date:")] 
                  }),
                  new TableCell({ 
                    spacing: { before: 200, after: 200 }, 
                    children: [new Paragraph({ text: "Through", alignment: AlignmentType.END })] 
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [] }),
                  new TableCell({
                    children: [
                      new Paragraph({ text: "Advocate", style: "strong", alignment: AlignmentType.END }),
                    ]
                  }),
                ],
              }),
            ],
          }),

          // Verification section
          new Paragraph({ 
            children: [new TextRun({ text: "VERIFICATION:", bold: true })],
            style: "strong", 
            spacing: { before: 400, after: 200 } 
          }),
          new Paragraph({
            children: [new TextRun({ text: pdfData.verification.text })],
            spacing: { after: 300 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "Plaintiff", bold: true })],
            alignment: AlignmentType.END,
            spacing: { after: 200 }
          }),
          
          new Paragraph({ text: pdfData.footer.note, spacing: { before: 200 } }),
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
      saveAs(blob, `Specific_Performance_Suit_${pdfData.parties.plaintiff.name.replace(/\s+/g, '_')}.docx`);
    });
  };

  return (
    <div className="form-container">
      <h1>Suit for Specific Performance of Contract</h1>
      <form onSubmit={handleSubmit}>
        {/* Plaintiff Information Section */}
        <section className="form-section">
          <h2>Plaintiff Information</h2>
          <div className="form-group">
            <label htmlFor="plaintiffName">Full Name of Plaintiff</label>
            <input
              type="text"
              id="plaintiffName"
              name="plaintiffName"
              value={formData.plaintiffName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="plaintiffAge">Age of Plaintiff</label>
            <input
              type="number"
              id="plaintiffAge"
              name="plaintiffAge"
              value={formData.plaintiffAge}
              onChange={handleChange}
              required
              min="18"
            />
          </div>
          <div className="form-group">
            <label htmlFor="plaintiffGuardianName">Guardian's Name</label>
            <input
              type="text"
              id="plaintiffGuardianName"
              name="plaintiffGuardianName"
              value={formData.plaintiffGuardianName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="plaintiffGuardianRelation">Relation with Guardian</label>
            <select
              id="plaintiffGuardianRelation"
              name="plaintiffGuardianRelation"
              value={formData.plaintiffGuardianRelation}
              onChange={handleChange}
              required
            >
              <option value="father">Father</option>
              <option value="mother">Mother</option>
              <option value="spouse">Spouse</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="plaintiffAddress">Complete Address</label>
            <textarea
              id="plaintiffAddress"
              name="plaintiffAddress"
              value={formData.plaintiffAddress}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="plaintiffOccupation">Occupation</label>
            <input
              type="text"
              id="plaintiffOccupation"
              name="plaintiffOccupation"
              value={formData.plaintiffOccupation}
              onChange={handleChange}
              required
            />
          </div>
        </section>

        {/* Defendant Information Section */}
        <section className="form-section">
          <h2>Defendant Information</h2>
          <div className="form-group">
            <label htmlFor="defendantName">Full Name of Defendant</label>
            <input
              type="text"
              id="defendantName"
              name="defendantName"
              value={formData.defendantName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="defendantAge">Age of Defendant</label>
            <input
              type="number"
              id="defendantAge"
              name="defendantAge"
              value={formData.defendantAge}
              onChange={handleChange}
              required
              min="18"
            />
          </div>
          <div className="form-group">
            <label htmlFor="defendantGuardianName">Guardian's Name</label>
            <input
              type="text"
              id="defendantGuardianName"
              name="defendantGuardianName"
              value={formData.defendantGuardianName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="defendantGuardianRelation">Relation with Guardian</label>
            <select
              id="defendantGuardianRelation"
              name="defendantGuardianRelation"
              value={formData.defendantGuardianRelation}
              onChange={handleChange}
              required
            >
              <option value="father">Father</option>
              <option value="mother">Mother</option>
              <option value="spouse">Spouse</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="defendantAddress">Complete Address</label>
            <textarea
              id="defendantAddress"
              name="defendantAddress"
              value={formData.defendantAddress}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="defendantOccupation">Occupation</label>
            <input
              type="text"
              id="defendantOccupation"
              name="defendantOccupation"
              value={formData.defendantOccupation}
              onChange={handleChange}
              required
            />
          </div>
        </section>

        {/* Court Details Section */}
        <section className="form-section">
          <h2>Court Details</h2>
          <div className="form-group">
            <label htmlFor="courtType">Court Name</label>
            <input
              type="text"
              id="courtType"
              name="courtType"
              value={formData.courtType}
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
          <div className="form-group">
            <label htmlFor="suitNumber">Suit Number</label>
            <input
              type="text"
              id="suitNumber"
              name="suitNumber"
              value={formData.suitNumber}
              onChange={handleChange}
              required
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
              required
              min="2000"
              max={new Date().getFullYear()}
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

        {/* Property Details Section */}
        <section className="form-section">
          <h2>Property Details</h2>
          <div className="form-group">
            <label htmlFor="propertyDescription">Property Description</label>
            <textarea
              id="propertyDescription"
              name="propertyDescription"
              value={formData.propertyDescription}
              onChange={handleChange}
              placeholder="Detailed description of the property"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="propertyBearingNumber">Property Bearing Number</label>
            <input
              type="text"
              id="propertyBearingNumber"
              name="propertyBearingNumber"
              value={formData.propertyBearingNumber}
              onChange={handleChange}
              required
            />
          </div>
        </section>

        {/* Contract Details Section */}
        <section className="form-section">
          <h2>Contract Details</h2>
          <div className="form-group">
            <label htmlFor="contractDate">Contract Date</label>
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
            <label htmlFor="contractAmount">Contract Amount (Rs.)</label>
            <input
              type="number"
              id="contractAmount"
              name="contractAmount"
              value={formData.contractAmount}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
          <div className="form-group">
            <label htmlFor="earnestMoney">Earnest Money Paid (Rs.)</label>
            <input
              type="number"
              id="earnestMoney"
              name="earnestMoney"
              value={formData.earnestMoney}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
          <div className="form-group">
            <label htmlFor="balanceAmount">Balance Amount (Rs.)</label>
            <input
              type="number"
              id="balanceAmount"
              name="balanceAmount"
              value={formData.balanceAmount}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
          <div className="form-group">
            <label htmlFor="saleExecutionDate">Agreed Sale Execution Date</label>
            <input
              type="date"
              id="saleExecutionDate"
              name="saleExecutionDate"
              value={formData.saleExecutionDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="agreementTerms">Agreement Terms & Conditions</label>
            <textarea
              id="agreementTerms"
              name="agreementTerms"
              value={formData.agreementTerms}
              onChange={handleChange}
              placeholder="Key terms and conditions of the agreement"
              required
            />
          </div>
        </section>

        {/* Performance Details Section */}
        <section className="form-section">
          <h2>Performance Details</h2>
          <div className="form-group">
            <label htmlFor="plaintiffReadiness">Plaintiff's Readiness to Perform</label>
            <textarea
              id="plaintiffReadiness"
              name="plaintiffReadiness"
              value={formData.plaintiffReadiness}
              onChange={handleChange}
              placeholder="Describe how you are ready and willing to perform your part"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="defendantRefusal">Defendant's Refusal Details</label>
            <textarea
              id="defendantRefusal"
              name="defendantRefusal"
              value={formData.defendantRefusal}
              onChange={handleChange}
              placeholder="Details of defendant's refusal to execute sale deed"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="legalNoticeDate">Legal Notice Date</label>
            <input
              type="date"
              id="legalNoticeDate"
              name="legalNoticeDate"
              value={formData.legalNoticeDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="legalNoticeDetails">Legal Notice Details</label>
            <textarea
              id="legalNoticeDetails"
              name="legalNoticeDetails"
              value={formData.legalNoticeDetails}
              onChange={handleChange}
              placeholder="Details of legal notice sent to defendant"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="defendantResponse">Defendant's Response to Notice</label>
            <textarea
              id="defendantResponse"
              name="defendantResponse"
              value={formData.defendantResponse}
              onChange={handleChange}
              placeholder="How defendant responded to the legal notice"
              required
            />
          </div>
        </section>

        {/* Cause of Action Section */}
        <section className="form-section">
          <h2>Cause of Action</h2>
          <div className="form-group">
            <label htmlFor="causeOfActionDate">Primary Cause of Action Date</label>
            <input
              type="date"
              id="causeOfActionDate"
              name="causeOfActionDate"
              value={formData.causeOfActionDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="additionalCauseOfAction">Additional Cause of Action</label>
            <textarea
              id="additionalCauseOfAction"
              name="additionalCauseOfAction"
              value={formData.additionalCauseOfAction}
              onChange={handleChange}
              placeholder="Any additional events that constitute cause of action"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="continuingCause">Continuing Cause of Action</label>
            <textarea
              id="continuingCause"
              name="continuingCause"
              value={formData.continuingCause}
              onChange={handleChange}
              placeholder="Explain if this is a continuing cause of action"
              required
            />
          </div>
        </section>

        {/* Legal Grounds Section */}
        <section className="form-section">
          <h2>Legal Grounds</h2>
          <div className="form-group">
            <label htmlFor="jurisdictionReason">Jurisdiction Reason</label>
            <textarea
              id="jurisdictionReason"
              name="jurisdictionReason"
              value={formData.jurisdictionReason}
              onChange={handleChange}
              placeholder="Why this court has jurisdiction over the matter"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="limitationPeriod">Limitation Period</label>
            <textarea
              id="limitationPeriod"
              name="limitationPeriod"
              value={formData.limitationPeriod}
              onChange={handleChange}
              placeholder="Explain that suit is within limitation period"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="courtFeesDetails">Court Fees Details</label>
            <textarea
              id="courtFeesDetails"
              name="courtFeesDetails"
              value={formData.courtFeesDetails}
              onChange={handleChange}
              placeholder="Details of court fees paid"
              required
            />
          </div>
        </section>

        {/* Relief Sought Section */}
        <section className="form-section">
          <h2>Relief Sought</h2>
          <div className="form-group">
            <label htmlFor="specificPerformanceRelief">Specific Performance Relief</label>
            <textarea
              id="specificPerformanceRelief"
              name="specificPerformanceRelief"
              value={formData.specificPerformanceRelief}
              onChange={handleChange}
              placeholder="Specific performance relief you are seeking"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="costOfSuit">Cost of Suit</label>
            <textarea
              id="costOfSuit"
              name="costOfSuit"
              value={formData.costOfSuit}
              onChange={handleChange}
              placeholder="Request for award of costs"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="additionalRelief">Additional Relief</label>
            <textarea
              id="additionalRelief"
              name="additionalRelief"
              value={formData.additionalRelief}
              onChange={handleChange}
              placeholder="Any other relief deemed fit and proper"
            />
          </div>
        </section>

        {/* Additional Information Section */}
        <section className="form-section">
          <h2>Additional Information</h2>
          <div className="form-group">
            <label htmlFor="previousNegotiations">Previous Negotiations</label>
            <textarea
              id="previousNegotiations"
              name="previousNegotiations"
              value={formData.previousNegotiations}
              onChange={handleChange}
              placeholder="Details of any previous negotiations or attempts to resolve"
            />
          </div>
          <div className="form-group">
            <label htmlFor="witnessDetails">Witness Details</label>
            <textarea
              id="witnessDetails"
              name="witnessDetails"
              value={formData.witnessDetails}
              onChange={handleChange}
              placeholder="Details of witnesses to the agreement and events"
            />
          </div>
          <div className="form-group">
            <label htmlFor="supportingDocuments">Supporting Documents</label>
            <textarea
              id="supportingDocuments"
              name="supportingDocuments"
              value={formData.supportingDocuments}
              onChange={handleChange}
              placeholder="List of documents supporting your case"
              required
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
            {loading ? 'Generating Document...' : 'Submit Application'}
          </button>
        </div>
      </form>
      
      {showPreview && pdfData && (
        <SpecificPerformancePdfPreviewModal
          data={pdfData}
          onClose={() => setShowPreview(false)}
          onWordDownload={() => handleWordDownload(pdfData)}
        />
      )}
      
      {pdfData && (
        <div className="download-section">
          <h2>Application Ready</h2>
          <p>Your specific performance suit has been generated successfully.</p>
          <div className="download-buttons-row">
            <PDFDownloadLink
              document={<SpecificPerformanceApplicationPDF data={pdfData} />}
              fileName={`Specific_Performance_Suit_${pdfData.parties?.plaintiff?.name?.replace(/\s+/g, '_') || 'document'}.pdf`}
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

export default SpecificPerformanceForm;