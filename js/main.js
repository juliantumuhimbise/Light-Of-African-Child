document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Accessible Mobile Menu ---
  const mobileBtn = document.querySelector(".mobile-menu-btn");
  const navLinks = document.querySelector(".nav-links");

  mobileBtn.addEventListener("click", () => {
    const isExpanded = mobileBtn.getAttribute("aria-expanded") === "true";
    mobileBtn.setAttribute("aria-expanded", !isExpanded);
    navLinks.classList.toggle("active");
  });

  // --- 2. Donation Payment Tabs (MoMo vs Bank) ---
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      if (!targetId) return;

      // Deactivate all
      tabBtns.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      tabPanels.forEach((p) => p.classList.add("hidden"));

      // Activate clicked
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.remove("hidden");
      }
    });
  });

  // --- 3. Amount Button Selection ---
  const amountBtns = document.querySelectorAll(".amount-btn");
  amountBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // Find siblings within the same tab panel to remove active state
      const siblings = e.target
        .closest(".preset-amounts")
        .querySelectorAll(".amount-btn");
      siblings.forEach((b) => b.classList.remove("active"));

      // Set current to active
      e.target.classList.add("active");
    });
  });

  // --- 4. Click to Copy Feature ---
  const copyableElements = document.querySelectorAll(".momo-number, .bank-value");
  copyableElements.forEach((el) => {
    el.style.cursor = "pointer";
    el.title = "Click to copy";
    
    el.addEventListener("click", () => {
      const text = el.innerText;
      navigator.clipboard.writeText(text).then(() => {
        const originalText = el.innerText;
        el.innerText = "Copied!";
        el.style.color = "#10b981"; // Success green
        
        setTimeout(() => {
          el.innerText = originalText;
          el.style.color = "";
        }, 2000);
      });
    });
  });
});
