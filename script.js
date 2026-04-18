let history = JSON.parse(localStorage.getItem('algoMentorHistory')) || [];
let profile = JSON.parse(localStorage.getItem('algoMentorProfile')) || { name: "Learner", dob: "", image: "" };

document.addEventListener('DOMContentLoaded', () => {
    updateUI(); 
    
    if (document.getElementById('historyList')) renderHistory();
    if (document.getElementById('profName')) loadProfile();
});


async function askInstructor() {
    const userInput = document.getElementById('userInput').value;
    if (!userInput) return;

    const askBtn = document.getElementById('askBtn');
    askBtn.disabled = true;
    document.getElementById('loading').classList.remove('hidden');

    try {
        const response = await fetch("/api/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                prompt: `You are a DSA Instructor. Explain simply: ${userInput}` 
            })
        });

        const data = await response.json();
        
        const result = data.candidates[0].content.parts[0].text;
        document.getElementById('aiResponse').innerHTML = formatMarkdown(result);
        document.getElementById('responseContainer').classList.remove('hidden');
    } catch (error) {
        console.error(error);
        alert("Error: Check Vercel Logs");
    } finally {
        document.getElementById('loading').classList.add('hidden');
        askBtn.disabled = false;
    }
}

function formatMarkdown(text) {
    return text
        .replace(/^### (.*$)/gim, '<h3 style="color: #ff9800; margin-top: 15px;">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 style="color: #ff9800; margin-top: 20px;">$1</h2>')
        .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #ff9800; font-weight: 700;">$1</strong>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br>');
}

function updateUI() {
    const nameDisplay = document.getElementById('header-username');
    const avatarImg = document.getElementById('header-avatar');
    const statCount = document.getElementById('stat-count');
    
    if (nameDisplay) nameDisplay.innerText = profile.name || "Learner";
    if (avatarImg && profile.image) avatarImg.src = profile.image;
    if (statCount) statCount.innerText = history.length;
}

function loadProfile() {
    const nameInput = document.getElementById('profName');
    const dobInput = document.getElementById('profDOB');
    if (!nameInput) return;

    nameInput.value = profile.name || "";
    if (dobInput) dobInput.value = profile.dob || "";
    
    const dispName = document.getElementById('display-name');
    const dispDob = document.getElementById('display-dob');
    const preview = document.getElementById('profile-preview');

    if (dispName) dispName.innerText = profile.name || "Learner";
    if (dispDob) dispDob.innerText = profile.dob || "Not Set";
    if (preview && profile.image) preview.src = profile.image;
}

function saveProfile() {
    const name = document.getElementById('profName').value;
    const dob = document.getElementById('profDOB').value;
    const file = document.getElementById('profImg').files[0];

    const finalize = (imgData) => {
        profile = { name, dob, image: imgData || profile.image };
        localStorage.setItem('algoMentorProfile', JSON.stringify(profile));
        updateUI();
        loadProfile();
        alert("Profile Saved!");
    };

    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => finalize(e.target.result);
        reader.readAsDataURL(file);
    } else {
        finalize(null);
    }
}

function previewImage(event) {
    const output = document.getElementById('profile-preview');
    if (output && event.target.files[0]) {
        output.src = URL.createObjectURL(event.target.files[0]);
    }
}

function saveToHistory(q, a) {
    history.unshift({ q, a, date: new Date().toLocaleDateString() });
    if (history.length > 15) history.pop();
    localStorage.setItem('algoMentorHistory', JSON.stringify(history));
}

