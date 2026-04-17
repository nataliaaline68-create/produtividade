let time = 1500;
let timerInterval;

// TIMER
function startTimer() {
  if (timerInterval) return;

  timerInterval = setInterval(() => {
    time--;

    let min = Math.floor(time / 60);
    let sec = time % 60;

    timer.innerText = `${min}:${sec < 10 ? "0" : ""}${sec}`;

    if (time <= 0) {
      clearInterval(timerInterval);
      alert("⏱ Sessão concluída!");
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  time = 1500;
  timer.innerText = "25:00";
}

// METAS
function addMeta() {
  if (!metaInput.value) return;

  const li = document.createElement("li");
  li.textContent = "✔ " + metaInput.value;

  li.onclick = () => {
    li.style.textDecoration = "line-through";
    li.style.opacity = "0.5";
  };

  metaList.appendChild(li);
  metaInput.value = "";
}

// SALVAR COM SISTEMA INTELIGENTE
function saveDiary() {
  const date = dateInput.value;

  const data = {
    q1: q1.value,
    q2: q2.value,
    q3: q3.value,
    q4: q4.value,
    summary: summary.value,
    level: 0,
    nextReview: getNextReview(0)
  };

  localStorage.setItem("diary-" + date, JSON.stringify(data));
  alert("💾 Salvo!");
}

// LÓGICA DE REVISÃO
function getNextReview(level) {
  const days = [1, 3, 7, 15];
  const now = new Date();

  now.setDate(now.getDate() + days[level]);
  return now.toISOString().split("T")[0];
}

// CARREGAR REVISÕES
function loadReviews() {
  const today = new Date().toISOString().split("T")[0];
  reviewList.innerHTML = "";

  for (let key in localStorage) {
    if (key.startsWith("diary-")) {
      const data = JSON.parse(localStorage.getItem(key));

      if (data.nextReview <= today) {
        const li = document.createElement("li");

        li.innerHTML = `
          📌 ${data.summary || "Sem resumo"}
          <br><button onclick="reviewItem('${key}')">Revisado</button>
        `;

        reviewList.appendChild(li);
      }
    }
  }
}

// MARCAR COMO REVISADO
function reviewItem(key) {
  const data = JSON.parse(localStorage.getItem(key));

  data.level = Math.min(data.level + 1, 3);
  data.nextReview = getNextReview(data.level);

  localStorage.setItem(key, JSON.stringify(data));

  loadReviews();
}

// TEMA
function toggleTheme() {
  document.body.classList.toggle("light");
}

loadReviews();
