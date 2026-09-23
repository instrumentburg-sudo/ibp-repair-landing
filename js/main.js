// ИнструментБург — ремонт ИБП. Минимальный JS: отметка целевых действий.
// Без внешних скриптов и счётчиков — чтобы страница не зависела от третьих сторон.

(function () {
  "use strict";

  // Отмечаем переходы наружу, чтобы видеть источник заявок.
  var leads = document.querySelectorAll('a[href^="https://wa.me"], a[href^="tel:"]');

  leads.forEach(function (link) {
    link.addEventListener("click", function () {
      var action =
        link.getAttribute("data-track") ||
        (link.protocol === "tel:" ? "phone" : "whatsapp");

      if (window.gtag) {
        window.gtag("event", "generate_lead", { lead_type: action });
      }

      // Готовая точка подключения Яндекс.Метрики без загрузки внешнего скрипта.
      window.__ibpLead = (window.__ibpLead || []).concat([
        { action: action, at: Date.now() }
      ]);
    });
  });
})();
