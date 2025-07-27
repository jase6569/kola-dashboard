const managerPIN = "2025";

// 🔓 Animate Sliding Doors on Load
window.addEventListener("DOMContentLoaded", () => {
  const doorLeft = document.getElementById("door-left");
  const doorRight = document.getElementById("door-right");

  setTimeout(() => {
    doorLeft.style.transform = "translateX(-100%)";
    doorRight.style.transform = "translateX(100%)";

    setTimeout(() => {
      doorLeft.style.display = "none";
      doorRight.style.display = "none";
    }, 1000);
  }, 500);

  const autoAccess = localStorage.getItem("kolaAccess");
  if (autoAccess) loginAs(autoAccess);
});

// 🔐 Login Handling
window.loginAs = function (role) {
  if (role === "manager") {
    const inputPin = document.getElementById("manager-pin").value;
    if (inputPin !== managerPIN) {
      document.getElementById("pin-error").style.display = "block";
      return;
    }
  }

  localStorage.setItem("kolaAccess", role);
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("dashboard").style.display = "block";

  if (role === "manager") {
    document.querySelectorAll(".manager-only").forEach(el => el.style.display = "block");
  }

  initializeDashboard();
};

// ✅ Tasks and Quiz Data
const tasks = {
  daily: [
    "Confirm daily event locations & staff assignments",
    "Check marketing kits in storage",
    "Schedule social media posts",
    "Check paid ad spend & status",
    "Receive staff photos/videos",
    "Submit daily media report",
    "Update stock inventory"
  ],
  weekly: [
    "Review upcoming event schedule",
    "Audit stock and reorder if needed",
    "Launch new event campaigns",
    "Segment & follow up leads",
    "Prepare weekly performance summary"
  ],
  leadTraining: [
    "Ask if they are planning an extension or new build",
    "Ask if planning permission is in place",
    "Ask estimated start time for project",
    "Ask if they are property owner",
    "Offer free design or quote appointment"
  ]
};

// ✅ Initialize Dashboard
function initializeDashboard() {
  renderTasks("daily-tasks", tasks.daily);
  renderTasks("weekly-tasks", tasks.weekly);
  renderTasks("lead-tasks", tasks.leadTraining);
  runQuiz();
  updateLeaderboard();
  updateActivityFeed();
  generateSmartInsights();

  document.getElementById("media-input")?.addEventListener("change", e => {
    const preview = document.getElementById("media-preview");
    [...e.target.files].forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = document.createElement("img");
        img.src = reader.result;
        img.classList.add("media-item");
        preview?.appendChild(img);
        logActivity(`📸 Media uploaded: ${file.name}`);
        updateLeaderboard();
        generateSmartInsights();
      };
      reader.readAsDataURL(file);
    });
  });

  document.getElementById("speak-insights")?.addEventListener("click", speakInsightsAloud);
}

// ✅ Render Checkbox Tasks
function renderTasks(id, list) {
  const ul = document.getElementById(id);
  if (!ul) return;
  ul.innerHTML = "";
  list.forEach((task, i) => {
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `${id}-task-${i}`;
    checkbox.checked = localStorage.getItem(checkbox.id) === "true";
    checkbox.addEventListener("change", () => {
      localStorage.setItem(checkbox.id, checkbox.checked);
      logActivity(`✔️ ${task} ticked`);
      updateLeaderboard();
      generateSmartInsights();
    });
    li.appendChild(checkbox);
    li.appendChild(document.createTextNode(task));
    ul.appendChild(li);
  });
}

// ✅ Activity Feed
function logActivity(text) {
  const feed = document.getElementById("activity-feed");
  if (!feed) return;
  const time = new Date().toLocaleTimeString();
  const entry = document.createElement("div");
  entry.textContent = `[${time}] ${text}`;
  feed.prepend(entry);
}

// ✅ Leaderboard (mock score)
function updateLeaderboard() {
  const percent = Math.floor(Math.random() * 100);
  document.getElementById("leaderboard").textContent = `✅ Completion Rate: ${percent}%`;
}

// ✅ AI Coach Insights (mock)
function generateSmartInsights() {
  const ai = document.getElementById("ai-insights");
  ai.textContent = "Staff completed more tasks on Wed & Fri. Boost Mon activity.";
}

// ✅ Voice Assistant (Manager)
function speakInsightsAloud() {
  const text = document.getElementById("ai-insights").textContent;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1;
  speechSynthesis.speak(utterance);
}

// ✅ KolaBot (Staff Chat Assistant)
window.handleChat = function () {
  const input = document.getElementById("chat-input");
  const log = document.getElementById("chat-log");
  const text = input.value.trim();
  if (!text) return;

  const reply = document.createElement("div");
  reply.textContent = `🤖 ${getBotReply(text)}`;
  log.appendChild(document.createElement("div")).textContent = `👤 ${text}`;
  log.appendChild(reply);
  input.value = "";

  const utter = new SpeechSynthesisUtterance(reply.textContent);
  speechSynthesis.speak(utter);
};

function getBotReply(text) {
  const t = text.toLowerCase();
  if (t.includes("resin")) return "Resin-bound driveways are low-maintenance and porous.";
  if (t.includes("properla")) return "ProPERLA is a waterproof coating for brick and render.";
  if (t.includes("quote")) return "Ask if they're planning a new build or extension.";
  return "I'm not sure yet, but I'm learning more each day!";
}

// ✅ Quiz Logic (simplified)
const quiz = [
  {
    q: "What is the first thing to ask on a resin enquiry?",
    a: ["Do they need planning permission?", "Do they own the property?", "Is it for a new build or extension?"],
    correct: 2
  },
  {
    q: "What does ProPERLA do?",
    a: ["Heats walls", "Seals surfaces from water", "Improves visibility"],
    correct: 1
  }
];

let quizIndex = 0;
window.runQuiz = function () {
  loadQuizQuestion();
  document.getElementById("quiz-next").onclick = () => {
    quizIndex = (quizIndex + 1) % quiz.length;
    loadQuizQuestion();
  };
};

function loadQuizQuestion() {
  const q = quiz[quizIndex];
  const qBox = document.getElementById("quiz-question");
  const options = document.getElementById("quiz-options");
  const scoreBox = document.getElementById("quiz-score");

  qBox.textContent = q.q;
  options.innerHTML = "";

  q.a.forEach((answer, i) => {
    const btn = document.createElement("button");
    btn.textContent = answer;
    btn.onclick = () => {
      if (i === q.correct) {
        scoreBox.textContent = "✅ Correct!";
      } else {
        scoreBox.textContent = "❌ Try again.";
      }
    };
    options.appendChild(btn);
  });
}

// ✅ Weekly reset logic (optional)
function updateActivityFeed() {
  logActivity("🟢 Dashboard loaded.");
}

















