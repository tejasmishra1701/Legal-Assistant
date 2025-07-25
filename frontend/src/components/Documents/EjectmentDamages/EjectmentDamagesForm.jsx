import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EjectmentDamagesForm.css';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { EjectmentDamagesApplicationPDF } from './EjectmentDamagesApplicationPDF';
import EjectmentDamagesPdfPreviewModal from './EjectmentDamagesPdfPreviewModal.jsx';
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

function EjectmentDamagesForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pdfData, setPdfData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    // Plaintiffs Information (we'll handle multiple plaintiffs)
    plaintiffs: [
      {
        name: '',
        age: '',
        guardianName: '',
        guardianRelation: 'father',
        address: '',
        occupation: ''
      }
    ],
    
    // Defendant Information
    defendantName: '',
    defendantAddress: '',
    defendantThroughType: 'Chairman/Managing Director',
    
    // Court Details
    courtType: 'SENIOR CIVIL JUDGE',
    district: '',
    state: '',
    suitNumber: '',
    suitYear: '',
    advocateName: '',
    
    // Property Details
    propertyType: 'flat',
    propertyNumber: '',
    propertyArea: '',
    propertyLocation: '',
    propertyAddress: '',
    
    // Lease Details
    originalLesseeOrganization: '',
    leasePeriod: '',
    leaseStartDate: '',
    leaseExpiryDate: '',
    monthlyRent: '',
    currentRent: '',
    
    // Case Details
    reasonForEjectment: '',
    noticePeriod: '',
    noticeDate: '',
    noticeServedUnder: 'section 106 of Transfer of Property Act',
    damagesPerDay: '',
    marketRentSurvey: '',
    ownPropertyRent: '',
    reasonForNeed: '',
    courtFeeCalculation: '',
    wrongfulUseStartDate: '',
    additionalFactors: '',
    
    // Legal Grounds
    legalNoticeDetails: '',
    defendantResponse: '',
    jurisdictionReason: '',
    additionalReliefSought: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlaintiffChange = (index, field, value) => {
    const updatedPlaintiffs = [...formData.plaintiffs];
    updatedPlaintiffs[index] = {
      ...updatedPlaintiffs[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      plaintiffs: updatedPlaintiffs
    }));
  };

  const addPlaintiff = () => {
    setFormData(prev => ({
      ...prev,
      plaintiffs: [
        ...prev.plaintiffs,
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

  const removePlaintiff = (index) => {
    if (formData.plaintiffs.length > 1) {
      const updatedPlaintiffs = formData.plaintiffs.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        plaintiffs: updatedPlaintiffs
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPdfData(null);

    try {
      const response = await fetch('https://mishratejass01.app.n8n.cloud/webhook/ejectment-damages', {
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

    const { courtDetails, parties, applicationTitle, applicationSubtitle, applicationBody, prayer, footer, verification } = pdfData;
    console.log('Generating Word document with data:', pdfData);
    
    const doc = new Document({
      numbering: {
        config: [
          {
            reference: "ejectment-damages-numbering",
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
                text: "(%1)",
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
              text: `BEFORE THE ${pdfData.courtDetails.courtType} (DISTRICT ${pdfData.courtDetails.district}), ${pdfData.courtDetails.state}`,
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
          new Paragraph({ text: "IN THE MATTER OF,", spacing: { after: 200 } }),
          
          // Plaintiffs details
          ...pdfData.parties.plaintiffs.map((plaintiff, index) => [
            new Paragraph(`${plaintiff.name} ${plaintiff.guardianRelation === 'father' ? 'S/O' : plaintiff.guardianRelation === 'mother' ? 'D/O' : 'W/O'}`),
            new Paragraph(plaintiff.guardianName),
            new Paragraph(`Both R/o ${plaintiff.address}`),
            new Paragraph({ text: "", spacing: { after: 100 } }),
          ]).flat(),
          
          new Paragraph({
            children: [new TextRun({ text: "....PLAINTIFFS", bold: true })],
            alignment: AlignmentType.END,
            spacing: { after: 200 },
          }),
          
          new Paragraph({
            alignment: AlignmentType.CENTER,
            style: "strong",
            children: [new TextRun({ text: "VERSUS", bold: true, spacing: { before: 300, after: 300 } })]
          }),
          
          // Defendant details
          new Paragraph(pdfData.parties.defendant.name),
          new Paragraph(pdfData.parties.defendant.address),
          new Paragraph(`Through its ${pdfData.parties.defendant.throughType}`),
          
          new Paragraph({
            children: [new TextRun({ text: "...DEFENDANT", bold: true })],
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
              reference: "ejectment-damages-numbering",
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
                    children: [new Paragraph({ text: "PLAINTIFFS", style: "strong", alignment: AlignmentType.END })] 
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
            children: [new TextRun({ text: "PLAINTIFFS", bold: true })],
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
      saveAs(blob, `Ejectment_Damages_Suit_${pdfData.parties.plaintiffs[0].name.replace(/\s+/g, '_')}.docx`);
    });
  };

  return (
    <div className="form-container">
      <h1>Suit for Ejectment and Damages Form</h1>
      <form onSubmit={handleSubmit}>
        {/* Plaintiffs Information Section */}
        <section className="form-section">
          <h2>Plaintiffs Information</h2>
          {formData.plaintiffs.map((plaintiff, index) => (
            <div key={index} className="plaintiff-section">
              <div className="plaintiff-header">
                <h3>Plaintiff {index + 1}</h3>
                {formData.plaintiffs.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removePlaintiff(index)}
                    className="remove-plaintiff-btn"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="form-group">
                <label htmlFor={`plaintiff-name-${index}`}>Full Name of Plaintiff</label>
                <input
                  type="text"
                  id={`plaintiff-name-${index}`}
                  value={plaintiff.name}
                  onChange={(e) => handlePlaintiffChange(index, 'name', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor={`plaintiff-age-${index}`}>Age</label>
                <input
                  type="number"
                  id={`plaintiff-age-${index}`}
                  value={plaintiff.age}
                  onChange={(e) => handlePlaintiffChange(index, 'age', e.target.value)}
                  required
                  min="18"
                />
              </div>
              <div className="form-group">
                <label htmlFor={`plaintiff-guardian-${index}`}>Guardian's Name</label>
                <input
                  type="text"
                  id={`plaintiff-guardian-${index}`}
                  value={plaintiff.guardianName}
                  onChange={(e) => handlePlaintiffChange(index, 'guardianName', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor={`plaintiff-relation-${index}`}>Relation with Guardian</label>
                <select
                  id={`plaintiff-relation-${index}`}
                  value={plaintiff.guardianRelation}
                  onChange={(e) => handlePlaintiffChange(index, 'guardianRelation', e.target.value)}
                  required
                >
                  <option value="father">Father</option>
                  <option value="mother">Mother</option>
                  <option value="spouse">Spouse</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor={`plaintiff-address-${index}`}>Complete Address</label>
                <textarea
                  id={`plaintiff-address-${index}`}
                  value={plaintiff.address}
                  onChange={(e) => handlePlaintiffChange(index, 'address', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor={`plaintiff-occupation-${index}`}>Occupation</label>
                <input
                  type="text"
                  id={`plaintiff-occupation-${index}`}
                  value={plaintiff.occupation}
                  onChange={(e) => handlePlaintiffChange(index, 'occupation', e.target.value)}
                  required
                />
              </div>
            </div>
          ))}
          <button type="button" onClick={addPlaintiff} className="add-plaintiff-btn">
            Add Another Plaintiff
          </button>
        </section>

        {/* Defendant Information Section */}
        <section className="form-section">
          <h2>Defendant Information</h2>
          <div className="form-group">
            <label htmlFor="defendantName">Defendant Name/Organization</label>
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
            <label htmlFor="defendantAddress">Defendant Address</label>
            <textarea
              id="defendantAddress"
              name="defendantAddress"
              value={formData.defendantAddress}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="defendantThroughType">Through</label>
            <select
              id="defendantThroughType"
              name="defendantThroughType"
              value={formData.defendantThroughType}
              onChange={handleChange}
              required
            >
              <option value="Chairman/Managing Director">Chairman/Managing Director</option>
              <option value="Managing Director">Managing Director</option>
              <option value="Chairman">Chairman</option>
              <option value="Secretary">Secretary</option>
              <option value="Authorized Representative">Authorized Representative</option>
            </select>
          </div>
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
            <label htmlFor="propertyType">Property Type</label>
            <select
              id="propertyType"
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              required
            >
              <option value="flat">Flat</option>
              <option value="house">House</option>
              <option value="shop">Shop</option>
              <option value="office">Office</option>
              <option value="land">Land</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="propertyNumber">Property Number</label>
            <input
              type="text"
              id="propertyNumber"
              name="propertyNumber"
              value={formData.propertyNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="propertyArea">Property Area (sq. ft.)</label>
            <input
              type="number"
              id="propertyArea"
              name="propertyArea"
              value={formData.propertyArea}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="propertyLocation">Property Location</label>
            <input
              type="text"
              id="propertyLocation"
              name="propertyLocation"
              value={formData.propertyLocation}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="propertyAddress">Complete Property Address</label>
            <textarea
              id="propertyAddress"
              name="propertyAddress"
              value={formData.propertyAddress}
              onChange={handleChange}
              required
            />
          </div>
        </section>

        {/* Lease Details Section */}
        <section className="form-section">
          <h2>Lease Details</h2>
          <div className="form-group">
            <label htmlFor="originalLesseeOrganization">Original Lessee Organization</label>
            <input
              type="text"
              id="originalLesseeOrganization"
              name="originalLesseeOrganization"
              value={formData.originalLesseeOrganization}
              onChange={handleChange}
              placeholder="e.g., National Power Transmission Corporation Limited"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="leasePeriod">Lease Period (in years)</label>
            <input
              type="number"
              id="leasePeriod"
              name="leasePeriod"
              value={formData.leasePeriod}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="leaseStartDate">Lease Start Date</label>
            <input
              type="date"
              id="leaseStartDate"
              name="leaseStartDate"
              value={formData.leaseStartDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="leaseExpiryDate">Lease Expiry Date</label>
            <input
              type="date"
              id="leaseExpiryDate"
              name="leaseExpiryDate"
              value={formData.leaseExpiryDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="monthlyRent">Original Monthly Rent (Rs.)</label>
            <input
              type="number"
              id="monthlyRent"
              name="monthlyRent"
              value={formData.monthlyRent}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="currentRent">Current Monthly Rent (Rs.)</label>
            <input
              type="number"
              id="currentRent"
              name="currentRent"
              value={formData.currentRent}
              onChange={handleChange}
              required
            />
          </div>
        </section>

        {/* Legal Notice & Ejectment Details Section */}
        <section className="form-section">
          <h2>Legal Notice & Ejectment Details</h2>
          <div className="form-group">
            <label htmlFor="reasonForEjectment">Reason for Ejectment</label>
            <textarea
              id="reasonForEjectment"
              name="reasonForEjectment"
              value={formData.reasonForEjectment}
              onChange={handleChange}
              placeholder="Explain why you need the property to be vacated"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="noticePeriod">Notice Period (in days)</label>
            <input
              type="number"
              id="noticePeriod"
              name="noticePeriod"
              value={formData.noticePeriod}
              onChange={handleChange}
              placeholder="e.g., 15"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="noticeDate">Notice Date</label>
            <input
              type="date"
              id="noticeDate"
              name="noticeDate"
              value={formData.noticeDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="noticeServedUnder">Notice Served Under</label>
            <select
              id="noticeServedUnder"
              name="noticeServedUnder"
              value={formData.noticeServedUnder}
              onChange={handleChange}
              required
            >
              <option value="section 106 of Transfer of Property Act">Section 106 of Transfer of Property Act</option>
              <option value="section 111 of Transfer of Property Act">Section 111 of Transfer of Property Act</option>
              <option value="Rent Control Act">Rent Control Act</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="legalNoticeDetails">Legal Notice Details</label>
            <textarea
              id="legalNoticeDetails"
              name="legalNoticeDetails"
              value={formData.legalNoticeDetails}
              onChange={handleChange}
              placeholder="Provide details of the legal notice served"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="defendantResponse">Defendant's Response to Notice</label>
            <textarea
              id="defendantResponse"
              name="defendantResponse"
              value={formData.defendantResponse}
              onChange={handleChange}
              placeholder="Describe how the defendant responded to the notice"
              required
            />
          </div>
        </section>

        {/* Damages & Financial Details Section */}
        <section className="form-section">
          <h2>Damages & Financial Details</h2>
          <div className="form-group">
            <label htmlFor="damagesPerDay">Damages Per Day (Rs.)</label>
            <input
              type="number"
              id="damagesPerDay"
              name="damagesPerDay"
              value={formData.damagesPerDay}
              onChange={handleChange}
              placeholder="e.g., 1000"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="wrongfulUseStartDate">Wrongful Use Start Date</label>
            <input
              type="date"
              id="wrongfulUseStartDate"
              name="wrongfulUseStartDate"
              value={formData.wrongfulUseStartDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="marketRentSurvey">Market Rent Survey Details</label>
            <textarea
              id="marketRentSurvey"
              name="marketRentSurvey"
              value={formData.marketRentSurvey}
              onChange={handleChange}
              placeholder="Provide details of market rent survey conducted in the area"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="ownPropertyRent">Own Property Market Rent (Rs.)</label>
            <input
              type="number"
              id="ownPropertyRent"
              name="ownPropertyRent"
              value={formData.ownPropertyRent}
              onChange={handleChange}
              placeholder="Market rent for your property per month"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="courtFeeCalculation">Court Fee Calculation</label>
            <textarea
              id="courtFeeCalculation"
              name="courtFeeCalculation"
              value={formData.courtFeeCalculation}
              onChange={handleChange}
              placeholder="Explain how court fee has been calculated"
              required
            />
          </div>
        </section>

        {/* Additional Case Details Section */}
        <section className="form-section">
          <h2>Additional Case Details</h2>
          <div className="form-group">
            <label htmlFor="reasonForNeed">Reason for Needing the Property</label>
            <textarea
              id="reasonForNeed"
              name="reasonForNeed"
              value={formData.reasonForNeed}
              onChange={handleChange}
              placeholder="Explain why you need the property for your own use"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="jurisdictionReason">Reason for Court Jurisdiction</label>
            <textarea
              id="jurisdictionReason"
              name="jurisdictionReason"
              value={formData.jurisdictionReason}
              onChange={handleChange}
              placeholder="Explain why this court has jurisdiction over the matter"
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
              placeholder="Any additional relief you are seeking from the court"
            />
          </div>
          <div className="form-group">
            <label htmlFor="additionalFactors">Additional Relevant Factors</label>
            <textarea
              id="additionalFactors"
              name="additionalFactors"
              value={formData.additionalFactors}
              onChange={handleChange}
              placeholder="Any other relevant facts or circumstances"
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
        <EjectmentDamagesPdfPreviewModal
          data={pdfData}
          onClose={() => setShowPreview(false)}
          onWordDownload={() => handleWordDownload(pdfData)}
        />
      )}
      
      {pdfData && (
        <div className="download-section">
          <h2>Application Ready</h2>
          <p>Your ejectment and damages suit has been generated successfully.</p>
          <div className="download-buttons-row">
            <PDFDownloadLink
              document={<EjectmentDamagesApplicationPDF data={pdfData} />}
              fileName={`Ejectment_Damages_Suit_${pdfData.parties?.plaintiffs?.[0]?.name?.replace(/\s+/g, '_') || 'document'}.pdf`}
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

export default EjectmentDamagesForm;