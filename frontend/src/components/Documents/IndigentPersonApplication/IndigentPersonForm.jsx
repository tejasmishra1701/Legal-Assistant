import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './IndigentPersonForm.css';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { IndigentPersonApplicationPDF } from './IndigentPersonApplicationPDF';
import IndigentPersonPdfPreviewModal from './IndigentPersonPDFPreviewModal.jsx';
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

function IndigentPersonForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pdfData, setPdfData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    // Applicant Information
    applicantName: '',
    applicantAge: '',
    applicantGuardianName: '',
    applicantGuardianRelation: 'father',
    applicantAddress: '',
    applicantOccupation: '',
    
    // Respondent Information
    respondentName: '',
    respondentAge: '',
    respondentGuardianName: '',
    respondentGuardianRelation: 'father',
    respondentAddress: '',
    respondentOccupation: '',
    
    // Court Details
    courtType: 'ROHINI',
    district: 'DELHI',
    state: 'DELHI',
    suitNumber: '',
    suitYear: '',
    advocateName: '',
    
    // Financial Details
    monthlyIncome: '',
    familyIncome: '',
    familyMembers: '',
    propertyDetails: '',
    movableAssets: '',
    immovableAssets: '',
    bankBalance: '',
    debts: '',
    
    // Case Details
    natureOfSuit: '',
    caseDescription: '',
    urgencyReason: '',
    estimatedCourtFee: '',
    reasonForIndigency: '',
    supportingDocuments: '',
    financialHardship: '',
    alternativeArrangements: '',
    
    // Undertakings
    courtFeeUndertaking: '',
    truthfulnessUndertaking: '',
    additionalUndertakings: '',
    
    // Additional Information
    previousCases: '',
    legalAidHistory: '',
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
      const response = await fetch('https://mishratejass01.app.n8n.cloud/webhook/indigent-person', {
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

    const { courtDetails, parties, applicationTitle, applicationSubtitle, applicationBody, prayer, footer } = pdfData;
    console.log('Generating Word document with data:', pdfData);
    
    const doc = new Document({
      numbering: {
        config: [
          {
            reference: "indigent-person-numbering",
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
          
          // Applicant details
          new Paragraph(`X ${pdfData.parties.applicant.name}`),
          new Paragraph(`S/o ${pdfData.parties.applicant.guardianName}`),
          new Paragraph(`R/o ${pdfData.parties.applicant.address}`),
          
          new Paragraph({
            children: [new TextRun({ text: "...APPLICANT/PLAINTIFF", bold: true })],
            alignment: AlignmentType.END,
            spacing: { before: 100, after: 200 },
          }),
          
          new Paragraph({
            alignment: AlignmentType.CENTER,
            style: "strong",
            children: [new TextRun({ text: "Versus", bold: true, spacing: { before: 300, after: 300 } })]
          }),
          
          // Respondent details
          new Paragraph(`Y ${pdfData.parties.respondent.name}`),
          new Paragraph(`S/o ${pdfData.parties.respondent.guardianName}`),
          new Paragraph(`R/o ${pdfData.parties.respondent.address}`),
          
          new Paragraph({
            children: [new TextRun({ text: "...RESPONDENT/DEFENDANT", bold: true })],
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
              reference: "indigent-person-numbering",
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
            children: [new TextRun({ text: "It is therefore most respectfully prayed that the Hon'ble Court may:" })],
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
                    children: [new Paragraph("Date:")] 
                  }),
                  new TableCell({ 
                    spacing: { before: 200, after: 200 }, 
                    children: [new Paragraph({ text: "Applicant", style: "strong", alignment: AlignmentType.END })] 
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ 
                    spacing: { before: 200, after: 200 }, 
                    children: [new Paragraph("Place:")] 
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
      saveAs(blob, `Indigent_Person_Application_${pdfData.parties.applicant.name.replace(/\s+/g, '_')}.docx`);
    });
  };

  return (
    <div className="form-container">
      <h1>Application to Sue as an Indigent Person</h1>
      <form onSubmit={handleSubmit}>
        {/* Applicant Information Section */}
        <section className="form-section">
          <h2>Applicant Information</h2>
          <div className="form-group">
            <label htmlFor="applicantName">Full Name of Applicant</label>
            <input
              type="text"
              id="applicantName"
              name="applicantName"
              value={formData.applicantName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="applicantAge">Age of Applicant</label>
            <input
              type="number"
              id="applicantAge"
              name="applicantAge"
              value={formData.applicantAge}
              onChange={handleChange}
              required
              min="18"
            />
          </div>
          <div className="form-group">
            <label htmlFor="applicantGuardianName">Guardian's Name</label>
            <input
              type="text"
              id="applicantGuardianName"
              name="applicantGuardianName"
              value={formData.applicantGuardianName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="applicantGuardianRelation">Relation with Guardian</label>
            <select
              id="applicantGuardianRelation"
              name="applicantGuardianRelation"
              value={formData.applicantGuardianRelation}
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
            <label htmlFor="applicantAddress">Complete Address</label>
            <textarea
              id="applicantAddress"
              name="applicantAddress"
              value={formData.applicantAddress}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="applicantOccupation">Occupation</label>
            <input
              type="text"
              id="applicantOccupation"
              name="applicantOccupation"
              value={formData.applicantOccupation}
              onChange={handleChange}
              required
            />
          </div>
        </section>

        {/* Respondent Information Section */}
        <section className="form-section">
          <h2>Respondent Information</h2>
          <div className="form-group">
            <label htmlFor="respondentName">Full Name of Respondent</label>
            <input
              type="text"
              id="respondentName"
              name="respondentName"
              value={formData.respondentName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="respondentAge">Age of Respondent</label>
            <input
              type="number"
              id="respondentAge"
              name="respondentAge"
              value={formData.respondentAge}
              onChange={handleChange}
              required
              min="18"
            />
          </div>
          <div className="form-group">
            <label htmlFor="respondentGuardianName">Guardian's Name</label>
            <input
              type="text"
              id="respondentGuardianName"
              name="respondentGuardianName"
              value={formData.respondentGuardianName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="respondentGuardianRelation">Relation with Guardian</label>
            <select
              id="respondentGuardianRelation"
              name="respondentGuardianRelation"
              value={formData.respondentGuardianRelation}
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
            <label htmlFor="respondentAddress">Complete Address</label>
            <textarea
              id="respondentAddress"
              name="respondentAddress"
              value={formData.respondentAddress}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="respondentOccupation">Occupation</label>
            <input
              type="text"
              id="respondentOccupation"
              name="respondentOccupation"
              value={formData.respondentOccupation}
              onChange={handleChange}
              required
            />
          </div>
        </section>

        {/* Court Details Section */}
        <section className="form-section">
          <h2>Court Details</h2>
          <div className="form-group">
            <label htmlFor="courtType">Court Type</label>
            <select
              id="courtType"
              name="courtType"
              value={formData.courtType}
              onChange={handleChange}
              required
            >
              <option value="ROHINI">Rohini Court</option>
              <option value="DWARKA">Dwarka Court</option>
              <option value="SAKET">Saket Court</option>
              <option value="KARKARDOOMA">Karkardooma Court</option>
              <option value="PATIALA HOUSE">Patiala House Court</option>
              <option value="TIS HAZARI">Tis Hazari Court</option>
              <option value="OTHER">Other</option>
            </select>
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

        {/* Financial Details Section */}
        <section className="form-section">
          <h2>Financial Details</h2>
          <div className="form-group">
            <label htmlFor="monthlyIncome">Monthly Income (Rs.)</label>
            <input
              type="number"
              id="monthlyIncome"
              name="monthlyIncome"
              value={formData.monthlyIncome}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
          <div className="form-group">
            <label htmlFor="familyIncome">Total Family Income (Rs.)</label>
            <input
              type="number"
              id="familyIncome"
              name="familyIncome"
              value={formData.familyIncome}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
          <div className="form-group">
            <label htmlFor="familyMembers">Number of Family Members</label>
            <input
              type="number"
              id="familyMembers"
              name="familyMembers"
              value={formData.familyMembers}
              onChange={handleChange}
              required
              min="1"
            />
          </div>
          <div className="form-group">
            <label htmlFor="propertyDetails">Property Details</label>
            <textarea
              id="propertyDetails"
              name="propertyDetails"
              value={formData.propertyDetails}
              onChange={handleChange}
              placeholder="Provide details of any property owned"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="movableAssets">Movable Assets (Rs.)</label>
            <input
              type="number"
              id="movableAssets"
              name="movableAssets"
              value={formData.movableAssets}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
          <div className="form-group">
            <label htmlFor="immovableAssets">Immovable Assets (Rs.)</label>
            <input
              type="number"
              id="immovableAssets"
              name="immovableAssets"
              value={formData.immovableAssets}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
          <div className="form-group">
            <label htmlFor="bankBalance">Bank Balance (Rs.)</label>
            <input
              type="number"
              id="bankBalance"
              name="bankBalance"
              value={formData.bankBalance}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
          <div className="form-group">
            <label htmlFor="debts">Outstanding Debts (Rs.)</label>
            <input
              type="number"
              id="debts"
              name="debts"
              value={formData.debts}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
        </section>

        {/* Case Details Section */}
        <section className="form-section">
          <h2>Case Details</h2>
          <div className="form-group">
            <label htmlFor="natureOfSuit">Nature of Suit</label>
            <textarea
              id="natureOfSuit"
              name="natureOfSuit"
              value={formData.natureOfSuit}
              onChange={handleChange}
              placeholder="Briefly describe the nature of your legal case"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="caseDescription">Case Description</label>
            <textarea
              id="caseDescription"
              name="caseDescription"
              value={formData.caseDescription}
              onChange={handleChange}
              placeholder="Provide detailed description of your case"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="urgencyReason">Reason for Urgency</label>
            <textarea
              id="urgencyReason"
              name="urgencyReason"
              value={formData.urgencyReason}
              onChange={handleChange}
              placeholder="Explain why this case requires urgent attention"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="estimatedCourtFee">Estimated Court Fee (Rs.)</label>
            <input
              type="number"
              id="estimatedCourtFee"
              name="estimatedCourtFee"
              value={formData.estimatedCourtFee}
              onChange={handleChange}
              placeholder="Estimated amount of court fee for your case"
              required
              min="0"
            />
          </div>
          <div className="form-group">
            <label htmlFor="reasonForIndigency">Reason for Applying as Indigent Person</label>
            <textarea
              id="reasonForIndigency"
              name="reasonForIndigency"
              value={formData.reasonForIndigency}
              onChange={handleChange}
              placeholder="Explain why you cannot afford to pay court fees"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="supportingDocuments">Supporting Documents</label>
            <textarea
              id="supportingDocuments"
              name="supportingDocuments"
              value={formData.supportingDocuments}
              onChange={handleChange}
              placeholder="List the documents you are submitting to support your application"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="financialHardship">Financial Hardship Details</label>
            <textarea
              id="financialHardship"
              name="financialHardship"
              value={formData.financialHardship}
              onChange={handleChange}
              placeholder="Provide details of your financial hardship"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="alternativeArrangements">Alternative Financial Arrangements</label>
            <textarea
              id="alternativeArrangements"
              name="alternativeArrangements"
              value={formData.alternativeArrangements}
              onChange={handleChange}
              placeholder="Explain if you have explored any alternative arrangements for paying court fees"
              required
            />
          </div>
        </section>

        {/* Undertakings Section */}
        <section className="form-section">
          <h2>Undertakings</h2>
          <div className="form-group">
            <label htmlFor="courtFeeUndertaking">Court Fee Undertaking</label>
            <textarea
              id="courtFeeUndertaking"
              name="courtFeeUndertaking"
              value={formData.courtFeeUndertaking}
              onChange={handleChange}
              placeholder="Your undertaking to pay court fees if the case is decided in your favor"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="truthfulnessUndertaking">Truthfulness Undertaking</label>
            <textarea
              id="truthfulnessUndertaking"
              name="truthfulnessUndertaking"
              value={formData.truthfulnessUndertaking}
              onChange={handleChange}
              placeholder="Your undertaking that all information provided is true and correct"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="additionalUndertakings">Additional Undertakings</label>
            <textarea
              id="additionalUndertakings"
              name="additionalUndertakings"
              value={formData.additionalUndertakings}
              onChange={handleChange}
              placeholder="Any additional undertakings you wish to provide"
            />
          </div>
        </section>

        {/* Additional Information Section */}
        <section className="form-section">
          <h2>Additional Information</h2>
          <div className="form-group">
            <label htmlFor="previousCases">Previous Legal Cases</label>
            <textarea
              id="previousCases"
              name="previousCases"
              value={formData.previousCases}
              onChange={handleChange}
              placeholder="Details of any previous legal cases you have been involved in"
            />
          </div>
          <div className="form-group">
            <label htmlFor="legalAidHistory">Legal Aid History</label>
            <textarea
              id="legalAidHistory"
              name="legalAidHistory"
              value={formData.legalAidHistory}
              onChange={handleChange}
              placeholder="Have you previously received legal aid or sued as an indigent person?"
            />
          </div>
          <div className="form-group">
            <label htmlFor="additionalInfo">Additional Relevant Information</label>
            <textarea
              id="additionalInfo"
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              placeholder="Any other relevant information that supports your application"
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
        <IndigentPersonPdfPreviewModal
          data={pdfData}
          onClose={() => setShowPreview(false)}
          onWordDownload={() => handleWordDownload(pdfData)}
        />
      )}
      
      {pdfData && (
        <div className="download-section">
          <h2>Application Ready</h2>
          <p>Your indigent person application has been generated successfully.</p>
          <div className="download-buttons-row">
            <PDFDownloadLink
              document={<IndigentPersonApplicationPDF data={pdfData} />}
              fileName={`Indigent_Person_Application_${pdfData.parties?.applicant?.name?.replace(/\s+/g, '_') || 'document'}.pdf`}
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

export default IndigentPersonForm;