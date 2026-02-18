// --- SOUND ENGINE ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playTone(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    const t = audioCtx.currentTime;
    
    if (type === 'hover') {
        osc.frequency.setValueAtTime(200, t);
        gain.gain.setValueAtTime(0.05, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
        osc.start(t); osc.stop(t + 0.05);
    } else if (type === 'click') {
        osc.frequency.setValueAtTime(400, t);
        osc.frequency.exponentialRampToValueAtTime(100, t + 0.1);
        gain.gain.setValueAtTime(0.1, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
        osc.start(t); osc.stop(t + 0.1);
    } else if (type === 'success') {
        osc.frequency.setValueAtTime(500, t);
        osc.frequency.linearRampToValueAtTime(1000, t + 0.1);
        gain.gain.setValueAtTime(0.1, t);
        gain.gain.linearRampToValueAtTime(0, t + 0.3);
        osc.start(t); osc.stop(t + 0.3);
    } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.linearRampToValueAtTime(100, t + 0.3);
        gain.gain.setValueAtTime(0.1, t);
        gain.gain.linearRampToValueAtTime(0, t + 0.3);
        osc.start(t); osc.stop(t + 0.3);
    }
}

// --- TEXT TO SPEECH ---
function speakCurrentQuestion() {
    if (!('speechSynthesis' in window)) return;
    
    // Stop any current speech
    window.speechSynthesis.cancel();

    if (currentIdx >= activeData.length) return;

    const q = activeData[currentIdx];
    const text = `${q.q}. Option A: ${q.options[0]}. Option B: ${q.options[1]}. Option C: ${q.options[2]}. Option D: ${q.options[3]}.`;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1; // Slightly faster
    utterance.pitch = 1;
    
    window.speechSynthesis.speak(utterance);
}

