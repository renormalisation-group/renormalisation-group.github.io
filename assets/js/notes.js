document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".notes-month-tab");
  const panels = document.querySelectorAll(".notes-month-panel");

  if (!tabs.length || !panels.length) {
    return;
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      const month = tab.dataset.month;

      tabs.forEach(function (otherTab) {
        const selected = otherTab === tab;

        otherTab.setAttribute(
          "aria-selected",
          selected ? "true" : "false"
        );

        otherTab.setAttribute(
          "tabindex",
          selected ? "0" : "-1"
        );
      });

      panels.forEach(function (panel) {
        panel.hidden = panel.dataset.month !== month;
      });
    });
  });

  tabs.forEach(function (tab, index) {
    tab.addEventListener("keydown", function (event) {
      let newIndex = null;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        newIndex = (index + 1) % tabs.length;
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        newIndex = (index - 1 + tabs.length) % tabs.length;
      }

      if (newIndex !== null) {
        event.preventDefault();
        tabs[newIndex].focus();
        tabs[newIndex].click();
      }
    });
  });
});