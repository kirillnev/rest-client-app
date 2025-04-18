import './terms.css';

export default function TermsPage() {
  return (
    <main className="terms-main">
      <h1 className="terms-title">Terms and Conditions</h1>
      <p>Last updated: April 15, 2025</p>

      <div className="terms-section">
        <h2>1. Purpose</h2>
        <p>
          This application is intended for testing and learning how REST APIs
          work. It is not designed for use in production environments or
          handling sensitive data.
        </p>
      </div>

      <div className="terms-section">
        <h2>2. User Responsibility</h2>
        <ul>
          <li>
            You are responsible for all activities performed through your
            account.
          </li>
          <li>
            You agree not to misuse the app, send malicious requests, or violate
            any laws.
          </li>
          <li>
            Data you send to external APIs via this client is not stored or
            monitored.
          </li>
        </ul>
      </div>

      <div className="terms-section">
        <h2>3. No Warranty</h2>
        <p>
          This app is provided as is without any warranties of any kind. We do
          not guarantee uninterrupted or error-free operation.
        </p>
      </div>

      <div className="terms-section">
        <h2>4. Limitation of Liability</h2>
        <p>
          Under no circumstances shall the developers be held liable for any
          damages resulting from the use of this application.
        </p>
      </div>

      <div className="terms-section">
        <h2>5. Changes</h2>
        <p>
          We may update these terms at any time. Changes will be posted on this
          page. Continued use of the app after changes indicates your
          acceptance.
        </p>
      </div>

      <div className="terms-section">
        <h2>6. Contact</h2>
        <p>
          For any questions regarding these terms, please contact the
          development team via GitHub.
        </p>
      </div>
    </main>
  );
}
