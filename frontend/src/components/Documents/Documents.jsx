import { useNavigate } from 'react-router-dom';
import './Documents.css';

function Documents() {
  const navigate = useNavigate();

  return (
    <div className="documents-container">
      <h1>Legal Document Templates</h1>
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
      </div>
    </div>
  );
}

export default Documents;