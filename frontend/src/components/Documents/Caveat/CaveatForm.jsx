import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CaveatForm.css';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { CaveatApplicationPDF } from './CaveatApplicationPDF';
import CaveatPdfPreviewModal from './CaveatPDFPreviewModal.jsx';
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

function CaveatForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pdfData, setPdfData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    // Petitioner Information (Who will file the case)
    petitionerName: '',
    petitionerAge: '',
    petitionerGuardianName: '',
    petitionerGuardianRelation: 'father',
    petitionerAddress: '',
    petitionerOccupation: '',
    
    // Caveator Information (Who is filing the caveat)
    caveatorName: '',
    caveatorAge: '',
    caveatorGuardianName: '',
    caveatorGuardianRelation: 'father',
    caveatorAddress: '',
    caveatorOccupation: '',
    
    // Court Details
    courtType: '',
    courtLocation: '',
    caveatNumber: '',
    caveatYear: '',
    originalSuitNumber: '',
    originalSuitYear: '',
    originalJudgeName: '',
    originalDistrict: '',
    advocateName: '',
    
    // Case Details
    caseType: 'Civil Misc. (Main) Petition',
    natureOfCase: '',
    originalCaseDetails: '',
    judgmentOrderDetails: '',
    expectedPetitionType: '',
    
    // Caveat Details
    reasonForCaveat: '',
    rightToAppeal: '',
    expectedGrounds: '',
    urgencyReason: '',
    noticeRequirement: '',
    hearingParticipation: '',
    
    // Legal Grounds
    legalProvisions: 'Article 227 of Constitution of India',
    jurisdictionBasis: '',
    timelineDetails: '',
    previousApplications: '',
    
    // Relief Sought
    mainRelief: '',
    specificConditions: '',
    additionalReliefSought: '',
    
    // Supporting Information
    supportingDocuments: '',
    witnessDetails: '',
    affidavitDetails: '',
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
      const response = await fetch('https://mishratejass01.app.n8n.cloud/webhook/caveat', {
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
            reference: "caveat-numbering",
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
            spacing: { after: 100 },
            children: [new TextRun({
              text: `IN THE ${pdfData.courtDetails.courtType} OF DELHI AT ${pdfData.courtDetails.courtLocation}`,
              color: "#000000",
              bold: true,
            })],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `CAVEAT NO. ${pdfData.courtDetails.caveatNumber}/${pdfData.courtDetails.caveatYear}`,
                bold: false,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `(ARISING OUT OF THE JUDGMENT AND ORDER DATED ........ IN SUIT NO. ${pdfData.courtDetails.originalSuitNumber} TITLED AS ABC v. XYZ PASSED BY SH. ${pdfData.courtDetails.originalJudgeName}, CIVIL JUDGE, ${pdfData.courtDetails.originalDistrict} DISTRICT, DELHI)`,
                bold: false,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          new Paragraph({ text: "In the matter of:", spacing: { after: 200 } }),
          
          // Petitioner details
          new Paragraph(`XYZ ${pdfData.parties.petitioner.name}`),
          new Paragraph(`S/o ${pdfData.parties.petitioner.guardianName}`),
          new Paragraph(`R/o ${pdfData.parties.petitioner.address}`),
          
          new Paragraph({
            children: [new TextRun({ text: "...Petitioner", bold: false })],
            alignment: AlignmentType.END,
            spacing: { before: 100, after: 200 },
          }),
          
          new Paragraph({
            alignment: AlignmentType.CENTER,
            style: "strong",
            children: [new TextRun({ text: "Versus", bold: false, spacing: { before: 300, after: 300 } })]
          }),
          
          // Caveator details
          new Paragraph(`ABC ${pdfData.parties.caveator.name}`),
          new Paragraph(`S/o ${pdfData.parties.caveator.guardianName}`),
          new Paragraph(`R/o ${pdfData.parties.caveator.address}`),
          
          new Paragraph({
            children: [new TextRun({ text: "...Respondent/Caveator", bold: false })],
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
            children: [new TextRun({ text: "Most Respectfully Showeth:", bold: true })],
          }),

          ...pdfData.applicationBody.grounds.map(ground => new Paragraph({
            children: [new TextRun({ text: ground })],
            numbering: {
              reference: "caveat-numbering",
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
                    children: [new Paragraph({ text: "Caveator", style: "strong", alignment: AlignmentType.END })] 
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ 
                    spacing: { before: 200, after: 200 }, 
                    children: [new Paragraph("Dated:")] 
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
      saveAs(blob, `Caveat_Application_${pdfData.parties.caveator.name.replace(/\s+/g, '_')}.docx`);
    });
  };

  return (
    <div className="form-container">
      <h1>Caveat Under Section 148-A of CPC</h1>
      <form onSubmit={handleSubmit}>
        {/* Petitioner Information Section */}
        <section className="form-section">
          <h2>Petitioner Information (Expected to file case)</h2>
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
        </section>

        {/* Caveator Information Section */}
        <section className="form-section">
          <h2>Caveator Information (Filing the caveat)</h2>
          <div className="form-group">
            <label htmlFor="caveatorName">Full Name of Caveator</label>
            <input
              type="text"
              id="caveatorName"
              name="caveatorName"
              value={formData.caveatorName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="caveatorAge">Age of Caveator</label>
            <input
              type="number"
              id="caveatorAge"
              name="caveatorAge"
              value={formData.caveatorAge}
              onChange={handleChange}
              required
              min="18"
            />
          </div>
          <div className="form-group">
            <label htmlFor="caveatorGuardianName">Guardian's Name</label>
            <input
              type="text"
              id="caveatorGuardianName"
              name="caveatorGuardianName"
              value={formData.caveatorGuardianName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="caveatorGuardianRelation">Relation with Guardian</label>
            <select
              id="caveatorGuardianRelation"
              name="caveatorGuardianRelation"
              value={formData.caveatorGuardianRelation}
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
            <label htmlFor="caveatorAddress">Complete Address</label>
            <textarea
              id="caveatorAddress"
              name="caveatorAddress"
              value={formData.caveatorAddress}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="caveatorOccupation">Occupation</label>
            <input
              type="text"
              id="caveatorOccupation"
              name="caveatorOccupation"
              value={formData.caveatorOccupation}
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
            <label htmlFor="courtLocation">Court Location</label>
            <input
              type="text"
              id="courtLocation"
              name="courtLocation"
              value={formData.courtLocation}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="caveatNumber">Caveat Number</label>
            <input
              type="text"
              id="caveatNumber"
              name="caveatNumber"
              value={formData.caveatNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="caveatYear">Caveat Year</label>
            <input
              type="number"
              id="caveatYear"
              name="caveatYear"
              value={formData.caveatYear}
              onChange={handleChange}
              required
              min="2000"
              max={new Date().getFullYear()}
            />
          </div>
          <div className="form-group">
            <label htmlFor="originalSuitNumber">Original Suit Number</label>
            <input
              type="text"
              id="originalSuitNumber"
              name="originalSuitNumber"
              value={formData.originalSuitNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="originalSuitYear">Original Suit Year</label>
            <input
              type="number"
              id="originalSuitYear"
              name="originalSuitYear"
              value={formData.originalSuitYear}
              onChange={handleChange}
              required
              min="2000"
              max={new Date().getFullYear()}
            />
          </div>
          <div className="form-group">
            <label htmlFor="originalJudgeName">Original Judge Name</label>
            <input
              type="text"
              id="originalJudgeName"
              name="originalJudgeName"
              value={formData.originalJudgeName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="originalDistrict">Original District</label>
            <input
              type="text"
              id="originalDistrict"
              name="originalDistrict"
              value={formData.originalDistrict}
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

        {/* Case Details Section */}
        <section className="form-section">
          <h2>Case Details</h2>
          <div className="form-group">
            <label htmlFor="caseType">Expected Petition Type</label>
            <select
              id="caseType"
              name="caseType"
              value={formData.caseType}
              onChange={handleChange}
              required
            >
              <option value="Civil Misc. (Main) Petition">Civil Misc. (Main) Petition</option>
              <option value="Writ Petition">Writ Petition</option>
              <option value="Appeal">Appeal</option>
              <option value="Revision Petition">Revision Petition</option>
              <option value="Application for Review">Application for Review</option>
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
              placeholder="Briefly describe the nature of the original case"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="originalCaseDetails">Original Case Details</label>
            <textarea
              id="originalCaseDetails"
              name="originalCaseDetails"
              value={formData.originalCaseDetails}
              onChange={handleChange}
              placeholder="Details of the original suit/case"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="judgmentOrderDetails">Judgment/Order Details</label>
            <textarea
              id="judgmentOrderDetails"
              name="judgmentOrderDetails"
              value={formData.judgmentOrderDetails}
              onChange={handleChange}
              placeholder="Details of the judgment/order that may be challenged"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="expectedPetitionType">Expected Petition Details</label>
            <textarea
              id="expectedPetitionType"
              name="expectedPetitionType"
              value={formData.expectedPetitionType}
              onChange={handleChange}
              placeholder="What type of petition you expect to be filed"
              required
            />
          </div>
        </section>

        {/* Caveat Details Section */}
        <section className="form-section">
          <h2>Caveat Grounds</h2>
          <div className="form-group">
            <label htmlFor="reasonForCaveat">Reason for Filing Caveat</label>
            <textarea
              id="reasonForCaveat"
              name="reasonForCaveat"
              value={formData.reasonForCaveat}
              onChange={handleChange}
              placeholder="Why you are filing this caveat"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="rightToAppeal">Right to Appeal/Contest</label>
            <textarea
              id="rightToAppeal"
              name="rightToAppeal"
              value={formData.rightToAppeal}
              onChange={handleChange}
              placeholder="Your right to appeal and contest the petition"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="expectedGrounds">Expected Grounds of Petition</label>
            <textarea
              id="expectedGrounds"
              name="expectedGrounds"
              value={formData.expectedGrounds}
              onChange={handleChange}
              placeholder="What grounds you expect the petitioner to raise"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="urgencyReason">Urgency for Caveat</label>
            <textarea
              id="urgencyReason"
              name="urgencyReason"
              value={formData.urgencyReason}
              onChange={handleChange}
              placeholder="Why urgent filing of caveat is necessary"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="noticeRequirement">Notice Requirement</label>
            <textarea
              id="noticeRequirement"
              name="noticeRequirement"
              value={formData.noticeRequirement}
              onChange={handleChange}
              placeholder="Your requirement to be given notice before any order"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="hearingParticipation">Hearing Participation</label>
            <textarea
              id="hearingParticipation"
              name="hearingParticipation"
              value={formData.hearingParticipation}
              onChange={handleChange}
              placeholder="Your desire to participate in the hearing"
              required
            />
          </div>
        </section>

        {/* Legal Grounds Section */}
        <section className="form-section">
          <h2>Legal Grounds</h2>
          <div className="form-group">
            <label htmlFor="legalProvisions">Legal Provisions</label>
            <textarea
              id="legalProvisions"
              name="legalProvisions"
              value={formData.legalProvisions}
              onChange={handleChange}
              placeholder="Legal provisions under which petition may be filed"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="jurisdictionBasis">Jurisdiction Basis</label>
            <textarea
              id="jurisdictionBasis"
              name="jurisdictionBasis"
              value={formData.jurisdictionBasis}
              onChange={handleChange}
              placeholder="Basis of court's jurisdiction"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="timelineDetails">Timeline Details</label>
            <textarea
              id="timelineDetails"
              name="timelineDetails"
              value={formData.timelineDetails}
              onChange={handleChange}
              placeholder="Timeline of events and limitation period"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="previousApplications">Previous Applications</label>
            <textarea
              id="previousApplications"
              name="previousApplications"
              value={formData.previousApplications}
              onChange={handleChange}
              placeholder="Details of any previous applications filed"
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
              placeholder="Main relief sought in the caveat"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="specificConditions">Specific Conditions</label>
            <textarea
              id="specificConditions"
              name="specificConditions"
              value={formData.specificConditions}
              onChange={handleChange}
              placeholder="Specific conditions for notice and hearing"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="additionalReliefSought">Additional Relief</label>
            <textarea
              id="additionalReliefSought"
              name="additionalReliefSought"
              value={formData.additionalReliefSought}
              onChange={handleChange}
              placeholder="Any additional relief sought"
            />
          </div>
        </section>

        {/* Supporting Information Section */}
        <section className="form-section">
          <h2>Supporting Information</h2>
          <div className="form-group">
            <label htmlFor="supportingDocuments">Supporting Documents</label>
            <textarea
              id="supportingDocuments"
              name="supportingDocuments"
              value={formData.supportingDocuments}
              onChange={handleChange}
              placeholder="List of documents supporting the caveat"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="witnessDetails">Witness Details</label>
            <textarea
              id="witnessDetails"
              name="witnessDetails"
              value={formData.witnessDetails}
              onChange={handleChange}
              placeholder="Details of witnesses if any"
            />
          </div>
          <div className="form-group">
            <label htmlFor="affidavitDetails">Affidavit Details</label>
            <textarea
              id="affidavitDetails"
              name="affidavitDetails"
              value={formData.affidavitDetails}
              onChange={handleChange}
              placeholder="Details of supporting affidavit"
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
        <CaveatPdfPreviewModal
          data={pdfData}
          onClose={() => setShowPreview(false)}
          onWordDownload={() => handleWordDownload(pdfData)}
        />
      )}
      
      {pdfData && (
        <div className="download-section">
          <h2>Application Ready</h2>
          <p>Your caveat application has been generated successfully.</p>
          <div className="download-buttons-row">
            <PDFDownloadLink
              document={<CaveatApplicationPDF data={pdfData} />}
              fileName={`Caveat_Application_${pdfData.parties?.caveator?.name?.replace(/\s+/g, '_') || 'document'}.pdf`}
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

export default CaveatForm;