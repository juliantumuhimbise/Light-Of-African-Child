document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and initialized");

  // --- 0. Theme Engine (Light / Dark Mode Sliding Toggle) ---
  const themeSwitchCheckbox = document.querySelector("#theme-switch-checkbox");
  const savedTheme = localStorage.getItem("lacu-theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const currentTheme = savedTheme || (systemPrefersDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", currentTheme);

  if (themeSwitchCheckbox) {
    themeSwitchCheckbox.checked = currentTheme === "dark";
    themeSwitchCheckbox.addEventListener("change", (e) => {
      const newTheme = e.target.checked ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("lacu-theme", newTheme);
    });
  }

  // --- 1. Accessible Mobile Menu ---
  const mobileBtn = document.querySelector(".mobile-menu-btn");
  const navLinks = document.querySelector(".nav-links");

  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener("click", () => {
      const isExpanded = mobileBtn.getAttribute("aria-expanded") === "true";
      mobileBtn.setAttribute("aria-expanded", !isExpanded);
      navLinks.classList.toggle("active");
    });

    // Close menu when a link is clicked
    const navItems = navLinks.querySelectorAll("a");
    navItems.forEach(link => {
      link.addEventListener("click", () => {
        mobileBtn.setAttribute("aria-expanded", "false");
        navLinks.classList.remove("active");
      });
    });
  }

  // --- 2. Scroll Reveal & Number Counter Animations ---
  const revealElements = document.querySelectorAll(".reveal-on-scroll");
  const counterElements = document.querySelectorAll(".snapshot-number, .impact-number");

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => revealObserver.observe(el));

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterElements.forEach(el => counterObserver.observe(el));

  function animateCounter(counterEl) {
    const rawText = counterEl.innerText.trim();
    const numericMatch = rawText.match(/(\d+)/);
    if (!numericMatch) return;

    const targetNum = parseInt(numericMatch[0], 10);
    const suffix = rawText.replace(numericMatch[0], "");
    const duration = 1600;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic function
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easeProgress * targetNum);

      counterEl.innerText = `${currentVal}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        counterEl.innerText = rawText;
      }
    }

    requestAnimationFrame(step);
  }

  // --- 3. Donation Payment Tabs ---
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      if (!targetId) return;

      tabBtns.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      tabPanels.forEach((p) => p.classList.add("hidden"));

      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.remove("hidden");
      }
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
        el.style.color = "#10b981";
        
        setTimeout(() => {
          el.innerText = originalText;
          el.style.color = "";
        }, 2000);
      });
    });
  });

  // --- 5. Lightbox Modal ---
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxClose = document.querySelector(".lightbox-close");
  
  const contentImages = document.querySelectorAll("main img:not(.hero-logo):not(.process-image img)");

  contentImages.forEach((img) => {
    img.style.cursor = "pointer";
    img.addEventListener("click", (e) => {
      if (lightbox) {
        e.stopPropagation();
        lightbox.classList.add("active");
        lightbox.style.display = "flex";
        if (lightboxImg) lightboxImg.src = img.src;
        if (lightboxImg) lightboxImg.alt = img.alt;
        if (lightboxCaption) lightboxCaption.innerText = img.alt || "Image Detail";
        document.body.style.overflow = "hidden";
      }
    });
  });

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove("active");
      lightbox.style.display = "none";
      document.body.style.overflow = "auto";
    }
  }

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  // --- 6. Program Detail Modal Content ---
  const programsData = {
    "education": {
      title: "Education Programs",
      tagline: "Quality education as a catalyst for change",
      mission: "To help children stay in school and build a better future through education by providing materials, scholarships, and learning opportunities.",
      impact: ["100 Students Supported", "92% Graduation Rate", "15+ Primary Schools Partnered", "98% Attendance Rate"],
      details: "We support underprivileged children by providing educational materials, scholarships, and community learning opportunities."
    },
    "shelter": {
      title: "Safe Shelter Project",
      tagline: "Secure, family-style residential facilities",
      mission: "To create a loving, stable environment where orphaned children can grow up with the safety and care they deserve.",
      impact: ["8 Shelters Built", "180 Children Housed", "24 Trained Caregivers", "100% Safe Environment"],
      details: "Our shelter project focuses on 'family units.' Each house has a dedicated, trained caregiver who provides personalized emotional support."
    },
    "skills": {
      title: "Skill Development & Vocational Training",
      tagline: "Practical training for self-reliance",
      mission: "Empowering young adults and people with disabilities with hands-on skills to break the cycle of poverty.",
      impact: ["75% Job Placement Rate", "250+ Graduates", "4 Main Tracks", "PWD Inclusive Programs"],
      details: "We provide 'start-up kits' for our top graduates, including sewing machines or tools, allowing them to open their own small businesses immediately."
    },
    "health": {
      title: "Health Awareness Campaign",
      tagline: "Protecting communities through preventative education",
      mission: "To improve community well-being by providing accessible health screenings and life-saving health education.",
      impact: ["2,500 Screenings in 2025", "150+ Consultations", "85% Immunization Rate", "Weekly Radio Talks"],
      details: "Our campaigns focus on HIV/AIDS awareness, malaria prevention, and maternal health, partnering with local clinics for free screenings."
    },
    "nutrition": {
      title: "Food & Nutrition Program",
      tagline: "Ensuring every child has access to healthy meals",
      mission: "To eliminate childhood malnutrition by providing balanced, nutrient-rich meals to every child in our care.",
      impact: ["100+ Children Fed Daily", "Balanced Meal Planning", "Zero malnutrition cases", "Supplementary nutrition"],
      details: "We operate a central kitchen that sources ingredients from local farmers. Our menu is designed by nutritionists for healthy child development."
    },
    "talent": {
      title: "Community Talent Development",
      tagline: "Nurturing spirits through dance, music, and sports",
      mission: "To help nurture talents by creating platforms where children can express their creativity and develop their skills.",
      impact: ["350 Talents Nurtured", "24 Annual Performances", "Traditional dance training", "Regional sports success"],
      details: "Many children have talents that often go unnoticed due to a lack of opportunities. We create platforms for creative expression."
    },
    "environment": {
      title: "Environmental Conservation",
      tagline: "Protecting resources through sustainable action",
      mission: "To teach the next generation environmental stewardship through tree planting and sustainable agricultural practices.",
      impact: ["5,000 Trees Planted", "450 Families involved", "3 School gardens", "10 Community clean-ups"],
      details: "Our 'Green Schools' initiative involves students in planting fruit trees which provide shade and future food security for the community."
    },
    "discrimination": {
      title: "Anti-Discrimination Initiative",
      tagline: "Creating inclusive, accepting communities",
      mission: "To advocate for equality and protect the rights of children regardless of background or physical ability.",
      impact: ["85 Trained Advocates", "10+ Community Dialogues", "Legal support provided", "100% Inclusive policy"],
      details: "We fight against the stigma surrounding disability and HIV/AIDS through community workshops and dialogue with local leaders."
    },
    "clothing": {
      title: "Clothing Donations",
      tagline: "Basic needs support for vulnerable families",
      mission: "To provide clothing and other necessities to families and children in need with support from well-wishers and community members.",
      impact: ["500+ Items Distributed", "100+ Families Supported", "Community Collection Drives", "Essential Care Packages"],
      details: "We collect and distribute quality clothing, shoes, and bedding to children who lack these basic necessities, ensuring they can attend school with dignity and stay healthy."
    }
  };

  const programModal = document.getElementById("program-modal");
  const pmImage = document.getElementById("pm-image");
  const pmTitle = document.getElementById("pm-title");
  const pmTagline = document.getElementById("pm-tagline");
  const pmMission = document.getElementById("pm-mission");
  const pmImpact = document.getElementById("pm-impact");
  const pmDetails = document.getElementById("pm-details");
  const pmClose = document.querySelector(".program-modal-close");
  const pmCloseBtn = document.querySelector(".pm-close-btn");

  const programArticles = document.querySelectorAll(".process-item");

  programArticles.forEach((article) => {
    article.addEventListener("click", () => {
      const programKey = article.getAttribute("data-program");
      const data = programsData[programKey];

      if (data && programModal) {
        if (pmTitle) pmTitle.innerText = data.title;
        if (pmImage) pmImage.src = article.querySelector("img").src;
        if (pmTagline) pmTagline.innerText = data.tagline;
        if (pmMission) pmMission.innerText = data.mission;
        if (pmDetails) pmDetails.innerText = data.details;

        if (pmImpact) {
          pmImpact.innerHTML = "";
          data.impact.forEach(item => {
            const li = document.createElement("li");
            li.innerText = item;
            pmImpact.appendChild(li);
          });
        }

        programModal.classList.add("active");
        programModal.style.display = "flex";
        document.body.style.overflow = "hidden";
      }
    });
  });

  const closeProgramModal = () => {
    if (programModal) {
      programModal.classList.remove("active");
      programModal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  };

  if (pmClose) pmClose.addEventListener("click", closeProgramModal);
  if (pmCloseBtn) pmCloseBtn.addEventListener("click", closeProgramModal);
  
  if (programModal) {
    programModal.addEventListener("click", (e) => {
      if (e.target === programModal) closeProgramModal();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeLightbox();
      closeProgramModal();
    }
  });

  // --- 7. Form Submission Handlers ---
  const handleFormSubmission = (form, messageElement, successMsg) => {
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString(),
      })
        .then(() => {
          if (messageElement) {
            messageElement.innerText = successMsg;
            messageElement.style.color = "#10b981";
            messageElement.style.display = "block";
          }
          form.reset();
        })
        .catch((error) => {
          console.error("Form submission error:", error);
          if (messageElement) {
            messageElement.innerText = "Submission failed. Please try again.";
            messageElement.style.color = "#ef4444";
            messageElement.style.display = "block";
          }
        });
    });
  };

  const contactForm = document.querySelector(".contact-form form");
  const contactMsg = document.querySelector("#contact-message");
  handleFormSubmission(contactForm, contactMsg, "Thank you! Your message has been sent successfully.");

  const newsletterForm = document.querySelector(".newsletter-form");
  const newsletterMsg = document.querySelector("#newsletter-message");
  handleFormSubmission(newsletterForm, newsletterMsg, "Thank you for subscribing!");
});
