import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegularBailForm.css';
import PdfPreviewModal from './PdfPreviewModal';
import html2pdf from 'html2pdf.js';
import jsPDF from 'jspdf';
function RegularBailForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
  
  const [htmlContent, setHtmlContent] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

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
        setHtmlContent(data.output);
        setShowPreview(true);
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      setError('Failed to submit bail application. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // FIXED DOWNLOAD FUNCTION
  const handleDownload = () => {
    // if (!htmlContent) {
    //   console.error('No HTML content available for download');
    //   return;
    // }

    // const opt = {
    //   margin:       0.5,
    //   filename:     `bail_application_${formData.accusedName.replace(/\s+/g, '_') || 'document'}.pdf`,
    //   image:        { type: 'png', quality: 1.0 }, // Set quality to max
    //   html2canvas:  {
    //     scale: 2,
    //     useCORS: true,
    //     backgroundColor: null,
    //     // --- NEW OPTIONS FOR HIGH-QUALITY RENDER ---
    //     dpi: 300, // Increase dots per inch for print quality
    //     letterRendering: true, // Improve text rendering
    //   },
    //   jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    // };

    html2pdf(htmlContent, {
      margin: 19,
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

      {showPreview && htmlContent && (
        <PdfPreviewModal
          htmlContent={htmlContent}
          onClose={() => {
            setShowPreview(false);
            setHtmlContent(null);
          }}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
}

export default RegularBailForm;