// --- DEFAULT DATA (IT1915) ---
const defaultData = [
    { q: "What is defined as raw facts, such as a number or image, representing specific data?", options: ["Information", "Data", "System", "Input"], a: 1, info: "Data is raw facts; Information is processed data." },
    { q: "Which characteristic of information ensures it is up-to-date, not too early and not too late?", options: ["Accuracy", "Completeness", "Timeliness", "Conciseness"], a: 2, info: "Timeliness ensures info is relevant to the current moment." },
    { q: "In a system, what refers to the comments or suggestions used to improve the process?", options: ["Control", "Output", "Processing", "Feedback"], a: 3, info: "Feedback helps regulate and improve system output." },
    { q: "Which Information System is described as the 'most widely used' and records data at organization boundaries?", options: ["DSS", "TPS", "ESS", "CRM"], a: 1, info: "TPS (Transaction Processing System) handles daily transactions." },
    { q: "Which system uses artificial intelligence to preserve expert knowledge?", options: ["DSS", "ESS", "MIS", "SCM"], a: 1, info: "ESS (Expert Support System) mimics human expertise." },
    { q: "Information must be correct or precise. This characteristic is called:", options: ["Accuracy", "Appropriateness", "Relevance", "Timeliness"], a: 0, info: "Accuracy refers to correctness and precision." },
    { q: "The component of a system that involves the efficiency of data processing is:", options: ["Input", "Output", "Processing", "Control"], a: 2, info: "Processing transforms input into output." },
    { q: "Which system answers 'What if?' questions?", options: ["TPS", "DSS", "CRM", "SCM"], a: 1, info: "DSS (Decision Support System) models scenarios." },
    { q: "Information should only contain the minimum detail appropriate to the user. This is:", options: ["Completeness", "Conciseness", "Timeliness", "Accuracy"], a: 1, info: "Conciseness prevents information overload." },
    { q: "The scope of activities limited for viewing or accessing a module is known as:", options: ["System Boundaries", "Subsystem Interface", "System Environment", "Control"], a: 0, info: "Boundaries define limits and access." },
    { q: "Which system manages the relationship of the organization to its customers?", options: ["SCM", "CRM", "TPS", "DSS"], a: 1, info: "CRM stands for Customer Relationship Management." },
    { q: "A collection of data that contains useful context for users is called:", options: ["Data", "Input", "Information", "Raw Facts"], a: 2, info: "Data becomes Information when given context." },
    { q: "Which system accesses massive data warehouses to compete with other organizations?", options: ["Business Intelligence", "TPS", "SCM", "CRM"], a: 0, info: "BI uses big data for strategic advantage." },
    { q: "The supply chain includes marketing, manufacturing, shipping, and:", options: ["Hiring", "Billing and collection", "Auditing", "Programming"], a: 1, info: "Billing is part of the SCM cycle." },
    { q: "In a system, what manages the operations in every process?", options: ["Feedback", "Input", "Control", "Output"], a: 2, info: "Control regulates the system processes." },
    { q: "The connection that displays output from one system to the input of another is the:", options: ["System Boundary", "Subsystem Interface", "Environment", "Feedback Loop"], a: 1, info: "Interfaces connect subsystems." },
    { q: "Which SDLC stage involves identifying problems and determining information requirements?", options: ["System Design", "System Analysis", "Programming", "Implementation"], a: 1, info: "Analysis focuses on requirements gathering." },
    { q: "Which feasibility study asks 'Will the system be used to its full capacity?'", options: ["Technical", "Economic", "Operational", "Legal"], a: 2, info: "Operational feasibility checks user acceptance." },
    { q: "The oldest and most structured method of system development is:", options: ["Agile", "Prototyping", "Waterfall", "Ad-Hoc"], a: 2, info: "Waterfall is sequential and structured." },
    { q: "In which stage are system specifications translated into program code?", options: ["Analysis", "Design", "Programming", "Testing"], a: 2, info: "Programming is the coding phase." },
    { q: "Which tool is a graphical standard for visualizing and documenting software?", options: ["DFD", "UML", "Flowchart", "Gantt Chart"], a: 1, info: "UML is the Unified Modeling Language." },
    { q: "Testing should include attempts to make the system:", options: ["Run faster", "Fail", "Look better", "Save power"], a: 1, info: "Testing aims to break the system to find bugs." },
    { q: "Which development approach relies on the skills of individual staff for small projects?", options: ["Waterfall", "Spiral", "Ad-Hoc", "Agile"], a: 2, info: "Ad-Hoc is unstructured and person-dependent." },
    { q: "Which approach focuses on fast delivery by dividing a project into small subprojects?", options: ["Waterfall", "Prototyping", "Agile Development", "Spiral"], a: 2, info: "Agile is iterative and fast." },
    { q: "In Prototyping, what happens after the client assesses the prototype?", options: ["Deployment", "Refinement", "System Analysis", "Maintenance"], a: 1, info: "Refinement improves the prototype based on feedback." },
    { q: "Which model combines features of Waterfall and Prototyping and includes Risk Assessment?", options: ["Agile", "Spiral", "Ad-Hoc", "SDLC"], a: 1, info: "Spiral model emphasizes risk analysis." },
    { q: "Conversion and Training take place during which SDLC phase?", options: ["Programming", "Testing", "Implementation", "Maintenance"], a: 2, info: "Implementation puts the system into use." },
    { q: "What occurs when an organization switches from an old system to a new one?", options: ["Conversion", "Production", "Feasibility", "Integration"], a: 0, info: "Conversion is the switch-over process." },
    { q: "Economic Feasibility Study asks:", options: ["Is the technology available?", "Will benefits outweigh costs?", "Will users like it?", "Is it legal?"], a: 1, info: "Cost-Benefit analysis." },
    { q: "Which diagramming symbol is suitable for describing IS even if not computer-based?", options: ["UML", "DFD", "Pie Chart", "Histogram"], a: 1, info: "Data Flow Diagrams (DFD) show logic flow." },
    { q: "If the system meets objectives and is in production, changes to it are called:", options: ["Testing", "Maintenance", "Design", "Analysis"], a: 1, info: "Maintenance keeps the system running." },
    { q: "System Design comprises three steps: Description of functions, construction, and:", options: ["Analysis", "Testing", "Deployment", "Hiring"], a: 1, info: "Testing designs." },
    { q: "What software allows an organization to collect and manage data efficiently?", options: ["ERP", "DBMS", "TPS", "UML"], a: 1, info: "DBMS (Database Management System)." },
    { q: "Which file organization method is typically used for processing the same information?", options: ["Direct", "Random", "Sequential", "Indexed"], a: 2, info: "Sequential access processes data in order." },
    { q: "Which system integrates Manufacturing, Finance, Sales, and HR into a single software?", options: ["DBMS", "ERP", "MIS", "DSS"], a: 1, info: "ERP (Enterprise Resource Planning)." },
    { q: "Which file access method uses a primary key and mathematical calculations to find a record?", options: ["Sequential", "Direct/Random", "Index Sequential", "Cloud"], a: 1, info: "Direct/Random access jumps to specific data." },
    { q: "Producing bills of materials is a process in which functional area?", options: ["Sales", "HR", "Finance", "Manufacturing"], a: 3, info: "Manufacturing handles BOMs." },
    { q: "Enrolling employees in benefits plans is a process in which functional area?", options: ["Finance", "HR", "Sales", "Manufacturing"], a: 1, info: "HR manages benefits." },
    { q: "Identifying customers is a function of which area?", options: ["Sales and Marketing", "Finance", "Manufacturing", "HR"], a: 0, info: "Sales/Marketing targets customers." },
    { q: "What refers to the hardware/software that facilitate fast transmission?", options: ["People", "Procedures", "Telecommunications", "DBMS"], a: 2, info: "Telecommunications handles data transmission." },
    { q: "Which is NOT a change of high importance in MIS?", options: ["IT Innovation", "New Business Models", "Decreased Internet Use", "E-commerce expanding"], a: 2, info: "Internet use is increasing, not decreasing." },
    { q: "In Index Sequential Access Method, records are stored using a:", options: ["Primary Key", "Foreign Key", "Random Number", "Date"], a: 0, info: "Primary keys order the records." },
    { q: "A stable, formal social structure that takes resources and processes them is a(n):", options: ["Organization", "System", "Network", "Database"], a: 0, info: "Definition of an Organization." },
    { q: "SAP, Peoplesoft, and Oracle are examples of what kind of software?", options: ["Operating System", "ERP", "Antivirus", "Photo Editor"], a: 1, info: "Major ERP vendors." },
    { q: "Paying creditors is a business process in:", options: ["HR", "Manufacturing", "Finance and Accounting", "Sales"], a: 2, info: "Finance handles payments." },
    { q: "Strategies involves leveraging technology in the:", options: ["Supply Chain", "Value Chain", "Food Chain", "Block Chain"], a: 1, info: "Value Chain analysis." },
    { q: "Which component includes rules for secure operations in data processing?", options: ["Hardware", "Software", "People", "Procedures"], a: 3, info: "Procedures are the rules/policies." },
    { q: "What acts as an interface between data resources and application programs?", options: ["Windows", "DBMS", "Internet", "Spreadsheet"], a: 1, info: "DBMS sits between app and data." },
    { q: "What distinguishes modern 21st-century firms?", options: ["More hierarchy", "Less emphasis on hierarchy", "Slower processing", "No technology"], a: 1, info: "Flatter structures." },
    { q: "Using IS to beat competition often requires:", options: ["Buying more computers", "Changing business processes", "Hiring fewer people", "Ignoring customers"], a: 1, info: "Process re-engineering is key." }
];

