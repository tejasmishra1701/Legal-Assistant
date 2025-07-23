import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegularBailForm.css';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { BailApplicationPDF } from './BailApplicationPDF';
import PdfPreviewModal from '../PdfPreviewModal';
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

function RegularBailForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pdfData, setPdfData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    // Personal Information
    accusedName: '',
    accusedAge: '',
    guardianName: '',
    guardianRelation: 'father',
    address: '',
    // Case Details
    policeStation: '',
    firNumber: '',
    sections: '',
    arrestDate: '',
    custodyStatus: 'judicial',
    investigatingOfficer: '',
    caseNumber: '',
    district: '',
    state: '',
    advocateName: '',
    // Bail Grounds
    priorHistory: '',
    offenseNature: '',
    mitigatingCircumstances: '',
    custodyDuration: '',
    healthConditions: '',
    occupation: '',
    familyBackground: '',
    previousBailHistory: '',
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
      const response = await fetch('https://mishratejass01.app.n8n.cloud/webhook/regular-bail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setPdfData(Array.isArray(data) ? data[0] : data); // Use the first object if it's an array
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

// Corrected Word document download handler


const handleWordDownload = (pdfData) => {
  if (!pdfData) return;

  const { courtDetails, parties, applicationTitle, applicationBody, prayer, footer } = pdfData;
  console.log('Generating Word document with data:', pdfData);
  const doc = new Document({
    numbering: {
      config: [
        {
          reference: "bail-grounds-numbering",
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
          children: [ new TextRun({
            text: `IN THE COURT OF METROPOLITAN MAGISTRATE (DISTRICT ${pdfData.courtDetails.district}), ${pdfData.courtDetails.state}`,
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
        
        // Using a table for Applicant vs. Label layout
        new Table({
    columnWidths: [4500, 4500],
    width: { size: 9000, type: WidthType.DXA },
    // Corrected borders property to make them all invisible
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
                    },
                  )],
                  verticalAlign: "center",
                }),
            ],
        }),
    ],
}),
        
        new Paragraph({  alignment: AlignmentType.CENTER, style: "strong",
          children: [new TextRun({ text: "VERSUS", bold: true, spacing: { before: 300, after: 300 } })] }),
        
        // Using a table for Respondent vs. Label layout
        new Table({
    columnWidths: [4500, 4500],
    width: { size: 9000, type: WidthType.DXA },
    // This is the corrected borders property
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
                    children: [new Paragraph({  style: "strong", alignment: AlignmentType.END,
                      children: [new TextRun({ text: ".....RESPONDENT/COMPLAINANT", bold: true })],
                    })],
                    verticalAlign: "center",
                }),
            ],
        }),
    ],
}),

        new Paragraph({ text: `FIR NO. ${pdfData.parties.caseInfo.firNumber}`, spacing: { top: 500 } }),
        new Paragraph(`U/S. ${pdfData.parties.caseInfo.sections}`),
        new Paragraph(`POLICE STATION: ${pdfData.parties.caseInfo.policeStation}`),

        new Paragraph({
    // Paragraph-level properties remain here
    alignment: AlignmentType.CENTER,
    style: "strong",
    heading: "Heading3",
    spacing: { before: 300, after: 300 },

    // Use the 'children' array for detailed text formatting
    children: [
        new TextRun({
            text: applicationTitle,
            bold: true,
            underline: {
                type: "single", // 'style' is not a valid key, it's 'type'
            },
            color: "#000000", // Example: Blue text (use hex code without #)
        }),
    ],
}),

        new Paragraph({  style: "strong",spacing: { before: 200, after: 200 },
          children: [new TextRun({ text: applicationBody.introduction, bold: true  })],
        }),

        ...applicationBody.grounds.map(ground => new Paragraph({
            children: [new TextRun({ text: ground })],
            numbering: {
                reference: "bail-grounds-numbering",
                level: 0,
            }, spacing: { before: 200, after: 200 }
        })),

        new Paragraph({ 
          children: [new TextRun({text: prayer.heading, bold:true })],
          style: "strong", 
          spacing: { before: 300, after: 150 } }),
        new Paragraph(
          {children: [new TextRun({ text: prayer.text })],
          spacing: { after: 200 }}
        ),

        // Using tables for footer layout
        new Table({
          columnWidths: [4500, 4500],
          width: { size: 9000, type: WidthType.DXA },
          spacing: { before: 200, after: 200 },
          // This is the corrected borders property
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
                new TableCell({ spacing: { before: 200, after: 200 }, children: [new Paragraph(`Place: ${pdfData.footer.place}`)] }),
                new TableCell({ spacing: { before: 200, after: 200 }, children: [new Paragraph({ text: "APPLICANT", style: "strong", alignment: AlignmentType.END })] }),
            ],
        }),
        new TableRow({
            children: [
                new TableCell({ spacing: { before: 200, after: 200 }, children: [new Paragraph(`Date: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`)] }),
                new TableCell({ spacing: { before: 200, after: 200 }, children: [new Paragraph({ text: "THROUGH", alignment: AlignmentType.END })] }),
            ],
        }),
        new TableRow({
            children: [
                new TableCell({ children: [] }), // Empty cell for alignment
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
                size: 22, // 11pt font
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
    saveAs(blob, `Bail_Application_${pdfData.parties.applicant.name.replace(/\s+/g, '_')}.docx`);
  });
};

  return (
    <div className="form-container">
      <h1>Regular Bail Application Form</h1>
      <form onSubmit={handleSubmit}>
        {/* Personal Information Section */}
        <section className="form-section">
          <h2>Personal Information</h2>
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
            <label htmlFor="accusedAge">Age of Accused</label>
            <input
              type="number"
              id="accusedAge"
              name="accusedAge"
              value={formData.accusedAge}
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
            <label htmlFor="arrestDate">Date of Arrest</label>
            <input
              type="date"
              id="arrestDate"
              name="arrestDate"
              value={formData.arrestDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="custodyStatus">Custody Status</label>
            <select
              id="custodyStatus"
              name="custodyStatus"
              value={formData.custodyStatus}
              onChange={handleChange}
              required
            >
              <option value="judicial">Judicial Custody</option>
              <option value="police">Police Custody</option>
            </select>
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

        {/* Bail Grounds Section */}
        <section className="form-section">
          <h2>Grounds for Bail</h2>
          <div className="form-group">
            <label htmlFor="priorHistory">Prior Criminal History</label>
            <textarea
              id="priorHistory"
              name="priorHistory"
              value={formData.priorHistory}
              onChange={handleChange}
              placeholder="Mention if first time offender or details of prior cases"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="offenseNature">Nature and Gravity of Offense</label>
            <textarea
              id="offenseNature"
              name="offenseNature"
              value={formData.offenseNature}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="mitigatingCircumstances">Mitigating Circumstances</label>
            <textarea
              id="mitigatingCircumstances"
              name="mitigatingCircumstances"
              value={formData.mitigatingCircumstances}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="custodyDuration">Duration of Custody</label>
            <input
              type="text"
              id="custodyDuration"
              name="custodyDuration"
              value={formData.custodyDuration}
              onChange={handleChange}
              required
              placeholder="e.g., 30 days"
            />
          </div>
          <div className="form-group">
            <label htmlFor="healthConditions">Health Conditions (if any)</label>
            <textarea
              id="healthConditions"
              name="healthConditions"
              value={formData.healthConditions}
              onChange={handleChange}
              placeholder="Mention any health issues or medical conditions"
            />
          </div>
          <div className="form-group">
            <label htmlFor="occupation">Occupation</label>
            <textarea
              id="occupation"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="familyBackground">Family Background</label>
            <textarea
              id="familyBackground"
              name="familyBackground"
              value={formData.familyBackground}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="previousBailHistory">Previous Bail Applications</label>
            <textarea
              id="previousBailHistory"
              name="previousBailHistory"
              value={formData.previousBailHistory}
              onChange={handleChange}
              placeholder="Details of any previous bail applications in this case"
              required
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
        <PdfPreviewModal
          data={pdfData}
          onClose={() => setShowPreview(false)}
          onWordDownload={() => handleWordDownload(pdfData)}
        />
      )}
      {pdfData && (
        <div className="download-section">
          <h2>Application Ready</h2>
          <p>Your bail application has been generated successfully.</p>
          <div className="download-buttons-row">
            <PDFDownloadLink
              document={<BailApplicationPDF data={pdfData} />}
              fileName={`Bail_Application_${pdfData.parties?.applicant?.name?.replace(/\s+/g, '_') || 'document'}.pdf`}
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

export default RegularBailForm;