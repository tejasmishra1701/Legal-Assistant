import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PermanentInjunctionForm.css';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PermanentInjunctionApplicationPDF } from './PermanentInjunctionApplicationPDF';
import PermanentInjunctionPdfPreviewModal from './PermanentInjunctionPdfPreviewModal.jsx';
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

function PermanentInjunctionForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pdfData, setPdfData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    // Plaintiff Information
    plaintiffName: '',
    plaintiffGuardianName: '',
    plaintiffGuardianRelation: 'father',
    plaintiffAddress: '',
    
    // Defendants Information (multiple defendants)
    defendants: [
      {
        name: '',
        guardianName: '',
        guardianRelation: 'father',
        address: ''
      }
    ],
    
    // Court Details
    district: '',
    state: '',
    caseNumber: '',
    caseYear: '',
    judgeName: '',
    advocateName: '',
    
    // Property Details
    propertyAddress: '',
    propertyDescription: '',
    propertyBearingNumber: '',
    rentAmount: '',
    tenancyDetails: '',
    
    // Case Specific Details
    disputeNature: '',
    threatsReceived: '',
    policeComplaintDetails: '',
    possessionDetails: '',
    rentPaymentHistory: '',
    documentsAvailable: '',
    neighboursIntervention: '',
    
    // Legal Grounds
    legalRightsToPossession: '',
    interferenceByDefendants: '',
    irreparableHarm: '',
    noAdequateRemedy: '',
    balanceOfConvenience: '',
    priorRelations: '',
    
    // Additional Information
    courtFeeValue: '',
    additionalInfo: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDefendantChange = (index, field, value) => {
    const updatedDefendants = [...formData.defendants];
    updatedDefendants[index][field] = value;
    setFormData(prev => ({
      ...prev,
      defendants: updatedDefendants
    }));
  };

  const addDefendant = () => {
    setFormData(prev => ({
      ...prev,
      defendants: [...prev.defendants, {
        name: '',
        guardianName: '',
        guardianRelation: 'father',
        address: ''
      }]
    }));
  };

  const removeDefendant = (index) => {
    if (formData.defendants.length > 1) {
      setFormData(prev => ({
        ...prev,
        defendants: prev.defendants.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPdfData(null);

    try {
      const response = await fetch('https://mishratejass01.app.n8n.cloud/webhook/permanent-injunction', {
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

    const { courtDetails, parties, applicationTitle, applicationBody, prayer, footer, verification } = pdfData;
    console.log('Generating Word document with data:', pdfData);
    
    const doc = new Document({
      numbering: {
        config: [
          {
            reference: "permanent-injunction-numbering",
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
            spacing: { before: 300, after: 200 },
            children: [new TextRun({
              text: pdfData.courtDetails.courtType,
              color: "#000000",
              bold: true,
            })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            style: "strong",
            spacing: { after: 300 },
            children: [new TextRun({
              text: `IN THE COURT OF ${pdfData.courtDetails.judgeName} (DISTRICT ${pdfData.courtDetails.district}), ${pdfData.courtDetails.state}`,
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
          
          // Plaintiff table
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
                      new Paragraph(pdfData.parties.plaintiff.name),
                      new Paragraph(`${pdfData.parties.plaintiff.guardianRelation === 'father' ? 'S/o' : 'C/o'} ${pdfData.parties.plaintiff.guardianName}`),
                      new Paragraph(`R/o ${pdfData.parties.plaintiff.address}`),
                    ],
                  }),
                  new TableCell({
                    children: [new Paragraph({ 
                      style: "strong", 
                      alignment: AlignmentType.END, 
                      children: [new TextRun({ text: ".....PLAINTIFF", bold: true })],
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
          
          // Defendants table
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
                    children: pdfData.parties.defendants.map((defendant, index) => 
                      new Paragraph(`${index + 1}. ${defendant.name}`)
                    )
                  }),
                  new TableCell({
                    children: [new Paragraph({
                      style: "strong",
                      alignment: AlignmentType.END,
                      children: [new TextRun({ text: ".....DEFENDANTS", bold: true })],
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
            children: [new TextRun({ text: "MOST RESPECTFULLY SHOWETH:", bold: true })],
          }),

          ...applicationBody.facts.map(fact => new Paragraph({
            children: [new TextRun({ text: fact })],
            numbering: {
              reference: "permanent-injunction-numbering",
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
            children: [new TextRun({ text: prayer.mainText })],
            spacing: { after: 200 }
          }),

          ...prayer.reliefs.map((relief, index) => new Paragraph({
            children: [new TextRun({ text: `(${String.fromCharCode(97 + index)}) ${relief}` })],
            spacing: { before: 100, after: 100 },
            indent: { left: 360 }
          })),

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
                  new TableCell({ children: [] }),
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
                    children: [new Paragraph(`Place: ${pdfData.footer.place}`)] 
                  }),
                  new TableCell({ 
                    spacing: { before: 200, after: 200 }, 
                    children: [new Paragraph({ text: "Through", alignment: AlignmentType.END })] 
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
                    children: [new Paragraph({ text: "Advocate", style: "strong", alignment: AlignmentType.END })] 
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ 
            children: [new TextRun({ text: "VERIFICATION:", bold: true })],
            style: "strong", 
            spacing: { before: 300, after: 150 } 
          }),
          new Paragraph({
            children: [new TextRun({ text: verification.text })],
            spacing: { after: 200 }
          }),
          new Paragraph({ text: "Plaintiff", alignment: AlignmentType.END, spacing: { before: 200 } }),
          
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
      saveAs(blob, `Permanent_Injunction_Application_${pdfData.parties.plaintiff.name.replace(/\s+/g, '_')}.docx`);
    });
  };

  return (
    <div className="form-container">
      <h1>Permanent Injunction Application Form</h1>
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
            <label htmlFor="plaintiffAddress">Complete Address of Plaintiff</label>
            <textarea
              id="plaintiffAddress"
              name="plaintiffAddress"
              value={formData.plaintiffAddress}
              onChange={handleChange}
              required
            />
          </div>
        </section>

        {/* Defendants Information Section */}
        <section className="form-section">
          <h2>Defendants Information</h2>
          {formData.defendants.map((defendant, index) => (
            <div key={index} className="defendant-group">
              <h3>Defendant {index + 1}</h3>
              <div className="form-group">
                <label htmlFor={`defendantName${index}`}>Full Name of Defendant</label>
                <input
                  type="text"
                  id={`defendantName${index}`}
                  value={defendant.name}
                  onChange={(e) => handleDefendantChange(index, 'name', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor={`defendantGuardianName${index}`}>Guardian's Name</label>
                <input
                  type="text"
                  id={`defendantGuardianName${index}`}
                  value={defendant.guardianName}
                  onChange={(e) => handleDefendantChange(index, 'guardianName', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor={`defendantGuardianRelation${index}`}>Relation with Guardian</label>
                <select
                  id={`defendantGuardianRelation${index}`}
                  value={defendant.guardianRelation}
                  onChange={(e) => handleDefendantChange(index, 'guardianRelation', e.target.value)}
                  required
                >
                  <option value="father">Father</option>
                  <option value="mother">Mother</option>
                  <option value="spouse">Spouse</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor={`defendantAddress${index}`}>Complete Address of Defendant</label>
                <textarea
                  id={`defendantAddress${index}`}
                  value={defendant.address}
                  onChange={(e) => handleDefendantChange(index, 'address', e.target.value)}
                  required
                />
              </div>
              {formData.defendants.length > 1 && (
                <button type="button" onClick={() => removeDefendant(index)} className="remove-defendant-btn">
                  Remove Defendant
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addDefendant} className="add-defendant-btn">
            Add Another Defendant
          </button>
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
            <label htmlFor="caseYear">Case Year</label>
            <input
              type="number"
              id="caseYear"
              name="caseYear"
              value={formData.caseYear}
              onChange={handleChange}
              required
              min="2000"
              max={new Date().getFullYear()}
            />
          </div>
          <div className="form-group">
            <label htmlFor="judgeName">Judge Name/Designation</label>
            <input
              type="text"
              id="judgeName"
              name="judgeName"
              value={formData.judgeName}
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

        {/* Property Details Section */}
        <section className="form-section">
          <h2>Property Details</h2>
          <div className="form-group">
            <label htmlFor="propertyAddress">Property Address</label>
            <textarea
              id="propertyAddress"
              name="propertyAddress"
              value={formData.propertyAddress}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="propertyDescription">Property Description</label>
            <textarea
              id="propertyDescription"
              name="propertyDescription"
              value={formData.propertyDescription}
              onChange={handleChange}
              placeholder="Details about rooms, facilities, etc."
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
            />
          </div>
          <div className="form-group">
            <label htmlFor="rentAmount">Rent Amount (if applicable)</label>
            <input
              type="text"
              id="rentAmount"
              name="rentAmount"
              value={formData.rentAmount}
              onChange={handleChange}
              placeholder="Monthly rent amount"
            />
          </div>
          <div className="form-group">
            <label htmlFor="tenancyDetails">Tenancy Details</label>
            <textarea
              id="tenancyDetails"
              name="tenancyDetails"
              value={formData.tenancyDetails}
              onChange={handleChange}
              placeholder="Details about tenancy agreement, duration, etc."
            />
          </div>
        </section>

        {/* Case Specific Details Section */}
        <section className="form-section">
          <h2>Case Specific Details</h2>
          <div className="form-group">
            <label htmlFor="disputeNature">Nature of Dispute</label>
            <textarea
              id="disputeNature"
              name="disputeNature"
              value={formData.disputeNature}
              onChange={handleChange}
              placeholder="Describe the nature of the dispute"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="threatsReceived">Threats Received</label>
            <textarea
              id="threatsReceived"
              name="threatsReceived"
              value={formData.threatsReceived}
              onChange={handleChange}
              placeholder="Details of threats received from defendants"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="policeComplaintDetails">Police Complaint Details</label>
            <textarea
              id="policeComplaintDetails"
              name="policeComplaintDetails"
              value={formData.policeComplaintDetails}
              onChange={handleChange}
              placeholder="Details of police complaints filed, if any"
            />
          </div>
          <div className="form-group">
            <label htmlFor="possessionDetails">Possession Details</label>
            <textarea
              id="possessionDetails"
              name="possessionDetails"
              value={formData.possessionDetails}
              onChange={handleChange}
              placeholder="Details about your possession of the property"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="rentPaymentHistory">Rent Payment History</label>
            <textarea
              id="rentPaymentHistory"
              name="rentPaymentHistory"
              value={formData.rentPaymentHistory}
              onChange={handleChange}
              placeholder="History of rent payments, receipts, etc."
            />
          </div>
          <div className="form-group">
            <label htmlFor="documentsAvailable">Documents Available</label>
            <textarea
              id="documentsAvailable"
              name="documentsAvailable"
              value={formData.documentsAvailable}
              onChange={handleChange}
              placeholder="List of documents you have as proof"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="neighboursIntervention">Neighbours' Intervention</label>
            <textarea
              id="neighboursIntervention"
              name="neighboursIntervention"
              value={formData.neighboursIntervention}
              onChange={handleChange}
              placeholder="Details of neighbours' intervention, if any"
            />
          </div>
        </section>

        {/* Legal Grounds Section */}
        <section className="form-section">
          <h2>Legal Grounds</h2>
          <div className="form-group">
            <label htmlFor="legalRightsToPossession">Legal Rights to Possession</label>
            <textarea
              id="legalRightsToPossession"
              name="legalRightsToPossession"
              value={formData.legalRightsToPossession}
              onChange={handleChange}
              placeholder="Explain your legal rights to possess the property"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="interferenceByDefendants">Interference by Defendants</label>
            <textarea
              id="interferenceByDefendants"
              name="interferenceByDefendants"
              value={formData.interferenceByDefendants}
              onChange={handleChange}
              placeholder="How defendants are interfering with your rights"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="irreparableHarm">Irreparable Harm</label>
            <textarea
              id="irreparableHarm"
              name="irreparableHarm"
              value={formData.irreparableHarm}
              onChange={handleChange}
              placeholder="Explain the irreparable harm you would suffer"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="noAdequateRemedy">No Adequate Remedy at Law</label>
            <textarea
              id="noAdequateRemedy"
              name="noAdequateRemedy"
              value={formData.noAdequateRemedy}
              onChange={handleChange}
              placeholder="Why there is no adequate remedy available at law"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="balanceOfConvenience">Balance of Convenience</label>
            <textarea
              id="balanceOfConvenience"
              name="balanceOfConvenience"
              value={formData.balanceOfConvenience}
              onChange={handleChange}
              placeholder="Why the balance of convenience favors you"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="priorRelations">Prior Relations with Defendants</label>
            <textarea
              id="priorRelations"
              name="priorRelations"
              value={formData.priorRelations}
              onChange={handleChange}
              placeholder="History of relations with the defendants"
            />
          </div>
        </section>

        {/* Additional Information Section */}
        <section className="form-section">
          <h2>Additional Information</h2>
          <div className="form-group">
            <label htmlFor="courtFeeValue">Court Fee Value</label>
            <input
              type="text"
              id="courtFeeValue"
              name="courtFeeValue"
              value={formData.courtFeeValue}
              onChange={handleChange}
              placeholder="Value for court fee calculation"
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
        <PermanentInjunctionPdfPreviewModal
          data={pdfData}
          onClose={() => setShowPreview(false)}
          onWordDownload={() => handleWordDownload(pdfData)}
        />
      )}
      
      {pdfData && (
        <div className="download-section">
          <h2>Application Ready</h2>
          <p>Your permanent injunction application has been generated successfully.</p>
          <div className="download-buttons-row">
            <PDFDownloadLink
              document={<PermanentInjunctionApplicationPDF data={pdfData} />}
              fileName={`Permanent_Injunction_Application_${pdfData.parties?.plaintiff?.name?.replace(/\s+/g, '_') || 'document'}.pdf`}
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

export default PermanentInjunctionForm;