import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Section125MaintenanceForm.css';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Section125MaintenancePDF } from './Section125MaintenancePDF';
import Section125PdfPreviewModal from './Section125PdfPreviewModal';
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

function Section125MaintenanceForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pdfData, setPdfData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    // Applicant Details
    applicantName: '',
    applicantAddress: '',
    applicantPhone: '',
    applicantEmail: '',
    applicantOccupation: '',
    applicantAge: '',
    applicantRelation: 'wife', // wife, child, parent
    
    // Additional Applicants (for children/dependents)
    additionalApplicants: [],
    
    // Respondent Details
    respondentName: '',
    respondentAddress: '',
    respondentPhone: '',
    respondentOccupation: '',
    respondentIncome: '',
    respondentAge: '',
    
    // Marriage Details (if applicable)
    marriageDate: '',
    marriagePlace: '',
    marriageCeremony: 'Hindu rites and ceremonies',
    
    // Children Details
    childrenCount: '',
    childrenDetails: '',
    
    // Relationship Details
    relationshipDuration: '',
    livingTogetherPeriod: '',
    separationDate: '',
    separationReason: '',
    
    // Financial Details
    applicantIncome: '',
    applicantAssets: '',
    respondentAssets: '',
    currentExpenses: '',
    maintenanceRequested: '',
    
    // Grounds for Application
    groundsForMaintenance: '',
    neglectDetails: '',
    refusalToMaintain: '',
    applicantInability: '',
    
    // Court Details
    courtName: 'Principal Judge, Family Court',
    district: '',
    state: '',
    applicationNumber: '',
    applicationYear: new Date().getFullYear().toString(),
    
    // Legal Representation
    advocateName: '',
    
    // Additional Information
    previousApplications: '',
    otherReliefs: '',
    witnessDetails: '',
    additionalInfo: '',
    
    // Interim Maintenance
    interimMaintenanceRequested: false,
    interimAmount: '',
    urgencyReason: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addAdditionalApplicant = () => {
    setFormData(prev => ({
      ...prev,
      additionalApplicants: [...prev.additionalApplicants, {
        name: '',
        age: '',
        relation: '',
        occupation: ''
      }]
    }));
  };

  const removeAdditionalApplicant = (index) => {
    setFormData(prev => ({
      ...prev,
      additionalApplicants: prev.additionalApplicants.filter((_, i) => i !== index)
    }));
  };

  const handleAdditionalApplicantChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      additionalApplicants: prev.additionalApplicants.map((applicant, i) => 
        i === index ? { ...applicant, [field]: value } : applicant
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPdfData(null);

    try {
      const response = await fetch('https://mishratejass01.app.n8n.cloud/webhook/section125-maintenance', {
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
   
    const doc = new Document({
      numbering: {
        config: [
          {
            reference: "section125-numbering",
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
              text: applicationTitle,
              color: "#000000",
              bold: true,
            })],
          }),
          
          new Paragraph({
            alignment: AlignmentType.CENTER,
            style: "strong",
            spacing: { before: 200, after: 200 },
            children: [new TextRun({
              text: `IN THE COURT OF ${courtDetails.courtName}, ${courtDetails.district}.`,
              bold: true,
            })],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `MAINTENANCE APPLICATION NO. ${courtDetails.applicationNumber} OF ${courtDetails.applicationYear}`,
                bold: true,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),

          new Paragraph({ text: "IN THE MATTER OF:", spacing: { after: 200 } }),
         
          // Applicants section
          ...parties.applicants.map(applicant => 
            new Paragraph({
              children: [
                new TextRun(`${applicant.name}, ${applicant.relation}`),
                new TextRun({ text: `\nR/o ${applicant.address}` }),
              ],
              spacing: { after: 100 }
            })
          ),

          new Paragraph({
            children: [new TextRun({ text: "APPLICANTS", bold: true })],
            alignment: AlignmentType.RIGHT,
            spacing: { after: 200 }
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            style: "strong",
            children: [new TextRun({ text: "VERSUS", bold: true, spacing: { before: 300, after: 300 } })]
          }),
         
          // Respondent section
          new Paragraph({
            children: [
              new TextRun(parties.respondent.name),
              new TextRun({ text: `\nR/o ${parties.respondent.address}` }),
            ],
            spacing: { after: 100 }
          }),

          new Paragraph({
            children: [new TextRun({ text: "RESPONDENT", bold: true })],
            alignment: AlignmentType.RIGHT,
            spacing: { after: 300 }
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            style: "strong",
            heading: "Heading3",
            spacing: { before: 300, after: 300 },
            children: [
              new TextRun({
                text: "APPLICATION UNDER SECTION 125 OF THE CODE OF CRIMINAL PROCEDURE, 1973",
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

          ...applicationBody.grounds.map(fact => new Paragraph({
            children: [new TextRun({ text: fact })],
            numbering: {
              reference: "section125-numbering",
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

          // Footer section
          new Table({
            columnWidths: [4500, 4500],
            width: { size: 9000, type: WidthType.DXA },
            spacing: { before: 300, after: 200 },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph(`Place: ${footer.place}`)]
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: "APPLICANTS", alignment: AlignmentType.RIGHT })]
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph(`Date: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`)]
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: "THROUGH", alignment: AlignmentType.RIGHT })]
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [] }),
                  new TableCell({
                    children: [
                      new Paragraph({ text: footer.advocateName, alignment: AlignmentType.RIGHT }),
                      new Paragraph({ text: "ADVOCATE", style: "strong", alignment: AlignmentType.RIGHT }),
                    ]
                  }),
                ],
              }),
            ],
          }),
         
          new Paragraph({ text: footer.verification, spacing: { before: 200 } }),
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
      },
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, `Section_125_Maintenance_Application_${pdfData.parties.applicants[0]?.name.replace(/\s+/g, '_') || 'document'}.docx`);
    });
  };

  return (
    <div className="form-container">
      <h1>Section 125 Maintenance Application Form</h1>
      <form onSubmit={handleSubmit}>
        {/* Applicant Details Section */}
        <section className="form-section">
          <h2>Primary Applicant Details</h2>
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
            <label htmlFor="applicantRelation">Relationship to Respondent</label>
            <select
              id="applicantRelation"
              name="applicantRelation"
              value={formData.applicantRelation}
              onChange={handleChange}
              required
            >
              <option value="wife">Wife</option>
              <option value="child">Child</option>
              <option value="parent">Parent</option>
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
            <label htmlFor="applicantAge">Age</label>
            <input
              type="number"
              id="applicantAge"
              name="applicantAge"
              value={formData.applicantAge}
              onChange={handleChange}
              required
              min="1"
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
              placeholder="Enter occupation or 'Housewife' if applicable"
            />
          </div>
          <div className="form-group">
            <label htmlFor="applicantPhone">Phone Number</label>
            <input
              type="tel"
              id="applicantPhone"
              name="applicantPhone"
              value={formData.applicantPhone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="applicantEmail">Email Address</label>
            <input
              type="email"
              id="applicantEmail"
              name="applicantEmail"
              value={formData.applicantEmail}
              onChange={handleChange}
            />
          </div>
        </section>

        {/* Additional Applicants Section */}
        <section className="form-section">
          <h2>Additional Applicants (Children/Dependents)</h2>
          {formData.additionalApplicants.map((applicant, index) => (
            <div key={index} className="additional-applicant">
              <h3>Applicant {index + 2}</h3>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={applicant.name}
                  onChange={(e) => handleAdditionalApplicantChange(index, 'name', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  value={applicant.age}
                  onChange={(e) => handleAdditionalApplicantChange(index, 'age', e.target.value)}
                  required
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Relation to Respondent</label>
                <select
                  value={applicant.relation}
                  onChange={(e) => handleAdditionalApplicantChange(index, 'relation', e.target.value)}
                  required
                >
                  <option value="">Select Relation</option>
                  <option value="son">Son</option>
                  <option value="daughter">Daughter</option>
                  <option value="parent">Parent</option>
                </select>
              </div>
              <div className="form-group">
                <label>Occupation/School</label>
                <input
                  type="text"
                  value={applicant.occupation}
                  onChange={(e) => handleAdditionalApplicantChange(index, 'occupation', e.target.value)}
                  placeholder="Student/School name or occupation"
                />
              </div>
              <button type="button" onClick={() => removeAdditionalApplicant(index)} className="remove-btn">
                Remove Applicant
              </button>
            </div>
          ))}
          <button type="button" onClick={addAdditionalApplicant} className="add-btn">
            Add Additional Applicant
          </button>
        </section>

        {/* Respondent Details Section */}
        <section className="form-section">
          <h2>Respondent Details</h2>
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
          <div className="form-group">
            <label htmlFor="respondentIncome">Monthly Income (approximate)</label>
            <input
              type="number"
              id="respondentIncome"
              name="respondentIncome"
              value={formData.respondentIncome}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label htmlFor="respondentAge">Age</label>
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
        </section>

        {/* Marriage Details Section */}
        {formData.applicantRelation === 'wife' && (
          <section className="form-section">
            <h2>Marriage Details</h2>
            <div className="form-group">
              <label htmlFor="marriageDate">Date of Marriage</label>
              <input
                type="date"
                id="marriageDate"
                name="marriageDate"
                value={formData.marriageDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="marriagePlace">Place of Marriage</label>
              <input
                type="text"
                id="marriagePlace"
                name="marriagePlace"
                value={formData.marriagePlace}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="marriageCeremony">Marriage Ceremony</label>
              <input
                type="text"
                id="marriageCeremony"
                name="marriageCeremony"
                value={formData.marriageCeremony}
                onChange={handleChange}
                placeholder="e.g., Hindu rites and ceremonies"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="livingTogetherPeriod">Period Living Together</label>
              <input
                type="text"
                id="livingTogetherPeriod"
                name="livingTogetherPeriod"
                value={formData.livingTogetherPeriod}
                onChange={handleChange}
                placeholder="e.g., 2 years"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="separationDate">Date of Separation (if applicable)</label>
              <input
                type="date"
                id="separationDate"
                name="separationDate"
                value={formData.separationDate}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="separationReason">Reason for Separation</label>
              <textarea
                id="separationReason"
                name="separationReason"
                value={formData.separationReason}
                onChange={handleChange}
                placeholder="Describe the circumstances leading to separation"
              />
            </div>
          </section>
        )}

        {/* Children Details Section */}
        <section className="form-section">
          <h2>Children Details</h2>
          <div className="form-group">
            <label htmlFor="childrenCount">Number of Children</label>
            <input
              type="number"
              id="childrenCount"
              name="childrenCount"
              value={formData.childrenCount}
              onChange={handleChange}
              min="0"
            />
          </div>
          <div className="form-group">
            <label htmlFor="childrenDetails">Children Details</label>
            <textarea
              id="childrenDetails"
              name="childrenDetails"
              value={formData.childrenDetails}
              onChange={handleChange}
              placeholder="Names, ages, and current status of children"
            />
          </div>
        </section>

        {/* Financial Details Section */}
        <section className="form-section">
          <h2>Financial Details</h2>
          <div className="form-group">
            <label htmlFor="applicantIncome">Applicant's Monthly Income</label>
            <input
              type="number"
              id="applicantIncome"
              name="applicantIncome"
              value={formData.applicantIncome}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="Enter 0 if no income"
            />
          </div>
          <div className="form-group">
            <label htmlFor="currentExpenses">Monthly Expenses</label>
            <input
              type="number"
              id="currentExpenses"
              name="currentExpenses"
              value={formData.currentExpenses}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label htmlFor="maintenanceRequested">Maintenance Amount Requested (per month)</label>
            <input
              type="number"
              id="maintenanceRequested"
              name="maintenanceRequested"
              value={formData.maintenanceRequested}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label htmlFor="applicantAssets">Applicant's Assets</label>
            <textarea
              id="applicantAssets"
              name="applicantAssets"
              value={formData.applicantAssets}
              onChange={handleChange}
              placeholder="Describe any assets owned by the applicant"
            />
          </div>
          <div className="form-group">
            <label htmlFor="respondentAssets">Respondent's Assets (if known)</label>
            <textarea
              id="respondentAssets"
              name="respondentAssets"
              value={formData.respondentAssets}
              onChange={handleChange}
              placeholder="Describe any known assets of the respondent"
            />
          </div>
        </section>

        {/* Grounds for Application Section */}
        <section className="form-section">
          <h2>Grounds for Maintenance</h2>
          <div className="form-group">
            <label htmlFor="groundsForMaintenance">Legal Grounds for Maintenance</label>
            <textarea
              id="groundsForMaintenance"
              name="groundsForMaintenance"
              value={formData.groundsForMaintenance}
              onChange={handleChange}
              required
              placeholder="State the legal basis for claiming maintenance under Section 125 CrPC"
            />
          </div>
          <div className="form-group">
            <label htmlFor="neglectDetails">Details of Neglect</label>
            <textarea
              id="neglectDetails"
              name="neglectDetails"
              value={formData.neglectDetails}
              onChange={handleChange}
              required
              placeholder="Describe how the respondent has neglected to provide maintenance"
            />
          </div>
          <div className="form-group">
            <label htmlFor="refusalToMaintain">Refusal to Maintain</label>
            <textarea
              id="refusalToMaintain"
              name="refusalToMaintain"
              value={formData.refusalToMaintain}
              onChange={handleChange}
              required
              placeholder="Describe instances where respondent refused to provide maintenance"
            />
          </div>
          <div className="form-group">
            <label htmlFor="applicantInability">Applicant's Inability to Self-Maintain</label>
            <textarea
              id="applicantInability"
              name="applicantInability"
              value={formData.applicantInability}
              onChange={handleChange}
              required
              placeholder="Explain why the applicant cannot maintain themselves"
            />
          </div>
        </section>

        {/* Interim Maintenance Section */}
        <section className="form-section">
          <h2>Interim Maintenance</h2>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="interimMaintenanceRequested"
                checked={formData.interimMaintenanceRequested}
                onChange={handleChange}
              />
              Request Interim Maintenance
            </label>
          </div>
          {formData.interimMaintenanceRequested && (
            <>
              <div className="form-group">
                <label htmlFor="interimAmount">Interim Maintenance Amount</label>
                <input
                  type="number"
                  id="interimAmount"
                  name="interimAmount"
                  value={formData.interimAmount}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
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
                  required
                  placeholder="Explain why interim maintenance is urgently needed"
                />
              </div>
            </>
          )}
        </section>

        {/* Court Details Section */}
        <section className="form-section">
          <h2>Court Details</h2>
          <div className="form-group">
            <label htmlFor="courtName">Court Name</label>
            <input
              type="text"
              id="courtName"
              name="courtName"
              value={formData.courtName}
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
            <label htmlFor="applicationNumber">Application Number (if known)</label>
            <input
              type="text"
              id="applicationNumber"
              name="applicationNumber"
              value={formData.applicationNumber}
              onChange={handleChange}
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

        {/* Additional Information Section */}
        <section className="form-section">
          <h2>Additional Information</h2>
          <div className="form-group">
            <label htmlFor="previousApplications">Previous Applications (if any)</label>
            <textarea
              id="previousApplications"
              name="previousApplications"
              value={formData.previousApplications}
              onChange={handleChange}
              placeholder="Details of any previous maintenance applications"
            />
          </div>
          <div className="form-group">
            <label htmlFor="otherReliefs">Other Reliefs Sought</label>
            <textarea
              id="otherReliefs"
              name="otherReliefs"
              value={formData.otherReliefs}
              onChange={handleChange}
              placeholder="Any other reliefs or orders sought from the court"
            />
          </div>
          <div className="form-group">
            <label htmlFor="witnessDetails">Witness Details</label>
            <textarea
              id="witnessDetails"
              name="witnessDetails"
              value={formData.witnessDetails}
              onChange={handleChange}
              placeholder="Details of witnesses who can support your case"
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
            {loading ? 'Generating Application...' : 'Submit Application'}
          </button>
        </div>
      </form>
     
      {showPreview && pdfData && (
        <Section125PdfPreviewModal
          data={pdfData}
          onClose={() => setShowPreview(false)}
          onWordDownload={() => handleWordDownload(pdfData)}
        />
      )}
     
      {pdfData && (
        <div className="download-section">
          <h2>Application Ready</h2>
          <p>Your Section 125 maintenance application has been generated successfully.</p>
          <div className="download-buttons-row">
            <PDFDownloadLink
              document={<Section125MaintenancePDF data={pdfData} />}
              fileName={`Section_125_Maintenance_Application_${pdfData.parties?.applicants?.[0]?.name?.replace(/\s+/g, '_') || 'document'}.pdf`}
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

export default Section125MaintenanceForm;