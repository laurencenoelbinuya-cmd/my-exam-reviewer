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
    window.speechSynthesis.cancel();
    if (currentIdx >= activeData.length) return;

    const q = activeData[currentIdx];
    const text = `${q.q}. Option A: ${q.options[0]}. Option B: ${q.options[1]}. Option C: ${q.options[2]}. Option D: ${q.options[3]}.`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1; 
    window.speechSynthesis.speak(utterance);
}

// --- DEFAULT DATA WITH TOPICS ADDED ---
const defaultData = [
  // HTML Handout 1
  { "topic": "HTML: Handout 1", "q": "What does HTML stand for in web development?", "options": ["HyperText Markup Language", "Hyperlinks Text Mark Language", "Home Tool Markup Language", "Hyper Tool Markup Language"], "a": 0, "info": "HTML is the standard markup language used to create and structure web pages." },
  { "topic": "HTML: Handout 1", "q": "Which organization is responsible for managing the specifications of HTML?", "options": ["Microsoft", "Google", "World Wide Web Consortium (W3C)", "Mozilla Foundation"], "a": 2, "info": "The W3C manages what is included in HTML specifications and what is not." },
  { "topic": "HTML: Handout 1", "q": "Which tag tells the web browser what type of document is about to be processed?", "options": ["<html>", "<head>", "<meta>", "<!DOCTYPE>"], "a": 3, "info": "The <!DOCTYPE> declaration must be the very first thing in your HTML document." },
  { "topic": "HTML: Handout 1", "q": "Which HTML element is considered the 'root element' and contains all other elements?", "options": ["<body>", "<html>", "<head>", "<main>"], "a": 1, "info": "The <html> tag is the root container for all other HTML elements except the doctype." },
  { "topic": "HTML: Handout 1", "q": "Which HTML tag is used to create a single line break without needing a closing tag?", "options": ["<break>", "<lb>", "<br>", "<line>"], "a": 2, "info": "The <br> tag inserts a line break and is an empty element (no closing tag)." },
  { "topic": "HTML: Handout 1", "q": "What is placed inside an opening HTML tag to modify or provide additional information about the element?", "options": ["Attribute", "Value", "Property", "Selector"], "a": 0, "info": "An HTML Attribute (like class or id) is used to modify or define an element." },
  { "topic": "HTML: Handout 1", "q": "Which heading tag is used to display the most important title on a webpage?", "options": ["<h0>", "<h1>", "<h6>", "<title>"], "a": 1, "info": "HTML headings range from <h1> to <h6>, with <h1> being the highest level of importance." },
  { "topic": "HTML: Handout 1", "q": "In an anchor tag (<a>), which attribute specifies the destination URL?", "options": ["link", "src", "href", "url"], "a": 2, "info": "The href attribute tells the anchor tag where the link should navigate to." },
  { "topic": "HTML: Handout 1", "q": "Which tag defines a table header cell?", "options": ["<thead>", "<th>", "<tr>", "<td>"], "a": 1, "info": "The <th> tag acts as a title for the type of information in a table column." },
  { "topic": "HTML: Handout 1", "q": "Which attribute allows a table cell to span across multiple columns?", "options": ["rowspan", "merge", "colspan", "span"], "a": 2, "info": "The colspan attribute is used to join two or more columns together." },
  
  // HTML Handout 2
  { "topic": "HTML: Handout 2", "q": "Which tag is used to embed an image into an HTML webpage?", "options": ["<pic>", "<image>", "<src>", "<img>"], "a": 3, "info": "The <img> tag is used for embedding images and requires a 'src' attribute." },
  { "topic": "HTML: Handout 2", "q": "Which attribute provides alternate text for an image if the image fails to load?", "options": ["title", "alt", "desc", "text"], "a": 1, "info": "The 'alt' attribute displays text if the image cannot be rendered by the browser." },
  { "topic": "HTML: Handout 2", "q": "What HTML tag is used to define an unordered list that uses bullet points?", "options": ["<ol>", "<li>", "<ul>", "<dl>"], "a": 2, "info": "An unordered list starts with the <ul> tag, while an ordered list uses <ol>." },
  { "topic": "HTML: Handout 2", "q": "Which inline HTML tag is commonly used to color or markup a specific part of a text?", "options": ["<div>", "<mark>", "<p>", "<span>"], "a": 3, "info": "The <span> tag is an inline container used to mark up a part of a text." },
  { "topic": "HTML: Handout 2", "q": "Which HTML tag is used to define a major block of navigation links?", "options": ["<menu>", "<nav>", "<links>", "<ul>"], "a": 1, "info": "The <nav> tag represents a section of a page whose purpose is to provide navigation links." },
  { "topic": "HTML: Handout 2", "q": "Which form input type allows a user to select only ONE option from a list?", "options": ["checkbox", "radio", "text", "button"], "a": 1, "info": "Radio buttons (<input type='radio'>) restrict the user to a single selection." },
  { "topic": "HTML: Handout 2", "q": "Which form input type allows a user to select MULTIPLE options?", "options": ["radio", "checkbox", "select", "multiple"], "a": 1, "info": "Checkboxes (<input type='checkbox'>) allow users to select zero or more options." },
  { "topic": "HTML: Handout 2", "q": "Which HTML attribute in the <form> tag specifies where to send the form data upon submission?", "options": ["method", "submit", "handler", "action"], "a": 3, "info": "The action attribute specifies the address (URL) where the submitted data will be processed." },
  { "topic": "HTML: Handout 2", "q": "Which type of <input> tag is used to clear all the data a user has entered into a form?", "options": ["<input type='clear'>", "<input type='delete'>", "<input type='reset'>", "<input type='submit'>"], "a": 2, "info": "The 'reset' input type restores all form fields to their default values." },
  { "topic": "HTML: Handout 2", "q": "Which HTML tag is a container used to draw graphics via JavaScript?", "options": ["<svg>", "<graphic>", "<draw>", "<canvas>"], "a": 3, "info": "The <canvas> tag is used to draw graphics and requires JavaScript." },

  // CSS Handout 3
  { "topic": "CSS: Handout 3", "q": "What does CSS stand for?", "options": ["Computer Style Sheet", "Creative Style Sheet", "Cascading Style Sheet", "Colorful Style Sheet"], "a": 2, "info": "CSS stands for Cascading Style Sheet, used for styling web pages." },
  { "topic": "CSS: Handout 3", "q": "Which HTML tag is used to connect an external CSS file to an HTML document?", "options": ["<style>", "<script>", "<css>", "<link>"], "a": 3, "info": "The <link> tag is placed in the <head> section to reference external style sheets." },
  { "topic": "CSS: Handout 3", "q": "In CSS, what is the part of the code that targets the specific HTML element you want to style?", "options": ["Declaration", "Property", "Value", "Selector"], "a": 3, "info": "The selector (e.g., 'p', 'h1', or '.class') targets the element you want to apply styles to." },
  { "topic": "CSS: Handout 3", "q": "Which CSS property is used to change the typeface (font) of text?", "options": ["font-style", "font-weight", "font-family", "text-font"], "a": 2, "info": "The font-family property is used to define the priority list of fonts to be used." },
  { "topic": "CSS: Handout 3", "q": "Which CSS property is used to make text italicized?", "options": ["text-decoration", "font-style", "font-weight", "font-variant"], "a": 1, "info": "The font-style property is used to apply italic or oblique styling to text." },
  { "topic": "CSS: Handout 3", "q": "In the CSS Box Model, what property adds spacing OUTSIDE the element's border?", "options": ["Padding", "Margin", "Spacing", "Outline"], "a": 1, "info": "Margin creates transparent space around the outside of the element's border." },
  { "topic": "CSS: Handout 3", "q": "In the CSS Box Model, what property adds spacing INSIDE the element, between the content and the border?", "options": ["Margin", "Padding", "Border", "Spacing"], "a": 1, "info": "Padding creates space inside the container, right around the actual content." },
  { "topic": "CSS: Handout 3", "q": "Which CSS background property value prevents a background image from duplicating?", "options": ["repeat-none", "no-repeat", "repeat-0", "stop-repeat"], "a": 1, "info": "Using 'background-repeat: no-repeat' ensures the image only shows up once." },
  { "topic": "CSS: Handout 3", "q": "In the CSS Box Model, which border style makes the content look like it is carved or sinking into the canvas?", "options": ["Outset", "Groove", "Ridge", "Inset"], "a": 3, "info": "The 'inset' border style creates a 3D effect making the box appear sunken." },

  // IS Handout 1
  { "topic": "IS: Handout 1", "q": "Raw facts such as numbers, images, or statements that have not yet been processed are known as:", "options": ["Information", "Data", "Knowledge", "Systems"], "a": 1, "info": "Data refers to raw, unprocessed facts and measurements." },
  { "topic": "IS: Handout 1", "q": "When data is processed and given useful context for decision-making, it becomes:", "options": ["A Database", "A System", "Information", "Raw Facts"], "a": 2, "info": "Information is a collection of data that contains useful context for users." },
  { "topic": "IS: Handout 1", "q": "Which characteristic of good information ensures it is up-to-date and available when needed?", "options": ["Accuracy", "Completeness", "Conciseness", "Timeliness"], "a": 3, "info": "Timeliness means the information is provided neither too early nor too late for the user." },
  { "topic": "IS: Handout 1", "q": "Which characteristic ensures that only the minimum necessary details are displayed to avoid overwhelming the user?", "options": ["Accuracy", "Conciseness", "Appropriateness", "Understandability"], "a": 1, "info": "Conciseness ensures that information is brief and to the point." },
  { "topic": "IS: Handout 1", "q": "In a system, what component refers to comments or suggestions used to improve the process?", "options": ["Input", "Output", "Feedback", "Control"], "a": 2, "info": "Feedback is vital for making adjustments and ensuring the system achieves its goals." },
  { "topic": "IS: Handout 1", "q": "Which type of Information System is the most widely used and records day-to-day business operations?", "options": ["Transaction Processing System (TPS)", "Decision Support System (DSS)", "Expert Support System (ESS)", "Customer Relationship Management (CRM)"], "a": 0, "info": "TPS handles and records the daily transactions inside an organization." },
  { "topic": "IS: Handout 1", "q": "Which system manages the sequence of activities from marketing and manufacturing to shipping and billing?", "options": ["CRM", "TPS", "Supply Chain Management (SCM)", "DSS"], "a": 2, "info": "SCM handles the flow of goods and services from production to the consumer." },
  { "topic": "IS: Handout 1", "q": "Which system uses Artificial Intelligence to preserve specialist knowledge and solve complex problems?", "options": ["Business Intelligence", "Decision Support System", "Transaction Processing System", "Expert Support System"], "a": 3, "info": "Expert Support Systems (ESS) mimic human expertise using AI." },

  // SDLC Handout 2
  { "topic": "IS: SDLC Handout 2", "q": "What does SDLC stand for in systems development?", "options": ["Software Design Life Cycle", "Systems Development Life Cycle", "System Data Logic Control", "Software Deployment Life Cycle"], "a": 1, "info": "SDLC (Systems Development Life Cycle) is a structured, phased approach to building systems." },
  { "topic": "IS: SDLC Handout 2", "q": "Which phase of the SDLC involves identifying problems and determining information requirements?", "options": ["System Design", "Implementation", "Programming", "Systems Analysis"], "a": 3, "info": "Systems Analysis is the first stage where requirements and problems are identified." },
  { "topic": "IS: SDLC Handout 2", "q": "Which feasibility study asks: 'Will the system's benefits outweigh its costs?'", "options": ["Technical Feasibility", "Economic Feasibility", "Operational Feasibility", "Schedule Feasibility"], "a": 1, "info": "Economic feasibility assesses the financial viability of a project." },
  { "topic": "IS: SDLC Handout 2", "q": "Which feasibility study asks: 'Will the system be used appropriately by its intended users?'", "options": ["Technical Feasibility", "Economic Feasibility", "Operational Feasibility", "Schedule Feasibility"], "a": 2, "info": "Operational feasibility checks if the organization and users can adapt to the new system." },
  { "topic": "IS: SDLC Handout 2", "q": "What graphical standard is used by developers for visualizing, specifying, and documenting software?", "options": ["DFD", "Flowchart", "Gantt Chart", "UML"], "a": 3, "info": "Unified Modeling Language (UML) provides standard diagrams like use case and class diagrams." },
  { "topic": "IS: SDLC Handout 2", "q": "In which SDLC stage are the design specifications actually translated into software code?", "options": ["Systems Analysis", "System Design", "Programming", "Testing"], "a": 2, "info": "The Programming stage is where the actual coding of the software takes place." },
  { "topic": "IS: SDLC Handout 2", "q": "Which system development approach focuses on fast delivery by dividing the project into small, iterative subprojects?", "options": ["Waterfall Model", "Agile Development", "Prototyping", "Ad-Hoc Development"], "a": 1, "info": "Agile emphasizes short sprints, continuous feedback, and fast delivery." },
  { "topic": "IS: SDLC Handout 2", "q": "Which system development approach builds a simplified version of the system first to gather client feedback?", "options": ["Prototyping", "Waterfall Model", "Spiral Model", "Ad-Hoc Development"], "a": 0, "info": "Prototyping involves creating a draft system so the client can refine requirements early." },

  // Data/MIS Handout 3
  { "topic": "IS: Data Handout 3", "q": "What type of software acts as an interface to allow an organization to efficiently collect and manage data?", "options": ["ERP", "UML", "DBMS", "TPS"], "a": 2, "info": "A Database Management System (DBMS) acts as the bridge between applications and data resources." },
  { "topic": "IS: Data Handout 3", "q": "Which file organization method uses a primary key and mathematical calculations to find a record's location?", "options": ["Sequential", "Direct/Random", "Index Sequential", "Cloud"], "a": 1, "info": "Direct File Access uses math calculations on a primary key to jump straight to data." },
  { "topic": "IS: Data Handout 3", "q": "Which enterprise software integrates manufacturing, finance, HR, and sales into a single massive system?", "options": ["DBMS", "MIS", "DSS", "ERP"], "a": 3, "info": "Enterprise Resource Planning (ERP) connects all business departments into one platform." },
  { "topic": "IS: Data Handout 3", "q": "Which component of an Information System includes the hardware and software that facilitate fast data transmission?", "options": ["Procedures", "Telecommunications", "Software", "People"], "a": 1, "info": "Telecommunications handle the networking and transmission of data." },
  { "topic": "IS: Data Handout 3", "q": "Producing bills of materials and assembling products fall under which business functional area?", "options": ["Sales and Marketing", "Finance and Accounting", "Human Resources", "Manufacturing and Production"], "a": 3, "info": "These physical and logistical tasks are part of the Manufacturing process." },
  { "topic": "IS: Data Handout 3", "q": "Enrolling employees in benefits plans and evaluating job performance fall under which functional area?", "options": ["Finance and Accounting", "Sales and Marketing", "Human Resources", "Manufacturing and Production"], "a": 2, "info": "Human Resources is responsible for managing the personnel and their benefits." }
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

// NEW: Active Topics Tracker
let activeTopics = new Set();

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
const topicBadge = document.getElementById('topic-badge');
const modal = document.getElementById('exit-modal');
const mistakesContainer = document.getElementById('mistakes-container');
const mistakesBtn = document.getElementById('btn-review-mistakes');
const importModal = document.getElementById('import-modal');
const pdfModal = document.getElementById('pdf-modal');
const studyModal = document.getElementById('study-modal');
const studyContent = document.getElementById('study-content');

// --- INITIALIZATION ---
window.onload = () => {
    const savedHigh = localStorage.getItem('quiz_highscore') || 0;
    document.getElementById('high-score-val').textContent = savedHigh;

    const customData = localStorage.getItem('quiz_custom_data');
    if (customData) {
        try {
            fullQuizData = JSON.parse(customData);
            document.getElementById('app-title').textContent = "CUSTOM EXAM LOADED";
        } catch (e) {
            fullQuizData = defaultData;
        }
    } else {
        fullQuizData = defaultData;
    }
    
    renderTopics(); // Render the Topic Selectors based on loaded data
};

// --- TOPIC SELECTOR LOGIC ---
function renderTopics() {
    const topicContainer = document.getElementById('topic-selector');
    topicContainer.innerHTML = '';
    activeTopics.clear();

    // Extract unique topics (fallback to 'General' if no topic exists)
    const topics = [...new Set(fullQuizData.map(q => q.topic || 'General'))];
    
    topics.forEach(topic => {
        activeTopics.add(topic); // By default, all are selected
        const btn = document.createElement('button');
        btn.className = 'topic-btn active';
        btn.textContent = topic;
        
        btn.onclick = () => {
            playTone('click');
            if (btn.classList.contains('active')) {
                if (activeTopics.size > 1) { // prevent turning off ALL topics
                    btn.classList.remove('active');
                    activeTopics.delete(topic);
                } else {
                    alert("You must select at least one topic to review!");
                }
            } else {
                btn.classList.add('active');
                activeTopics.add(topic);
            }
        };
        topicContainer.appendChild(btn);
    });
}

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
        
        if (mode === 'sudden') container.parentNode.classList.add('sd-mode-active');
        
        loadQuestion();
    }, 600);
}

