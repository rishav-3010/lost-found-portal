import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../UserContext';

const SubmitItem = () => {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'lost',
    location: '',
    contactEmail: '',
    contactPhone: '',
    hostelAddress: '',
  });
  const [image, setImage] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setFormData(prev => ({ ...prev, contactEmail: user.email }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!emailRegex.test(formData.contactEmail)) {
      alert("Please enter a valid email address.");
      return false;
    }

    if (formData.contactPhone && !phoneRegex.test(formData.contactPhone)) {
      alert("Please enter a valid 10-digit phone number or leave it blank.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (image) data.append('image', image);

    try {
      setLoading(true);
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/items`, data, {
  withCredentials: true, // Only if your backend uses cookies/sessions
});

      setSuccessMsg('Item submitted successfully!');
      setFormData({
        title: '',
        description: '',
        type: 'lost',
        location: '',
        contactEmail: user.email,
        contactPhone: '',
        hostelAddress: '',
      });
      setImage(null);
    } catch (err) {
      console.error('Error submitting item:', err);
      alert('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="submit-form">
      <style>{`
        .submit-form {
          max-width: 500px;
          margin: 40px auto;
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
          padding: 32px 24px 24px 24px;
        }
        .submit-form h2 {
          margin-bottom: 24px;
          font-weight: 600;
          color: #222;
        }
        .submit-form form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .submit-form input[type="text"],
        .submit-form input[type="email"],
        .submit-form input[type="tel"],
        .submit-form input[type="file"],
        .submit-form textarea,
        .submit-form select {
          padding: 10px 12px;
          border: 1px solid #ccc;
          border-radius: 7px;
          font-size: 1rem;
          transition: border 0.2s;
        }
        .submit-form input:focus,
        .submit-form textarea:focus,
        .submit-form select:focus {
          border: 1.5px solid #1976d2;
          outline: none;
        }
        .submit-form textarea {
          min-height: 70px;
          resize: vertical;
        }
        .submit-form button[type="submit"] {
          background: #1976d2;
          color: #fff;
          border: none;
          border-radius: 7px;
          padding: 12px 0;
          font-size: 1.08rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 8px;
          transition: background 0.2s;
        }
        .submit-form button[type="submit"]:hover,
        .submit-form button[type="submit"]:focus {
          background: #1256a3;
        }
        .submit-form .success-msg {
          background: #e7f8ed;
          color: #197c3a;
          padding: 10px 14px;
          border-radius: 6px;
          margin-bottom: 10px;
          font-weight: 500;
          border: 1px solid #b2e5c5;
        }
      `}</style>
      <h2>Submit Lost or Found Item</h2>
      {successMsg && <div className="success-msg">{successMsg}</div>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" name="title" placeholder="Item title" value={formData.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>
        <input type="text" name="location" placeholder="Where it was lost/found" value={formData.location} onChange={handleChange} required />
        <input type="email" name="contactEmail" placeholder="Your Email" value={formData.contactEmail} disabled />
        <input type="tel" name="contactPhone" placeholder="Phone No (optional)" value={formData.contactPhone} onChange={handleChange} />
        <input type="text" name="hostelAddress" placeholder="Hostel Address (optional)" value={formData.hostelAddress} onChange={handleChange} />
        <input type="file" accept="image/*" onChange={handleImageChange} required />
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default SubmitItem;
