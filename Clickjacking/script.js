const btn = document.getElementById("testBtn");
const frame = document.getElementById("testFrame");

const API_URL = "https://api.0xkayala.com";

btn.addEventListener("click", async () => {
  const protocol = document.getElementById("protocol").value;
  const target = document.getElementById("target").value.trim();

  if (!target) {
    alert("Enter a valid domain");
    return;
  }

  const url = protocol + target;

  // UI pre-state
  document.getElementById("r-url").textContent = url;
  document.getElementById("r-status").textContent = "Testing…";
  document.getElementById("r-xfo").textContent = "-";
  document.getElementById("r-csp").textContent = "-";

  // Load iframe (visual PoC)
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

    // X-Frame-Options
    document.getElementById("r-xfo").textContent =
      data.x_frame_options
        ? data.x_frame_options
        : "❌ Missing";

    // CSP frame-ancestors
    document.getElementById("r-csp").textContent =
      data.csp && data.csp.toLowerCase().includes("frame-ancestors")
        ? "✅ Present"
        : "❌ Missing";

    // Final status
    const statusEl = document.getElementById("r-status");

    if (data.vulnerable) {
      statusEl.textContent = "❌ VULNERABLE TO CLICKJACKING";
      statusEl.style.color = "red";
    } else {
      statusEl.textContent = "✅ NOT VULNERABLE";
      statusEl.style.color = "green";
    }

  } catch (err) {
    document.getElementById("r-status").textContent =
      "Scan failed (API unreachable)";
  }
});
