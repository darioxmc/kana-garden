const KANA = [
  ["a", "あ", "ア", "vowels"], ["i", "い", "イ", "vowels"],
  ["u", "う", "ウ", "vowels"], ["e", "え", "エ", "vowels"],
  ["o", "お", "オ", "vowels"], ["ka", "か", "カ", "k"],
  ["ki", "き", "キ", "k"], ["ku", "く", "ク", "k"],
  ["ke", "け", "ケ", "k"], ["ko", "こ", "コ", "k"],
  ["sa", "さ", "サ", "s"], ["shi", "し", "シ", "s"],
  ["su", "す", "ス", "s"], ["se", "せ", "セ", "s"],
  ["so", "そ", "ソ", "s"], ["ta", "た", "タ", "t"],
  ["chi", "ち", "チ", "t"], ["tsu", "つ", "ツ", "t"],
  ["te", "て", "テ", "t"], ["to", "と", "ト", "t"],
  ["na", "な", "ナ", "n"], ["ni", "に", "ニ", "n"],
  ["nu", "ぬ", "ヌ", "n"], ["ne", "ね", "ネ", "n"],
  ["no", "の", "ノ", "n"], ["ha", "は", "ハ", "h"],
  ["hi", "ひ", "ヒ", "h"], ["fu", "ふ", "フ", "h"],
  ["he", "へ", "ヘ", "h"], ["ho", "ほ", "ホ", "h"],
  ["ma", "ま", "マ", "m"], ["mi", "み", "ミ", "m"],
  ["mu", "む", "ム", "m"], ["me", "め", "メ", "m"],
  ["mo", "も", "モ", "m"], ["ya", "や", "ヤ", "y"],
  ["yu", "ゆ", "ユ", "y"], ["yo", "よ", "ヨ", "y"],
  ["ra", "ら", "ラ", "r"], ["ri", "り", "リ", "r"],
  ["ru", "る", "ル", "r"], ["re", "れ", "レ", "r"],
  ["ro", "ろ", "ロ", "r"], ["wa", "わ", "ワ", "w"],
  ["wo", "を", "ヲ", "w"], ["n", "ん", "ン", "w"],
].map(([romaji, hiragana, katakana, group]) => ({
  romaji, hiragana, katakana, group,
}));

const KANJI = [
  ["日", ["sun", "day"], "にち / ひ"], ["一", ["one"], "いち"],
  ["国", ["country", "nation"], "くに / こく"], ["人", ["person", "human"], "ひと / じん"],
  ["年", ["year"], "とし / ねん"], ["大", ["big", "large"], "おお / だい"],
  ["十", ["ten"], "じゅう"], ["二", ["two"], "に"],
  ["本", ["book", "origin"], "ほん"], ["中", ["middle", "inside"], "なか / ちゅう"],
  ["長", ["long", "leader"], "なが / ちょう"], ["出", ["exit", "leave"], "で / しゅつ"],
  ["三", ["three"], "さん"], ["時", ["time", "hour"], "とき / じ"],
  ["行", ["go"], "い / こう"], ["見", ["see", "look"], "み / けん"],
  ["月", ["moon", "month"], "つき / げつ"], ["分", ["part", "minute"], "ぶん / ふん"],
  ["後", ["after", "behind"], "あと / ご"], ["前", ["before", "front"], "まえ / ぜん"],
  ["生", ["life", "birth"], "せい / う"], ["五", ["five"], "ご"],
  ["間", ["between", "interval"], "あいだ / かん"], ["上", ["up", "above"], "うえ / じょう"],
  ["東", ["east"], "ひがし / とう"], ["四", ["four"], "よん / し"],
  ["今", ["now"], "いま / こん"], ["金", ["gold", "money"], "かね / きん"],
  ["九", ["nine"], "きゅう / く"], ["入", ["enter", "inside"], "はい / にゅう"],
  ["学", ["study", "learning"], "まな / がく"], ["高", ["high", "tall"], "たか / こう"],
  ["円", ["yen", "circle"], "えん"], ["子", ["child"], "こ / し"],
  ["外", ["outside"], "そと / がい"], ["八", ["eight"], "はち"],
  ["六", ["six"], "ろく"], ["下", ["down", "below"], "した / か"],
  ["来", ["come"], "く / らい"], ["気", ["spirit", "feeling"], "き"],
  ["小", ["small", "little"], "ちい / しょう"], ["七", ["seven"], "なな / しち"],
  ["山", ["mountain"], "やま / さん"], ["話", ["talk", "speak"], "はなし / わ"],
  ["女", ["woman", "female"], "おんな / じょ"], ["北", ["north"], "きた / ほく"],
  ["午", ["noon"], "ご"], ["百", ["hundred"], "ひゃく"],
  ["書", ["write"], "か / しょ"], ["先", ["ahead", "previous"], "さき / せん"],
].map(([character, meanings, reading]) => ({ character, meanings, reading }));

