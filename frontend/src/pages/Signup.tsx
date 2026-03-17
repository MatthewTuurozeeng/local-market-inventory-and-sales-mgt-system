import { useState } from "react";

export default function Signup() {
  const [idType, setIdType] = useState<"ghana" | "voter" | "">("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordsMatch =
    password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const showMismatch =
    password.length > 0 && confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <div className="page-content">
      <section className="section">
        <div className="section-title">
          <p className="eyebrow">Sign up</p>
          <h2>Create your vendor account.</h2>
        </div>
        <div className="panel form-panel">
          <p>Tell us about you and your business to get started.</p>
          <form className="form-stack">
            <div className="form-section">
              <h3>Vendor details</h3>
              <div className="form-grid">
                <label>
                  <span>First name</span>
                  <input type="text" placeholder="Ama" required />
                </label>
                <label>
                  <span>Middle name (optional)</span>
                  <input type="text" placeholder="Kofi" />
                </label>
                <label>
                  <span>Last name</span>
                  <input type="text" placeholder="Mensah" required />
                </label>
                <label>
                  <span>Email</span>
                  <input
                    type="email"
                    placeholder="ama@market.com"
                    required
                    pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                    title="Enter a valid email address"
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
                  <input type="text" placeholder="Ama Fresh Produce" required />
                </label>
                <label>
                  <span>Market or location</span>
                  <input type="text" placeholder="Makola Market, Accra" required />
                </label>
                <label>
                  <span>Primary products</span>
                  <input
                    type="text"
                    placeholder="Tomatoes, onions, peppers"
                    required
                  />
                </label>
                <label>
                  <span>Product types (select all that apply)</span>
                  <div className="checkbox-group">
                    <label>
                      <input type="checkbox" name="productType" /> Fresh produce
                    </label>
                    <label>
                      <input type="checkbox" name="productType" /> Grains & cereals
                    </label>
                    <label>
                      <input type="checkbox" name="productType" /> Tubers & roots
                    </label>
                    <label>
                      <input type="checkbox" name="productType" /> Spices & condiments
                    </label>
                    <label>
                      <input type="checkbox" name="productType" /> Processed foods
                    </label>
                    <label>
                      <input type="checkbox" name="productType" /> Meat & poultry
                    </label>
                    <label>
                      <input type="checkbox" name="productType" /> Fish & seafood
                    </label>
                    <label>
                      <input type="checkbox" name="productType" /> Dairy & eggs
                    </label>
                    <label>
                      <input type="checkbox" name="productType" /> Household items
                    </label>
                    <label>
                      <input type="checkbox" name="productType" /> Textiles & clothing
                    </label>
                    <label>
                      <input type="checkbox" name="productType" /> Beauty & personal care
                    </label>
                  </div>
                </label>
                <label>
                  <span>Other product types</span>
                  <input type="text" placeholder="Add other product types" />
                </label>
                <label>
                  <span>Number of staff</span>
                  <input type="number" min="1" placeholder="1" required />
                </label>
              </div>
            </div>

            <button className="button solid" type="submit">
              Create account
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
