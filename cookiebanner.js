/*
  Stuurjij. Cookiebanner
  ----------------------
  Hoe te gebruiken:
  1. Upload dit bestand als cookiebanner.js naar de root van je repository
     (dus naast index.html, niet in een submap).
  2. Voeg op ELKE pagina, vlak voor de afsluitende </body> tag, deze regel toe:

     <script src="/cookiebanner.js"></script>

  Dat is alles. De banner verschijnt automatisch bij een nieuw bezoek en
  onthoudt de keuze van de bezoeker (via localStorage) voor 6 maanden.
  Analytics (Google Analytics) wordt pas geladen NADAT iemand op "Accepteren"
  heeft geklikt. Bij "Alleen noodzakelijk" wordt Analytics niet geladen.
*/

(function () {
  const CONSENT_KEY = "stuurjij_cookie_consent";
  const CONSENT_DAYS = 180;

  function getConsent() {
    try {
      const raw = localStorage.getItem(CONSENT_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      const expired = Date.now() - data.timestamp > CONSENT_DAYS * 24 * 60 * 60 * 1000;
      return expired ? null : data.value;
    } catch (e) {
      return null;
    }
  }

  function setConsent(value) {
    try {
      localStorage.setItem(
        CONSENT_KEY,
        JSON.stringify({ value: value, timestamp: Date.now() })
      );
    } catch (e) {
      /* localStorage niet beschikbaar, banner verschijnt dan elke keer opnieuw */
    }
  }

  function loadAnalytics() {
    // Vervang G-XXXXXXXXXX hieronder door je eigen Google Analytics Measurement ID
    const GA_ID = "G-XXXXXXXXXX";
    if (document.getElementById("ga-script")) return;

    const s1 = document.createElement("script");
    s1.id = "ga-script";
    s1.async = true;
    s1.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(s1);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", GA_ID);
    window.gtag = gtag;
  }

  function buildBanner() {
    const wrapper = document.createElement("div");
    wrapper.id = "stuurjij-cookiebanner";
    wrapper.style.cssText = [
      "position:fixed",
      "left:0",
      "right:0",
      "bottom:0",
      "z-index:9999",
      "background:#0b0b0d",
      "border-top:1px solid #26262b",
      "padding:20px",
      "font-family:'DM Sans', sans-serif",
      "color:#EDEDEF",
      "box-shadow:0 -4px 20px rgba(0,0,0,0.4)",
    ].join(";");

    wrapper.innerHTML = `
      <div style="max-width:900px;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;gap:16px;justify-content:space-between;">
        <p style="margin:0;flex:1;min-width:240px;font-size:0.9rem;line-height:1.5;">
          Stuurjij. gebruikt cookies voor bezoekstatistieken (Google Analytics) en om affiliate-links correct te laten werken.
          Lees meer in ons <a href="/privacybeleid.html" style="color:#FAC775;">privacybeleid</a>.
        </p>
        <div style="display:flex;gap:10px;flex-shrink:0;">
          <button id="stuurjij-cookie-necessary" style="background:transparent;border:1px solid #A6A6AC;color:#EDEDEF;padding:10px 16px;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:0.85rem;cursor:pointer;">
            Alleen noodzakelijk
          </button>
          <button id="stuurjij-cookie-accept" style="background:#FAC775;border:none;color:#0b0b0d;padding:10px 16px;border-radius:8px;font-family:'DM Sans',sans-serif;font-weight:600;font-size:0.85rem;cursor:pointer;">
            Accepteren
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(wrapper);

    document.getElementById("stuurjij-cookie-accept").addEventListener("click", function () {
      setConsent("accepted");
      loadAnalytics();
      wrapper.remove();
    });

    document.getElementById("stuurjij-cookie-necessary").addEventListener("click", function () {
      setConsent("necessary-only");
      wrapper.remove();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    const consent = getConsent();
    if (consent === "accepted") {
      loadAnalytics();
    } else if (consent === null) {
      buildBanner();
    }
    // Bij "necessary-only" wordt Analytics simpelweg niet geladen, geen actie nodig.
  });
})();
