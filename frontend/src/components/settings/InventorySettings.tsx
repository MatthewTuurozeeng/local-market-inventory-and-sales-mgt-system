import type { InventorySettings as InventorySettingsType } from "../../lib/api.ts";

type InventorySettingsProps = {
  values: InventorySettingsType;
  onChange: (values: InventorySettingsType) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  statusMessage: string;
  statusTone: "success" | "error" | "";
  isSaving: boolean;
};

export default function InventorySettings({
  values,
  onChange,
  onSubmit,
  statusMessage,
  statusTone,
  isSaving,
}: InventorySettingsProps) {
  return (
    <div className="panel">
      <h3>Inventory settings</h3>
      <p className="subtext">Set defaults for stock alerts and units.</p>
      <form className="form-stack" onSubmit={onSubmit}>
        <label>
          <span>Low stock threshold</span>
          <input
            type="number"
            min={0}
            value={values.lowStockThreshold}
            onChange={(event) =>
              onChange({
                ...values,
                lowStockThreshold: Number(event.target.value),
              })
            }
            required
          />
        </label>
        <label>
          <span>Default unit</span>
          <input
            type="text"
            value={values.defaultUnit}
            onChange={(event) =>
              onChange({ ...values, defaultUnit: event.target.value })
            }
            required
          />
        </label>
        {statusMessage && (
          <p className={`form-alert ${statusTone}`}>{statusMessage}</p>
        )}
        <button className="button solid" type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save inventory settings"}
        </button>
      </form>
    </div>
  );
}
