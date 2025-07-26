import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TransferPetitionForm.css';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { TransferPetitionApplicationPDF } from './TransferPetitionPDFApplication';
import TransferPetitionPdfPreviewModal from './TransferPetitionPDFPreviewModal';
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

function TransferPetitionForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pdfData, setPdfData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    // Petitioner Information
    petitionerName: '',
    petitionerAge: '',
    petitionerGuardianName: '',
    petitionerGuardianRelation: 'father',
    petitionerAddress: '',
    petitionerOccupation: '',
    petitionerRank: '',
    petitionerServiceDetails: '',
    
    // Court Details
    originalCourtType: '',
    originalCourtLocation: '',
    targetCourtType: '',
    targetCourtLocation: '',
    originalCaseNumber: '',
    originalCaseYear: '',
    originalCaseTitle: '',
    transferPetitionNumber: '',
    transferPetitionYear: '',
    
    // Case Background
    caseNature: '',
    briefFacts: '',
    currentStatus: '',
    judgmentOrderDate: '',
    judgmentOrderDetails: '',
    
    // Transfer Grounds
    groundsForTransfer: '',
    financialHardship: '',
    safetyReasons: '',
    convenienceFactors: '',
    jurisdictionIssues: '',
    publicInterest: '',
    
    // Supporting Details
    previousApplications: '',
    urgencyReason: '',
    supportingDocuments: '',
    witnessDetails: '',
    
    // Legal Provisions
    legalProvisions: 'Section 25 of CPC',
    constitutionalProvisions: '',
    caseAuthorities: '',
    
    // Relief Sought
    mainRelief: '',
    interimRelief: '',
    additionalRelief: '',
    
    // Additional Information
    advocateName: '',
    placeOfFiling: '',
    additionalInfo: ''
  });

  // Dynamic arrays for multiple inputs
  const [respondents, setRespondents] = useState([{ name: '', address: '' }]);
  const [grounds, setGrounds] = useState(['']);
  const [documents, setDocuments] = useState(['']);
  const [witnesses, setWitnesses] = useState(['']);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Respondent handlers
  const addRespondent = () => {
    setRespondents([...respondents, { name: '', address: '' }]);
  };

  const removeRespondent = (index) => {
    if (respondents.length > 1) {
      setRespondents(respondents.filter((_, i) => i !== index));
    }
  };

  const handleRespondentChange = (index, field, value) => {
    const updatedRespondents = respondents.map((respondent, i) =>
      i === index ? { ...respondent, [field]: value } : respondent
    );
    setRespondents(updatedRespondents);
  };

  // Grounds handlers
  const addGround = () => {
    setGrounds([...grounds, '']);
  };

  const removeGround = (index) => {
    if (grounds.length > 1) {
      setGrounds(grounds.filter((_, i) => i !== index));
    }
  };

  const handleGroundChange = (index, value) => {
    const updatedGrounds = grounds.map((ground, i) =>
      i === index ? value : ground
    );
    setGrounds(updatedGrounds);
  };

  // Document handlers
  const addDocument = () => {
    setDocuments([...documents, '']);
  };

  const removeDocument = (index) => {
    if (documents.length > 1) {
      setDocuments(documents.filter((_, i) => i !== index));
    }
  };

  const handleDocumentChange = (index, value) => {
    const updatedDocuments = documents.map((doc, i) =>
      i === index ? value : doc
    );
    setDocuments(updatedDocuments);
  };

  // Witness handlers
  const addWitness = () => {
    setWitnesses([...witnesses, '']);
  };

  const removeWitness = (index) => {
    if (witnesses.length > 1) {
      setWitnesses(witnesses.filter((_, i) => i !== index));
    }
  };

  const handleWitnessChange = (index, value) => {
    const updatedWitnesses = witnesses.map((witness, i) =>
      i === index ? value : witness
    );
    setWitnesses(updatedWitnesses);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPdfData(null);

    try {
      const submissionData = {
        ...formData,
        respondents: respondents.filter(r => r.name.trim() !== ''),
        grounds: grounds.filter(g => g.trim() !== ''),
        documents: documents.filter(d => d.trim() !== ''),
        witnesses: witnesses.filter(w => w.trim() !== '')
      };

      const response = await fetch('https://mishratejass01.app.n8n.cloud/webhook/transfer-petition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
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
    
    const doc = new Document({
      numbering: {
        config: [
          {
            reference: "transfer-numbering",
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
              text: applicationTitle,
              color: "#000000",
              bold: true,
              underline: { type: "single" },
            })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            style: "strong",
            spacing: { after: 100 },
            children: [new TextRun({
              text: `IN THE ${courtDetails.targetCourtType} OF INDIA`,
              color: "#000000",
              bold: true,
            })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            style: "strong",
            spacing: { after: 100 },
            children: [new TextRun({
              text: `ORIGINAL CIVIL JURISDICTION`,
              color: "#000000",
              bold: true,
            })],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `TRANSFER PETITION (CIVIL) NO. ${courtDetails.transferPetitionNumber}/${courtDetails.transferPetitionYear}`,
                bold: true,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `(UNDER SECTION 25 OF THE CODE OF CIVIL PROCEDURE, READ WITH ORDER XLI, SUPREME COURT RULES, 2013.)`,
                bold: false,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          new Paragraph({ text: "IN THE MATTER OF:", spacing: { after: 200 } }),
          
          // Petitioner details
          new Paragraph(`${parties.petitioner.name}`),
          new Paragraph(`S/o ${parties.petitioner.guardianName}`),
          new Paragraph(`R/o ${parties.petitioner.address}`),
          
          new Paragraph({
            children: [new TextRun({ text: "...PETITIONER", bold: false })],
            alignment: AlignmentType.END,
            spacing: { before: 100, after: 200 },
          }),
          
          new Paragraph({
            alignment: AlignmentType.CENTER,
            style: "strong",
            children: [new TextRun({ text: "VERSUS", bold: false, spacing: { before: 300, after: 300 } })]
          }),
          
          // Respondents details
          ...parties.respondents.map((respondent, index) => [
            new Paragraph(`${index + 1}. ${respondent.name}`),
            new Paragraph(`   ${respondent.address}`),
          ]).flat(),
          
          new Paragraph({
            children: [new TextRun({ text: "...RESPONDENTS", bold: false })],
            alignment: AlignmentType.END,
            spacing: { before: 100, after: 300 },
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            style: "strong",
            spacing: { before: 300, after: 300 },
            children: [
              new TextRun({
                text: "AND IN THE MATTER OF:",
                bold: true,
                underline: { type: "single" },
                color: "#000000",
              }),
            ],
          }),

          new Paragraph({
            children: [new TextRun({
              text: `TRANSFER OF CIVIL WRIT PETITION NO.${courtDetails.originalCaseNumber}/${courtDetails.originalCaseYear} FILED BY THE PETITIONER AGAINST THE RESPONDENTS PENDING IN THE ${courtDetails.originalCourtType.toUpperCase()} AT ${courtDetails.originalCourtLocation.toUpperCase()}, TO THE ${courtDetails.targetCourtType.toUpperCase()} AT ${courtDetails.targetCourtLocation.toUpperCase()}.`,
              bold: false
            })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          }),

          new Paragraph({
            children: [new TextRun({ text: "To", bold: false })],
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph("The Hon'ble Chief Justice of India,"),
          new Paragraph("And his Companion Justices of the Hon'ble Supreme Court of India at New Delhi"),

          new Paragraph({
            style: "strong",
            spacing: { before: 300, after: 200 },
            children: [new TextRun({ text: "MOST RESPECTFULLY SHOWETH:", bold: true })],
          }),

          ...applicationBody.grounds.map((ground, index) => new Paragraph({
            children: [new TextRun({ text: ground })],
            numbering: {
              reference: "transfer-numbering",
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
            children: [new TextRun({ text: prayer.text })],
            spacing: { after: 200 }
          }),

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
                    children: [new Paragraph(`DATE OF DRAWN _______________`)]
                  }),
                  new TableCell({
                    spacing: { before: 200, after: 200 },
                    children: [new Paragraph({ text: "FILED BY:", style: "strong", alignment: AlignmentType.END })]
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    spacing: { before: 200, after: 200 },
                    children: [new Paragraph("DATE OF FILING")]
                  }),
                  new TableCell({
                    spacing: { before: 200, after: 200 },
                    children: [new Paragraph({ text: "ADVOCATE FOR THE PETITIONER", alignment: AlignmentType.END })]
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph(footer.place)]
                  }),
                  new TableCell({ children: [new Paragraph(formData.advocateName, {alignment: AlignmentType.END}) ] }),
                ],
              }),
            ],
          }),
          
          new Paragraph({ text: footer.note, spacing: { before: 200 } }),
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
      saveAs(blob, `Transfer_Petition_${parties.petitioner.name.replace(/\s+/g, '_')}.docx`);
    });
  };

  return (
    <div className="form-container">
      <h1>Transfer Petition Under Section 25 of CPC</h1>
      <form onSubmit={handleSubmit}>
        
        {/* Petitioner Information Section */}
        <section className="form-section">
          <h2>Petitioner Information</h2>
          <div className="form-group">
            <label htmlFor="petitionerName">Full Name of Petitioner</label>
            <input
              type="text"
              id="petitionerName"
              name="petitionerName"
              value={formData.petitionerName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="petitionerAge">Age of Petitioner</label>
            <input
              type="number"
              id="petitionerAge"
              name="petitionerAge"
              value={formData.petitionerAge}
              onChange={handleChange}
              required
              min="18"
            />
          </div>
          <div className="form-group">
            <label htmlFor="petitionerGuardianName">Guardian's Name</label>
            <input
              type="text"
              id="petitionerGuardianName"
              name="petitionerGuardianName"
              value={formData.petitionerGuardianName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="petitionerGuardianRelation">Relation with Guardian</label>
            <select
              id="petitionerGuardianRelation"
              name="petitionerGuardianRelation"
              value={formData.petitionerGuardianRelation}
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
            <label htmlFor="petitionerAddress">Complete Address</label>
            <textarea
              id="petitionerAddress"
              name="petitionerAddress"
              value={formData.petitionerAddress}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="petitionerOccupation">Occupation</label>
            <input
              type="text"
              id="petitionerOccupation"
              name="petitionerOccupation"
              value={formData.petitionerOccupation}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="petitionerRank">Rank/Designation (if applicable)</label>
            <input
              type="text"
              id="petitionerRank"
              name="petitionerRank"
              value={formData.petitionerRank}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="petitionerServiceDetails">Service Details</label>
            <textarea
              id="petitionerServiceDetails"
              name="petitionerServiceDetails"
              value={formData.petitionerServiceDetails}
              onChange={handleChange}
              placeholder="Details of service record, achievements, etc."
            />
          </div>
        </section>

        {/* Respondent Information Section */}
        <section className="form-section">
          <div className="section-header">
            <h2>Respondent Information</h2>
            <button type="button" className="add-btn" onClick={addRespondent}>
              + Add Respondent
            </button>
          </div>
          {respondents.map((respondent, index) => (
            <div key={index} className="dynamic-input-group">
              <div className="input-group-header">
                <h3>Respondent {index + 1}</h3>
                {respondents.length > 1 && (
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeRespondent(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="form-group">
                <label htmlFor={`respondentName${index}`}>Name and Designation</label>
                <input
                  type="text"
                  id={`respondentName${index}`}
                  value={respondent.name}
                  onChange={(e) => handleRespondentChange(index, 'name', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor={`respondentAddress${index}`}>Address</label>
                <textarea
                  id={`respondentAddress${index}`}
                  value={respondent.address}
                  onChange={(e) => handleRespondentChange(index, 'address', e.target.value)}
                  required
                />
              </div>
            </div>
          ))}
        </section>

        {/* Court Details Section */}
        <section className="form-section">
          <h2>Court Details</h2>
          <div className="form-group">
            <label htmlFor="originalCourtType">Original Court Type (in Capital Letters)</label>
            <input 
              type="text"
              id="originalCourtType"
              name="originalCourtType"
              value={formData.originalCourtType}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="originalCourtLocation">Original Court Location (in Capital Letters)</label>
            <input 
              type="text"
              id="originalCourtLocation"
              name="originalCourtLocation"
              value={formData.originalCourtLocation}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="targetCourtType">Target Court Type (in Capital Letters)</label>
            <input
              type="text"
              id="targetCourtType"
              name="targetCourtType"
              value={formData.targetCourtType}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="targetCourtLocation">Target Court Location (in Capital Letters)</label>
            <input
              type="text"
              id="targetCourtLocation"
              name="targetCourtLocation"
              value={formData.targetCourtLocation}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="originalCaseNumber">Original Case Number</label>
            <input
              type="text"
              id="originalCaseNumber"
              name="originalCaseNumber"
              value={formData.originalCaseNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="originalCaseYear">Original Case Year</label>
            <input
              type="number"
              id="originalCaseYear"
              name="originalCaseYear"
              value={formData.originalCaseYear}
              onChange={handleChange}
              required
              min="2000"
              max={new Date().getFullYear()}
            />
          </div>
          <div className="form-group">
            <label htmlFor="originalCaseTitle">Original Case Title</label>
            <input
              type="text"
              id="originalCaseTitle"
              name="originalCaseTitle"
              value={formData.originalCaseTitle}
              onChange={handleChange}
              placeholder="e.g., ABC vs XYZ"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="transferPetitionNumber">Transfer Petition Number</label>
            <input
              type="text"
              id="transferPetitionNumber"
              name="transferPetitionNumber"
              value={formData.transferPetitionNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="transferPetitionYear">Transfer Petition Year</label>
            <input
              type="number"
              id="transferPetitionYear"
              name="transferPetitionYear"
              value={formData.transferPetitionYear}
              onChange={handleChange}
              required
              min="2000"
              max={new Date().getFullYear()}
            />
          </div>
        </section>

        {/* Case Background Section */}
        <section className="form-section">
          <h2>Case Background</h2>
          <div className="form-group">
            <label htmlFor="caseNature">Nature of Original Case</label>
            <textarea
              id="caseNature"
              name="caseNature"
              value={formData.caseNature}
              onChange={handleChange}
              placeholder="Brief description of the nature of the original case"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="briefFacts">Brief Facts</label>
            <textarea
              id="briefFacts"
              name="briefFacts"
              value={formData.briefFacts}
              onChange={handleChange}
              placeholder="Brief facts of the case and sequence of events"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="currentStatus">Current Status of Case</label>
            <textarea
              id="currentStatus"
              name="currentStatus"
              value={formData.currentStatus}
              onChange={handleChange}
              placeholder="Current status and stage of the original case"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="judgmentOrderDate">Judgment/Order Date</label>
            <input
              type="date"
              id="judgmentOrderDate"
              name="judgmentOrderDate"
              value={formData.judgmentOrderDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="judgmentOrderDetails">Judgment/Order Details</label>
            <textarea
              id="judgmentOrderDetails"
              name="judgmentOrderDetails"
              value={formData.judgmentOrderDetails}
              onChange={handleChange}
              placeholder="Details of any relevant judgment or order"
            />
          </div>
        </section>
        
        {/* Grounds for Transfer Section */}
        <section className="form-section">
          <div className="section-header">
            <h2>Detailed Grounds for Transfer</h2>
            <button type="button" className="add-btn" onClick={addGround}>
              + Add Ground
            </button>
          </div>
          {grounds.map((ground, index) => (
            <div key={index} className="dynamic-input-group">
              <div className="input-group-header">
                <h3>Ground {index + 1}</h3>
                {grounds.length > 1 && (
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeGround(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="form-group">
                <label htmlFor={`ground${index}`}>Ground Details</label>
                <textarea
                  id={`ground${index}`}
                  value={ground}
                  onChange={(e) => handleGroundChange(index, e.target.value)}
                  placeholder="Detailed explanation of this ground for transfer"
                  required
                />
              </div>
            </div>
          ))}
        </section>

        {/* General Transfer Grounds Section */}
        <section className="form-section">
          <h2>General Grounds for Transfer</h2>
          <div className="form-group">
            <label htmlFor="groundsForTransfer">Main Grounds for Transfer</label>
            <textarea
              id="groundsForTransfer"
              name="groundsForTransfer"
              value={formData.groundsForTransfer}
              onChange={handleChange}
              placeholder="Primary reasons why the case should be transferred"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="financialHardship">Financial Hardship</label>
            <textarea
              id="financialHardship"
              name="financialHardship"
              value={formData.financialHardship}
              onChange={handleChange}
              placeholder="Details of financial difficulties in pursuing case in original court"
            />
          </div>
          <div className="form-group">
            <label htmlFor="safetyReasons">Safety and Security Concerns</label>
            <textarea
              id="safetyReasons"
              name="safetyReasons"
              value={formData.safetyReasons}
              onChange={handleChange}
              placeholder="Any safety or security concerns"
            />
          </div>
          <div className="form-group">
            <label htmlFor="convenienceFactors">Convenience Factors</label>
            <textarea
              id="convenienceFactors"
              name="convenienceFactors"
              value={formData.convenienceFactors}
              onChange={handleChange}
              placeholder="Factors related to convenience and accessibility"
            />
          </div>
          <div className="form-group">
            <label htmlFor="jurisdictionIssues">Jurisdiction Issues</label>
            <textarea
              id="jurisdictionIssues"
              name="jurisdictionIssues"
              value={formData.jurisdictionIssues}
              onChange={handleChange}
              placeholder="Any jurisdictional issues or conflicts"
            />
          </div>
          <div className="form-group">
            <label htmlFor="publicInterest">Public Interest</label>
            <textarea
              id="publicInterest"
              name="publicInterest"
              value={formData.publicInterest}
              onChange={handleChange}
              placeholder="How transfer serves public interest"
            />
          </div>
        </section>

        {/* Supporting Documents Section */}
        <section className="form-section">
          <div className="section-header">
            <h2>Supporting Documents</h2>
            <button type="button" className="add-btn" onClick={addDocument}>
              + Add Document
            </button>
          </div>
          {documents.map((document, index) => (
            <div key={index} className="dynamic-input-group">
              <div className="input-group-header">
                <h3>Document {index + 1}</h3>
                {documents.length > 1 && (
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeDocument(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="form-group">
                <label htmlFor={`document${index}`}>Document Description</label>
                <textarea
                  id={`document${index}`}
                  value={document}
                  onChange={(e) => handleDocumentChange(index, e.target.value)}
                  placeholder="Description of the supporting document"
                  required
                />
              </div>
            </div>
          ))}
        </section>

        {/* Witness Details Section */}
        <section className="form-section">
          <div className="section-header">
            <h2>Witness Details</h2>
            <button type="button" className="add-btn" onClick={addWitness}>
              + Add Witness
            </button>
          </div>
          {witnesses.map((witness, index) => (
            <div key={index} className="dynamic-input-group">
              <div className="input-group-header">
                <h3>Witness {index + 1}</h3>
                {witnesses.length > 1 && (
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeWitness(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="form-group">
                <label htmlFor={`witness${index}`}>Witness Details</label>
                <textarea
                  id={`witness${index}`}
                  value={witness}
                  onChange={(e) => handleWitnessChange(index, e.target.value)}
                  placeholder="Name, address, and role of the witness"
                />
              </div>
            </div>
          ))}
        </section>

        {/* Supporting Details Section */}
        <section className="form-section">
          <h2>Supporting Details</h2>
          <div className="form-group">
            <label htmlFor="previousApplications">Previous Applications</label>
            <textarea
              id="previousApplications"
              name="previousApplications"
              value={formData.previousApplications}
              onChange={handleChange}
              placeholder="Details of any previous transfer applications or similar petitions"
            />
          </div>
          <div className="form-group">
            <label htmlFor="urgencyReason">Urgency for Transfer</label>
            <textarea
              id="urgencyReason"
              name="urgencyReason"
              value={formData.urgencyReason}
              onChange={handleChange}
              placeholder="Reasons why urgent consideration is required"
            />
          </div>
        </section>

        {/* Legal Provisions Section */}
        <section className="form-section">
          <h2>Legal Provisions</h2>
          <div className="form-group">
            <label htmlFor="legalProvisions">Applicable Legal Provisions</label>
            <textarea
              id="legalProvisions"
              name="legalProvisions"
              value={formData.legalProvisions}
              onChange={handleChange}
              placeholder="Legal provisions under which transfer is sought"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="constitutionalProvisions">Constitutional Provisions</label>
            <textarea
              id="constitutionalProvisions"
              name="constitutionalProvisions"
              value={formData.constitutionalProvisions}
              onChange={handleChange}
              placeholder="Relevant constitutional provisions"
            />
          </div>
          <div className="form-group">
            <label htmlFor="caseAuthorities">Case Authorities</label>
            <textarea
              id="caseAuthorities"
              name="caseAuthorities"
              value={formData.caseAuthorities}
              onChange={handleChange}
              placeholder="Relevant case law and precedents"
            />
          </div>
        </section>

        {/* Relief Sought Section */}
        <section className="form-section">
          <h2>Relief Sought</h2>
          <div className="form-group">
            <label htmlFor="mainRelief">Main Relief</label>
            <textarea
              id="mainRelief"
              name="mainRelief"
              value={formData.mainRelief}
              onChange={handleChange}
              placeholder="Primary relief sought in the transfer petition"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="interimRelief">Interim Relief</label>
            <textarea
              id="interimRelief"
              name="interimRelief"
              value={formData.interimRelief}
              onChange={handleChange}
              placeholder="Any interim relief or stay sought"
            />
          </div>
          <div className="form-group">
            <label htmlFor="additionalRelief">Additional Relief</label>
            <textarea
              id="additionalRelief"
              name="additionalRelief"
              value={formData.additionalRelief}
              onChange={handleChange}
              placeholder="Any other relief sought"
            />
          </div>
        </section>

        {/* Additional Information Section */}
        <section className="form-section">
          <h2>Additional Information</h2>
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
            <label htmlFor="placeOfFiling">Place of Filing</label>
            <input
              type="text"
              id="placeOfFiling"
              name="placeOfFiling"
              value={formData.placeOfFiling}
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
        <TransferPetitionPdfPreviewModal
          data={pdfData}
          onClose={() => setShowPreview(false)}
          onWordDownload={() => handleWordDownload(pdfData)}
        />
      )}
      
      {pdfData && (
        <div className="download-section">
          <h2>Application Ready</h2>
          <p>Your transfer petition has been generated successfully.</p>
          <div className="download-buttons-row">
            <PDFDownloadLink
              document={<TransferPetitionApplicationPDF data={pdfData} />}
              fileName={`Transfer_Petition_${pdfData.parties?.petitioner?.name?.replace(/\s+/g, '_') || 'document'}.pdf`}
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

export default TransferPetitionForm;