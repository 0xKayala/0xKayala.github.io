const btn = document.getElementById("testBtn");
const frame = document.getElementById("testFrame");
const API_URL = "https://api.0xkayala.com/api/scan";

btn.addEventListener("click", async () => {
  const protocol = document.getElementById("protocol").value;
  const target = document.getElementById("target").value.trim();

  if (!target) return alert("Enter a valid domain");

  const url = protocol + target;

  document.getElementById("r-url").textContent = url;
  document.getElementById("r-status").textContent = "Testing…";
  document.getElementById("r-xfo").textContent = "-";
  document.getElementById("r-csp").textContent = "-";

  const verdictBox = document.getElementById("verdict");
  verdictBox.className = "verdict hidden";

  frame.src = url;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });

    const data = await response.json();

    document.getElementById("r-xfo").textContent =
      data.x_frame_options || "❌ Missing";

    document.getElementById("r-csp").textContent =
      data.frame_ancestors || "❌ Missing";

    if (data.vulnerable) {
      document.getElementById("r-status").textContent = "VULNERABLE";
      document.getElementById("r-status").style.color = "#dc2626";
      verdictBox.textContent =
        "❌ This site is vulnerable to Clickjacking (UI Redressing) attack";
      verdictBox.className = "verdict vuln";
    } else {
      document.getElementById("r-status").textContent = "SAFE";
      document.getElementById("r-status").style.color = "#16a34a";
      verdictBox.textContent =
        "✅ This site is protected against Clickjacking attacks";
      verdictBox.className = "verdict safe";
    }

    /* --------------------
       PROFESSIONAL RAW HEADER FORMAT
    -------------------- */
    const sortedHeaders = Object.keys(data.raw_headers)
      .sort()
      .reduce((obj, key) => {
        obj[key] = data.raw_headers[key];
        return obj;
      }, {});

    let rawOutput = `HTTP/1.1 200 OK\n`;
    for (const [k, v] of Object.entries(sortedHeaders)) {
      rawOutput += `${k}: ${v}\n`;
    }

    document.getElementById("rawHeaders").textContent = rawOutput.trim();

  } catch (err) {
    document.getElementById("r-status").textContent = "Scan failed";
    document.getElementById("r-status").style.color = "#f59e0b";
    verdictBox.textContent =
      "⚠️ Scan could not be completed. The target may be blocking requests.";
    verdictBox.className = "verdict warn";
  }
});
