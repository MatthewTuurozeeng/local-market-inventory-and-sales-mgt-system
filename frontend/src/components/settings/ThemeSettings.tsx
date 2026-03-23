import { useTheme } from "../../lib/theme.tsx";

type ThemeSettingsProps = {
  description?: string;
};

export default function ThemeSettings({
  description = "Toggle between light and dark mode for comfortable viewing.",
}: ThemeSettingsProps) {
  const { theme, toggleTheme } = useTheme();
  const label = theme === "dark" ? "Dark" : "Light";

  return (
    <div className="panel">
      <h3>Appearance</h3>
      <p className="subtext">{description}</p>
      <div className="settings-row">
        <div>
          <p className="settings-label">Current theme</p>
          <strong>{label} mode</strong>
        </div>
        <button className="button outline" type="button" onClick={toggleTheme}>
          Switch to {theme === "dark" ? "Light" : "Dark"} mode
        </button>
      </div>
    </div>
  );
}
