import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useUser } from '../UserContext';
import { FaTimes, FaUpload, FaSpinner, FaCheckCircle } from 'react-icons/fa';

const SubmitItem = () => {
  const { user } = useUser();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'lost',
    location: '',
    contactEmail: '',
    contactPhone: '',
    hostelAddress: '',
  });

  const [image, setImage] = useState(null);      // File
  const [preview, setPreview] = useState(null);  // Object URL
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Autofill email from logged-in user
  useEffect(() => {
    if (user?.email) {
      setFormData(prev => ({ ...prev, contactEmail: user.email }));
    }
  }, [user]);

  // Revoke object URL when preview changes / component unmounts
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Auto-dismiss success message
  useEffect(() => {
    if (!successMsg) return;
    const t = setTimeout(() => setSuccessMsg(''), 3000);
    return () => clearTimeout(t);
  }, [successMsg]);

  /* ---------- Validation ---------- */
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;

  const validateField = (name, value) => {
    let msg = '';
    if (['title', 'description', 'location', 'contactEmail'].includes(name)) {
      if (!value || value.toString().trim() === '') msg = 'This field is required';
    }
    if (name === 'contactEmail' && value) {
      if (!emailRegex.test(value)) msg = 'Enter a valid email';
    }
    if (name === 'contactPhone' && value) {
      if (!phoneRegex.test(value)) msg = 'Enter 10-digit phone or leave blank';
    }
    setErrors(prev => ({ ...prev, [name]: msg }));
    return !msg;
  };

  const validateAll = () => {
    const toValidate = ['title', 'description', 'location', 'contactEmail', 'contactPhone'];
    let ok = true;
    toValidate.forEach(name => {
      const valid = validateField(name, formData[name]);
      if (!valid) ok = false;
    });
    if (!image) {
      setErrors(prev => ({ ...prev, image: 'Image is required' }));
      ok = false;
    }
    return ok;
  };

  /* ---------- Handlers ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleTypeToggle = (t) => {
    setFormData(prev => ({ ...prev, type: t }));
  };

  const handleImageFile = (file) => {
    if (!file) return;
    // revoke previous preview
    if (preview) URL.revokeObjectURL(preview);
    const url = URL.createObjectURL(file);
    setImage(file);
    setPreview(url);
    // clear image error if any
    setErrors(prev => ({ ...prev, image: '' }));
  };

  const handleImageChange = (file) => {
    if (file && file.type && file.type.startsWith('image')) {
      handleImageFile(file);
    } else {
      setErrors(prev => ({ ...prev, image: 'Please upload a valid image file' }));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange(e.dataTransfer.files[0]);
    }
  };

  const removeImage = (ev) => {
    ev?.stopPropagation?.();
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setImage(null);
    setErrors(prev => ({ ...prev, image: 'Image is required' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    const payload = new FormData();
    Object.entries(formData).forEach(([k, v]) => payload.append(k, v));
    payload.append('image', image);

    try {
      setLoading(true);
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/items`, payload, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccessMsg('Item submitted successfully!');
      setFormData({
        title: '',
        description: '',
        type: 'lost',
        location: '',
        contactEmail: user?.email ?? '',
        contactPhone: '',
        hostelAddress: '',
      });
      removeImage();
      setErrors({});
    } catch (err) {
      console.error('Submit error:', err);
      // Show a helpful error
      setErrors(prev => ({ ...prev, submit: 'Failed to submit. Try again.' }));
      alert('Something went wrong while submitting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Render ---------- */
  return (
    <div className="submit-wrap">
      {successMsg && (
        <div className="success-toast" role="status" aria-live="polite">
          <FaCheckCircle /> <span>{successMsg}</span>
        </div>
      )}

      <form className="submit-form" onSubmit={handleSubmit} encType="multipart/form-data" noValidate>
        <h2 className="form-title">Submit Lost or Found Item</h2>

        <div className="grid">
          <div className="col main-col">
            <label className="label">Item Title <span className="req">*</span></label>
            <input name="title" value={formData.title} onChange={handleChange} placeholder="Item title" />
            {errors.title && <div className="error">{errors.title}</div>}

            <label className="label">Description <span className="req">*</span></label>
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe the item" />

            {errors.description && <div className="error">{errors.description}</div>}

            <label className="label">Where it was lost/found <span className="req">*</span></label>
            <input name="location" value={formData.location} onChange={handleChange} placeholder="Location (campus, building, etc.)" />
            {errors.location && <div className="error">{errors.location}</div>}
          </div>

          <aside className="col side-col">
            <label className="label">Type</label>
            <div className="toggle-group" role="tablist" aria-label="Type selector">
              {['lost', 'found'].map(t => (
                <button
                  key={t}
                  type="button"
                  className={`toggle ${formData.type === t ? 'active' : ''}`}
                  onClick={() => handleTypeToggle(t)}
                  aria-pressed={formData.type === t}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            <label className="label">Your Email <span className="req">*</span></label>
            <input name="contactEmail" value={formData.contactEmail} onChange={handleChange} disabled />

            {errors.contactEmail && <div className="error">{errors.contactEmail}</div>}

            <label className="label">Phone No (optional)</label>
            <input name="contactPhone" value={formData.contactPhone} onChange={handleChange} placeholder="10-digit number" />
            {errors.contactPhone && <div className="error">{errors.contactPhone}</div>}

            <label className="label">Hostel Address (optional)</label>
            <input name="hostelAddress" value={formData.hostelAddress} onChange={handleChange} placeholder="Hostel / room (optional)" />
          </aside>
        </div>

        {/* ------- Upload area (large dashed outer + white inner frame preview) ------- */}
        <div
          className="upload-box"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') fileInputRef.current?.click(); }}
          aria-label="Upload item photo (required)"
        >
          {preview ? (
            <div className="image-frame" onClick={(ev) => ev.stopPropagation()}>
              <button
                type="button"
                className="remove-btn"
                onClick={removeImage}
                aria-label="Remove uploaded image"
              >
                <FaTimes />
              </button>

              <div className="image-holder">
                <img src={preview} alt="Uploaded preview" />
              </div>
            </div>
          ) : (
            <div className="upload-placeholder">
              <FaUpload size={22} />
              <div className="upload-text">
                <div className="title-strong">Item Photo <span className="req">*</span></div>
                <div className="sub">Drag & drop or click to upload — required</div>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => handleImageChange(e.target.files?.[0])}
            aria-hidden="true"
          />
        </div>
        {errors.image && <div className="error" style={{ marginTop: 8 }}>{errors.image}</div>}

        {errors.submit && <div className="error">{errors.submit}</div>}

        <div style={{ marginTop: 18 }}>
          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? <FaSpinner className="spin" /> : 'Submit Item'}
          </button>
        </div>
      </form>

      {/* ---------- Styles (component-scoped) ---------- */}
      <style>{`
        :root {
          --glass-bg: rgba(255,255,255,0.08);
          --glass-border: rgba(255,255,255,0.12);
          --accent-1: #00d2ff;
          --accent-2: #3a7bd5;
          --text: #fff;
          --muted: rgba(255,255,255,0.85);
        }

        .submit-wrap {
          max-width: 900px;
          margin: 36px auto;
          padding: 22px;
        }

        .submit-form {
          background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
          border-radius: 14px;
          padding: 26px;
          box-shadow: 0 8px 30px rgba(10,10,20,0.18);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.06);
          color: var(--text);
        }

        .form-title {
          margin: 0 0 12px 0;
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--muted);
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 18px;
        }
        @media (max-width: 880px) {
          .grid { grid-template-columns: 1fr; }
        }

        .col { display: flex; flex-direction: column; gap: 10px; }
        .main-col { min-width: 0; }
        .side-col { min-width: 0; }

        .label { font-size: 0.95rem; color: rgba(255,255,255,0.95); margin-top: 6px; font-weight: 600; }
        .req { color: #ff9aa2; margin-left: 6px; font-weight: 700; }
        input, textarea {
          padding: 10px 12px;
          border-radius: 10px;
          border: none;
          background: rgba(255,255,255,0.06);
          color: var(--text);
          font-size: 0.98rem;
        }
        input[disabled] { opacity: 0.7; cursor: not-allowed; }
        textarea { min-height: 96px; resize: vertical; }

        .error { color: #ff9aa2; font-size: 0.88rem; margin-top: 4px; }

        /* toggle buttons */
        .toggle-group { display: flex; gap: 8px; margin-top: 6px; }
        .toggle {
          padding: 8px 12px;
          border-radius: 10px;
          background: rgba(255,255,255,0.04);
          color: var(--text);
          border: 1px solid transparent;
          cursor: pointer;
          font-weight: 700;
        }
        .toggle.active {
          background: linear-gradient(90deg, var(--accent-1), var(--accent-2));
          color: #061320;
          border: 1px solid rgba(0,0,0,0.08);
        }

        /* Upload box - dashed outer area */
        .upload-box {
          border: 2px dashed rgba(255,255,255,0.35);
          border-radius: 14px;
          padding: 18px;
          min-height: 170px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.18s, border-color 0.18s;
          position: relative;
          margin-top: 12px;
          background: linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.005));
        }
        .upload-box:hover { background: rgba(255,255,255,0.02); border-color: rgba(255,255,255,0.55); }

        /* image frame inside dashed area (white card) */
        .image-frame {
          width: 100%;
          max-width: 760px;    /* wide preview like your screenshot */
          height: 140px;       /* short banner look */
          background: #fff;
          border-radius: 10px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 6px 18px rgba(12,12,24,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
        }

        .image-holder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .image-holder img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          display: block;
          border-radius: 6px;
        }

        /* remove button (round black X) */
        .remove-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0,0,0,0.78);
          color: #fff;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 6px 14px rgba(0,0,0,0.25);
          z-index: 6;
        }

        /* placeholder when no image */
        .upload-placeholder { display:flex; gap:12px; align-items:center; justify-content:center; color:var(--muted); text-align:left; }
        .upload-text .sub { font-size:0.88rem; opacity:0.9; margin-top:4px; font-weight:600; color:var(--muted); }
        .title-strong { font-weight:700; color:var(--muted); }

        /* submit button */
        .submit-btn {
          width: 100%;
          max-width: 360px;
          padding: 12px 18px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(90deg, var(--accent-1), var(--accent-2));
          color: #061320;
          font-weight: 800;
          font-size: 1rem;
          cursor: pointer;
          box-shadow: 0 8px 30px rgba(58,123,213,0.18);
        }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .spin { animation: spin 1s linear infinite; color: #fff; }
        @keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }

        /* success toast */
        .success-toast {
          display: inline-flex;
          gap: 8px;
          align-items: center;
          background: rgba(10,200,150,0.08);
          border-radius: 10px;
          padding: 8px 12px;
          color: #b7ffd9;
          margin-bottom: 14px;
          border: 1px solid rgba(10,200,150,0.12);
        }
      `}</style>
    </div>
  );
};

export default SubmitItem;
