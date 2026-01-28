const btn = document.getElementById("testBtn");
const frame = document.getElementById("testFrame");

btn.addEventListener("click", () => {
  const protocol = document.getElementById("protocol").value;
  const target = document.getElementById("target").value.trim();

  if (!target) return alert("Enter a valid domain");

  const url = protocol + target;

  document.getElementById("r-url").textContent = url;
  document.getElementById("r-status").textContent = "Testing…";

  frame.src = url;

  // Header detection via fetch (best-effort)
  fetch(url, { method: "HEAD", mode: "cors" })
    .then(res => {
      const xfo = res.headers.get("x-frame-options");
      const csp = res.headers.get("content-security-policy");

      document.getElementById("r-xfo").textContent =
        xfo ? xfo : "❌ Missing";

      document.getElementById("r-csp").textContent =
        csp && csp.includes("frame-ancestors")
          ? "✅ Present"
          : "❌ Missing";

      document.getElementById("r-status").textContent =
        (!xfo && !csp) ? "VULNERABLE" : "Partially / Not Vulnerable";
    })
    .catch(() => {
      document.getElementById("r-status").textContent =
        "Headers not accessible (CORS)";
    });
});