function prepareData() {
    // 1. Filter by Selected Topics
    let temp = fullQuizData.filter(q => activeTopics.has(q.topic || 'General'));
    
    // 2. Shuffle if needed
    if (settingShuffle) temp.sort(() => Math.random() - 0.5);
    
    // 3. Slice based on Count setting
    const count = Math.min(settingCount, temp.length);
    activeData = temp.slice(0, count);
    
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
    topicBadge.textContent = q.topic || 'General'; // Show which handout this is from
    
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
    if (settingAudio) setTimeout(speakCurrentQuestion, 500);
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
    window.speechSynthesis.cancel();
    
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
        
        mistakes.push({
            topic: q.topic || 'General',
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
    
    mistakes.push({
        topic: q.topic || 'General',
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
            <div style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:5px;">${m.topic}</div>
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
function openImportModal() { playTone('click'); importModal.style.display = 'flex'; }
function closeImportModal() { playTone('click'); importModal.style.display = 'none'; }

function saveQuestions() {
    let input = document.getElementById('import-area').value;
    
    // --- MAGICAL AI CLEANUP ---
    // 1. Automatically removes any ,, etc. that Gemini adds
    input = input.replace(/\[cite.*?\]/g, '');
    
    // 2. Automatically removes ```json or ``` if you accidentally copy those too
    input = input.replace(/```json/g, '').replace(/```/g, '');
    
    try {
        const parsed = JSON.parse(input);
        if (!Array.isArray(parsed) || parsed.length === 0) throw new Error("Invalid Format");
        
        localStorage.setItem('quiz_custom_data', JSON.stringify(parsed));
        fullQuizData = parsed;
        renderTopics(); // Refresh topic buttons
        
        playTone('success');
        alert("✅ Success! " + parsed.length + " questions loaded.");
        closeImportModal();
        document.getElementById('app-title').textContent = "CUSTOM EXAM LOADED";
    } catch (e) {
        playTone('error');
        alert("❌ Invalid JSON! Please check the format.");
        console.error("JSON Error:", e);
    }
}

function clearCustomData() {
    if(confirm("Reset to original IT1915 questions?")) {
        localStorage.removeItem('quiz_custom_data');
        location.reload();
    }
}

// --- PDF VIEWER LOGIC ---
function openPdfModal() { playTone('click'); pdfModal.style.display = 'flex'; }
function closePdfModal() { playTone('click'); pdfModal.style.display = 'none'; }

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
function openStudyModal() { playTone('click'); studyModal.style.display = 'flex'; renderStudyGuide(); }
function closeStudyModal() { playTone('click'); studyModal.style.display = 'none'; }

function renderStudyGuide() {
    studyContent.innerHTML = '';
    const searchTerm = document.getElementById('study-search').value.toLowerCase();
    
    // Only show questions from the currently Toggled Topics
    let dataToView = fullQuizData.filter(q => activeTopics.has(q.topic || 'General'));
    
    let count = 0;
    dataToView.forEach((item, index) => {
        if (searchTerm && !item.q.toLowerCase().includes(searchTerm) && !item.info.toLowerCase().includes(searchTerm)) return;
        
        const card = document.createElement('div');
        card.className = 'study-item';
        const correctAnswerText = item.options[item.a];

        card.innerHTML = `
            <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 5px;">${item.topic || 'General'} | Question #${index + 1}</div>
            <div class="study-q">${item.q}</div>
            <div class="study-a">✅ ${correctAnswerText}</div>
            <div class="study-info">ℹ️ ${item.info}</div>
        `;
        studyContent.appendChild(card);
        count++;
    });

    if (count === 0) studyContent.innerHTML = '<div style="text-align:center; padding: 20px; color: var(--text-muted);">No questions found matching your search and selected topics.</div>';
}

function filterStudyGuide() { renderStudyGuide(); }

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
