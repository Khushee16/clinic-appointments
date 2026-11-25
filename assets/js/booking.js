// BrightSmile Dental Care — appointment booking form
// Posts to appointment.php when a PHP backend is available.
// On static hosting (or file://) the fetch fails, so we show a clearly
// labelled DEMO success state instead of pretending a booking was saved.
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("booking-form");
  if (!form) return;

  const resultBox = document.getElementById("booking-result");
  const submitBtn = form.querySelector('button[type="submit"]');

  // Time-slot picker: single-select pill buttons synced to a hidden input
  const slotInput = document.getElementById("time");
  document.querySelectorAll("[data-slot]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-slot]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      slotInput.value = btn.dataset.slot;
    });
  });

  // Don't allow past dates
  const dateInput = document.getElementById("date");
  if (dateInput) dateInput.min = new Date().toISOString().split("T")[0];

  // Prefill treatment / doctor from query string, e.g. booking.html?treatment=Cleaning&doctor=dr-chen
  const params = new URLSearchParams(window.location.search);
  const preTreatment = params.get("treatment");
  const preDoctor = params.get("doctor");
  if (preTreatment) {
    const t = document.getElementById("treatment");
    if (t && [...t.options].some((o) => o.value === preTreatment)) t.value = preTreatment;
  }
  if (preDoctor) {
    const d = document.getElementById("doctor");
    if (d && [...d.options].some((o) => o.value === preDoctor)) d.value = preDoctor;
  }

  const showResult = (html, kind) => {
    resultBox.className = `alert alert-${kind} mt-4`;
    resultBox.innerHTML = html;
    resultBox.classList.remove("d-none");
    resultBox.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }
    if (!slotInput.value) {
      showResult("<strong>Please pick a time slot</strong> — choose one of the times above.", "warning");
      return;
    }

    const payload = new FormData(form);
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Booking…';

    try {
      const res = await fetch("appointment.php", { method: "POST", body: payload });
      if (!res.ok) throw new Error("Backend unavailable");
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Booking rejected");

      // Real backend confirmation
      showResult(
        `<h5 class="alert-heading">✓ Appointment confirmed!</h5>
         <p class="mb-1">Thank you, <strong>${escapeHtml(data.name)}</strong>. Your <strong>${escapeHtml(data.treatment)}</strong>
         appointment is booked for <strong>${escapeHtml(data.date)}</strong> at <strong>${escapeHtml(data.time)}</strong>.</p>
         <p class="mb-0">Reference: <code>${escapeHtml(data.reference)}</code> — please bring it to your visit.</p>`,
        "success"
      );
      form.reset();
      document.querySelectorAll("[data-slot]").forEach((b) => b.classList.remove("active"));
    } catch (err) {
      // No PHP backend reachable (static hosting / file://) — honest demo state.
      const name = payload.get("name");
      const treatment = payload.get("treatment");
      const date = payload.get("date");
      const time = payload.get("time");
      showResult(
        `<h5 class="alert-heading">✓ Demo mode — request previewed, not saved</h5>
         <p class="mb-1"><strong>No backend is connected</strong> on this static demo, so nothing was stored.
         On a PHP host this same form saves the booking and returns a confirmation reference.</p>
         <p class="mb-0">Your request: <strong>${escapeHtml(treatment)}</strong> on
         <strong>${escapeHtml(date)}</strong> at <strong>${escapeHtml(time)}</strong> for
         <strong>${escapeHtml(name)}</strong>.</p>`,
        "info"
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Book appointment";
    }
  });

  function escapeHtml(str) {
    return String(str ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }
});