function renderHistory() {
    const list = document.getElementById('historyList');
    if (!list) return;
    list.innerHTML = history.map(item => `
        <div class="card history-card" style="margin-bottom: 12px; border-left: 3px solid var(--accent);">
            <h4 style="color: #ff9800;">${item.q}</h4>
            <p style="font-size: 0.8rem; color: #94a3b8;">${item.a.substring(0, 100).replace(/[#*`]/g, '')}...</p>
        </div>
    `).join('');
}

function copyResponse() {
    const aiText = document.getElementById('aiResponse');
    if (aiText) {
        navigator.clipboard.writeText(aiText.innerText);
        alert("Copied!");
    }
}

function switchSection(id) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.add('hidden'));
    const target = document.getElementById(id);
    if (target) target.classList.remove('hidden');
    
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    const activeNav = document.querySelector(`.nav-links li[onclick*="${id}"]`);
    if (activeNav) activeNav.classList.add('active');
// }
// // CONFIGURATION

// // CONFIGURATION
// // We use gemini-1.5-flash as the basic, fast model.
// const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
// const API_KEY = "AIzaSyBRt85tS0sBseaidGP8mFRHmbeLe1Dv7Ts"; 

// // STATE MANAGEMENT
// let history = JSON.parse(localStorage.getItem('algoMentorHistory')) || [];
// let profile = JSON.parse(localStorage.getItem('algoMentorProfile')) || { name: "Learner", dob: "", image: "" };

// // INITIALIZE
// document.addEventListener('DOMContentLoaded', () => {
//     updateUI();
//     if (document.getElementById('historyList')) renderHistory();
//     if (document.getElementById('profName')) loadProfile();
// });

// /**
//  * MAIN AI FUNCTION
//  * Fixed to prevent "Model Not Found" and "Safety" errors
//  */
// async function askInstructor() {
//     const userInputEl = document.getElementById('userInput');
//     if (!userInputEl) return;
    
//     const userInput = userInputEl.value.trim();
//     if (!userInput) return;

//     const askBtn = document.getElementById('askBtn');
//     const loading = document.getElementById('loading');
//     const responseBox = document.getElementById('responseContainer');
//     const aiText = document.getElementById('aiResponse');

//     // UI Reset
//     askBtn.disabled = true;
//     if (loading) loading.classList.remove('hidden');
//     if (responseBox) responseBox.classList.add('hidden');
//     if (aiText) aiText.innerHTML = ""; 

//     try {
//         const response = await fetch(`${API_URL}?key=${API_KEY}`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//                 contents: [{
//                     parts: [{ text: `You are a DSA Instructor. Explain simply: ${userInput}` }]
//                 }],
//                 // Standard generation config for stability
//                 generationConfig: {
//                     temperature: 0.7,
//                     maxOutputTokens: 800
//                 }
//             })
//         });

//         const data = await response.json();

//         // Check for API errors
//         if (data.error) {
//             throw new Error(data.error.message);
//         }

//         if (data.candidates && data.candidates[0].content) {
//             const result = data.candidates[0].content.parts[0].text;
            
//             // Format and show result
//             if (aiText) aiText.innerHTML = formatMarkdown(result);
//             if (responseBox) responseBox.classList.remove('hidden');
            
//             saveToHistory(userInput, result);
//             updateUI();
//         } else {
//             throw new Error("Empty response. Please try a different question.");
//         }

//     } catch (error) {
//         console.error("AI Error:", error);
//         alert("System Error: " + error.message);
//     } finally {
//         if (loading) loading.classList.add('hidden');
//         askBtn.disabled = false;
//     }
// }

// /**
//  * FORMATTING ENGINE
//  * Converts AI symbols into clean Orange/Purple UI elements
//  */
// function formatMarkdown(text) {
//     return text
//         // Headings: ### Title
//         .replace(/^### (.*$)/gim, '<h3 style="color: #ff9800; margin-top: 15px;">$1</h3>')
//         .replace(/^## (.*$)/gim, '<h2 style="color: #ff9800; margin-top: 20px;">$1</h2>')
//         // Bold: **text**
//         .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #ff9800; font-weight: 700;">$1</strong>')
//         // Inline Code: `text`
//         .replace(/`(.*?)`/g, '<code style="background: #0f172a; padding: 2px 5px; border-radius: 4px; color: #8b5cf6;">$1</code>')
//         // New lines
//         .replace(/\n/g, '<br>');
// }

// /**
//  * PROFILE & UI HELPERS
//  */
// function updateUI() {
//     const nameDisplay = document.getElementById('header-username');
//     const avatarImg = document.getElementById('header-avatar');
//     const statCount = document.getElementById('stat-count');
    
//     if (nameDisplay) nameDisplay.innerText = profile.name || "Learner";
//     if (avatarImg && profile.image) avatarImg.src = profile.image;
//     if (statCount) statCount.innerText = history.length;
// }

// function loadProfile() {
//     const nameInput = document.getElementById('profName');
//     const dobInput = document.getElementById('profDOB');
//     if (!nameInput) return;

//     nameInput.value = profile.name || "";
//     if (dobInput) dobInput.value = profile.dob || "";
    
//     const dispName = document.getElementById('display-name');
//     const dispDob = document.getElementById('display-dob');
//     const preview = document.getElementById('profile-preview');

//     if (dispName) dispName.innerText = profile.name || "Learner";
//     if (dispDob) dispDob.innerText = profile.dob || "Not Set";
//     if (preview && profile.image) preview.src = profile.image;
// }

// function saveProfile() {
//     const name = document.getElementById('profName').value;
//     const dob = document.getElementById('profDOB').value;
//     const file = document.getElementById('profImg').files[0];

//     const finalize = (imgData) => {
//         profile = { name, dob, image: imgData || profile.image };
//         localStorage.setItem('algoMentorProfile', JSON.stringify(profile));
//         updateUI();
//         loadProfile();
//         alert("Profile Updated!");
//     };

//     if (file) {
//         const reader = new FileReader();
//         reader.onload = (e) => finalize(e.target.result);
//         reader.readAsDataURL(file);
//     } else {
//         finalize(null);
//     }
// }

// function previewImage(event) {
//     const reader = new FileReader();
//     reader.onload = function() {
//         const output = document.getElementById('profile-preview');
//         if (output) output.src = reader.result;
//     }
//     if (event.target.files[0]) reader.readAsDataURL(event.target.files[0]);
// }

// /**
//  * HISTORY UTILS
//  */
// function saveToHistory(q, a) {
//     history.unshift({ q, a, date: new Date().toLocaleDateString() });
//     if (history.length > 15) history.pop();
//     localStorage.setItem('algoMentorHistory', JSON.stringify(history));
//     if (document.getElementById('historyList')) renderHistory();
// }

// function renderHistory() {
//     const list = document.getElementById('historyList');
//     if (!list) return;
//     list.innerHTML = history.map(item => `
//         <div class="card history-card" style="margin-bottom: 12px; border-left: 3px solid var(--accent);">
//             <h4 style="color: #ff9800;">${item.q}</h4>
//             <p style="font-size: 0.8rem; color: #94a3b8;">${item.a.substring(0, 100).replace(/[#*`]/g, '')}...</p>
//         </div>
//     `).join('');
// }

