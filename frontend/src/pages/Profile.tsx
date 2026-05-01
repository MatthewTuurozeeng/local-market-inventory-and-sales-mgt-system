import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  API_BASE_URL, 
  getProfile,
  updateProfile,
  uploadAvatar,
  type VendorProfile,
} from "../lib/api.ts";

const emptyProfile: VendorProfile = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  avatarUrl: "",
  businessName: "",
  location: "",
  primaryProducts: "",
  staffCount: 1,
  productTypes: [],
  otherProductTypes: "",
};

// the Profile component allows vendors to view and update their personal and business information. 
// it fetches the vendor's profile data from the API and populates a form with the existing information. 
// vendors can edit their details, including their name, email, phone number, business name, location, primary products, staff count, and product types. 
// the component also supports avatar uploads, allowing vendors to personalize their profile with an image. 
// error handling and status messages provide feedback on the success or failure of profile updates and avatar uploads.
export default function Profile() {
  const [profile, setProfile] = useState<VendorProfile>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    businessName: "",
    location: "",
    primaryProducts: "",
    staffCount: "",
    productTypes: "",
    otherProductTypes: "",
  });

  const avatarPreview = useMemo(() => {
    if (avatarFile) {
      return URL.createObjectURL(avatarFile);
    }
    if (!profile.avatarUrl) {
      return "";
    }
    if (profile.avatarUrl.startsWith("http")) {
      return profile.avatarUrl;
    }
    if (profile.avatarUrl.startsWith("/")) {
      return `${API_BASE_URL}${profile.avatarUrl}`;
    }
    return profile.avatarUrl;
  }, [avatarFile, profile.avatarUrl]);

  useEffect(() => {
    let isMounted = true;
    const loadProfile = async () => {
      try {
        const data = await getProfile();
        if (!isMounted) return;
        setProfile(data);
        setForm({
          firstName: data.firstName ?? "",
          lastName: data.lastName ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          businessName: data.businessName ?? "",
          location: data.location ?? "",
          primaryProducts: data.primaryProducts ?? "",
          staffCount: String(data.staffCount ?? 1),
          productTypes: (data.productTypes || []).join(", "),
          otherProductTypes: data.otherProductTypes ?? "",
        });
      } catch (err) {
        setError((err as Error).message || "Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
    return () => {
      isMounted = false;
      if (avatarFile) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarFile, avatarPreview]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("");
    setError("");

    const productTypes = form.productTypes
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    try {
      const updated = await updateProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        businessName: form.businessName,
        location: form.location,
        primaryProducts: form.primaryProducts,
        staffCount: Number(form.staffCount),
        productTypes: productTypes.length > 0 ? productTypes : profile.productTypes,
        otherProductTypes: form.otherProductTypes,
      });
      setProfile(updated);
      setStatus("Profile updated successfully.");
    } catch (err) {
      setError((err as Error).message || "Unable to update profile.");
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) {
      setError("Select an image file before uploading.");
      return;
    }
    setError("");
    setStatus("");
    try {
      const result = await uploadAvatar(avatarFile);
      setProfile((prev) => ({ ...prev, avatarUrl: result.avatarUrl }));
      setAvatarFile(null);
      setStatus("Avatar updated successfully.");
    } catch (err) {
      setError((err as Error).message || "Unable to upload avatar.");
    }
  };

  if (loading) {
    return (
      <div className="page-content">
        <section className="section">
          <div className="panel">
            <p>Loading profile...</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page-content">
      <section className="section">
        <div className="section-title">
          <p className="eyebrow">Profile</p>
          <h2>Vendor profile.</h2>
          <p className="subtext">
            View and update personal details and business information.
          </p>
        </div>
        <div className="panel form-panel">
          <div className="profile-avatar">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Vendor avatar" className="profile-avatar__image" />
            ) : (
              <div className="profile-avatar__placeholder">No image</div>
            )}
            <div className="profile-avatar__actions">
              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setAvatarFile(event.target.files ? event.target.files[0] : null)
                }
              />
              <button className="button outline" type="button" onClick={handleAvatarUpload}>
                Upload avatar
              </button>
            </div>
          </div>
          <form className="form-stack" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label>
                <span>First name</span>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(event) => setForm({ ...form, firstName: event.target.value })}
                  required
                />
              </label>
              <label>
                <span>Last name</span>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(event) => setForm({ ...form, lastName: event.target.value })}
                  required
                />
              </label>
              <label>
                <span>Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  required
                />
              </label>
              <label>
                <span>Phone</span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(event) => setForm({ ...form, phone: event.target.value })}
                />
              </label>
              <label>
                <span>Business name</span>
                <input
                  type="text"
                  value={form.businessName}
                  onChange={(event) =>
                    setForm({ ...form, businessName: event.target.value })
                  }
                  required
                />
              </label>
              <label>
                <span>Location</span>
                <input
                  type="text"
                  value={form.location}
                  onChange={(event) => setForm({ ...form, location: event.target.value })}
                  required
                />
              </label>
              <label>
                <span>Primary products</span>
                <input
                  type="text"
                  value={form.primaryProducts}
                  onChange={(event) =>
                    setForm({ ...form, primaryProducts: event.target.value })
                  }
                  required
                />
              </label>
              <label>
                <span>Staff count</span>
                <input
                  type="number"
                  min={1}
                  value={form.staffCount}
                  onChange={(event) => setForm({ ...form, staffCount: event.target.value })}
                  required
                />
              </label>
              <label>
                <span>Product types (comma separated)</span>
                <input
                  type="text"
                  value={form.productTypes}
                  onChange={(event) => setForm({ ...form, productTypes: event.target.value })}
                />
              </label>
              <label>
                <span>Other product types</span>
                <input
                  type="text"
                  value={form.otherProductTypes}
                  onChange={(event) =>
                    setForm({ ...form, otherProductTypes: event.target.value })
                  }
                />
              </label>
            </div>
            {status && <p className="form-alert success">{status}</p>}
            {error && <p className="form-alert error">{error}</p>}
            <button className="button solid" type="submit">
              Save profile
            </button>
          </form>
          <p className="form-helper">
            <Link to="/dashboard">Back to dashboard</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
