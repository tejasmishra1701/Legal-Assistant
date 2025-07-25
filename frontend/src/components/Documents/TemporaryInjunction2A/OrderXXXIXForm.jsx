import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderXXXIXForm.css';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { OrderXXXIXApplicationPDF } from './OrderXXXIXApplicationPDF';
import OrderXXXIXPdfPreviewModal from './OrderXXXIXPDFPreviewModal.jsx';
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

function OrderXXXIXForm() {
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
    state: 'DELHI',
    iaNumber: '',
    iaYear: '',
    suitNumber: '',
    suitYear: '',
    advocateName: '',
    
    // Property Details
    propertyDescription: '',
    propertyAddress: '',
    houseNumber: '',
    tenancyDetails: '',
    
    // Injunction Details
    originalInjunctionDate: '',
    injunctionOrderDetails: '',
    interimInjunctionTerms: '',
    
    // Violation Details
    violationDate: '',
    violationDescription: '',
    disobedienceDetails: '',
    forciblePossessionDetails: '',
    householdGoodsDetails: '',
    witnessDetails: '',
    
    // Contempt Details
    contemptNature: '',
    wilfulDisobedience: '',
    liabilityForDetention: '',
    propertyAttachmentDetails: '',
    
    // Relief Sought
    appropriateAction: '',
    propertyRestoration: '',
    civilImprisonment: '',
    additionalReliefSought: '',
    
    // Supporting Evidence
    documentsList: '',
    evidenceDetails: '',
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
      const response = await fetch('https://mishratejass01.app.n8n.cloud/webhook/order-xxxix', {
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
            reference: "order-xxxix-numbering",
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
              text: `IN THE COURT OF SH. ${pdfData.courtDetails.judgeName} SENIOR CIVIL JUDGE (DISTRICT ${pdfData.courtDetails.district}), ${pdfData.courtDetails.state}`,
              color: "#000000",
              bold: true,
            })],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `IA NO. ${pdfData.courtDetails.iaNumber} OF ${pdfData.courtDetails.iaYear}`,
                bold: false,
              }),
            ],
            alignment: AlignmentType.END,
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: "IN", bold: false })],
            alignment: AlignmentType.CENTER,
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
          
          // Plaintiff details
          new Paragraph(`ABC ${pdfData.parties.plaintiff.name}`),
          
          new Paragraph({
            children: [new TextRun({ text: "...PLAINTIFF/APPLICANT", bold: true })],
            alignment: AlignmentType.END,
            spacing: { before: 100, after: 200 },
          }),
          
          new Paragraph({
            alignment: AlignmentType.CENTER,
            style: "strong",
            children: [new TextRun({ text: "Versus", bold: true, spacing: { before: 300, after: 300 } })]
          }),
          
          // Defendant details
          new Paragraph(`XYZ ${pdfData.parties.defendant.name}`),
          
          new Paragraph({
            children: [new TextRun({ text: "...DEFENDANT/RESPONDENT", bold: true })],
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
              reference: "order-xxxix-numbering",
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
                    children: [new Paragraph(`${pdfData.footer.place}.`)] 
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
      saveAs(blob, `Order_XXXIX_Application_${pdfData.parties.plaintiff.name.replace(/\s+/g, '_')}.docx`);
    });
  };

  return (
    <div className="form-container">
      <h1>Application Under Order XXXIX Rule 2-A</h1>
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
            <label htmlFor="iaNumber">IA Number</label>
            <input
              type="text"
              id="iaNumber"
              name="iaNumber"
              value={formData.iaNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="iaYear">IA Year</label>
            <input
              type="number"
              id="iaYear"
              name="iaYear"
              value={formData.iaYear}
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
              placeholder="Describe the property in question"
              required
            />
          </div>
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
            <label htmlFor="houseNumber">House Number</label>
            <input
              type="text"
              id="houseNumber"
              name="houseNumber"
              value={formData.houseNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="tenancyDetails">Tenancy Details</label>
            <textarea
              id="tenancyDetails"
              name="tenancyDetails"
              value={formData.tenancyDetails}
              onChange={handleChange}
              placeholder="Details about tenancy relationship"
              required
            />
          </div>
        </section>

        {/* Original Injunction Details Section */}
        <section className="form-section">
          <h2>Original Injunction Details</h2>
          <div className="form-group">
            <label htmlFor="originalInjunctionDate">Original Injunction Date</label>
            <input
              type="date"
              id="originalInjunctionDate"
              name="originalInjunctionDate"
              value={formData.originalInjunctionDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="injunctionOrderDetails">Injunction Order Details</label>
            <textarea
              id="injunctionOrderDetails"
              name="injunctionOrderDetails"
              value={formData.injunctionOrderDetails}
              onChange={handleChange}
              placeholder="Details of the original injunction order"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="interimInjunctionTerms">Interim Injunction Terms</label>
            <textarea
              id="interimInjunctionTerms"
              name="interimInjunctionTerms"
              value={formData.interimInjunctionTerms}
              onChange={handleChange}
              placeholder="Terms of the interim injunction granted"
              required
            />
          </div>
        </section>

        {/* Violation Details Section */}
        <section className="form-section">
          <h2>Violation Details</h2>
          <div className="form-group">
            <label htmlFor="violationDate">Date of Violation</label>
            <input
              type="date"
              id="violationDate"
              name="violationDate"
              value={formData.violationDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="violationDescription">Description of Violation</label>
            <textarea
              id="violationDescription"
              name="violationDescription"
              value={formData.violationDescription}
              onChange={handleChange}
              placeholder="Describe how the injunction was violated"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="disobedienceDetails">Willful Disobedience Details</label>
            <textarea
              id="disobedienceDetails"
              name="disobedienceDetails"
              value={formData.disobedienceDetails}
              onChange={handleChange}
              placeholder="Details of willful disobedience of court orders"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="forciblePossessionDetails">Forcible Possession Details</label>
            <textarea
              id="forciblePossessionDetails"
              name="forciblePossessionDetails"
              value={formData.forciblePossessionDetails}
              onChange={handleChange}
              placeholder="Details of forcible possession taken by defendant"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="householdGoodsDetails">Household Goods Details</label>
            <textarea
              id="householdGoodsDetails"
              name="householdGoodsDetails"
              value={formData.householdGoodsDetails}
              onChange={handleChange}
              placeholder="Details of household goods thrown on roadside"
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
              placeholder="Details of witnesses to the violation"
              required
            />
          </div>
        </section>

        {/* Contempt Details Section */}
        <section className="form-section">
          <h2>Contempt Details</h2>
          <div className="form-group">
            <label htmlFor="contemptNature">Nature of Contempt</label>
            <textarea
              id="contemptNature"
              name="contemptNature"
              value={formData.contemptNature}
              onChange={handleChange}
              placeholder="Describe the nature of contempt committed"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="wilfulDisobedience">Willful Disobedience</label>
            <textarea
              id="wilfulDisobedience"
              name="wilfulDisobedience"
              value={formData.wilfulDisobedience}
              onChange={handleChange}
              placeholder="Details of willful disobedience and violation"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="liabilityForDetention">Liability for Detention</label>
            <textarea
              id="liabilityForDetention"
              name="liabilityForDetention"
              value={formData.liabilityForDetention}
              onChange={handleChange}
              placeholder="Why defendant is liable for civil imprisonment"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="propertyAttachmentDetails">Property Attachment Details</label>
            <textarea
              id="propertyAttachmentDetails"
              name="propertyAttachmentDetails"
              value={formData.propertyAttachmentDetails}
              onChange={handleChange}
              placeholder="List of properties that may be attached"
              required
            />
          </div>
        </section>

        {/* Relief Sought Section */}
        <section className="form-section">
          <h2>Relief Sought</h2>
          <div className="form-group">
            <label htmlFor="appropriateAction">Appropriate Action Sought</label>
            <textarea
              id="appropriateAction"
              name="appropriateAction"
              value={formData.appropriateAction}
              onChange={handleChange}
              placeholder="What appropriate action you want the court to take"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="propertyRestoration">Property Restoration</label>
            <textarea
              id="propertyRestoration"
              name="propertyRestoration"
              value={formData.propertyRestoration}
              onChange={handleChange}
              placeholder="Request for restoration of possession of suit property"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="civilImprisonment">Civil Imprisonment</label>
            <textarea
              id="civilImprisonment"
              name="civilImprisonment"
              value={formData.civilImprisonment}
              onChange={handleChange}
              placeholder="Request for civil imprisonment of defendant"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="additionalReliefSought">Additional Relief Sought</label>
            <textarea
              id="additionalReliefSought"
              name="additionalReliefSought"
              value={formData.additionalReliefSought}
              onChange={handleChange}
              placeholder="Any other relief you are seeking"
            />
          </div>
        </section>

        {/* Supporting Evidence Section */}
        <section className="form-section">
          <h2>Supporting Evidence</h2>
          <div className="form-group">
            <label htmlFor="documentsList">List of Documents</label>
            <textarea
              id="documentsList"
              name="documentsList"
              value={formData.documentsList}
              onChange={handleChange}
              placeholder="List all supporting documents"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="evidenceDetails">Evidence Details</label>
            <textarea
              id="evidenceDetails"
              name="evidenceDetails"
              value={formData.evidenceDetails}
              onChange={handleChange}
              placeholder="Details of evidence supporting your application"
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
        <OrderXXXIXPdfPreviewModal
          data={pdfData}
          onClose={() => setShowPreview(false)}
          onWordDownload={() => handleWordDownload(pdfData)}
        />
      )}
      
      {pdfData && (
        <div className="download-section">
          <h2>Application Ready</h2>
          <p>Your Order XXXIX Rule 2-A application has been generated successfully.</p>
          <div className="download-buttons-row">
            <PDFDownloadLink
              document={<OrderXXXIXApplicationPDF data={pdfData} />}
              fileName={`Order_XXXIX_Application_${pdfData.parties?.plaintiff?.name?.replace(/\s+/g, '_') || 'document'}.pdf`}
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

export default OrderXXXIXForm;