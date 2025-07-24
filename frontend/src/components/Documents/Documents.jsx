import { useNavigate } from 'react-router-dom';
import './Documents.css';

function Documents() {
  const navigate = useNavigate();

  return (
    <div className="documents-container">
      <h1>Generate Legal Documents within Seconds</h1>
      <div className="documents-grid">
        <div className="document-card">
          <h2>Regular Bail Application</h2>
          <p>
            A comprehensive application for seeking regular bail under Section 439 of CrPC. 
            This document includes all necessary details about the accused, case particulars, 
            and grounds for bail application.
          </p>
          <button 
            className="create-doc-btn"
            onClick={() => navigate('/documents/regular-bail-form')}
          >
            Create Document
          </button>
        </div>
        <div className="document-card">
          <h2>Anticipatory Bail Application</h2>
          <p>
            A comprehensive application for seeking anticipatory bail under Section 438 of CrPC. 
            This document includes all necessary details about the accused, case particulars, 
            and grounds for anticipatory bail application.
          </p>
          <button 
            className="create-doc-btn"
            onClick={() => navigate('/documents/anticipatory-bail-form')}
          >
            Create Document
          </button>
        </div>
        <div className="document-card">
          <h2>Complaint Under Section 138 </h2>
          <p>
            A comprehensive application for filing a complaint under Section 138 of the Negotiable Instruments Act. 
            This document includes all necessary details about the parties involved, the cheque in question, 
            and the grounds for the complaint.
          </p>
          <button 
            className="create-doc-btn"
            onClick={() => navigate('/documents/section-138-complaint-form')}
          >
            Create Document
          </button>
        </div>
        <div className="document-card">
          <h2>Complaint Under Section 125 </h2>
          <p>
            A comprehensive application for filing a complaint under Section 125 of the Code of Criminal Procedure. 
            This document includes all necessary details about the parties involved, the grounds for the complaint, 
            and any supporting evidence.
          </p>
          <button 
            className="create-doc-btn"
            onClick={() => navigate('/documents/section-125-maintenance-form')}
          >
            Create Document
          </button>
        </div>
        
      </div>
      
    </div>
  );
}

export default Documents;