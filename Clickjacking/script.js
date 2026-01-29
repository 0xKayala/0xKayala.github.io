const btn = document.getElementById("testBtn");
const frame = document.getElementById("testFrame");

const API_URL = "https://api.0xkayala.com/api/scan";

btn.addEventListener("click", async () => {
  const protocol = document.getElementById("protocol").value;
  const target = document.getElementById("target").value.trim();

  if (!target) {
    alert("Enter a valid domain");
    return;
  }

  const url = protocol + target;

  /* --------------------
     UI PRE-STATE
  -------------------- */
  document.getElementById("r-url").textContent = url;
  document.getElementById("r-status").textContent = "Testing…";
  document.getElementById("r-xfo").textContent = "-";
  document.getElementById("r-csp").textContent = "-";
  document.getElementById("rawHeaders").textContent = "-";

  const verdictBox = document.getElementById("verdict");
  verdictBox.className = "verdict hidden";
  verdictBox.textContent = "";

  /* --------------------
     LOAD IFRAME (PoC)
  -------------------- */
  frame.src = url;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url })
    });

    if (!response.ok) {
      throw new Error("API error");
    }

    const data = await response.json();

    /* --------------------
       X-Frame-Options
    -------------------- */
    document.getElementById("r-xfo").textContent =
      data.x_frame_options ? data.x_frame_options : "❌ Missing";

    /* --------------------
       CSP frame-ancestors
    -------------------- */
    document.getElementById("r-csp").textContent =
      data.frame_ancestors ? data.frame_ancestors : "❌ Missing";

    /* --------------------
       STATUS + VERDICT
    -------------------- */
    const statusEl = document.getElementById("r-status");

    if (data.vulnerable) {
      statusEl.textContent = "VULNERABLE";
      statusEl.style.color = "red";

      verdictBox.textContent =
        "❌ This site is vulnerable to Clickjacking (UI Redressing) attack";
      verdictBox.className = "verdict vuln";
    } else {
      statusEl.textContent = "SAFE";
      statusEl.style.color = "green";

      verdictBox.textContent =
        "✅ This site is protected against Clickjacking attacks";
      verdictBox.className = "verdict safe";
    }

    /* --------------------
       RAW HTTP HEADERS
    -------------------- */
    document.getElementById("rawHeaders").textContent =
      JSON.stringify(data.raw_headers, null, 2);

  } catch (err) {
    document.getElementById("r-status").textContent =
      "Scan failed (API unreachable)";
    document.getElementById("r-status").style.color = "orange";

    const verdictBox = document.getElementById("verdict");
    verdictBox.textContent =
      "⚠️ Scan could not be completed. The target may be blocking requests.";
    verdictBox.className = "verdict warn";

    console.error(err);
  }
});
