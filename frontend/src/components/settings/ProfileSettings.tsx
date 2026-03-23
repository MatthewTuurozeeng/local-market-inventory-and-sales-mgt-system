import type { VendorSettingsProfile } from "../../lib/api.ts";

type ProfileSettingsProps = {
  values: VendorSettingsProfile;
  onChange: (values: VendorSettingsProfile) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  statusMessage: string;
  statusTone: "success" | "error" | "";
  isSaving: boolean;
  onAvatarUpload: (file: File) => void;
  onLogoUpload: (file: File) => void;
  avatarStatus: string;
  logoStatus: string;
  isAvatarUploading: boolean;
  isLogoUploading: boolean;
};

export default function ProfileSettings({
  values,
  onChange,
  onSubmit,
  statusMessage,
  statusTone,
  isSaving,
  onAvatarUpload,
  onLogoUpload,
  avatarStatus,
  logoStatus,
  isAvatarUploading,
  isLogoUploading,
}: ProfileSettingsProps) {
  return (
  <div className="panel profile-panel">
      <h3>Profile & shop information</h3>
      <p className="subtext">Keep your vendor and shop details up to date.</p>
      <div className="profile-settings">
        <div className="profile-media-grid">
          <div className="profile-media-card">
            <p className="settings-label">Vendor photo</p>
            <div className="profile-media-preview">
              {values.avatarUrl ? (
                <img
                  src={values.avatarUrl}
                  alt="Vendor profile"
                  className="profile-media-image profile-media-image--round"
                />
              ) : (
                <div className="profile-media-placeholder profile-media-image--round">
                  Upload
                </div>
              )}
            </div>
            <div className="profile-media-actions">
              <label className="button outline">
                {isAvatarUploading ? "Uploading..." : "Upload photo"}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  disabled={isAvatarUploading}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      onAvatarUpload(file);
                    }
                    event.currentTarget.value = "";
                  }}
                />
              </label>
              {avatarStatus && <span className="form-helper">{avatarStatus}</span>}
            </div>
          </div>
          <div className="profile-media-card">
            <p className="settings-label">Store logo</p>
            <div className="profile-media-preview">
              {values.storeLogoUrl ? (
                <img
                  src={values.storeLogoUrl}
                  alt="Store logo"
                  className="profile-media-image"
                />
              ) : (
                <div className="profile-media-placeholder">Upload</div>
              )}
            </div>
            <div className="profile-media-actions">
              <label className="button outline">
                {isLogoUploading ? "Uploading..." : "Upload logo"}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  disabled={isLogoUploading}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      onLogoUpload(file);
                    }
                    event.currentTarget.value = "";
                  }}
                />
              </label>
              {logoStatus && <span className="form-helper">{logoStatus}</span>}
            </div>
          </div>
        </div>
      </div>
      <form className="form-stack" onSubmit={onSubmit}>
        <div className="form-grid">
          <label>
            <span>Vendor name</span>
            <input
              type="text"
              value={values.vendorName}
              onChange={(event) =>
                onChange({ ...values, vendorName: event.target.value })
              }
              required
            />
          </label>
          <label>
            <span>Shop name</span>
            <input
              type="text"
              value={values.shopName}
              onChange={(event) =>
                onChange({ ...values, shopName: event.target.value })
              }
              required
            />
          </label>
          <label>
            <span>Phone number</span>
            <input
              type="tel"
              value={values.phone}
              onChange={(event) => onChange({ ...values, phone: event.target.value })}
              required
            />
          </label>
          <label>
            <span>Email</span>
            <input
              type="email"
              value={values.email}
              onChange={(event) => onChange({ ...values, email: event.target.value })}
              required
            />
          </label>
          <label>
            <span>Location</span>
            <input
              type="text"
              value={values.location}
              onChange={(event) =>
                onChange({ ...values, location: event.target.value })
              }
              required
            />
          </label>
        </div>
        {statusMessage && (
          <p className={`form-alert ${statusTone}`}>{statusMessage}</p>
        )}
        <button className="button solid" type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save profile"}
        </button>
      </form>
    </div>
  );
}
