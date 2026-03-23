import type { NotificationSettings as NotificationSettingsType } from "../../lib/api.ts";

type NotificationSettingsProps = {
  values: NotificationSettingsType;
  onChange: (values: NotificationSettingsType) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  statusMessage: string;
  statusTone: "success" | "error" | "";
  isSaving: boolean;
};

export default function NotificationSettings({
  values,
  onChange,
  onSubmit,
  statusMessage,
  statusTone,
  isSaving,
}: NotificationSettingsProps) {
  return (
    <div className="panel">
      <h3>Notifications</h3>
      <p className="subtext">Choose how you receive alerts and updates.</p>
      <form className="form-stack" onSubmit={onSubmit}>
        <label className="settings-toggle">
          <input
            type="checkbox"
            checked={values.smsEnabled}
            onChange={(event) =>
              onChange({ ...values, smsEnabled: event.target.checked })
            }
          />
          <span>SMS notifications</span>
        </label>
        <label className="settings-toggle">
          <input
            type="checkbox"
            checked={values.emailEnabled}
            onChange={(event) =>
              onChange({ ...values, emailEnabled: event.target.checked })
            }
          />
          <span>Email notifications</span>
        </label>
        <div className="form-section">
          <h4>Alert preferences</h4>
          <label className="settings-toggle">
            <input
              type="checkbox"
              checked={values.saleConfirmation}
              onChange={(event) =>
                onChange({ ...values, saleConfirmation: event.target.checked })
              }
            />
            <span>Sale confirmation</span>
          </label>
          <label className="settings-toggle">
            <input
              type="checkbox"
              checked={values.lowStockAlerts}
              onChange={(event) =>
                onChange({ ...values, lowStockAlerts: event.target.checked })
              }
            />
            <span>Low stock alerts</span>
          </label>
          <label className="settings-toggle">
            <input
              type="checkbox"
              checked={values.dailySummary}
              onChange={(event) =>
                onChange({ ...values, dailySummary: event.target.checked })
              }
            />
            <span>Daily summary</span>
          </label>
        </div>
        {statusMessage && (
          <p className={`form-alert ${statusTone}`}>{statusMessage}</p>
        )}
        <button className="button solid" type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save notifications"}
        </button>
      </form>
    </div>
  );
}
