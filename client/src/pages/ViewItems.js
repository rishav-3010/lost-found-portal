import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaHome, FaTag } from 'react-icons/fa'; // add at the top of your file

const fallbackImg = "https://via.placeholder.com/250x180?text=No+Image";

const ViewItems = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterLocation, setFilterLocation] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/items');
        setItems(res.data);
      } catch (err) {
        console.error('Error fetching items:', err);
      }
    };
    fetchItems();
  }, []);

  return (
    <div className="items-container">
      <style>
        {`
          .items-container {
            padding: 20px;
            text-align: center;
          }
          .item-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            justify-content: center;
          }
          .item-card {
  background: #fff;
  border-radius: 12px;
  padding: 15px;
  width: 250px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
  transition: transform 0.2s ease;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

          .item-card:hover {
            transform: scale(1.03);
          }
          .img-wrapper {
            width: 100%;
            aspect-ratio: 5/3;
            overflow: hidden;
            border-radius: 8px;
            margin-bottom: 10px;
            background: #eee;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .item-card img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }
        `}
      </style>

      <h2>All Submitted Items</h2>

      {/* Filter/Search Inputs */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by keyword"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        >
          <option value="">All Types</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>
        <input
          type="text"
          placeholder="Filter by location"
          value={filterLocation}
          onChange={(e) => setFilterLocation(e.target.value)}
          style={{ padding: '5px' }}
        />
      </div>

      <div className="item-grid">
        {items
          .filter(item =>
            (!filterType || item.type === filterType) &&
            (!filterLocation || (item.location && item.location.toLowerCase().includes(filterLocation.toLowerCase()))) &&
            (!searchTerm ||
              (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
            )
          )
          .map(item => (
            <div key={item._id} className="item-card">
  <div className="img-wrapper">
    <img
      src={item.imageUrl || fallbackImg}
      alt={item.title}
      onError={e => { e.target.src = fallbackImg; }}
    />
  </div>

  <h2 style={{
  textAlign: 'center',
  fontSize: '18px',
  margin: '8px 0',
  color: '#2c3e50',
  fontWeight: '600',
  width: '100%'
}}>
  {item.title}
</h2>


  <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
  <div style={{
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 12px',
    borderRadius: '20px',
    backgroundColor: item.type === 'lost' ? '#ffdddd' : '#ddffdd',
    color: item.type === 'lost' ? '#c0392b' : '#27ae60',
    fontWeight: 'bold',
    fontSize: '12px'
  }}>
    <FaTag style={{ marginRight: '5px' }} />
    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
  </div>
</div>


  <p style={{ fontSize: '14px', margin: '6px 0' }}>
    <FaMapMarkerAlt style={{ marginRight: '6px', color: '#666' }} />
    <strong>Location:</strong> {item.location}
  </p>

  {item.description && (
    <p style={{ fontSize: '14px', margin: '6px 0' }}>
      <strong>Description:</strong> {item.description}
    </p>
  )}

  {item.contactEmail && (
    <p style={{ fontSize: '14px', margin: '6px 0' }}>
      <FaEnvelope style={{ marginRight: '6px', color: '#666' }} />
      {item.contactEmail}
    </p>
  )}

  {item.contactPhone && (
    <p style={{ fontSize: '14px', margin: '6px 0' }}>
      <FaPhone style={{ marginRight: '6px', color: '#666' }} />
      {item.contactPhone}
    </p>
  )}

  {item.hostelAddress && (
    <p style={{ fontSize: '14px', margin: '6px 0' }}>
      <FaHome style={{ marginRight: '6px', color: '#666' }} />
      {item.hostelAddress}
    </p>
  )}
</div>

          ))}
      </div>
    </div>
  );
};

export default ViewItems;
