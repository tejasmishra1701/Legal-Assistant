import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ConjugalRightsForm.css';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ConjugalRightsApplicationPDF } from './ConjugalRightsApplicationPDF';
import ConjugalRightsPdfPreviewModal from './ConjugalRightsPDFPreviewModal.jsx';
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
  HeadingLevel,
} from 'docx';
import { saveAs } from 'file-saver';

function ConjugalRightsForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pdfData, setPdfData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    // Court Details
    courtType: 'Family Court',
    courtLocation: '',
    petitionNumber: '',
    petitionYear: '',
    
    // Petitioner Information (Husband/Wife filing the petition)
    petitionerName: '',
    petitionerAge: '',
    petitionerGuardianName: '',
    petitionerGuardianRelation: 'father',
    petitionerAddress: '',
    petitionerOccupation: '',
    petitionerReligion: 'Hindu',
    petitionerStatusBeforeMarriage: '',
    petitionerStatusAtFiling: '',
    petitionerResidenceBeforeMarriage: '',
    petitionerResidenceAtFiling: '',
    
    // Respondent Information (Other spouse)
    respondentName: '',
    respondentAge: '',
    respondentGuardianName: '',
    respondentGuardianRelation: 'father',
    respondentAddress: '',
    respondentOccupation: '',
    respondentReligion: 'Hindu',
    respondentStatusBeforeMarriage: '',
    respondentStatusAtFiling: '',
    respondentResidenceBeforeMarriage: '',
    respondentResidenceAtFiling: '',
    
    // Marriage Details
    marriageDate: '',
    marriagePlace: '',
    marriageRegistrationDetails: '',
    marriageType: 'Hindu rites and ceremonies',
    
    // Cohabitation Details
    lastCohabitationDate: '',
    lastCohabitationPlace: '',
    cohabitationPeriod: '',
    reasonForSeparation: '',
    withdrawalCircumstances: '',
    
    // Children Details
    hasChildren: 'no',
    
    // Legal Grounds
    noCollusionStatement: '',
    noUnreasonableDelay: '',
    noPreviousProceedings: '',
    jurisdictionBasis: '',
    
    // Relief Sought
    mainRelief: '',
    additionalRelief: '',
    
    // Supporting Information
    advocateName: '',
    placeOfFiling: '',
    affidavitDetails: '',
    additionalInfo: ''
  });

  // Dynamic arrays for multiple inputs
  const [children, setChildren] = useState([{ name: '', sex: '', dateOfBirth: '', age: '' }]);
  const [previousProceedings, setPreviousProceedings] = useState([{ 
    serialNo: '', 
    nameOfParties: '', 
    natureOfProceedings: '', 
    caseNumber: '', 
    courtName: '', 
    result: '' 
  }]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Children handlers
  const addChild = () => {
    setChildren([...children, { name: '', sex: '', dateOfBirth: '', age: '' }]);
  };

  const removeChild = (index) => {
    if (children.length > 1) {
      setChildren(children.filter((_, i) => i !== index));
    }
  };

  const handleChildChange = (index, field, value) => {
    const updatedChildren = children.map((child, i) => 
      i === index ? { ...child, [field]: value } : child
    );
    setChildren(updatedChildren);
  };

  // Previous proceedings handlers
  const addProceeding = () => {
    setPreviousProceedings([...previousProceedings, { 
      serialNo: '', 
      nameOfParties: '', 
      natureOfProceedings: '', 
      caseNumber: '', 
      courtName: '', 
      result: '' 
    }]);
  };

  const removeProceeding = (index) => {
    if (previousProceedings.length > 1) {
      setPreviousProceedings(previousProceedings.filter((_, i) => i !== index));
    }
  };

  const handleProceedingChange = (index, field, value) => {
    const updatedProceedings = previousProceedings.map((proceeding, i) => 
      i === index ? { ...proceeding, [field]: value } : proceeding
    );
    setPreviousProceedings(updatedProceedings);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPdfData(null);

    try {
      const submissionData = {
        ...formData,
        children: formData.hasChildren === 'yes' ? children.filter(c => c.name.trim() !== '') : [],
        previousProceedings: formData.noPreviousProceedings === 'yes' ? 
          previousProceedings.filter(p => p.nameOfParties.trim() !== '') : []
      };

      const response = await fetch('https://mishratejass01.app.n8n.cloud/webhook/conjugal-rights', {
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
    
    const getGuardianPrefix = (relation) => {
        // A simple gender-neutral prefix
        return 'C/o'; 
    };

    const doc = new Document({
      numbering: {
        config: [
          {
            reference: "conjugal-numbering",
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
            heading: HeadingLevel.HEADING_2,
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
            spacing: { after: 100 },
            children: [new TextRun({
              text: `IN THE COURT OF ${pdfData.courtDetails.courtType}, ${pdfData.courtDetails.courtLocation}`,
              color: "#000000",
              bold: true,
            })],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `HMA PETITION NO. ${pdfData.courtDetails.petitionNumber} OF ${pdfData.courtDetails.petitionYear}`,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          new Paragraph({ text: "IN THE MATTER OF :", spacing: { after: 100 } }),
          
          // Petitioner details
          new Paragraph(pdfData.parties.petitioner.name),
          new Paragraph(`${getGuardianPrefix(pdfData.parties.petitioner.guardianRelation)} ${pdfData.parties.petitioner.guardianName}`),
          new Paragraph(`R/o ${pdfData.parties.petitioner.address}`),
          
          new Paragraph({
            children: [new TextRun({ text: "... PETITIONER" })],
            alignment: AlignmentType.END,
            spacing: { before: 100, after: 100 },
          }),
          
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "VERSUS", bold: true })]
          }),
          
          // Respondent details
          new Paragraph(pdfData.parties.respondent.name),
          new Paragraph(`${getGuardianPrefix(pdfData.parties.respondent.guardianRelation)} ${pdfData.parties.respondent.guardianName}`),
          new Paragraph(`R/o ${pdfData.parties.respondent.address}`),
          
          new Paragraph({
            children: [new TextRun({ text: "...RESPONDENT" })],
            alignment: AlignmentType.END,
            spacing: { before: 100, after: 200 },
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 200 },
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
            spacing: { before: 200, after: 200 },
            children: [new TextRun({ text: "Most Respectfully Showeth:", bold: true })],
          }),

          ...pdfData.applicationBody.grounds.map((ground) => new Paragraph({
            text: ground,
            numbering: {
              reference: "conjugal-numbering",
              level: 0,
            },
            spacing: { before: 200, after: 200 }
          })),

          new Paragraph({ 
            children: [new TextRun({ text: "PRAYER:", bold: true })],
            spacing: { before: 300, after: 150 } 
          }),
          new Paragraph({
            text: pdfData.prayer.text,
            spacing: { after: 200 }
          }),

          new Paragraph({
            children: [new TextRun({ text: "PETITIONER" })],
            alignment: AlignmentType.END,
            spacing: { before: 100, after: 100 },
          }),

          new Paragraph({
            children: [new TextRun({ text: "Through" })],
            alignment: AlignmentType.END,
            spacing: { after: 100 },
          }),

          // Footer
          new Paragraph({ text: `Place: ${pdfData.footer.place}`, spacing: { before: 200 } }),
          new Paragraph("Date:"),
          new Paragraph({ text: "ADVOCATE", alignment: AlignmentType.END }),
          
          new Paragraph({ text: "VERIFICATION:", bold: true, spacing: { before: 200 } }),
          new Paragraph({ text: pdfData.footer.verification, spacing: { after: 100 } }),
          
          new Paragraph({ text: `Verified at..................................(Place)`, spacing: { before: 100 } }),
          new Paragraph("Dated......................."),
          new Paragraph({ text: "PETITIONER", alignment: AlignmentType.END }),
          
          new Paragraph({ text: pdfData.footer.note, spacing: { before: 200 } }),
          new Paragraph({ text: "* * * * *", alignment: AlignmentType.CENTER, spacing: { before: 200 } }),
        ],
      }],
      styles: {
        paragraph: {
          run: {
            size: 24, // 12pt font size
            font: "Times New Roman",
          },
        },
      },
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, `Conjugal_Rights_Petition_${pdfData.parties.petitioner.name.replace(/\s+/g, '_')}.docx`);
    });
  };

  return (
    <div className="form-container">
      <h1>Petition for Restitution of Conjugal Rights under Section 9 of the Hindu Marriage Act</h1>
      <form onSubmit={handleSubmit}>
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
              <option value="Family Court">Family Court</option>
              <option value="Principal Judge, Family Court">Principal Judge, Family Court</option>
              <option value="District Court">District Court</option>
            </select>
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
            <label htmlFor="petitionNumber">HMA Petition Number</label>
            <input
              type="text"
              id="petitionNumber"
              name="petitionNumber"
              value={formData.petitionNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="petitionYear">Petition Year</label>
            <input
              type="number"
              id="petitionYear"
              name="petitionYear"
              value={formData.petitionYear}
              onChange={handleChange}
              required
              min="2000"
              max={new Date().getFullYear()}
            />
          </div>
        </section>

        {/* Petitioner Information Section */}
        <section className="form-section">
          <h2>Petitioner Information (Filing the petition)</h2>
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
            <label htmlFor="petitionerReligion">Religion</label>
            <select
              id="petitionerReligion"
              name="petitionerReligion"
              value={formData.petitionerReligion}
              onChange={handleChange}
              required
            >
              <option value="Hindu">Hindu</option>
              <option value="Muslim">Muslim</option>
              <option value="Christian">Christian</option>
              <option value="Sikh">Sikh</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="petitionerStatusBeforeMarriage">Status Before Marriage</label>
            <input
              type="text"
              id="petitionerStatusBeforeMarriage"
              name="petitionerStatusBeforeMarriage"
              value={formData.petitionerStatusBeforeMarriage}
              onChange={handleChange}
              placeholder="e.g., Bachelor, Spinster"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="petitionerStatusAtFiling">Status At Time of Filing</label>
            <input
              type="text"
              id="petitionerStatusAtFiling"
              name="petitionerStatusAtFiling"
              value={formData.petitionerStatusAtFiling}
              onChange={handleChange}
              placeholder="e.g., Married, Separated"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="petitionerResidenceBeforeMarriage">Place of Residence Before Marriage</label>
            <input
              type="text"
              id="petitionerResidenceBeforeMarriage"
              name="petitionerResidenceBeforeMarriage"
              value={formData.petitionerResidenceBeforeMarriage}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="petitionerResidenceAtFiling">Place of Residence At Time of Filing</label>
            <input
              type="text"
              id="petitionerResidenceAtFiling"
              name="petitionerResidenceAtFiling"
              value={formData.petitionerResidenceAtFiling}
              onChange={handleChange}
              required
            />
          </div>
        </section>

        {/* Respondent Information Section */}
        <section className="form-section">
          <h2>Respondent Information (Other spouse)</h2>
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
          <div className="form-group">
            <label htmlFor="respondentReligion">Religion</label>
            <select
              id="respondentReligion"
              name="respondentReligion"
              value={formData.respondentReligion}
              onChange={handleChange}
              required
            >
              <option value="Hindu">Hindu</option>
              <option value="Muslim">Muslim</option>
              <option value="Christian">Christian</option>
              <option value="Sikh">Sikh</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="respondentStatusBeforeMarriage">Status Before Marriage</label>
            <input
              type="text"
              id="respondentStatusBeforeMarriage"
              name="respondentStatusBeforeMarriage"
              value={formData.respondentStatusBeforeMarriage}
              onChange={handleChange}
              placeholder="e.g., Bachelor, Spinster"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="respondentStatusAtFiling">Status At Time of Filing</label>
            <input
              type="text"
              id="respondentStatusAtFiling"
              name="respondentStatusAtFiling"
              value={formData.respondentStatusAtFiling}
              onChange={handleChange}
              placeholder="e.g., Married, Separated"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="respondentResidenceBeforeMarriage">Place of Residence Before Marriage</label>
            <input
              type="text"
              id="respondentResidenceBeforeMarriage"
              name="respondentResidenceBeforeMarriage"
              value={formData.respondentResidenceBeforeMarriage}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="respondentResidenceAtFiling">Place of Residence At Time of Filing</label>
            <input
              type="text"
              id="respondentResidenceAtFiling"
              name="respondentResidenceAtFiling"
              value={formData.respondentResidenceAtFiling}
              onChange={handleChange}
              required
            />
          </div>
        </section>

        {/* Marriage Details Section */}
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
            <label htmlFor="marriageType">Type of Marriage</label>
            <input
              type="text"
              id="marriageType"
              name="marriageType"
              value={formData.marriageType}
              onChange={handleChange}
              placeholder="e.g., Hindu rites and ceremonies"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="marriageRegistrationDetails">Marriage Registration Details</label>
            <textarea
              id="marriageRegistrationDetails"
              name="marriageRegistrationDetails"
              value={formData.marriageRegistrationDetails}
              onChange={handleChange}
              placeholder="Registration details, certificate number, etc."
              required
            />
          </div>
        </section>

        {/* Children Details Section */}
        <section className="form-section">
          <h2>Children Details</h2>
          <div className="form-group">
            <label htmlFor="hasChildren">Do you have children from this marriage?</label>
            <select
              id="hasChildren"
              name="hasChildren"
              value={formData.hasChildren}
              onChange={handleChange}
              required
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>

          {formData.hasChildren === 'yes' && (
            <div className="children-section">
              <div className="section-header">
                <h3>Children Information</h3>
                <button type="button" className="add-btn" onClick={addChild}>
                  + Add Child
                </button>
              </div>
              {children.map((child, index) => (
                <div key={index} className="dynamic-input-group">
                  <div className="input-group-header">
                    <h4>Child {index + 1}</h4>
                    {children.length > 1 && (
                      <button 
                        type="button" 
                        className="remove-btn" 
                        onClick={() => removeChild(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor={`childName${index}`}>Name</label>
                    <input
                      type="text"
                      id={`childName${index}`}
                      value={child.name}
                      onChange={(e) => handleChildChange(index, 'name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor={`childSex${index}`}>Sex</label>
                    <select
                      id={`childSex${index}`}
                      value={child.sex}
                      onChange={(e) => handleChildChange(index, 'sex', e.target.value)}
                      required
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor={`childDOB${index}`}>Date of Birth</label>
                    <input
                      type="date"
                      id={`childDOB${index}`}
                      value={child.dateOfBirth}
                      onChange={(e) => handleChildChange(index, 'dateOfBirth', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor={`childAge${index}`}>Age</label>
                    <input
                      type="number"
                      id={`childAge${index}`}
                      value={child.age}
                      onChange={(e) => handleChildChange(index, 'age', e.target.value)}
                      required
                      min="0"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Cohabitation Details Section */}
        <section className="form-section">
          <h2>Cohabitation and Separation Details</h2>
          <div className="form-group">
            <label htmlFor="lastCohabitationDate">Last Date of Cohabitation</label>
            <input
              type="date"
              id="lastCohabitationDate"
              name="lastCohabitationDate"
              value={formData.lastCohabitationDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastCohabitationPlace">Last Place of Cohabitation</label>
            <input
              type="text"
              id="lastCohabitationPlace"
              name="lastCohabitationPlace"
              value={formData.lastCohabitationPlace}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="cohabitationPeriod">Period of Cohabitation</label>
            <input
              type="text"
              id="cohabitationPeriod"
              name="cohabitationPeriod"
              value={formData.cohabitationPeriod}
              onChange={handleChange}
              placeholder="e.g., 2 years, 6 months"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="reasonForSeparation">Reason for Separation</label>
            <textarea
              id="reasonForSeparation"
              name="reasonForSeparation"
              value={formData.reasonForSeparation}
              onChange={handleChange}
              placeholder="Brief reason why respondent left/separated"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="withdrawalCircumstances">Circumstances of Withdrawal</label>
            <textarea
              id="withdrawalCircumstances"
              name="withdrawalCircumstances"
              value={formData.withdrawalCircumstances}
              onChange={handleChange}
              placeholder="Describe the circumstances under which the respondent withdrew from the society of the petitioner."
              required
            />
          </div>
        </section>

        {/* Legal Grounds Section */}
        <section className="form-section">
            <h2>Legal Grounds & Statements</h2>
            <div className="form-group">
                <label htmlFor="noCollusionStatement">No Collusion Statement</label>
                <textarea
                    id="noCollusionStatement"
                    name="noCollusionStatement"
                    value={formData.noCollusionStatement}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="noUnreasonableDelay">No Unreasonable Delay Statement</label>
                <textarea
                    id="noUnreasonableDelay"
                    name="noUnreasonableDelay"
                    value={formData.noUnreasonableDelay}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="jurisdictionBasis">Basis of Jurisdiction</label>
                <textarea
                    id="jurisdictionBasis"
                    name="jurisdictionBasis"
                    value={formData.jurisdictionBasis}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="noPreviousProceedings">Any Previous Legal Proceedings?</label>
                <select
                    id="noPreviousProceedings"
                    name="noPreviousProceedings"
                    value={formData.noPreviousProceedings}
                    onChange={handleChange}
                    required
                >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                </select>
            </div>
            {formData.noPreviousProceedings === 'yes' && (
                <div className="proceedings-section">
                    <div className="section-header">
                        <h3>Previous Proceedings Details</h3>
                        <button type="button" className="add-btn" onClick={addProceeding}>
                            + Add Proceeding
                        </button>
                    </div>
                    {previousProceedings.map((proceeding, index) => (
                        <div key={index} className="dynamic-input-group">
                            <div className="input-group-header">
                                <h4>Proceeding {index + 1}</h4>
                                {previousProceedings.length > 1 && (
                                    <button type="button" className="remove-btn" onClick={() => removeProceeding(index)}>
                                        Remove
                                    </button>
                                )}
                            </div>
                            <input type="text" placeholder="Serial No." value={proceeding.serialNo} onChange={(e) => handleProceedingChange(index, 'serialNo', e.target.value)} />
                            <input type="text" placeholder="Name of Parties" value={proceeding.nameOfParties} onChange={(e) => handleProceedingChange(index, 'nameOfParties', e.target.value)} required/>
                            <input type="text" placeholder="Nature of Proceedings" value={proceeding.natureOfProceedings} onChange={(e) => handleProceedingChange(index, 'natureOfProceedings', e.target.value)} required/>
                            <input type="text" placeholder="Case Number" value={proceeding.caseNumber} onChange={(e) => handleProceedingChange(index, 'caseNumber', e.target.value)} required/>
                            <input type="text" placeholder="Court Name" value={proceeding.courtName} onChange={(e) => handleProceedingChange(index, 'courtName', e.target.value)} required/>
                            <input type="text" placeholder="Result/Status" value={proceeding.result} onChange={(e) => handleProceedingChange(index, 'result', e.target.value)} required/>
                        </div>
                    ))}
                </div>
            )}
        </section>

        {/* Relief Sought Section */}
        <section className="form-section">
            <h2>Relief Sought (Prayer)</h2>
            <div className="form-group">
                <label htmlFor="mainRelief">Main Relief</label>
                <textarea
                    id="mainRelief"
                    name="mainRelief"
                    value={formData.mainRelief}
                    onChange={handleChange}
                    required
                    rows="4"
                />
            </div>
            <div className="form-group">
                <label htmlFor="additionalRelief">Additional Relief (if any)</label>
                <textarea
                    id="additionalRelief"
                    name="additionalRelief"
                    value={formData.additionalRelief}
                    onChange={handleChange}
                    rows="3"
                />
            </div>
        </section>

        {/* Supporting Information Section */}
        <section className="form-section">
            <h2>Supporting Information</h2>
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
                <label htmlFor="affidavitDetails">Affidavit Details</label>
                <textarea
                    id="affidavitDetails"
                    name="affidavitDetails"
                    value={formData.affidavitDetails}
                    onChange={handleChange}
                />
            </div>
             <div className="form-group">
                <label htmlFor="additionalInfo">Additional Information (Optional)</label>
                <textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleChange}
                    placeholder="Any other relevant information"
                />
            </div>
        </section>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/documents')}>
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Application'}
          </button>
          {error && <p className="error-message">{error}</p>}
        </div>
      </form>
      
      {showPreview && pdfData && (
        <ConjugalRightsPdfPreviewModal
          data={pdfData}
          onClose={() => setShowPreview(false)}
          onWordDownload={() => handleWordDownload(pdfData)}
        />
      )}
      
      {pdfData && (
        <div className="download-section">
          <h2>Application Ready</h2>
          <p>Your application has been generated successfully.</p>
          <div className="download-buttons-row">
            <PDFDownloadLink
              document={<ConjugalRightsApplicationPDF data={pdfData} />}
              fileName={`Conjugal_Rights_Application_${pdfData.parties?.caveator?.name?.replace(/\s+/g, '_') || 'document'}.pdf`}
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

export default ConjugalRightsForm;