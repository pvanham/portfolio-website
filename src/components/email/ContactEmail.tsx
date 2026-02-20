// src/components/email/ContactEmail.tsx

interface ContactEmailProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactEmail: React.FC<Readonly<ContactEmailProps>> = ({
  name,
  email,
  subject,
  message,
}) => {
  const containerStyle = {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    lineHeight: "1.6",
    color: "#333",
    backgroundColor: "#f9f9f9",
    padding: "20px",
  };

  const cardStyle = {
    backgroundColor: "#ffffff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
  };

  const headingStyle = {
    fontSize: "24px",
    color: "#333",
    borderBottom: "1px solid #eee",
    paddingBottom: "10px",
    marginBottom: "20px",
  };

  const paragraphStyle = {
    fontSize: "16px",
    marginBottom: "10px",
  };

  const labelStyle = {
    fontWeight: "bold" as const,
    color: "#555",
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={headingStyle}>New Message from Portfolio Contact Form</h1>
        <p style={paragraphStyle}>
          You have received a new message from your portfolio website.
        </p>

        <p style={paragraphStyle}>
          <span style={labelStyle}>Subject:</span> {subject}
        </p>
        <p style={paragraphStyle}>
          <span style={labelStyle}>From:</span> {name}
        </p>
        <p style={paragraphStyle}>
          <span style={labelStyle}>Email:</span> {email}
        </p>

        <h2 style={{ ...headingStyle, fontSize: "20px", marginTop: "30px" }}>
          Message:
        </h2>
        <div
          style={{
            ...paragraphStyle,
            whiteSpace: "pre-wrap",
            border: "1px solid #eee",
            padding: "15px",
            borderRadius: "4px",
            backgroundColor: "#fafafa",
          }}
        >
          {message}
        </div>
      </div>
    </div>
  );
};

export default ContactEmail;