// function copyResponse() {
//     const aiText = document.getElementById('aiResponse');
//     if (!aiText) return;
//     navigator.clipboard.writeText(aiText.innerText);
//     alert("Copied to clipboard!");
// }

// /**
//  * PAGE NAVIGATION (For Single Page logic)
//  */
// function switchSection(id) {
//     const sections = document.querySelectorAll('.content-section');
//     const title = document.getElementById('section-title');
    
//     sections.forEach(s => s.classList.add('hidden'));
//     const target = document.getElementById(id);
//     if (target) target.classList.remove('hidden');
    
//     if (title) title.innerText = id.charAt(0).toUpperCase() + id.slice(1);
    
//     document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
//     const activeNav = document.querySelector(`.nav-links li[onclick*="${id}"]`);
//     if (activeNav) activeNav.classList.add('active');
// }
// // Make sure saveProfile calls loadProfile() at the end to refresh the card

// // CONFIGURATION
// const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";
// const API_KEY = "AIzaSyBRt85tS0sBseaidGP8mFRHmbeLe1Dv7Ts"; 

// // STATE
// let history = JSON.parse(localStorage.getItem('algoMentorHistory')) || [];
// let profile = JSON.parse(localStorage.getItem('algoMentorProfile')) || { name: "Learner", dob: "", image: "" };

// // INITIALIZE (Runs on every page load)
// document.addEventListener('DOMContentLoaded', () => {
//     updateUI(); // Updates top header (Name/Avatar/Stats)
    
//     // Page-specific checks (prevents errors)
//     if (document.getElementById('historyList')) renderHistory();
//     if (document.getElementById('profName')) loadProfile();
// });

// // 1. FORMATTING ENGINE (Converts stars and hashtags to Orange UI)
// function formatMarkdown(text) {
//     return text
//         // Headings: ### Title -> Orange Header
//         .replace(/^### (.*$)/gim, '<h3 style="margin: 15px 0 10px 0; color: #ff9800; border-bottom: 1px solid #334155; padding-bottom: 5px;">$1</h3>')
//         .replace(/^## (.*$)/gim, '<h2 style="margin: 20px 0 10px 0; color: #ff9800;">$1</h2>')
//         // Bold: **text** -> Orange Bold
//         .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #ff9800; font-weight: 700;">$1</strong>')
//         // Inline Code: `text`
//         .replace(/`(.*?)`/g, '<code style="background: #0f172a; padding: 2px 5px; border-radius: 4px; color: #8b5cf6; font-family: monospace;">$1</code>')
//         // New Lines
//         .replace(/\n/g, '<br>');
// }

// // 2. MAIN AI LOGIC
// async function askInstructor() {
//     const userInputEl = document.getElementById('userInput');
//     if (!userInputEl || !userInputEl.value) return;

//     const userInput = userInputEl.value;
//     const askBtn = document.getElementById('askBtn');
//     const loading = document.getElementById('loading');
//     const responseBox = document.getElementById('responseContaine.///
// 
// r');
//     const aiText = document.getElementById('aiResponse');