const STORAGE_KEY = "kana-garden-session-v1";
const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
const state = {
  total: stored.total || 0,
  correct: stored.correct || 0,
  streak: stored.streak || 0,
  awaitingNext: false,
  hasAttempted: Boolean(stored.hasAttempted),
  current: null,
  recentPrompts: [],
};

const promptEl = document.querySelector("#kana-prompt");
const scriptLabel = document.querySelector("#script-label");
const form = document.querySelector("#answer-form");
const input = document.querySelector("#answer-input");
const feedback = document.querySelector("#feedback");
const checkButton = document.querySelector("#check-button");
const skipButton = document.querySelector("#skip-button");
const practiceTitle = document.querySelector("#practice-title");
const answerLabel = document.querySelector("#answer-label");
const focusFieldset = document.querySelector("#focus-fieldset");
const themeToggle = document.querySelector("#theme-toggle");
const fontToggle = document.querySelector("#font-toggle");
const themeColor = document.querySelector('meta[name="theme-color"]');
const colorScheme = window.matchMedia("(prefers-color-scheme: dark)");
const THEME_KEY = "kana-garden-theme";
const THEME_OPTIONS = ["auto", "day", "night"];
const FONT_KEY = "kana-garden-character-font";

function applyCharacterFont(preference) {
  const isClear = preference === "clear";
  document.documentElement.dataset.characterFont = preference;
  fontToggle.querySelector("[aria-hidden]").textContent = isClear ? "字" : "筆";
  fontToggle.querySelector(".font-toggle-label").textContent = isClear ? "Clear" : "Brush";
  fontToggle.setAttribute("aria-label", `Character style: ${isClear ? "clear" : "brush"}`);
  fontToggle.title = `Switch to ${isClear ? "brush" : "clear"} characters`;
}

fontToggle.addEventListener("pointerdown", (event) => {
  event.preventDefault();
});

fontToggle.addEventListener("click", () => {
  const current = localStorage.getItem(FONT_KEY) || "brush";
  const next = current === "brush" ? "clear" : "brush";
  localStorage.setItem(FONT_KEY, next);
  applyCharacterFont(next);
});

applyCharacterFont(localStorage.getItem(FONT_KEY) || "brush");

function applyTheme(preference) {
  const resolved = preference === "auto"
    ? (colorScheme.matches ? "night" : "day")
    : preference;
  const labels = { auto: "Auto", day: "Day", night: "Night" };
  const icons = { auto: "◐", day: "☀", night: "☾" };

  document.documentElement.dataset.theme = resolved;
  document.documentElement.dataset.themePreference = preference;
  themeToggle.querySelector(".theme-label").textContent = labels[preference];
  themeToggle.querySelector(".theme-icon").textContent = icons[preference];
  themeToggle.setAttribute("aria-label", `Theme: ${labels[preference].toLowerCase()}`);
  themeToggle.title = `Theme: ${labels[preference].toLowerCase()}`;
  themeColor.content = resolved === "night" ? "#111d1a" : "#f4efe5";
}

themeToggle.addEventListener("click", () => {
  const current = localStorage.getItem(THEME_KEY) || "auto";
  const next = THEME_OPTIONS[(THEME_OPTIONS.indexOf(current) + 1) % THEME_OPTIONS.length];
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
});

colorScheme.addEventListener("change", () => {
  if ((localStorage.getItem(THEME_KEY) || "auto") === "auto") applyTheme("auto");
});

applyTheme(localStorage.getItem(THEME_KEY) || "auto");

function settings() {
  return {
    script: document.querySelector('input[name="script"]:checked').value,
    groups: [...document.querySelectorAll("#row-picker input:checked")].map(
      (item) => item.value,
    ),
  };
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    total: state.total,
    correct: state.correct,
    streak: state.streak,
    hasAttempted: state.hasAttempted,
  }));
}

