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
          <h2>Suit under Order XXXVII (37) of CPC </h2>
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
        <div className="document-card">
          <h2>Suit for Temporary Injunction Rules 1 & 2</h2>
          <p>
            A suit seeking a court order to restrain a party from taking a particular action, typically to prevent harm or injury.
          </p>
          <button 
            className="create-doc-btn"
            onClick={() => navigate('/documents/temporary-injunction-form')}
          >
            Create Document
          </button>
        </div>
        <div className="document-card">
          <h2>Application Under Order XXXIX (39) Rule 2-A</h2>
          <p>
           A Suit for Order XXXIX Rule 2-A (Consequences of Disobedience of an Injunction).
          </p>
          <button 
            className="create-doc-btn"
            onClick={() => navigate('/documents/temporary-injunction-form-2a')}
          >
            Create Document
          </button>
        </div>
        <div className="document-card">
          <h2>Suit for Ejectment and Damages</h2>
          <p>
            A suit seeking a court order for the eviction of a tenant and the recovery of damages for unauthorized occupation.
          </p>
          <button 
            className="create-doc-btn"
            onClick={() => navigate('/documents/ejectment-damages-form')}
          >
            Create Document
          </button>
        </div>
        <div className="document-card">
          <h2>Application to Sue as an Indigent Person</h2>
          <p>
            A formal request to the court for permission to file a lawsuit without paying the usual court fees, based on the claimant's inability to pay.
          </p>
          <button 
            className="create-doc-btn"
            onClick={() => navigate('/documents/indigent-person-application')}
          >
            Create Document
          </button>
        </div>
        <div className="document-card">
          <h2>A Suit for Specific Performance of Contract</h2>
          <p>
            A formal request to the court for specific performance of a contract, compelling the other party to fulfill their contractual obligations.
          </p>
          <button 
            className="create-doc-btn"
            onClick={() => navigate('/documents/specific-performance')}
          >
            Create Document
          </button>
        </div>
        <div className="document-card">
          <h2>Written Statement</h2>
          <p>
            A formal response to a plaint in a civil suit, where the defendant presents their defense and counterclaims against the plaintiff's allegations.
          </p>
          <button 
            className="create-doc-btn"
            onClick={() => navigate('/documents/written-statement')}
          >
            Create Document
          </button>
        </div>
        <div className="document-card">
          <h2>Caveat under Section 148A of CPC</h2>
          <p>
            A formal notice to the court requesting that no action be taken in a case without notifying the party who filed the caveat.
          </p>
          <button 
            className="create-doc-btn"
            onClick={() => navigate('/documents/caveat')}
          >
            Create Document
          </button>
        </div>
      </div>
      
    </div>
  );
}

export default Documents;