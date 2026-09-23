// ИнструментБург — ремонт ИБП. Минимальный JS: трекинг кликов и год в подвале.

(function () {
  "use strict";

  // Год в подвале не зашиваем — чтобы не протухал.
  var copies = document.querySelectorAll(".footer__copy");
  if (copies.length) {
    var year = String(new Date().getFullYear());
    copies[0].textContent = "© " + year + " ИнструментБург";
  }

  // Отмечаем переходы наружу, чтобы видеть источник заявок.
  var external = document.querySelectorAll('a[href^="https://wa.me"], a[href^="tel:"]');
  external.forEach(function (link) {
    link.addEventListener("click", function () {
      var action = link.getAttribute("data-track") || (link.protocol === "tel:" ? "phone" : "whatsapp");
      if (window.gtag) {
        window.gtag("event", "generate_lead", { lead_type: action });
      }
      // Разметка для будущего подключения Яндекс.Метрики без внешнего скрипта.
      window.__ibpLead = (window.__ibpLead || []).concat([{ action: action, at: Date.now() }]);
    });
  });
})();
