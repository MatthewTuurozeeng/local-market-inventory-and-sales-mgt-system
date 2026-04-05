import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerVendor } from "../lib/api.ts";

export default function Signup() {
  const navigate = useNavigate();
  const [idType, setIdType] = useState<"ghana" | "voter" | "">("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    idNumber: "",
    businessName: "",
    location: "",
    primaryProducts: "",
    otherProductTypes: "",
    staffCount: "",
    productTypes: [] as string[],
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const productTypeOptions = [
    "Fresh produce",
    "Grains & cereals",
    "Tubers & roots",
    "Spices & condiments",
    "Processed foods",
    "Meat & poultry",
    "Fish & seafood",
    "Dairy & eggs",
    "Household items",
    "Textiles & clothing",
    "Beauty & personal care",
  ];

  const passwordsMatch =
    password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const showMismatch =
    password.length > 0 && confirmPassword.length > 0 && password !== confirmPassword;

  const toggleProductType = (value: string) => {
    setForm((prev) => {
      const exists = prev.productTypes.includes(value);
      return {
        ...prev,
        productTypes: exists
          ? prev.productTypes.filter((item) => item !== value)
          : [...prev.productTypes, value],
      };
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!idType) {
      setError("Please select an ID type.");
      return;
    }
    if (form.productTypes.length === 0) {
      setError("Please select at least one product type.");
      return;
    }
    setLoading(true);
    try {
      await registerVendor({
        firstName: form.firstName,
        middleName: form.middleName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        password,
        idType,
        idNumber: form.idNumber,
        businessName: form.businessName,
        location: form.location,
        primaryProducts: form.primaryProducts,
        staffCount: Number(form.staffCount),
        productTypes: form.productTypes,
        otherProductTypes: form.otherProductTypes,
      });
      navigate("/dashboard");
    } catch (err) {
      setError((err as Error).message || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <section className="section">
        <div className="section-title">
          <p className="eyebrow">Sign up</p>
          <h2>Create your vendor account.</h2>
        </div>
        <div className="panel form-panel">
          <p>Tell us about you and your business to get started.</p>
          <form className="form-stack" onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Vendor details</h3>
              <div className="form-grid">
                <label>
                  <span>First name</span>
                  <input
                    type="text"
                    placeholder="Ama"
                    value={form.firstName}
                    onChange={(event) =>
                      setForm({ ...form, firstName: event.target.value })
                    }
                    required
                  />
                </label>
                <label>
                  <span>Middle name (optional)</span>
                  <input
                    type="text"
                    placeholder="Kofi"
                    value={form.middleName}
                    onChange={(event) =>
                      setForm({ ...form, middleName: event.target.value })
                    }
                  />
                </label>
                <label>
                  <span>Last name</span>
                  <input
                    type="text"
                    placeholder="Mensah"
                    value={form.lastName}
                    onChange={(event) =>
                      setForm({ ...form, lastName: event.target.value })
                    }
                    required
                  />
                </label>
                <label>
                  <span>Email</span>
                  <input
                    type="email"
                    placeholder="ama@market.com"
                    required
                    pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                    title="Enter a valid email address"
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                  />
                </label>
                <label>
                  <span>Phone number</span>
                  <input
                    type="tel"
                    placeholder="+233 24 000 0000"
                    required
                    pattern="^(\+233|0)(2[0-9]|3[0-9]|5[0-9])\d{7}$"
                    title="Use a Ghanaian number (e.g., 0240000000 or +233240000000)"
                    value={form.phone}
                    onChange={(event) => setForm({ ...form, phone: event.target.value })}
                  />
                </label>
                <label>
                  <span>Preferred ID type</span>
                  <select
                    value={idType}
                    onChange={(event) =>
                      setIdType(event.target.value as "ghana" | "voter" | "")
                    }
                    required
                  >
                    <option value="" disabled>
                      Select ID type
                    </option>
                    <option value="ghana">Ghana Card</option>
                    <option value="voter">Voter ID</option>
                  </select>
                </label>
                {idType === "ghana" && (
                  <label>
                    <span>Ghana Card ID</span>
                    <input
                      type="text"
                      placeholder="GHA-123456789-0"
                      pattern="^GHA-\d{9}-\d$"
                      title="Format: GHA-123456789-0"
                      required
                      value={form.idNumber}
                      onChange={(event) =>
                        setForm({ ...form, idNumber: event.target.value })
                      }
                    />
                  </label>
                )}
                {idType === "voter" && (
                  <label>
                    <span>Voter ID</span>
                    <input
                      type="text"
                      placeholder="AB-1234567"
                      pattern="^[A-Z]{2}-\d{6,8}$"
                      title="Format: AB-1234567"
                      required
                      value={form.idNumber}
                      onChange={(event) =>
                        setForm({ ...form, idNumber: event.target.value })
                      }
                    />
                  </label>
                )}
                <label>
                  <span>Password</span>
                  <input
                    type="password"
                    placeholder="Create a strong password"
                    minLength={6}
                    required
                    pattern="^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{6,}$"
                    title="Min 6 chars, include uppercase, lowercase, number, and symbol"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </label>
                <label>
                  <span>Confirm password</span>
                  <input
                    type="password"
                    placeholder="Re-enter password"
                    minLength={6}
                    required
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                  />
                </label>
                {showMismatch && (
                  <p className="form-alert error">Passwords do not match.</p>
                )}
                {passwordsMatch && (
                  <p className="form-alert success">Passwords match.</p>
                )}
              </div>
            </div>

            <div className="form-section">
              <h3>Business details</h3>
              <div className="form-grid">
                <label>
                  <span>Business name</span>
                  <input
                    type="text"
                    placeholder="Ama Fresh Produce"
                    value={form.businessName}
                    onChange={(event) =>
                      setForm({ ...form, businessName: event.target.value })
                    }
                    required
                  />
                </label>
                <label>
                  <span>Market or location</span>
                  <input
                    type="text"
                    placeholder="Makola Market, Accra"
                    value={form.location}
                    onChange={(event) =>
                      setForm({ ...form, location: event.target.value })
                    }
                    required
                  />
                </label>
                <label>
                  <span>Primary products</span>
                  <input
                    type="text"
                    placeholder="Tomatoes, onions, peppers"
                    required
                    value={form.primaryProducts}
                    onChange={(event) =>
                      setForm({ ...form, primaryProducts: event.target.value })
                    }
                  />
                </label>
                <label>
                  <span>Product types (select all that apply)</span>
                  <div className="checkbox-group">
                    {productTypeOptions.map((option) => (
                      <label key={option}>
                        <input
                          type="checkbox"
                          name="productType"
                          checked={form.productTypes.includes(option)}
                          onChange={() => toggleProductType(option)}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </label>
                <label>
                  <span>Other product types</span>
                  <input
                    type="text"
                    placeholder="Add other product types"
                    value={form.otherProductTypes}
                    onChange={(event) =>
                      setForm({ ...form, otherProductTypes: event.target.value })
                    }
                  />
                </label>
                <label>
                  <span>Number of staff</span>
                  <input
                    type="number"
                    min="1"
                    placeholder="1"
                    value={form.staffCount}
                    onChange={(event) =>
                      setForm({ ...form, staffCount: event.target.value })
                    }
                    required
                  />
                </label>
              </div>
            </div>

            {error && <p className="form-alert error">{error}</p>}
            <button className="button solid" type="submit">
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
