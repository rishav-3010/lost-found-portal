import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaHome, FaTag, FaSearch, FaFilter, FaEye } from 'react-icons/fa';

const fallbackImg = "https://via.placeholder.com/300x200/667eea/ffffff?text=No+Image+Available";

const ViewItems = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/items`, {
          withCredentials: true,
        });
        setItems(res.data);
      } catch (err) {
        console.error('Error fetching items:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const filteredItems = items.filter(item =>
    (!filterType || item.type === filterType) &&
    (!filterLocation || (item.location && item.location.toLowerCase().includes(filterLocation.toLowerCase()))) &&
    (!searchTerm ||
      (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  );

  const openModal = (item) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  return (
    <div className="items-container">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          
          .items-container {
            font-family: 'Inter', sans-serif;
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
            color: #fff;
            min-height: 80vh;
          }
          
          .page-header {
            text-align: center;
            margin-bottom: 40px;
            padding: 40px 20px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          }
          
          .page-header h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin: 0 0 10px 0;
            background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          
          .page-subtitle {
            font-size: 1.1rem;
            opacity: 0.8;
            margin: 0;
          }
          
          .filters-section {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            padding: 30px;
            margin-bottom: 30px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          }
          
          .filters-grid {
            display: grid;
            grid-template-columns: 2fr 1fr 1.5fr;
            gap: 20px;
            align-items: end;
          }
          
          .filter-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          
          .filter-label {
            font-size: 0.9rem;
            font-weight: 500;
            opacity: 0.9;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          .filter-input, .filter-select {
            padding: 14px 16px;
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.1);
            color: #fff;
            font-size: 1rem;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
          }
          
          .filter-input::placeholder {
            color: rgba(255, 255, 255, 0.6);
          }
          
          .filter-input:focus, .filter-select:focus {
            outline: none;
            border-color: rgba(255, 255, 255, 0.4);
            background: rgba(255, 255, 255, 0.15);
            box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.1);
          }
          
          .filter-select option {
            background: #667eea;
            color: #fff;
          }
          
          .results-summary {
            text-align: center;
            margin: 20px 0;
            font-size: 1.1rem;
            opacity: 0.8;
          }
          
          .item-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 24px;
            padding: 20px 0;
          }
          
          .item-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            padding: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            position: relative;
          }
          
          .item-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            border-color: rgba(255, 255, 255, 0.3);
            background: rgba(255, 255, 255, 0.15);
          }
          
          .item-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
          }
          
          .item-card:hover::before {
            opacity: 1;
          }

          /* =======================
             Image frame + accent border (THINNER BORDER)
             ======================= */
          .img-wrapper {
            width: 100%;
            height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 12px;                 /* white frame padding */
            background: #fff;              /* white inner card */
            border-radius: 12px;
            box-shadow: 0 8px 22px rgba(10, 12, 20, 0.12);
            position: relative;
            overflow: hidden;
            transition: transform 0.28s ease, box-shadow 0.28s ease;
          }

          /* accent outline for lost/found — thinner 2px border now */
          .img-wrapper.lost {
            box-shadow: 0 8px 20px rgba(238,90,82,0.10);
            border: 2px solid rgba(238,90,82,0.06);
          }
          .img-wrapper.found {
            box-shadow: 0 8px 20px rgba(78,205,196,0.10);
            border: 2px solid rgba(78,205,196,0.04);
          }

          /* the image sits inside the white frame, contain to keep full screenshot visible */
          .item-card img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain; /* shows full image (no crop) */
            display: block;
            border-radius: 8px;   /* small rounding inside frame */
            transition: transform 0.35s ease;
          }

          /* subtle hover lift (keeps your existing hover scale) */
          .item-card:hover .img-wrapper {
            transform: translateY(-6px);
            box-shadow: 0 22px 46px rgba(0,0,0,0.18);
          }

          /* small decorative label in bottom-left of image (optional) */
          .img-wrapper::after {
            content: '';
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 6px;
            background: linear-gradient(90deg, rgba(255,255,255,0.06), transparent);
            pointer-events: none;
          }

          .card-content {
            padding: 20px;
          }
          
          .item-title {
            font-size: 1.3rem;
            font-weight: 600;
            margin: 0 0 12px 0;
            color: #fff;
            text-align: center;
          }
          
          .item-type-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin: 0 auto 16px auto;
          }
          
          .type-lost {
            background: linear-gradient(135deg, #ff6b6b, #ee5a52);
            color: #fff;
            box-shadow: 0 4px 15px rgba(238, 90, 82, 0.3);
          }
          
          .type-found {
            background: linear-gradient(135deg, #4ecdc4, #44a08d);
            color: #fff;
            box-shadow: 0 4px 15px rgba(78,205,196,0.3);
          }
          
          .item-details {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          
          .detail-row {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            font-size: 0.9rem;
            line-height: 1.5;
          }
          
          .detail-icon {
            color: rgba(255, 255, 255, 0.7);
            margin-top: 2px;
            flex-shrink: 0;
          }
          
          .detail-text {
            color: rgba(255, 255, 255, 0.9);
          }
          
          .detail-label {
            font-weight: 500;
            color: #fff;
          }
          
          .view-details-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            cursor: pointer;
            transition: all 0.3s ease;
            opacity: 0;
          }
          
          .item-card:hover .view-details-btn {
            opacity: 1;
          }
          
          .view-details-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(1.1);
          }
          
          .loading-spinner {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 200px;
            font-size: 1.2rem;
            color: rgba(255, 255, 255, 0.8);
          }
          
          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(255, 255, 255, 0.2);
            border-top: 4px solid #fff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-right: 16px;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .no-items {
            text-align: center;
            padding: 60px 20px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: rgba(255, 255, 255, 0.8);
            font-size: 1.1rem;
          }
          
          /* Modal Styles */
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 20px;
          }
          
          .modal-content {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(30px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 24px;
            padding: 30px;
            max-width: 500px;
            width: 100%;
            max-height: 80vh;
            overflow-y: auto;
            color: #fff;
          }
          
          .modal-close {
            float: right;
            background: none;
            border: none;
            color: #fff;
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.3s ease;
          }
          
          .modal-close:hover {
            opacity: 1;
          }

          /* Modal image — show full portrait/landscape without cropping */
          .modal-content img {
            width: 100%;
            height: auto;               /* keep natural aspect */
            max-height: 60vh;           /* limit very tall images to viewport */
            object-fit: contain;        /* show entire image, no cropping */
            display: block;
            margin: 0 auto 20px auto;   /* center and keep spacing */
            border-radius: 12px;
            border: 6px solid rgba(255,255,255,0.06);
            box-shadow: 0 12px 40px rgba(0,0,0,0.28);
          }


          /* Contact buttons (email + phone) */
          .modal-actions {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
            margin-bottom: 16px;
          }
          .contact-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            border-radius: 10px;
            background: linear-gradient(90deg, #00d2ff, #3a7bd5);
            color: #061320;
            font-weight: 700;
            text-decoration: none;
            box-shadow: 0 8px 24px rgba(58,123,213,0.12);
            transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s;
            border: none;
            cursor: pointer;
          }
          .contact-btn:hover { transform: translateY(-3px); box-shadow: 0 14px 34px rgba(58,123,213,0.18); opacity: 0.98; }

          .phone-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            border-radius: 10px;
            background: linear-gradient(90deg, #ffa500, #ff7a00);
            color: #061320;
            font-weight: 700;
            text-decoration: none;
            box-shadow: 0 8px 24px rgba(255,140,0,0.12);
            transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s;
            border: none;
            cursor: pointer;
          }
          .phone-btn:hover { transform: translateY(-3px); box-shadow: 0 14px 34px rgba(255,140,0,0.18); opacity: 0.98; }

          @media (max-width: 768px) {
            .filters-grid {
              grid-template-columns: 1fr;
              gap: 16px;
            }
            
            .item-grid {
              grid-template-columns: 1fr;
              gap: 20px;
            }
            
            .page-header h1 {
              font-size: 2rem;
            }
            
            .filters-section {
              padding: 20px;
            }

            .modal-actions { justify-content: center; }
          }
        `}
      </style>

      <div className="page-header">
        <h1>Lost & Found Items</h1>
        <p className="page-subtitle">Help reunite items with their owners</p>
      </div>

      <div className="filters-section">
        <div className="filters-grid">
          <div className="filter-group">
            <label className="filter-label">
              <FaSearch /> Search Items
            </label>
            <input
              type="text"
              className="filter-input"
              placeholder="Search by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-group">
            <label className="filter-label">
              <FaFilter /> Item Type
            </label>
            <select
              className="filter-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="lost">Lost Items</option>
              <option value="found">Found Items</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label className="filter-label">
              <FaMapMarkerAlt /> Location
            </label>
            <input
              type="text"
              className="filter-input"
              placeholder="Filter by location..."
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          Loading items...
        </div>
      ) : (
        <>
          <div className="results-summary">
            Showing {filteredItems.length} of {items.length} items
          </div>

          {filteredItems.length === 0 ? (
            <div className="no-items">
              <p>No items found matching your criteria.</p>
              <p>Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="item-grid">
              {filteredItems.map(item => (
                <div key={item._id} className="item-card" onClick={() => openModal(item)}>
                  <button className="view-details-btn" title="View Details">
                    <FaEye />
                  </button>
                  
                  <div className={`img-wrapper ${item.type}`}>
                    <img
                      src={item.imageUrl || fallbackImg}
                      alt={item.title}
                      onError={e => { e.target.src = fallbackImg; }}
                    />
                  </div>

                  <div className="card-content">
                    <h3 className="item-title">{item.title}</h3>

                    <div className={`item-type-badge type-${item.type}`}>
                      <FaTag />
                      {item.type === 'lost' ? 'Lost Item' : 'Found Item'}
                    </div>

                    <div className="item-details">
                      <div className="detail-row">
                        <FaMapMarkerAlt className="detail-icon" />
                        <span className="detail-text">
                          <span className="detail-label">Location:</span> {item.location}
                        </span>
                      </div>

                      {item.description && (
                        <div className="detail-row">
                          <span className="detail-text">
                            <span className="detail-label">Description:</span> {item.description.length > 80 ? item.description.substring(0, 80) + '...' : item.description}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {selectedItem && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>&times;</button>
            
            <h2 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.5rem' }}>
              {selectedItem.title}
            </h2>
            
            <div className={`item-type-badge type-${selectedItem.type}`} style={{ marginBottom: '20px' }}>
              <FaTag />
              {selectedItem.type === 'lost' ? 'Lost Item' : 'Found Item'}
            </div>

            {selectedItem.imageUrl && (
              <img 
                src={selectedItem.imageUrl} 
                alt={selectedItem.title}
                onError={e => { e.target.src = fallbackImg; }}
              />
            )}

            {/* Contact actions: email + phone (if available) */}
            <div className="modal-actions">
              {selectedItem.contactEmail && (
                <a
                  href={`mailto:${selectedItem.contactEmail}?subject=${encodeURIComponent('Regarding your item: ' + selectedItem.title)}&body=${encodeURIComponent('Hi,\\n\\nI saw your item listed as "' + selectedItem.title + '". I would like to get in touch regarding it.\\n\\nThanks.')}`}
                  className="contact-btn"
                  aria-label="Contact owner by email"
                >
                  <FaEnvelope /> Contact Owner
                </a>
              )}

              {selectedItem.contactPhone && (
                <a
                  href={`tel:${selectedItem.contactPhone}`}
                  className="phone-btn"
                  aria-label="Call owner"
                >
                  <FaPhone /> Call Owner
                </a>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="detail-row">
                <FaMapMarkerAlt className="detail-icon" />
                <span><strong>Location:</strong> {selectedItem.location}</span>
              </div>

              {selectedItem.description && (
                <div className="detail-row">
                  <span><strong>Description:</strong> {selectedItem.description}</span>
                </div>
              )}

              {selectedItem.contactEmail && (
                <div className="detail-row">
                  <FaEnvelope className="detail-icon" />
                  <span><strong>Email:</strong> {selectedItem.contactEmail}</span>
                </div>
              )}

              {selectedItem.contactPhone && (
                <div className="detail-row">
                  <FaPhone className="detail-icon" />
                  <span><strong>Phone:</strong> {selectedItem.contactPhone}</span>
                </div>
              )}

              {selectedItem.hostelAddress && (
                <div className="detail-row">
                  <FaHome className="detail-icon" />
                  <span><strong>Hostel Address:</strong> {selectedItem.hostelAddress}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewItems;