// --- STATE MANAGEMENT ---
let fullQuizData = []; 
let activeData = [];
let mistakes = []; 
let currentIdx = 0;
let score = 0;
let streak = 0;
let timerInterval;
let timeLeft = 0;
let totalTime = 20;
let mode = 'normal';

// Settings
let settingCount = 50;
let settingDiff = 'Normal';
let settingShuffle = true;
let settingAudio = false;

// DOM Elements
const startScreen = document.getElementById('start-screen');
const quizUI = document.getElementById('quiz-ui');
const endScreen = document.getElementById('end-screen');
const loadOverlay = document.getElementById('loading-overlay');
const container = document.getElementById('app-container');
const scoreVal = document.getElementById('score-display');
const streakVal = document.getElementById('streak-display');
const streakFire = document.getElementById('streak-fire');
const qBox = document.getElementById('question-text');
const optBox = document.getElementById('options-container');
const feedback = document.getElementById('feedback-box');
const nextBtn = document.getElementById('next-btn');
const timerBar = document.getElementById('timer-bar');
const timerText = document.getElementById('timer-text');
const progBar = document.getElementById('progress-bar');
const currQ = document.getElementById('current-q-num');
const totQ = document.getElementById('total-q-num');
const modal = document.getElementById('exit-modal');
const mistakesContainer = document.getElementById('mistakes-container');
const mistakesBtn = document.getElementById('btn-review-mistakes');
const importModal = document.getElementById('import-modal');
const pdfModal = document.getElementById('pdf-modal');
const studyModal = document.getElementById('study-modal');
const studyContent = document.getElementById('study-content');

