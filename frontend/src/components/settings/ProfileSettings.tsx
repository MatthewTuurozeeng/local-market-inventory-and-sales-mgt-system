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
  passwordValues: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  onPasswordChange: (values: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => void;
  onPasswordSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  passwordStatus: string;
  passwordTone: "success" | "error" | "";
  isPasswordSaving: boolean;
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
  passwordValues,
  onPasswordChange,
  onPasswordSubmit,
  passwordStatus,
  passwordTone,
  isPasswordSaving,
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
              {avatarStatus && (
                (avatarStatus.toLowerCase().includes("updated") ? (
                  <span className="form-helper">{avatarStatus}</span>
                ) : (
                  <p className="form-alert error">{avatarStatus}</p>
                ))
              )}
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
              {logoStatus && (
                (logoStatus.toLowerCase().includes("updated") ? (
                  <span className="form-helper">{logoStatus}</span>
                ) : (
                  <p className="form-alert error">{logoStatus}</p>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <form className="form-stack" onSubmit={onSubmit}>
        <div className="form-section">
          <h4>Vendor details</h4>
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
              <span>Phone number</span>
              <input
                type="tel"
                value={values.phone}
                onChange={(event) =>
                  onChange({ ...values, phone: event.target.value })
                }
                required
              />
            </label>
            <label>
              <span>Email</span>
              <input
                type="email"
                value={values.email}
                onChange={(event) =>
                  onChange({ ...values, email: event.target.value })
                }
                required
              />
            </label>
          </div>
        </div>
        <div className="form-section">
          <h4>Business / shop details</h4>
          <div className="form-grid">
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
            <label>
              <span>Business category</span>
              <input
                type="text"
                value={values.businessCategory}
                onChange={(event) =>
                  onChange({ ...values, businessCategory: event.target.value })
                }
              />
            </label>
            <label>
              <span>Product focus</span>
              <input
                type="text"
                value={values.productFocus}
                onChange={(event) =>
                  onChange({ ...values, productFocus: event.target.value })
                }
              />
            </label>
            <label className="form-field--full">
              <span>Shop description</span>
              <textarea
                rows={3}
                value={values.shopDescription}
                onChange={(event) =>
                  onChange({ ...values, shopDescription: event.target.value })
                }
                placeholder="Describe your shop and what you sell."
              />
            </label>
          </div>
        </div>
        {statusMessage && (
          <p className={`form-alert ${statusTone}`}>{statusMessage}</p>
        )}
        <button className="button solid" type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save profile"}
        </button>
      </form>
      <form className="form-stack" onSubmit={onPasswordSubmit}>
        <div className="form-section">
          <h4>Change password</h4>
          <div className="form-grid">
            <label>
              <span>Current password</span>
              <input
                type="password"
                value={passwordValues.oldPassword}
                onChange={(event) =>
                  onPasswordChange({
                    ...passwordValues,
                    oldPassword: event.target.value,
                  })
                }
                required
              />
            </label>
            <label>
              <span>New password</span>
              <input
                type="password"
                value={passwordValues.newPassword}
                onChange={(event) =>
                  onPasswordChange({
                    ...passwordValues,
                    newPassword: event.target.value,
                  })
                }
                required
              />
            </label>
            <label>
              <span>Confirm new password</span>
              <input
                type="password"
                value={passwordValues.confirmPassword}
                onChange={(event) =>
                  onPasswordChange({
                    ...passwordValues,
                    confirmPassword: event.target.value,
                  })
                }
                required
              />
            </label>
          </div>
          {passwordStatus && (
            <p className={`form-alert ${passwordTone}`}>{passwordStatus}</p>
          )}
          <button className="button solid" type="submit" disabled={isPasswordSaving}>
            {isPasswordSaving ? "Updating..." : "Update password"}
          </button>
        </div>
      </form>
    </div>
  );
}
