const chips = document.querySelectorAll(".chip");
const customBet = document.getElementById("customBet");

const matchBtn = document.getElementById("matchBtn");
const matchStatus = document.getElementById("matchStatus");
const matchCard = document.getElementById("matchCard");
const opponentId = document.getElementById("opponentId");
const routeSim = document.getElementById("routeSim");
const eta = document.getElementById("eta");

const yourScoreEl = document.getElementById("yourScore");
const oppScoreEl = document.getElementById("oppScore");
const yourPassesEl = document.getElementById("yourPasses");
const oppPassesEl = document.getElementById("oppPasses");

const simulateBtn = document.getElementById("simulateBtn");
const finishBtn = document.getElementById("finishBtn");

const rewardUse = document.getElementById("rewardUse");
const winnerText = document.getElementById("winnerText");
const rewardText = document.getElementById("rewardText");
const rewardNote = document.getElementById("rewardNote");

const stars = document.querySelectorAll(".star");
const reviewStatus = document.getElementById("reviewStatus");

let bet = null;
let matched = false;
let finished = false;

let yourPasses = 0;
let oppPasses = 0;

function setBet(value) {
  bet = value;
  matchBtn.disabled = !(bet > 0);
  matchStatus.textContent = bet > 0
    ? `Bet selected: $${bet}. Ready to find an opponent.`
    : "Select a bet to enable matchmaking.";
}

chips.forEach(btn => {
  btn.addEventListener("click", () => {
    chips.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    customBet.value = "";
    setBet(Number(btn.dataset.bet));
  });
});

customBet.addEventListener("input", () => {
  chips.forEach(b => b.classList.remove("active"));
  const v = Number(customBet.value);
  setBet(v > 0 ? Math.floor(v) : null);
});

function resetGame() {
  matched = false;
  finished = false;
  yourPasses = 0;
  oppPasses = 0;

  yourScoreEl.textContent = "0";
  oppScoreEl.textContent = "0";
  yourPassesEl.textContent = "0 ScreenPlay cars passed";
  oppPassesEl.textContent = "0 ScreenPlay cars passed";

  matchCard.style.display = "none";
  simulateBtn.disabled = true;
  finishBtn.disabled = true;

  rewardUse.disabled = true;
  winnerText.textContent = "Finish the ride to see results.";
  winnerText.classList.add("muted");
  rewardText.textContent = "—";
  rewardText.classList.add("muted");
  rewardNote.textContent = "—";
  rewardNote.classList.add("muted");

  stars.forEach(s => { s.disabled = true; s.classList.remove("active"); });
  reviewStatus.textContent = "Finish the ride to unlock review.";
}

resetGame();

matchBtn.addEventListener("click", async () => {
  if (!bet || bet <= 0) return;

  resetGame();
  matchBtn.disabled = true;
  matchStatus.textContent = "Searching for an opponent…";

  // Simulate matchmaking delay
  await new Promise(r => setTimeout(r, 900));

  matched = true;
  matchCard.style.display = "block";
  opponentId.textContent = `SP-${Math.floor(100000 + Math.random() * 900000)}`;
  routeSim.textContent = `${Math.floor(82 + Math.random() * 16)}% similar`;
  eta.textContent = `${Math.floor(8 + Math.random() * 18)} min`;

  matchStatus.textContent = "Match found. Start earning points!";
  simulateBtn.disabled = false;
  finishBtn.disabled = false;
});

simulateBtn.addEventListener("click", () => {
  if (!matched || finished) return;

  // Each click simulates passing 0-3 ScreenPlay cars
  const yourDelta = Math.floor(Math.random() * 4);
  const oppDelta = Math.floor(Math.random() * 4);

  yourPasses += yourDelta;
  oppPasses += oppDelta;

  const yourScore = yourPasses * 10;
  const oppScore = oppPasses * 10;

  yourScoreEl.textContent = String(yourScore);
  oppScoreEl.textContent = String(oppScore);

  yourPassesEl.textContent = `${yourPasses} ScreenPlay cars passed`;
  oppPassesEl.textContent = `${oppPasses} ScreenPlay cars passed`;
});

finishBtn.addEventListener("click", () => {
  if (!matched || finished) return;
  finished = true;

  simulateBtn.disabled = true;
  finishBtn.disabled = true;

  rewardUse.disabled = false;

  const yourScore = yourPasses * 10;
  const oppScore = oppPasses * 10;

  const youWin = yourScore > oppScore;
  const tie = yourScore === oppScore;

  // Simple reward logic: examples like $4, $10, $20 but flexible
  // We'll map bet to reward:
  // bet 2 -> 4, bet 5 -> 10, bet 10 -> 20, otherwise 2x bet (rounded)
  let reward = 0;
  if (bet === 2) reward = 4;
  else if (bet === 5) reward = 10;
  else if (bet === 10) reward = 20;
  else reward = Math.max(2, Math.round(bet * 2));

  if (tie) {
    winnerText.textContent = "Tie game — reward split.";
    winnerText.classList.remove("muted");
    rewardText.textContent = `$${(reward / 2).toFixed(2)} each`;
    rewardText.classList.remove("muted");
    rewardNote.textContent = "Both rides receive equal rewards.";
    rewardNote.classList.remove("muted");
  } else if (youWin) {
    winnerText.textContent = "You won 🎉";
    winnerText.classList.remove("muted");
    rewardText.textContent = `$${reward.toFixed(2)} reward`;
    rewardText.classList.remove("muted");
    rewardNote.textContent = "Use it as a tip or a ride discount.";
    rewardNote.classList.remove("muted");
  } else {
    winnerText.textContent = "Opponent won";
    winnerText.classList.remove("muted");
    rewardText.textContent = "$0";
    rewardText.classList.remove("muted");
    rewardNote.textContent = "Try again next ride.";
    rewardNote.classList.remove("muted");
  }

  // Enable review
  stars.forEach(s => s.disabled = false);
  reviewStatus.textContent = "Tap a star rating for your driver.";
});

rewardUse.addEventListener("change", () => {
  const mode = rewardUse.value;
  if (mode === "tip") {
    rewardNote.textContent = rewardNote.textContent.replace("ride discount", "tip");
  } else {
    rewardNote.textContent = rewardNote.textContent.replace("tip", "ride discount");
  }
});

stars.forEach(btn => {
  btn.addEventListener("click", () => {
    const n = Number(btn.dataset.stars);
    stars.forEach(s => s.classList.remove("active"));
    // Highlight up to n
    stars.forEach(s => {
      if (Number(s.dataset.stars) <= n) s.classList.add("active");
    });
    reviewStatus.textContent = `Thanks! You rated your driver ${n}/5.`;
  });
});