// --- INITIALIZATION ---
window.onload = () => {
    // 1. Load High Score
    const savedHigh = localStorage.getItem('quiz_highscore') || 0;
    document.getElementById('high-score-val').textContent = savedHigh;

    // 2. Load Custom Questions (if any)
    const customData = localStorage.getItem('quiz_custom_data');
    if (customData) {
        try {
            fullQuizData = JSON.parse(customData);
            document.getElementById('app-title').textContent = "CUSTOM EXAM LOADED";
        } catch (e) {
            console.error("Error loading custom data", e);
            fullQuizData = defaultData;
        }
    } else {
        fullQuizData = defaultData; // Fallback to IT1915
    }
};

// --- SETTINGS FUNCTIONS ---
function setCount(n) {
    settingCount = n;
    document.querySelectorAll('#count-selector .segment-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`button[data-val="${n}"]`).classList.add('active');
    playTone('click');
}

function setDiff(d) {
    settingDiff = d;
    document.querySelectorAll('#diff-selector .segment-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`button[data-val="${d}"]`).classList.add('active');
    
    if (d === 'Easy') totalTime = 30;
    else if (d === 'Normal') totalTime = 20;
    else if (d === 'Hard') totalTime = 10;
    playTone('click');
}

// --- QUIZ LOGIC ---
function initQuiz(selectedMode) {
    playTone('click');
    loadOverlay.style.display = 'flex';
    settingShuffle = document.getElementById('shuffle-toggle').checked;
    settingAudio = document.getElementById('audio-toggle').checked;
    mode = selectedMode;

    setTimeout(() => {
        prepareData();
        loadOverlay.style.display = 'none';
        startScreen.style.display = 'none';
        quizUI.style.display = 'block';
        
        if (mode === 'sudden') {
            container.parentNode.classList.add('sd-mode-active');
        }
        
        loadQuestion();
    }, 600);
}

function prepareData() {
    let temp = [...fullQuizData];
    if (settingShuffle) temp.sort(() => Math.random() - 0.5);
    
    // Safety check if user requests more questions than available
    const count = Math.min(settingCount, temp.length);
    activeData = temp.slice(0, count);
    
    // Reset State
    currentIdx = 0;
    score = 0;
    streak = 0;
    mistakes = []; 
    scoreVal.textContent = 0;
    streakVal.textContent = 0;
    totQ.textContent = activeData.length;
}

function loadQuestion() {
    if (currentIdx >= activeData.length) {
        finishQuiz();
        return;
    }

    const q = activeData[currentIdx];
    qBox.innerHTML = q.q;
    currQ.textContent = currentIdx + 1;
    
    const pct = ((currentIdx) / activeData.length) * 100;
    progBar.style.width = `${pct}%`;

    optBox.innerHTML = '';
    feedback.style.display = 'none';
    nextBtn.style.display = 'none';
    container.classList.remove('time-critical');

    const labels = ['A', 'B', 'C', 'D'];
    q.options.forEach((txt, idx) => {
        const btn = document.createElement('div');
        btn.className = 'option-card';
        btn.textContent = txt;
        btn.setAttribute('data-key', labels[idx] || (idx+1));
        btn.onclick = () => checkAnswer(idx, btn);
        optBox.appendChild(btn);
    });

    startTimer();
    
    // Auto Audio
    if (settingAudio) {
        setTimeout(speakCurrentQuestion, 500);
    }
}

function startTimer() {
    clearInterval(timerInterval);
    timeLeft = totalTime;
    timerText.textContent = timeLeft;
    timerBar.style.width = '100%';
    timerBar.style.background = 'var(--success)';

    timerInterval = setInterval(() => {
        timeLeft--;
        timerText.textContent = timeLeft;
        const pct = (timeLeft / totalTime) * 100;
        timerBar.style.width = `${pct}%`;

        if (timeLeft <= 5) {
            container.classList.add('time-critical');
            timerBar.style.background = 'var(--danger)';
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timeOut();
        }
    }, 1000);
}

function checkAnswer(idx, btn) {
    clearInterval(timerInterval);
    window.speechSynthesis.cancel(); // Stop speaking
    
    const q = activeData[currentIdx];
    const allOpts = document.querySelectorAll('.option-card');
    allOpts.forEach(o => o.classList.add('disabled'));

    if (idx === q.a) {
        btn.classList.add('correct');
        playTone('success');
        score++;
        streak++;
        showFeedback(true, q.info);
    } else {
        btn.classList.add('wrong');
        playTone('error');
        if(allOpts[q.a]) allOpts[q.a].classList.add('correct');
        streak = 0;
        
        // Record Mistake
        mistakes.push({
            question: q.q,
            yourAnswer: q.options[idx],
            correctAnswer: q.options[q.a],
            info: q.info || "No extra info."
        });
        
        if (mode === 'sudden') {
            setTimeout(() => finishQuiz("Sudden Death Triggered"), 1000);
            return;
        }
        showFeedback(false, q.info);
    }
    updateStats();
    nextBtn.style.display = 'block';
}

function timeOut() {
    playTone('error');
    window.speechSynthesis.cancel();
    const q = activeData[currentIdx];
    const allOpts = document.querySelectorAll('.option-card');
    if(allOpts[q.a]) allOpts[q.a].classList.add('correct');
    allOpts.forEach(o => o.classList.add('disabled'));
    streak = 0;
    
    // Record Mistake (Timeout)
    mistakes.push({
        question: q.q,
        yourAnswer: "Time Expired",
        correctAnswer: q.options[q.a],
        info: q.info || "No extra info."
    });

    updateStats();

    if (mode === 'sudden') {
        setTimeout(() => finishQuiz("Time Expired in Sudden Death"), 1000);
    } else {
        showFeedback(false, "Time limit exceeded.");
        nextBtn.style.display = 'block';
    }
}

function showFeedback(isCorrect, text) {
    feedback.style.display = 'block';
    const infoText = text ? text : (isCorrect ? "Well done!" : "Keep trying.");
    feedback.innerHTML = `<strong style="color:${isCorrect ? 'var(--success)' : 'var(--danger)'}">${isCorrect ? 'Correct!' : 'Incorrect'}</strong><br><span style="color:var(--text-muted)">${infoText}</span>`;
    feedback.style.borderColor = isCorrect ? 'var(--success)' : 'var(--danger)';
}

function updateStats() {
    scoreVal.textContent = score;
    streakVal.textContent = streak;
    streakFire.style.display = streak >= 3 ? 'block' : 'none';
}

function nextQuestion() {
    playTone('click');
    window.speechSynthesis.cancel();
    currentIdx++;
    loadQuestion();
}

function confirmExit() {
    playTone('click');
    window.speechSynthesis.cancel();
    modal.style.display = 'flex';
    clearInterval(timerInterval);
}

function closeModal() {
    playTone('click');
    modal.style.display = 'none';
    if (timeLeft > 0) {
        timerInterval = setInterval(() => {
            timeLeft--;
            timerText.textContent = timeLeft;
            const pct = (timeLeft / totalTime) * 100;
            timerBar.style.width = `${pct}%`;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timeOut();
            }
        }, 1000);
    }
}

function exitQuiz() {
    playTone('click');
    modal.style.display = 'none';
    resetToStart();
}

// --- REVIEW MISTAKES ---
function toggleMistakes() {
    playTone('click');
    if (mistakesContainer.style.display === 'block') {
        mistakesContainer.style.display = 'none';
    } else {
        renderMistakes();
        mistakesContainer.style.display = 'block';
    }
}

function renderMistakes() {
    mistakesContainer.innerHTML = '';
    mistakes.forEach(m => {
        const card = document.createElement('div');
        card.className = 'mistake-card';
        card.innerHTML = `
            <div class="mistake-q">${m.question}</div>
            <div class="mistake-yours">✖ You: ${m.yourAnswer}</div>
            <div class="mistake-correct">✓ Correct: ${m.correctAnswer}</div>
            <div class="mistake-info">${m.info}</div>
        `;
        mistakesContainer.appendChild(card);
    });
}

function finishQuiz(reason) {
    clearInterval(timerInterval);
    window.speechSynthesis.cancel();
    quizUI.style.display = 'none';
    endScreen.style.display = 'block';
    container.parentNode.classList.remove('sd-mode-active');

    const currentHigh = parseInt(localStorage.getItem('quiz_highscore') || 0);
    if (score > currentHigh) {
        localStorage.setItem('quiz_highscore', score);
        document.getElementById('high-score-val').textContent = score;
    }

    const pct = (score / activeData.length) * 100;
    const color = pct >= 70 ? 'var(--success)' : (pct >= 40 ? '#f59e0b' : 'var(--danger)');
    document.getElementById('score-circle-outer').style.background = `conic-gradient(${color} ${pct}%, rgba(255,255,255,0.1) ${pct}%)`;
    document.getElementById('score-circle-outer').style.boxShadow = `0 0 40px ${color}`;

    document.getElementById('final-score').textContent = score;
    document.getElementById('final-total').textContent = activeData.length;
    
    let msg = reason ? reason : (pct >= 60 ? "Great job!" : "Keep practicing.");
    if (score === activeData.length && activeData.length > 0) msg = "PERFECT SCORE!";
    document.getElementById('final-msg').textContent = msg;

    if (mistakes.length > 0) {
        mistakesBtn.style.display = 'inline-block';
        mistakesContainer.style.display = 'none'; 
    } else {
        mistakesBtn.style.display = 'none';
        mistakesContainer.style.display = 'none';
    }

    if (pct >= 60) fireConfetti();
}

function resetToStart() {
    playTone('click');
    window.speechSynthesis.cancel();
    endScreen.style.display = 'none';
    quizUI.style.display = 'none';
    startScreen.style.display = 'block';
    container.parentNode.classList.remove('sd-mode-active');
}

// --- IMPORT LOGIC ---
function openImportModal() {
    playTone('click');
    importModal.style.display = 'flex';
}

function closeImportModal() {
    playTone('click');
    importModal.style.display = 'none';
}

function saveQuestions() {
    const input = document.getElementById('import-area').value;
    try {
        const parsed = JSON.parse(input);
        if (!Array.isArray(parsed) || parsed.length === 0) throw new Error("Invalid Format");
        
        localStorage.setItem('quiz_custom_data', JSON.stringify(parsed));
        fullQuizData = parsed;
        
        playTone('success');
        alert("✅ Success! " + parsed.length + " questions loaded.");
        closeImportModal();
        location.reload(); 
    } catch (e) {
        playTone('error');
        alert("❌ Invalid JSON! Please check the format.");
    }
}

function clearCustomData() {
    if(confirm("Reset to original IT1915 questions?")) {
        localStorage.removeItem('quiz_custom_data');
        location.reload();
    }
}

// --- PDF VIEWER LOGIC ---
function openPdfModal() {
    playTone('click');
    pdfModal.style.display = 'flex';
}

function closePdfModal() {
    playTone('click');
    pdfModal.style.display = 'none';
}

function renderPdf(input) {
    const file = input.files[0];
    if (file) {
        const fileURL = URL.createObjectURL(file);
        const container = document.getElementById('pdf-frame-container');
        document.getElementById('file-name').textContent = file.name;
        container.innerHTML = `<embed src="${fileURL}" type="application/pdf" />`;
    }
}

// --- STUDY GUIDE LOGIC ---
function openStudyModal() {
    playTone('click');
    studyModal.style.display = 'flex';
    renderStudyGuide();
}

function closeStudyModal() {
    playTone('click');
    studyModal.style.display = 'none';
}

function renderStudyGuide() {
    studyContent.innerHTML = '';
    const searchTerm = document.getElementById('study-search').value.toLowerCase();
    
    // View ALL data (custom or default)
    const dataToView = fullQuizData.length > 0 ? fullQuizData : defaultData;

    let count = 0;
    dataToView.forEach((item, index) => {
        if (searchTerm && !item.q.toLowerCase().includes(searchTerm) && !item.info.toLowerCase().includes(searchTerm)) {
            return;
        }
        const card = document.createElement('div');
        card.className = 'study-item';
        const correctAnswerText = item.options[item.a];

        card.innerHTML = `
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 5px;">Question #${index + 1}</div>
            <div class="study-q">${item.q}</div>
            <div class="study-a">✅ ${correctAnswerText}</div>
            <div class="study-info">ℹ️ ${item.info}</div>
        `;
        studyContent.appendChild(card);
        count++;
    });

    if (count === 0) {
        studyContent.innerHTML = '<div style="text-align:center; padding: 20px; color: var(--text-muted);">No questions found matching your search.</div>';
    }
}

function filterStudyGuide() {
    renderStudyGuide();
}

// --- CONFETTI ---
function fireConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = [];
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    for(let i=0; i<100; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 8 + 2,
            speed: Math.random() * 5 + 2,
            angle: Math.random() * 6
        });
    }

    function draw() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        particles.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
            ctx.fill();
            p.y += p.speed;
            p.x += Math.sin(p.angle);
        });
        if(particles.some(p => p.y < canvas.height)) requestAnimationFrame(draw);
    }
    draw();
}