function updateStats() {
  document.querySelector("#answered-count").textContent = state.total;
  document.querySelector("#streak").textContent = state.streak;
  document.querySelector("#total-correct").textContent = state.correct;
  document.querySelector("#accuracy").textContent =
    state.total ? `${Math.round((state.correct / state.total) * 100)}%` : "—";
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function nextQuestion() {
  const currentSettings = settings();
  const isKanji = currentSettings.script === "kanji";

  focusFieldset.classList.toggle("is-hidden", isKanji);
  practiceTitle.textContent = isKanji ? "What does this kanji mean?" : "What sound is this?";
  answerLabel.textContent = isKanji ? "Type the English meaning" : "Type the romaji";
  input.placeholder = state.hasAttempted ? "" : (isKanji ? "e.g. water" : "e.g. ka");

  if (isKanji) {
    const freshPool = KANJI.filter((item) => !state.recentPrompts.includes(item.character));
    const item = randomItem(freshPool.length ? freshPool : KANJI);
    state.current = { kind: "kanji", item, prompt: item.character };
    state.recentPrompts = [...state.recentPrompts, item.character].slice(-5);
    showQuestion(item.character, "KANJI");
    return;
  }

  const pool = KANA.filter(
    (item) => !currentSettings.groups.length || currentSettings.groups.includes(item.group),
  );
  const script = currentSettings.script === "mixed"
    ? randomItem(["hiragana", "katakana"])
    : currentSettings.script;
  const freshPool = pool.filter((item) => !state.recentPrompts.includes(item[script]));
  const item = randomItem(freshPool.length ? freshPool : pool);

  state.current = { kind: "kana", item, script, prompt: item[script] };
  state.recentPrompts = [...state.recentPrompts, item[script]].slice(-5);
  showQuestion(item[script], script.toUpperCase());
}

function showQuestion(prompt, label) {
  promptEl.classList.add("changing");

  window.setTimeout(() => {
    promptEl.textContent = prompt;
    scriptLabel.textContent = label;
    feedback.textContent = "Press Enter to check your answer";
    feedback.className = "feedback";
    input.value = "";
    state.awaitingNext = false;
    checkButton.innerHTML = 'Check <span aria-hidden="true">→</span>';
    promptEl.classList.remove("changing");
    input.focus();
  }, 120);
}

function acceptedAnswers(answer) {
  const alternates = { shi: "si", chi: "ti", tsu: "tu", fu: "hu" };
  return [answer, alternates[answer]].filter(Boolean);
}

skipButton.addEventListener("click", () => {
  if (state.awaitingNext) {
    nextQuestion();
    return;
  }

  const isKanji = state.current.kind === "kanji";
  const expected = isKanji ? state.current.item.meanings[0] : state.current.item.romaji;
  feedback.textContent = isKanji
    ? `Skipped — ${state.current.prompt} means “${expected}” · ${state.current.item.reading}`
    : `Skipped — ${state.current.prompt} is “${expected}”`;
  feedback.className = "feedback skipped";
  state.awaitingNext = true;
  checkButton.innerHTML = 'Next <span aria-hidden="true">→</span>';
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (state.awaitingNext) {
    nextQuestion();
    return;
  }

  const answer = input.value.trim().toLowerCase();
  if (!answer) {
    feedback.textContent = "Type your answer first";
    feedback.className = "feedback error";
    input.focus();
    return;
  }

  if (!state.hasAttempted) {
    state.hasAttempted = true;
    input.placeholder = "";
  }

  const isKanji = state.current.kind === "kanji";
  const expected = isKanji ? state.current.item.meanings[0] : state.current.item.romaji;
  const correct = isKanji
    ? state.current.item.meanings.includes(answer)
    : acceptedAnswers(expected).includes(answer);
  state.total += 1;

  if (correct) {
    state.correct += 1;
    state.streak += 1;
    feedback.textContent = isKanji
      ? `Correct — ${state.current.prompt} means “${expected}” · ${state.current.item.reading}`
      : `Correct — ${state.current.prompt} is “${expected}”`;
    feedback.className = "feedback correct";
    promptEl.classList.add("success");
    window.setTimeout(() => promptEl.classList.remove("success"), 450);
  } else {
    state.streak = 0;
    feedback.textContent = isKanji
      ? `Not quite — ${state.current.prompt} means “${expected}” · ${state.current.item.reading}`
      : `Not quite — ${state.current.prompt} is “${expected}”`;
    feedback.className = "feedback error";
  }

  state.awaitingNext = true;
  checkButton.innerHTML = 'Next <span aria-hidden="true">→</span>';
  updateStats();
  saveProgress();
});

document.querySelectorAll('input[name="script"], #row-picker input').forEach((control) => {
  control.addEventListener("change", nextQuestion);
});

document.querySelector("#reset-progress").addEventListener("click", () => {
  Object.assign(state, {
    total: 0,
    correct: 0,
    streak: 0,
    awaitingNext: false,
    hasAttempted: false,
  });
  localStorage.removeItem(STORAGE_KEY);
  updateStats();
  nextQuestion();
});

const dialog = document.querySelector("#kana-dialog");
document.querySelector("#open-chart").addEventListener("click", () => dialog.showModal());
document.querySelector("#close-chart").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

const kanaGrid = document.querySelector("#kana-grid");

function renderChart(chart) {
  kanaGrid.replaceChildren();

  if (chart === "kanji") {
    KANJI.forEach((item) => {
      const cell = document.createElement("div");
      cell.className = "kana-cell kanji-cell";
      cell.innerHTML = `<strong>${item.character}</strong><span>${item.meanings[0]}</span><small>${item.reading.split(" / ")[0]}</small>`;
      kanaGrid.appendChild(cell);
    });
    return;
  }

  KANA.forEach((item) => {
    const cell = document.createElement("div");
    cell.className = "kana-cell";
    cell.innerHTML = `<strong>${item[chart]}</strong><span>${item.romaji}</span>`;
    kanaGrid.appendChild(cell);
  });
}

document.querySelectorAll(".chart-tabs button").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".chart-tabs button").forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");
    renderChart(tab.dataset.chart);
  });
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js");
  });
}

if (state.hasAttempted) input.placeholder = "";
renderChart("hiragana");
updateStats();
nextQuestion();
