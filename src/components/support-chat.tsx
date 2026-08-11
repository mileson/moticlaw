export function SupportChat() {
  const websiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;
  if (!websiteId) return null;

  const loader = `
    (function () {
      var loaded = false;
      function loadCrisp() {
        if (loaded) return;
        loaded = true;
        window.$crisp = window.$crisp || [];
        window.CRISP_WEBSITE_ID = ${JSON.stringify(websiteId)};
        var s = document.createElement("script");
        s.src = "https://client.crisp.chat/l.js";
        s.async = true;
        document.head.appendChild(s);
      }
      if ("requestIdleCallback" in window) {
        requestIdleCallback(loadCrisp, { timeout: 8000 });
      } else {
        setTimeout(loadCrisp, 5000);
      }
      ["pointerdown", "keydown", "touchstart"].forEach(function (evt) {
        window.addEventListener(evt, loadCrisp, { once: true, passive: true });
      });
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: loader }} />;
}
