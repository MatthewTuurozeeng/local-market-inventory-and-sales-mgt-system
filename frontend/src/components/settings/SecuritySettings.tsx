type SecuritySettingsProps = {
  values: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  onChange: (values: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  statusMessage: string;
  statusTone: "success" | "error" | "";
  isSaving: boolean;
};

export default function SecuritySettings({
  values,
  onChange,
  onSubmit,
  statusMessage,
  statusTone,
  isSaving,
}: SecuritySettingsProps) {
  return (
    <div className="panel">
      <h3>Security</h3>
      <p className="subtext">Change your password regularly to stay secure.</p>
      <form className="form-stack" onSubmit={onSubmit}>
        <label>
          <span>Current password</span>
          <input
            type="password"
            value={values.oldPassword}
            onChange={(event) =>
              onChange({ ...values, oldPassword: event.target.value })
            }
            required
          />
        </label>
        <label>
          <span>New password</span>
          <input
            type="password"
            value={values.newPassword}
            onChange={(event) =>
              onChange({ ...values, newPassword: event.target.value })
            }
            required
          />
        </label>
        <label>
          <span>Confirm new password</span>
          <input
            type="password"
            value={values.confirmPassword}
            onChange={(event) =>
              onChange({ ...values, confirmPassword: event.target.value })
            }
            required
          />
        </label>
        {statusMessage && (
          <p className={`form-alert ${statusTone}`}>{statusMessage}</p>
        )}
        <button className="button solid" type="submit" disabled={isSaving}>
          {isSaving ? "Updating..." : "Update password"}
        </button>
      </form>
    </div>
  );
}
