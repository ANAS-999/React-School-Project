import { useState, useEffect } from "react";

export default function Test() {
  const [envValues, setEnvValues] = useState<Record<string, string>>({});
  const [apiResult, setApiResult] = useState<{
    status: number;
    statusText: string;
    url: string;
    headers: Record<string, string>;
    body: string;
    error: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEnvValues({
      VITE_GAMES_API_URL: import.meta.env.VITE_GAMES_API_URL || "NOT SET",
      VITE_GAMES_CLIENT_ID: import.meta.env.VITE_GAMES_CLIENT_ID || "NOT SET",
      VITE_GAMES_AUTHORIZATION:
        import.meta.env.VITE_GAMES_AUTHORIZATION || "NOT SET",
    });
  }, []);

  const testApi = async () => {
    setLoading(true);
    setApiResult(null);

    const apiUrl = import.meta.env.VITE_GAMES_API_URL || "/api/igdb/";
    const clientId = import.meta.env.VITE_GAMES_CLIENT_ID;
    const authorization = import.meta.env.VITE_GAMES_AUTHORIZATION;

    const fullUrl = apiUrl + "games";
    const headers = {
      Accept: "application/json",
      "Client-ID": clientId || "",
      Authorization: "Bearer " + (authorization || ""),
    };

    try {
      const response = await fetch(fullUrl, {
        method: "POST",
        headers,
        body: "fields id, name; limit 1;",
      });

      let bodyText = "";
      try {
        const json = await response.json();
        bodyText = JSON.stringify(json, null, 2);
      } catch {
        bodyText = await response.text();
      }

      setApiResult({
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        headers: Object.fromEntries(
          Object.entries(headers).map(([k, v]) => [
            k,
            k === "Authorization" ? "Bearer ***" : v,
          ]),
        ),
        body: bodyText,
        error: null,
      });
    } catch (err: any) {
      setApiResult({
        status: 0,
        statusText: "Network Error",
        url: fullUrl,
        headers: Object.fromEntries(
          Object.entries(headers).map(([k, v]) => [
            k,
            k === "Authorization" ? "Bearer ***" : v,
          ]),
        ),
        body: "",
        error: err.message || String(err),
      });
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "monospace", fontSize: "14px" }}>
      <h1>IGDB API Test Page</h1>

      <section style={{ marginBottom: "30px" }}>
        <h2>Environment Variables (VITE_*)</h2>
        <table
          border={1}
          cellPadding="8"
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
          <thead>
            <tr>
              <th>Variable</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(envValues).map(([key, value]) => (
              <tr key={key}>
                <td>{key}</td>
                <td style={{ color: value === "NOT SET" ? "red" : "green" }}>
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2>Server Environment (import.meta.env)</h2>
        <table
          border={1}
          cellPadding="8"
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
          <thead>
            <tr>
              <th>Variable</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>IGDB_CLIENT_ID</td>
              <td
                style={{
                  color: import.meta.env.IGDB_CLIENT_ID ? "green" : "red",
                }}
              >
                {import.meta.env.IGDB_CLIENT_ID
                  ? "SET (to " + import.meta.env.IGDB_CLIENT_ID + ")"
                  : "MISSING"}
              </td>
            </tr>
            <tr>
              <td>IGDB_ACCESS_TOKEN</td>
              <td
                style={{
                  color: import.meta.env.IGDB_ACCESS_TOKEN ? "green" : "red",
                }}
              >
                {import.meta.env.IGDB_ACCESS_TOKEN ? "SET" : "MISSING"}
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <button
          onClick={testApi}
          disabled={loading}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Testing..." : "Test IGDB API Call"}
        </button>
      </section>

      {apiResult && (
        <section>
          <h2>API Call Result</h2>
          <table
            border={1}
            cellPadding="8"
            style={{
              borderCollapse: "collapse",
              width: "100%",
              marginBottom: "20px",
            }}
          >
            <tbody>
              <tr>
                <td>
                  <strong>Status</strong>
                </td>
                <td
                  style={{
                    color:
                      apiResult.status >= 200 && apiResult.status < 300
                        ? "green"
                        : "red",
                  }}
                >
                  {apiResult.status} {apiResult.statusText}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>URL</strong>
                </td>
                <td>{apiResult.url}</td>
              </tr>
              <tr>
                <td>
                  <strong>Error</strong>
                </td>
                <td style={{ color: "red" }}>{apiResult.error || "None"}</td>
              </tr>
            </tbody>
          </table>

          <h3>Request Headers Sent</h3>
          <pre
            style={{  padding: "10px", overflow: "auto" }}
          >
            {JSON.stringify(apiResult.headers, null, 2)}
          </pre>

          <h3>Response Body</h3>
          <pre
            style={{
              
              padding: "10px",
              overflow: "auto",
              maxHeight: "400px",
            }}
          >
            {apiResult.body}
          </pre>
        </section>
      )}
    </div>
  );
}
