import { Icon } from "../components/common/Icon";

export const ConfigError = () => {
  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      background: "linear-gradient(180deg, #141419 0%, #0d0d10 100%)"
    }}>
        <div style={{
          textAlign: "center",
          maxWidth: "500px",
          padding: "48px 32px",
          background: "rgba(30, 30, 35, 0.8)",
          borderRadius: "24px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(12px)"
        }}>
          <div style={{
            width: "90px",
            height: "90px",
            margin: "0 auto 24px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.05) 100%)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ef4444",
            fontSize: "36px"
          }}>
            <Icon icon="fa-solid fa-triangle-exclamation" />
          </div>
          <h1 style={{
            fontSize: "1.8rem",
            fontWeight: "700",
            color: "#fff",
            marginBottom: "12px"
          }}>
            Configuration Required
          </h1>
          <p style={{
            color: "var(--text-secondary)",
            fontSize: "1.05rem",
            marginBottom: "24px",
            lineHeight: "1.6"
          }}>
            The application requires Firebase configuration to function properly. 
            Please set up your environment variables in a <code style={{ background: "rgba(0,0,0,0.3)", padding: "2px 6px", borderRadius: "4px" }}>.env</code> file.
          </p>
        </div>
      </div>
  );
};

export default ConfigError;
