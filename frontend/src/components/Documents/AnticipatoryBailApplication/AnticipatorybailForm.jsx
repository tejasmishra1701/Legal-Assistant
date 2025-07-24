import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AnticipatorybailForm.css';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { AnticipatorybailApplicationPDF } from './AnticipatorybailApplicationPDF';
import PdfPreviewModal from '../PdfPreviewModal';
import AnticipatorybailPDFPreviewModal from './AnticipatorybailPdfPreviewModal';
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

function AnticipatorybailForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pdfData, setPdfData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    // Personal Information
    applicantName: '',
    applicantAge: '',
    guardianName: '',
    guardianRelation: 'father',
    address: '',
    occupation: '',
    // Case Details
    policeStation: '',
    firNumber: '',
    firYear: '',
    sections: '',
    dateOfComplaint: '',
    investigatingOfficer: '',
    caseNumber: '',
    district: '',
    state: '',
    advocateName: '',
    // Anticipatory Bail Specific Details
    apprehensionReason: '',
    factsOfCase: '',
    denialOfAllegations: '',
    characterBackground: '',
    priorCriminalRecord: '',
    permanentResident: '',
    cooperationUndertaking: '',
    noAbscondingRisk: '',
    noTamperingRisk: '',
    witnessInterference: '',
    investigationCooperation: '',
    additionalUndertakings: '',
    proposedSureties: '',
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
      const response = await fetch('https://mishratejass01.app.n8n.cloud/webhook/anticipatory-bail', {
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

    const { courtDetails, parties, applicationTitle, applicationBody, prayer, footer } = pdfData;
    console.log('Generating Word document with data:', pdfData);
    
    const doc = new Document({
      numbering: {
        config: [
          {
            reference: "anticipatory-bail-numbering",
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
                text: `${pdfData.courtDetails.caseType} NO. ${pdfData.courtDetails.caseNumber} OF ${pdfData.courtDetails.caseYear}`,
                bold: true,
              }),
            ],
            alignment: AlignmentType.END,
            spacing: { after: 200 },
          }),
          new Paragraph({ text: "IN THE MATTER OF:", spacing: { after: 200 } }),
          
          // Applicant table
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
                      new Paragraph(pdfData.parties.applicant.name),
                      new Paragraph(`${pdfData.parties.applicant.guardianRelation === 'father' ? 'S/o' : 'C/o'} ${pdfData.parties.applicant.guardianName}`),
                      new Paragraph(`R/o ${pdfData.parties.applicant.address}`),
                    ],
                  }),
                  new TableCell({
                    children: [new Paragraph({ 
                      style: "strong", 
                      alignment: AlignmentType.END, 
                      children: [new TextRun({ text: ".....APPLICANT", bold: true })],
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
          
          // Respondent table
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
                  new TableCell({ children: [new Paragraph("STATE")] }),
                  new TableCell({
                    children: [new Paragraph({
                      style: "strong",
                      alignment: AlignmentType.END,
                      children: [new TextRun({ text: ".....RESPONDENT/COMPLAINANT", bold: true })],
                    })],
                    verticalAlign: "center",
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: `FIR NO. ${pdfData.parties.caseInfo.firNumber}/${pdfData.parties.caseInfo.firYear}`, spacing: { top: 500 } }),
          new Paragraph(`U/S. ${pdfData.parties.caseInfo.sections}`),
          new Paragraph(`POLICE STATION: ${pdfData.parties.caseInfo.policeStation}`),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            style: "strong",
            heading: "Heading3",
            spacing: { before: 300, after: 300 },
            children: [
              new TextRun({
                text: applicationTitle,
                bold: true,
                underline: { type: "single" },
                color: "#000000",
              }),
            ],
          }),

          new Paragraph({
            style: "strong",
            spacing: { before: 200, after: 200 },
            children: [new TextRun({ text: applicationBody.introduction, bold: true })],
          }),

          ...applicationBody.grounds.map(ground => new Paragraph({
            children: [new TextRun({ text: ground })],
            numbering: {
              reference: "anticipatory-bail-numbering",
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
                    children: [new Paragraph({ text: "APPLICANT", style: "strong", alignment: AlignmentType.END })] 
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
      saveAs(blob, `Anticipatory_Bail_Application_${pdfData.parties.applicant.name.replace(/\s+/g, '_')}.docx`);
    });
  };

  return (
    <div className="form-container">
      <h1>Anticipatory Bail Application Form</h1>
      <form onSubmit={handleSubmit}>
        {/* Personal Information Section */}
        <section className="form-section">
          <h2>Personal Information</h2>
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
            <label htmlFor="guardianName">Guardian's Name</label>
            <input
              type="text"
              id="guardianName"
              name="guardianName"
              value={formData.guardianName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="guardianRelation">Relation with Guardian</label>
            <select
              id="guardianRelation"
              name="guardianRelation"
              value={formData.guardianRelation}
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
            <label htmlFor="address">Complete Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="occupation">Occupation</label>
            <input
              type="text"
              id="occupation"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              required
            />
          </div>
        </section>

        {/* Case Details Section */}
        <section className="form-section">
          <h2>Case Details</h2>
          <div className="form-group">
            <label htmlFor="policeStation">Police Station</label>
            <input
              type="text"
              id="policeStation"
              name="policeStation"
              value={formData.policeStation}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="firNumber">FIR Number</label>
            <input
              type="text"
              id="firNumber"
              name="firNumber"
              value={formData.firNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="firYear">FIR Year</label>
            <input
              type="number"
              id="firYear"
              name="firYear"
              value={formData.firYear}
              onChange={handleChange}
              required
              min="2000"
              max={new Date().getFullYear()}
            />
          </div>
          <div className="form-group">
            <label htmlFor="sections">Sections of Law</label>
            <input
              type="text"
              id="sections"
              name="sections"
              value={formData.sections}
              onChange={handleChange}
              required
              placeholder="e.g., 302 IPC, 307 IPC"
            />
          </div>
          <div className="form-group">
            <label htmlFor="dateOfComplaint">Date of Complaint/FIR</label>
            <input
              type="date"
              id="dateOfComplaint"
              name="dateOfComplaint"
              value={formData.dateOfComplaint}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="investigatingOfficer">Investigating Officer Details</label>
            <input
              type="text"
              id="investigatingOfficer"
              name="investigatingOfficer"
              value={formData.investigatingOfficer}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="caseNumber">Case Number</label>
            <input
              type="text"
              id="caseNumber"
              name="caseNumber"
              value={formData.caseNumber}
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

        {/* Anticipatory Bail Specific Details Section */}
        <section className="form-section">
          <h2>Anticipatory Bail Grounds & Details</h2>
          <div className="form-group">
            <label htmlFor="apprehensionReason">Reason for Apprehension of Arrest</label>
            <textarea
              id="apprehensionReason"
              name="apprehensionReason"
              value={formData.apprehensionReason}
              onChange={handleChange}
              placeholder="Explain why you apprehend arrest"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="factsOfCase">Brief Facts of the Case</label>
            <textarea
              id="factsOfCase"
              name="factsOfCase"
              value={formData.factsOfCase}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="denialOfAllegations">Denial of Allegations</label>
            <textarea
              id="denialOfAllegations"
              name="denialOfAllegations"
              value={formData.denialOfAllegations}
              onChange={handleChange}
              placeholder="State your denial of the allegations made against you"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="characterBackground">Character & Background</label>
            <textarea
              id="characterBackground"
              name="characterBackground"
              value={formData.characterBackground}
              onChange={handleChange}
              placeholder="Details about your character, reputation, and background"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="priorCriminalRecord">Prior Criminal Record</label>
            <textarea
              id="priorCriminalRecord"
              name="priorCriminalRecord"
              value={formData.priorCriminalRecord}
              onChange={handleChange}
              placeholder="State if you have no prior criminal record or provide details if any"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="permanentResident">Permanent Resident Status</label>
            <textarea
              id="permanentResident"
              name="permanentResident"
              value={formData.permanentResident}
              onChange={handleChange}
              placeholder="Confirm you are a permanent resident and provide details"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="cooperationUndertaking">Undertaking to Cooperate with Investigation</label>
            <textarea
              id="cooperationUndertaking"
              name="cooperationUndertaking"
              value={formData.cooperationUndertaking}
              onChange={handleChange}
              placeholder="Your undertaking to cooperate fully with the investigation"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="noAbscondingRisk">No Risk of Absconding</label>
            <textarea
              id="noAbscondingRisk"
              name="noAbscondingRisk"
              value={formData.noAbscondingRisk}
              onChange={handleChange}
              placeholder="Explain why there is no risk of you absconding"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="noTamperingRisk">No Risk of Evidence Tampering</label>
            <textarea
              id="noTamperingRisk"
              name="noTamperingRisk"
              value={formData.noTamperingRisk}
              onChange={handleChange}
              placeholder="Assurance that you will not tamper with evidence"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="witnessInterference">No Witness Interference</label>
            <textarea
              id="witnessInterference"
              name="witnessInterference"
              value={formData.witnessInterference}
              onChange={handleChange}
              placeholder="Undertaking that you will not interfere with witnesses"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="investigationCooperation">Investigation Cooperation Details</label>
            <textarea
              id="investigationCooperation"
              name="investigationCooperation"
              value={formData.investigationCooperation}
              onChange={handleChange}
              placeholder="Details of how you will cooperate with the investigation"
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
          <div className="form-group">
            <label htmlFor="proposedSureties">Proposed Sureties</label>
            <textarea
              id="proposedSureties"
              name="proposedSureties"
              value={formData.proposedSureties}
              onChange={handleChange}
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
        <AnticipatorybailPDFPreviewModal
          data={pdfData}
          onClose={() => setShowPreview(false)}
          onWordDownload={() => handleWordDownload(pdfData)}
        />
      )}
      
      {pdfData && (
        <div className="download-section">
          <h2>Application Ready</h2>
          <p>Your anticipatory bail application has been generated successfully.</p>
          <div className="download-buttons-row">
            <PDFDownloadLink
              document={<AnticipatorybailApplicationPDF data={pdfData} />}
              fileName={`Anticipatory_Bail_Application_${pdfData.parties?.applicant?.name?.replace(/\s+/g, '_') || 'document'}.pdf`}
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

export default AnticipatorybailForm;