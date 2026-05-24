const WEDDING = {
  couple: "Mr Jefferey & Ms Ying Shya",
  date: "Tuesday, 15 September 2026",
  venue: "No 18 Jalan Gamelan 3, Bandar Bukit Raja",
  eventDate: "2026-09-15T19:30:00+08:00",
  hostWhatsAppNumber: "60132321896",
};

const storageKey = "jeffWeddingRsvpResponses";
const rsvpForm = document.querySelector("#rsvpForm");
const formNote = document.querySelector("#formNote");
const responsesBody = document.querySelector("#responsesBody");
const emptyState = document.querySelector("#emptyState");
const downloadCsv = document.querySelector("#downloadCsv");
const clearResponses = document.querySelector("#clearResponses");
const totalGuests = document.querySelector("#totalGuests");
const totalReplies = document.querySelector("#totalReplies");
const musicButton = document.querySelector("#musicButton");

let audio;

function getResponses() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } catch {
    return [];
  }
}

function saveResponses(responses) {
  localStorage.setItem(storageKey, JSON.stringify(responses));
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-MY", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function renderResponses() {
  const responses = getResponses();
  const pax = responses.reduce((sum, response) => sum + Number(response.count || 0), 0);

  responsesBody.innerHTML = "";
  emptyState.hidden = responses.length > 0;
  totalGuests.textContent = pax;
  totalReplies.textContent = responses.length;

  for (const response of responses) {
    const item = document.createElement("article");
    item.className = "response-item";
    item.innerHTML = `
      <strong>${escapeHtml(response.name)} <span>${response.count} pax</span></strong>
      <p>${escapeHtml(response.message || "No message")}</p>
      <time>${formatDate(response.createdAt)}</time>
    `;
    responsesBody.append(item);
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildWhatsAppUrl(response) {
  const lines = [
    `Hi, I want to RSVP for ${WEDDING.couple}'s wedding.`,
    `Name: ${response.name}`,
    `People coming: ${response.count}`,
    `Date: ${WEDDING.date}`,
    `Venue: ${WEDDING.venue}`,
  ];

  if (response.message) {
    lines.push(`Message: ${response.message}`);
  }

  return `https://wa.me/${WEDDING.hostWhatsAppNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
}

function downloadResponsesCsv() {
  const responses = getResponses();
  const header = ["Name", "Pax", "Message", "Submitted At"];
  const rows = responses.map((response) => [
    response.name,
    response.count,
    response.message || "",
    new Date(response.createdAt).toISOString(),
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "wedding-rsvp-responses.csv";
  link.click();
  URL.revokeObjectURL(link.href);
}

function updateCountdown() {
  const target = new Date(WEDDING.eventDate).getTime();
  const difference = Math.max(0, target - Date.now());
  const seconds = Math.floor(difference / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  document.querySelector("#days").textContent = days;
  document.querySelector("#hours").textContent = hours;
  document.querySelector("#minutes").textContent = minutes;
  document.querySelector("#seconds").textContent = remainingSeconds;
}

function toggleMusic() {
  if (!audio) {
    audio = new Audio("https://cdn.pixabay.com/audio/2024/08/30/audio_d0c6ff1ee5.mp3");
    audio.loop = true;
    audio.volume = 0.34;
  }

  if (audio.paused) {
    audio.play();
    musicButton.classList.add("is-playing");
    return;
  }

  audio.pause();
  musicButton.classList.remove("is-playing");
}

rsvpForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(rsvpForm);
  const response = {
    name: String(formData.get("guestName")).trim(),
    count: Number(formData.get("guestCount")),
    message: String(formData.get("guestMessage")).trim(),
    createdAt: new Date().toISOString(),
  };

  if (!response.name || !Number.isFinite(response.count) || response.count < 1) {
    formNote.textContent = "Please enter your name and number of people coming.";
    return;
  }

  const responses = getResponses();
  responses.unshift(response);
  saveResponses(responses);
  renderResponses();

  formNote.textContent = "Opening WhatsApp now. Please press send there.";
  window.open(buildWhatsAppUrl(response), "_blank", "noopener");
  rsvpForm.reset();
  document.querySelector("#guestCount").value = 1;
});

downloadCsv.addEventListener("click", downloadResponsesCsv);

clearResponses.addEventListener("click", () => {
  if (!confirm("Clear all local RSVP responses on this device?")) {
    return;
  }

  saveResponses([]);
  renderResponses();
});

musicButton.addEventListener("click", toggleMusic);

renderResponses();
updateCountdown();
setInterval(updateCountdown, 1000);
