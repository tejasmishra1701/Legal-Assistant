import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TemporaryInjunctionForm.css';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { TemporaryInjunctionApplicationPDF } from './TemporaryInjunctionApplicationPDF';
import TemporaryInjunctionPdfPreviewModal from './TemporaryInjunctionPdfPreviewModal.jsx';
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

function TemporaryInjunctionForm() {
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
    
    // Defendants Information (we'll handle multiple defendants)
    defendants: [
      {
        name: '',
        age: '',
        guardianName: '',
        guardianRelation: 'father',
        address: '',
        occupation: ''
      }
    ],
    
    // Court Details
    courtType: 'SENIOR CIVIL JUDGE',
    district: '',
    state: '',
    caseNumber: '',
    caseYear: '',
    suitNumber: '',
    suitYear: '',
    advocateName: '',
    
    // Case Details
    natureOfDispute: '',
    factsOfCase: '',
    primafacieCase: '',
    balanceOfConvenience: '',
    irreparableLoss: '',
    urgencyReason: '',
    propertyDetails: '',
    currentPossession: '',
    threatenedAction: '',
    previousLitigation: '',
    temporaryRelief: '',
    additionalFacts: ''
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
    updatedDefendants[index] = {
      ...updatedDefendants[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      defendants: updatedDefendants
    }));
  };

  const addDefendant = () => {
    setFormData(prev => ({
      ...prev,
      defendants: [
        ...prev.defendants,
        {
          name: '',
          age: '',
          guardianName: '',
          guardianRelation: 'father',
          address: '',
          occupation: ''
        }
      ]
    }));
  };

  const removeDefendant = (index) => {
    if (formData.defendants.length > 1) {
      const updatedDefendants = formData.defendants.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        defendants: updatedDefendants
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPdfData(null);

    try {
      const response = await fetch('https://mishratejass01.app.n8n.cloud/webhook/temporary-injunction', {
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
            reference: "temp-injunction-numbering",
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
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: "IN", bold: false })],
            alignment: AlignmentType.END,
            spacing: { after: 100 },
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
                      children: [new TextRun({ text: ".....PLAINTIFF/APPLICANT", bold: true })],
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
          
          // Defendants tables
          ...pdfData.parties.defendants.map((defendant, index) => 
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
                        new Paragraph(`${index + 1}. ${defendant.name}`),
                        new Paragraph(`${defendant.guardianRelation === 'father' ? 'S/o' : 'C/o'} ${defendant.guardianName}`),
                        new Paragraph(`R/o ${defendant.address}`),
                      ],
                    }),
                    new TableCell({
                      children: [new Paragraph({
                        style: "strong",
                        alignment: AlignmentType.END,
                        children: [new TextRun({ text: ".....DEFENDANTS/RESPONDENTS", bold: true })],
                      })],
                      verticalAlign: "center",
                    }),
                  ],
                }),
              ],
            })
          ),

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
              reference: "temp-injunction-numbering",
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
            children: [new TextRun({ text: pdfData.prayer.text })],
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
                    children: [new Paragraph({ text: "Plaintiff/Applicant", style: "strong", alignment: AlignmentType.END })] 
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
      saveAs(blob, `Temporary_Injunction_Application_${pdfData.parties.plaintiff.name.replace(/\s+/g, '_')}.docx`);
    });
  };

  return (
    <div className="form-container">
      <h1>Temporary Injunction Application Form</h1>
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

        {/* Defendants Information Section */}
        <section className="form-section">
          <h2>Defendants Information</h2>
          {formData.defendants.map((defendant, index) => (
            <div key={index} className="defendant-section">
              <div className="defendant-header">
                <h3>Defendant {index + 1}</h3>
                {formData.defendants.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeDefendant(index)}
                    className="remove-defendant-btn"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="form-group">
                <label htmlFor={`defendant-name-${index}`}>Full Name of Defendant</label>
                <input
                  type="text"
                  id={`defendant-name-${index}`}
                  value={defendant.name}
                  onChange={(e) => handleDefendantChange(index, 'name', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor={`defendant-age-${index}`}>Age</label>
                <input
                  type="number"
                  id={`defendant-age-${index}`}
                  value={defendant.age}
                  onChange={(e) => handleDefendantChange(index, 'age', e.target.value)}
                  required
                  min="18"
                />
              </div>
              <div className="form-group">
                <label htmlFor={`defendant-guardian-${index}`}>Guardian's Name</label>
                <input
                  type="text"
                  id={`defendant-guardian-${index}`}
                  value={defendant.guardianName}
                  onChange={(e) => handleDefendantChange(index, 'guardianName', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor={`defendant-relation-${index}`}>Relation with Guardian</label>
                <select
                  id={`defendant-relation-${index}`}
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
                <label htmlFor={`defendant-address-${index}`}>Complete Address</label>
                <textarea
                  id={`defendant-address-${index}`}
                  value={defendant.address}
                  onChange={(e) => handleDefendantChange(index, 'address', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor={`defendant-occupation-${index}`}>Occupation</label>
                <input
                  type="text"
                  id={`defendant-occupation-${index}`}
                  value={defendant.occupation}
                  onChange={(e) => handleDefendantChange(index, 'occupation', e.target.value)}
                  required
                />
              </div>
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
            <label htmlFor="courtType">Court Type</label>
            <select
              id="courtType"
              name="courtType"
              value={formData.courtType}
              onChange={handleChange}
              required
            >
              <option value="SENIOR CIVIL JUDGE">Senior Civil Judge</option>
              <option value="CIVIL JUDGE">Civil Judge</option>
              <option value="DISTRICT JUDGE">District Judge</option>
              <option value="HIGH COURT">High Court</option>
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
            <label htmlFor="caseNumber">Case/IA Number</label>
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

        {/* Case Details Section */}
        <section className="form-section">
          <h2>Case Details & Grounds</h2>
          <div className="form-group">
            <label htmlFor="natureOfDispute">Nature of Dispute</label>
            <textarea
              id="natureOfDispute"
              name="natureOfDispute"
              value={formData.natureOfDispute}
              onChange={handleChange}
              placeholder="Briefly describe the nature of the dispute"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="factsOfCase">Facts of the Case</label>
            <textarea
              id="factsOfCase"
              name="factsOfCase"
              value={formData.factsOfCase}
              onChange={handleChange}
              placeholder="Provide detailed facts of the case"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="primafacieCase">Prima Facie Case</label>
            <textarea
              id="primafacieCase"
              name="primafacieCase"
              value={formData.primafacieCase}
              onChange={handleChange}
              placeholder="Explain how you have a prima facie case in your favor"
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
              placeholder="Explain why the balance of convenience lies in your favor"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="irreparableLoss">Irreparable Loss and Injury</label>
            <textarea
              id="irreparableLoss"
              name="irreparableLoss"
              value={formData.irreparableLoss}
              onChange={handleChange}
              placeholder="Describe the irreparable loss you would suffer if injunction is not granted"
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
              placeholder="Explain why urgent relief is required"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="propertyDetails">Property/Subject Matter Details</label>
            <textarea
              id="propertyDetails"
              name="propertyDetails"
              value={formData.propertyDetails}
              onChange={handleChange}
              placeholder="Provide details of the property or subject matter in dispute"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="currentPossession">Current Possession Status</label>
            <textarea
              id="currentPossession"
              name="currentPossession"
              value={formData.currentPossession}
              onChange={handleChange}
              placeholder="Describe who is currently in possession and how"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="threatenedAction">Threatened Action by Defendants</label>
            <textarea
              id="threatenedAction"
              name="threatenedAction"
              value={formData.threatenedAction}
              onChange={handleChange}
              placeholder="Describe what action the defendants are threatening to take"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="previousLitigation">Previous Litigation (if any)</label>
            <textarea
              id="previousLitigation"
              name="previousLitigation"
              value={formData.previousLitigation}
              onChange={handleChange}
              placeholder="Mention any previous litigation between the parties"
            />
          </div>
          <div className="form-group">
            <label htmlFor="temporaryRelief">Temporary Relief Sought</label>
            <textarea
              id="temporaryRelief"
              name="temporaryRelief"
              value={formData.temporaryRelief}
              onChange={handleChange}
              placeholder="Specify exactly what temporary relief you are seeking"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="additionalFacts">Additional Facts/Information</label>
            <textarea
              id="additionalFacts"
              name="additionalFacts"
              value={formData.additionalFacts}
              onChange={handleChange}
              placeholder="Any other relevant facts or information"
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
        <TemporaryInjunctionPdfPreviewModal
          data={pdfData}
          onClose={() => setShowPreview(false)}
          onWordDownload={() => handleWordDownload(pdfData)}
        />
      )}
      
      {pdfData && (
        <div className="download-section">
          <h2>Application Ready</h2>
          <p>Your temporary injunction application has been generated successfully.</p>
          <div className="download-buttons-row">
            <PDFDownloadLink
              document={<TemporaryInjunctionApplicationPDF data={pdfData} />}
              fileName={`Temporary_Injunction_Application_${pdfData.parties?.plaintiff?.name?.replace(/\s+/g, '_') || 'document'}.pdf`}
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

export default TemporaryInjunctionForm;