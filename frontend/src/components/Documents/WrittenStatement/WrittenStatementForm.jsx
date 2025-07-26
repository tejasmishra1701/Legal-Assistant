import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WrittenStatementForm.css';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { WrittenStatementApplicationPDF } from './WrittenStatementApplicationPDF';
import WrittenStatementPdfPreviewModal from './WrittenStatementPDFPreviewModal.jsx';
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

function WrittenStatementForm() {
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
    judgeName: '',
    district: '',
    state: '',
    suitNumber: '',
    suitYear: '',
    advocateName: '',
    
    // Case Details
    caseType: 'Civil Suit',
    natureOfCase: '',
    originalPlaintDetails: '',
    
    // Preliminary Objections
    limitationObjection: '',
    jurisdictionObjection: '',
    valuationObjection: '',
    causeOfActionObjection: '',
    nonJoinderObjection: '',
    misJoinderObjection: '',
    resJudicataObjection: '',
    pendingLitigationObjection: '',
    verificationObjection: '',
    specificReliefObjections: '',
    mandatoryNoticeObjection: '',
    registrationObjection: '',
    benamiFirmObjection: '',
    contractEnforcementObjection: '',
    additionalObjections: '',
    
    // On Merits Response
    meritsResponses: [
    { para: 1, text: '' }
  ],
    generalDenial: '',
    factsAdmitted: '',
    factsdenied: '',
    additionalFacts: '',
    
    // Counter Claims (if any)
    hasCounterClaim: false,
    counterClaimDetails: '',
    counterClaimRelief: '',
    
    // Relief Sought
    dismissalRequest: '',
    costsRequest: '',
    additionalRelief: '',
    
    // Additional Information
    supportingDocuments: '',
    witnessDetails: '',
    additionalInfo: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPdfData(null);

    try {
      const response = await fetch('https://mishratejass01.app.n8n.cloud/webhook/written-statement', {
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
            reference: "preliminary-objections-numbering",
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
            reference: "merits-numbering",
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
                text: "%1)",
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
            spacing: { after: 100 },
            children: [new TextRun({
              text: `IN THE COURT OF SHRI ${pdfData.courtDetails.judgeName} CIVIL JUDGE`,
              color: "#000000",
              bold: true,
            })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            style: "strong",
            spacing: { after: 300 },
            children: [new TextRun({
              text: `(DISTRICT ${pdfData.courtDetails.district}), ${pdfData.courtDetails.state}`,
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
          
          // Plaintiff details
          new Paragraph(`X ${pdfData.parties.plaintiff.name}`),
          
          new Paragraph({
            children: [new TextRun({ text: "... PLAINTIFF", bold: true })],
            alignment: AlignmentType.END,
            spacing: { before: 100, after: 200 },
          }),
          
          new Paragraph({
            alignment: AlignmentType.CENTER,
            style: "strong",
            children: [new TextRun({ text: "VERSUS", bold: true, spacing: { before: 300, after: 300 } })]
          }),
          
          // Defendant details
          new Paragraph(`Y ${pdfData.parties.defendant.name}`),
          
          new Paragraph({
            children: [new TextRun({ text: "....DEFENDANT", bold: true })],
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
                text: pdfData.applicationTitle,
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

          new Paragraph({
            style: "strong",
            spacing: { before: 300, after: 200 },
            children: [new TextRun({ text: "PRELIMINARY OBJECTIONS:", bold: true, underline: { type: "single" } })],
          }),

          ...pdfData.applicationBody.preliminaryObjections.map(objection => new Paragraph({
            children: [new TextRun({ text: objection })],
            numbering: {
              reference: "preliminary-objections-numbering",
              level: 0,
            },
            spacing: { before: 200, after: 200 }
          })),

          new Paragraph({
            style: "strong",
            spacing: { before: 300, after: 200 },
            children: [new TextRun({ text: "ON MERITS :", bold: true, underline: { type: "single" } })],
          }),

          new Paragraph({
            children: [new TextRun({ text: "Without prejudice to the preliminary objections stated above, the reply on merits, which is without prejudice to one another, is as under:-" })],
            spacing: { after: 200 }
          }),

          ...pdfData.applicationBody.onMerits.map(merit => new Paragraph({
            children: [new TextRun({ text: merit })],
            numbering: {
              reference: "merits-numbering",
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
                    children: [new Paragraph(pdfData.footer.place)] 
                  }),
                  new TableCell({ 
                    spacing: { before: 200, after: 200 }, 
                    children: [new Paragraph({ text: "DEFENDANT", style: "strong", alignment: AlignmentType.END })] 
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ 
                    spacing: { before: 200, after: 200 }, 
                    children: [new Paragraph("Dated")] 
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
                      new Paragraph({ text: "ADVOCATE", style: "strong", alignment: AlignmentType.END }),
                    ]
                  }),
                ],
              }),
            ],
          }),

          // Verification section
          new Paragraph({ 
            children: [new TextRun({ text: "VERIFICATION :", bold: true })],
            style: "strong", 
            spacing: { before: 400, after: 200 } 
          }),
          new Paragraph({
            children: [new TextRun({ text: pdfData.verification.text })],
            spacing: { after: 300 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "DEFENDANT", bold: true })],
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
      saveAs(blob, `Written_Statement_${pdfData.parties.defendant.name.replace(/\s+/g, '_')}.docx`);
    });
  };

  const handleMeritsChange = (idx, value) => {
    setFormData(prev => ({
      ...prev,
      meritsResponses: prev.meritsResponses.map((resp, i) =>
        i === idx ? { ...resp, text: value } : resp
      )
    }));
  };

  const handleAddMeritsResponse = () => {
    setFormData(prev => ({
      ...prev,
      meritsResponses: [
        ...prev.meritsResponses,
        { para: prev.meritsResponses.length + 1, text: '' }
      ]
    }));
  };

  const handleRemoveMeritsResponse = (idx) => {
    setFormData(prev => ({
      ...prev,
      meritsResponses: prev.meritsResponses.filter((_, i) => i !== idx)
        .map((resp, i) => ({ ...resp, para: i + 1 }))
    }));
  };

  return (
    <div className="form-container">
      <h1>Written Statement on Behalf of Defendant</h1>
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
            <label htmlFor="judgeName">Judge Name</label>
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

        {/* Case Details Section */}
        <section className="form-section">
          <h2>Case Details</h2>
          <div className="form-group">
            <label htmlFor="caseType">Type of Case</label>
            <select
              id="caseType"
              name="caseType"
              value={formData.caseType}
              onChange={handleChange}
              required
            >
              <option value="Civil Suit">Civil Suit</option>
              <option value="Specific Performance">Specific Performance</option>
              <option value="Ejectment">Ejectment</option>
              <option value="Injunction">Injunction</option>
              <option value="Declaration">Declaration</option>
              <option value="Damages">Damages</option>
              <option value="Possession">Possession</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="natureOfCase">Nature of Case</label>
            <textarea
              id="natureOfCase"
              name="natureOfCase"
              value={formData.natureOfCase}
              onChange={handleChange}
              placeholder="Briefly describe the nature of the case"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="originalPlaintDetails">Original Plaint Details</label>
            <textarea
              id="originalPlaintDetails"
              name="originalPlaintDetails"
              value={formData.originalPlaintDetails}
              onChange={handleChange}
              placeholder="Summary of plaintiff's claims in the original plaint"
              required
            />
          </div>
        </section>

        {/* Preliminary Objections Section */}
        <section className="form-section">
          <h2>Preliminary Objections</h2>
          <div className="form-group">
            <label htmlFor="limitationObjection">Limitation Objection</label>
            <textarea
              id="limitationObjection"
              name="limitationObjection"
              value={formData.limitationObjection}
              onChange={handleChange}
              placeholder="Objection that suit is barred by limitation under Article... of the Limitation Act"
            />
          </div>
          <div className="form-group">
            <label htmlFor="jurisdictionObjection">Jurisdiction Objection</label>
            <textarea
              id="jurisdictionObjection"
              name="jurisdictionObjection"
              value={formData.jurisdictionObjection}
              onChange={handleChange}
              placeholder="Objection that court has no jurisdiction to entertain this suit"
            />
          </div>
          <div className="form-group">
            <label htmlFor="valuationObjection">Valuation Objection</label>
            <textarea
              id="valuationObjection"
              name="valuationObjection"
              value={formData.valuationObjection}
              onChange={handleChange}
              placeholder="Objection that suit has not been properly valued for court fees"
            />
          </div>
          <div className="form-group">
            <label htmlFor="causeOfActionObjection">Cause of Action Objection</label>
            <textarea
              id="causeOfActionObjection"
              name="causeOfActionObjection"
              value={formData.causeOfActionObjection}
              onChange={handleChange}
              placeholder="Objection that there is no cause of action"
            />
          </div>
          <div className="form-group">
            <label htmlFor="nonJoinderObjection">Non-Joinder Objection</label>
            <textarea
              id="nonJoinderObjection"
              name="nonJoinderObjection"
              value={formData.nonJoinderObjection}
              onChange={handleChange}
              placeholder="Objection for non-joinder of necessary parties"
            />
          </div>
          <div className="form-group">
            <label htmlFor="misJoinderObjection">Mis-Joinder Objection</label>
            <textarea
              id="misJoinderObjection"
              name="misJoinderObjection"
              value={formData.misJoinderObjection}
              onChange={handleChange}
              placeholder="Objection for mis-joinder of parties"
            />
          </div>
          <div className="form-group">
            <label htmlFor="resJudicataObjection">Res-Judicata Objection</label>
            <textarea
              id="resJudicataObjection"
              name="resJudicataObjection"
              value={formData.resJudicataObjection}
              onChange={handleChange}
              placeholder="Objection based on principle of res-judicata"
            />
          </div>
          <div className="form-group">
            <label htmlFor="pendingLitigationObjection">Pending Litigation Objection</label>
            <textarea
              id="pendingLitigationObjection"
              name="pendingLitigationObjection"
              value={formData.pendingLitigationObjection}
              onChange={handleChange}
              placeholder="Objection that similar suit is pending"
            />
          </div>
          <div className="form-group">
            <label htmlFor="verificationObjection">Verification Objection</label>
            <textarea
              id="verificationObjection"
              name="verificationObjection"
              value={formData.verificationObjection}
              onChange={handleChange}
              placeholder="Objection that suit has not been properly verified"
            />
          </div>
          <div className="form-group">
            <label htmlFor="specificReliefObjections">Specific Relief Act Objections</label>
            <textarea
              id="specificReliefObjections"
              name="specificReliefObjections"
              value={formData.specificReliefObjections}
              onChange={handleChange}
              placeholder="Objections under Specific Relief Act (Section 41, etc.)"
            />
          </div>
          <div className="form-group">
            <label htmlFor="mandatoryNoticeObjection">Mandatory Notice Objection</label>
            <textarea
              id="mandatoryNoticeObjection"
              name="mandatoryNoticeObjection"
              value={formData.mandatoryNoticeObjection}
              onChange={handleChange}
              placeholder="Objection for not giving mandatory notice under relevant acts"
            />
          </div>
          <div className="form-group">
            <label htmlFor="registrationObjection">Registration Objection</label>
            <textarea
              id="registrationObjection"
              name="registrationObjection"
              value={formData.registrationObjection}
              onChange={handleChange}
              placeholder="Objection that plaintiff firm is not registered"
            />
          </div>
          <div className="form-group">
            <label htmlFor="benamiFirmObjection">Benami/Firm Objection</label>
            <textarea
              id="benamiFirmObjection"
              name="benamiFirmObjection"
              value={formData.benamiFirmObjection}
              onChange={handleChange}
              placeholder="Objections under Benami Transaction Act or related to firm competency"
            />
          </div>
          <div className="form-group">
            <label htmlFor="contractEnforcementObjection">Contract Enforcement Objection</label>
            <textarea
              id="contractEnforcementObjection"
              name="contractEnforcementObjection"
              value={formData.contractEnforcementObjection}
              onChange={handleChange}
              placeholder="Objection that contract of personal service cannot be enforced"
            />
          </div>
          <div className="form-group">
            <label htmlFor="additionalObjections">Additional Objections</label>
            <textarea
              id="additionalObjections"
              name="additionalObjections"
              value={formData.additionalObjections}
              onChange={handleChange}
              placeholder="Any other preliminary objections"
            />
          </div>
        </section>

        {/* On Merits Response Section */}
        <section className="form-section">
          <h2>Response on Merits</h2>
          {formData.meritsResponses.map((resp, idx) => (
            <div className="form-group" key={idx}>
              <label htmlFor={`meritsResponse${resp.para}`}>Response to Para {resp.para} of Plaint</label>
              <textarea
                id={`meritsResponse${resp.para}`}
                name={`meritsResponse${resp.para}`}
                value={resp.text}
                onChange={e => handleMeritsChange(idx, e.target.value)}
                placeholder={`Response to paragraph ${resp.para} of plaintiff's plaint`}
                required={idx === 0}
              />
              {formData.meritsResponses.length > 1 && (
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => handleRemoveMeritsResponse(idx)}
                  style={{ marginTop: '6px', marginBottom: '6px' }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="add-btn"
            onClick={handleAddMeritsResponse}
            style={{ marginTop: '10px', marginBottom: '10px' }}
          >
            + Add Another Paragraph Response
          </button>
          <div className="form-group">
            <label htmlFor="generalDenial">General Denial</label>
            <textarea
              id="generalDenial"
              name="generalDenial"
              value={formData.generalDenial}
              onChange={handleChange}
              placeholder="General denial of allegations not specifically responded to"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="factsAdmitted">Facts Admitted</label>
            <textarea
              id="factsAdmitted"
              name="factsAdmitted"
              value={formData.factsAdmitted}
              onChange={handleChange}
              placeholder="Facts from plaintiff's plaint that are admitted"
            />
          </div>
          <div className="form-group">
            <label htmlFor="factsdenied">Facts Denied</label>
            <textarea
              id="factsdenied"
              name="factsdenied"
              value={formData.factsdenied}
              onChange={handleChange}
              placeholder="Facts from plaintiff's plaint that are denied"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="additionalFacts">Additional Facts in Defense</label>
            <textarea
              id="additionalFacts"
              name="additionalFacts"
              value={formData.additionalFacts}
              onChange={handleChange}
              placeholder="Additional facts in support of defendant's case"
            />
          </div>
        </section>

        {/* Counter Claims Section */}
        <section className="form-section">
          <h2>Counter Claims (Optional)</h2>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="hasCounterClaim"
                checked={formData.hasCounterClaim}
                onChange={handleChange}
              />
              File Counter Claim
            </label>
          </div>
          {formData.hasCounterClaim && (
            <>
              <div className="form-group">
                <label htmlFor="counterClaimDetails">Counter Claim Details</label>
                <textarea
                  id="counterClaimDetails"
                  name="counterClaimDetails"
                  value={formData.counterClaimDetails}
                  onChange={handleChange}
                  placeholder="Details of counter claim against plaintiff"
                />
              </div>
              <div className="form-group">
                <label htmlFor="counterClaimRelief">Counter Claim Relief Sought</label>
                <textarea
                  id="counterClaimRelief"
                  name="counterClaimRelief"
                  value={formData.counterClaimRelief}
                  onChange={handleChange}
                  placeholder="Relief sought in counter claim"
                />
              </div>
            </>
          )}
        </section>

        {/* Relief Sought Section */}
        <section className="form-section">
          <h2>Relief Sought</h2>
          <div className="form-group">
            <label htmlFor="dismissalRequest">Dismissal Request</label>
            <textarea
              id="dismissalRequest"
              name="dismissalRequest"
              value={formData.dismissalRequest}
              onChange={handleChange}
              placeholder="Request for dismissal of plaintiff's suit"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="costsRequest">Costs Request</label>
            <textarea
              id="costsRequest"
              name="costsRequest"
              value={formData.costsRequest}
              onChange={handleChange}
              placeholder="Request for award of costs to defendant"
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
            <label htmlFor="supportingDocuments">Supporting Documents</label>
            <textarea
              id="supportingDocuments"
              name="supportingDocuments"
              value={formData.supportingDocuments}
              onChange={handleChange}
              placeholder="List of documents supporting defendant's case"
            />
          </div>
          <div className="form-group">
            <label htmlFor="witnessDetails">Witness Details</label>
            <textarea
              id="witnessDetails"
              name="witnessDetails"
              value={formData.witnessDetails}
              onChange={handleChange}
              placeholder="Details of witnesses for defendant's case"
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
        <WrittenStatementPdfPreviewModal
          data={pdfData}
          onClose={() => setShowPreview(false)}
          onWordDownload={() => handleWordDownload(pdfData)}
        />
      )}
      
      {pdfData && (
        <div className="download-section">
          <h2>Application Ready</h2>
          <p>Your written statement has been generated successfully.</p>
          <div className="download-buttons-row">
            <PDFDownloadLink
              document={<WrittenStatementApplicationPDF data={pdfData} />}
              fileName={`Written_Statement_${pdfData.parties?.defendant?.name?.replace(/\s+/g, '_') || 'document'}.pdf`}
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

export default WrittenStatementForm;