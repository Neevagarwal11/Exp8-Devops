
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const appointmentForm = document.getElementById("appointmentForm");
const formMessage = document.getElementById("formMessage");
const currentYear = document.getElementById("currentYear");
const releaseBadge = document.getElementById("releaseBadge");

// Keep the footer year current.
currentYear.textContent = new Date().getFullYear();

// Mobile navigation menu.
menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Open navigation"
  );
  menuToggle.textContent = isOpen ? "✕" : "☰";
});

// Close the mobile menu after selecting a section.
mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    menuToggle.textContent = "☰";
  });
});

// This is a frontend-only demonstration, not a real booking service.
appointmentForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!appointmentForm.reportValidity()) {
    return;
  }

  const formData = new FormData(appointmentForm);
  const firstName = String(formData.get("fullName")).trim().split(/\s+/)[0];
  const careType = formData.get("careType");

  formMessage.textContent =
    `Thanks, ${firstName}! Your demo request for ${careType} is ready. No real appointment was booked.`;

  appointmentForm.reset();
});

// Get the active release from the Express server.
// The same image can demonstrate two different releases in Kubernetes.
async function loadReleaseVersion() {
  try {
    const response = await fetch("/api/version", { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Version endpoint unavailable");
    }

    const release = await response.json();
    const isGreen = release.version.toLowerCase().startsWith("green");

    document.body.dataset.version = isGreen ? "green" : "blue";

    releaseBadge.textContent = isGreen
      ? "● GREEN RELEASE"
      : "● BLUE RELEASE";

    document.title = isGreen
      ? "CarePoint | Green Release"
      : "CarePoint | Blue Release";
  } catch (error) {
    // Default to Blue if the version endpoint cannot be reached.
    document.body.dataset.version = "blue";
    releaseBadge.textContent = "● BLUE RELEASE";
    console.error("Could not load deployment version:", error);
  }
}

loadReleaseVersion();

