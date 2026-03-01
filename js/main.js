document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");

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

  // --- 2. Donation Payment Tabs ---
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

  // --- 3. Click to Copy Feature ---
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

  // --- 4. Lightbox Modal (Gallery & Content) ---
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

  if (lightboxClose) {
    lightboxClose.addEventListener("click", () => {
      if (lightbox) {
        lightbox.classList.remove("active");
        lightbox.style.display = "none";
        document.body.style.overflow = "auto";
      }
    });
  }

  // --- 5. Program Detail Modal Content ---
  const programsData = {
    "education": {
      title: "Community Education",
      tagline: "Quality education as a catalyst for change",
      mission: "To provide essential educational support to orphans and underprivileged children, ensuring they have the tools and resources needed for a bright future.",
      impact: ["100 Students Supported", "92% Graduation Rate", "15+ Primary Schools Partnered", "98% Attendance Rate"],
      details: "Our education program covers more than just fees. We provide full uniforms, textbooks, writing materials, and after-school tutoring."
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
      mission: "To preserve Ugandan cultural heritage and provide a creative outlet for children to express joy and build confidence.",
      impact: ["350 Talents Nurtured", "24 Annual Performances", "Traditional dance training", "Regional sports success"],
      details: "Children learn traditional drums, dances, and competitive sports. These activities are vital for emotional healing and social integration."
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

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove("active");
      lightbox.style.display = "none";
      document.body.style.overflow = "auto";
    }
  }
});
