import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { OrderXXXVIIComplaintPDF } from './OrderXXXVIIComplaintPDF';

const OrderXXXVIIPdfPreviewModal = ({ data, onClose, onWordDownload }) => {
  return (
    <div className="pdf-modal-overlay">
      <div className="pdf-modal">
        <div className="pdf-modal-header">
          <h2>Order XXXVII Suit Preview</h2>
          <button onClick={onClose} className="close-button" aria-label="Close modal">&times;</button>
        </div>
        
        <div className="pdf-modal-content">
          <PDFViewer style={{ width: '100%', height: '100%' }}>
            <OrderXXXVIIComplaintPDF data={data} />
          </PDFViewer>
        </div>
        
        <div className="pdf-modal-footer">
          <PDFDownloadLink
            document={<OrderXXXVIIComplaintPDF data={data} />}
            fileName={`order_xxxvii_suit_${data.parties.plaintiff.companyName.replace(/\s+/g, '_')}.pdf`}
          >
            {({ loading }) => (
              <button className="download-btn" disabled={loading}>
                {loading ? 'Loading...' : '📄 Download PDF'}
              </button>
            )}
          </PDFDownloadLink>
          
          <button className="download-btn" onClick={onWordDownload}>
            📝 Download Word Document
          </button>
          <button onClick={onClose} className="close-btn">Close</button>
        </div>
      </div>
    </div>
  );
};

export default OrderXXXVIIPdfPreviewModal;