//     // UI Reset
//     askBtn.disabled = true;
//     if(loading) loading.classList.remove('hidden');   
//     if(responseBox) responseBox.classList.add('hidden');  

//     try {
//         const response = await fetch(API_URL, {
//             method: "POST",
//             headers: { 
//                 "Content-Type": "application/json",
//                 "X-goog-api-key": API_KEY 
//             },
//             body: JSON.stringify({
//                 contents: [{
//                     parts: [{ text: `You are a DSA Instructor. Answer clearly using ### for titles and ** for bold. User: ${userInput}` }]
//                 }]
//             })
//         });

//         const data = await response.json();
        
//         // CATCH REAL ERRORS (Quota, Location, etc.)
//         if (data.error) {
//             throw new Error(data.error.message);
//         }

//         const result = data.candidates[0].content.parts[0].text;
        
//         if(aiText) aiText.innerHTML = formatMarkdown(result);
//         if(loading) loading.classList.add('hidden');      
//         if(responseBox) responseBox.classList.remove('hidden'); 
        
//         saveToHistory(userInput, result);
//         updateUI();

//     } catch (error) {
//         if(loading) loading.classList.add('hidden');
//         // This alert now shows the REAL problem
//         alert("AI MESSAGE: " + error.message);
//         console.error("Debug Error:", error);
//     } finally {
//         askBtn.disabled = false;
//     }
// }

// // 3. UI HELPERS
// function updateUI() {
//     // Global Header Elements
//     const nameDisplay = document.getElementById('header-username');
//     const avatarImg = document.getElementById('header-avatar');
//     const statCount = document.getElementById('stat-count');
    
//     if (nameDisplay) nameDisplay.innerText = profile.name || "Learner";
//     if (avatarImg && profile.image) avatarImg.src = profile.image;
//     if (statCount) statCount.innerText = history.length;
// }

// function loadProfile() {
//     const nameInput = document.getElementById('profName');
//     if (!nameInput) return; // Exit if not on profile page

//     // Fill inputs
//     nameInput.value = profile.name || "";
//     document.getElementById('profDOB').value = profile.dob || "";
    
//     // Fill visual card
//     document.getElementById('display-name').innerText = profile.name || "Learner";
//     document.getElementById('display-dob').innerText = profile.dob || "Not Set";
    
//     if(profile.image) {
//         document.getElementById('profile-preview').src = profile.image;
//         document.getElementById('header-avatar').src = profile.image;
//     }
// }

// function saveProfile() {
//     const name = document.getElementById('profName').value;
//     const dob = document.getElementById('profDOB').value;
//     const file = document.getElementById('profImg').files[0];

//     const finalize = (imgData) => {
//         profile = { name, dob, image: imgData || profile.image };
//         localStorage.setItem('algoMentorProfile', JSON.stringify(profile));
//         updateUI();
//         loadProfile();
//         alert("Profile Updated Successfully!");
//     };

//     if (file) {
//         const reader = new FileReader();
//         reader.onload = (e) => finalize(e.target.result);
//         reader.readAsDataURL(file);
//     } else {
//         finalize(null);
//     }
// }

// function previewImage(event) {
//     const reader = new FileReader();
//     reader.onload = function() {
//         const output = document.getElementById('profile-preview');
//         if (output) output.src = reader.result;
//     }
//     if(event.target.files[0]) reader.readAsDataURL(event.target.files[0]);
// }

// // 4. HISTORY & UTILS
// function saveToHistory(q, a) {
//     history.unshift({ q, a, date: new Date().toLocaleDateString() });
//     if(history.length > 15) history.pop();
//     localStorage.setItem('algoMentorHistory', JSON.stringify(history));
//     if (document.getElementById('historyList')) renderHistory();
// }

// function renderHistory() {
//     const list = document.getElementById('historyList');
//     if(!list) return;
//     list.innerHTML = history.map(item => `
//         <div class="card history-card" style="margin-bottom:15px; border-left: 4px solid var(--accent);">
//             <h4 style="color: #ff9800;">${item.q}</h4>
//             <div style="font-size: 0.85rem; color: #cbd5e1; margin-top: 10px;">${formatMarkdown(item.a.substring(0, 150))}...</div>
//         </div>
//     `).join('');
// }

// function copyResponse() {
//     const aiText = document.getElementById('aiResponse');
//     if(!aiText) return;
//     navigator.clipboard.writeText(aiText.innerText);
//     alert("Copied to clipboard!");
// }
}