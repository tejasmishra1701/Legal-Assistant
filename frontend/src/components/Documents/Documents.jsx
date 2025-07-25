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
            An application filed on behalf of an arrested person seeking release from custody, presenting the grounds for bail while the investigation or trial is pending.
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
            A pre-arrest bail application under Section 438 CrPC for a person who apprehends arrest in a false case, seeking a court order to grant bail if an arrest occurs.
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
            A criminal complaint under Section 138, Negotiable Instruments Act, when a cheque is dishonoured (bounced) and the issuer fails to pay despite receiving a legal demand notice.
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
            A formal petition under Section 125 of CrPC for a wife, child, or parent to legally claim monthly financial support from a person who has neglected or refused to maintain them.
          </p>
          <button 
            className="create-doc-btn"
            onClick={() => navigate('/documents/section-125-maintenance-form')}
          >
            Create Document
          </button>
        </div>
        <div className="document-card">
          <h2>Suit under Order XXXVII of CPC </h2>
          <p>
            A summary suit for the recovery of a debt or liquidated demand, where the defendant has no real defense.
          </p>
          <button 
            className="create-doc-btn"
            onClick={() => navigate('/documents/order-37-suit-form')}
          >
            Create Document
          </button>
        </div>
        <div className="document-card">
          <h2>Suit for Permanent Injunction</h2>
          <p>
            A suit seeking a court order to restrain a party from taking a particular action, typically to prevent harm or injury.
          </p>
          <button 
            className="create-doc-btn"
            onClick={() => navigate('/documents/permanent-injunction-form')}
          >
            Create Document
          </button>
        </div>
      </div>
      
    </div>
  );
}

export default Documents;