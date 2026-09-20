// ==========================================
// SUPABASE AUTHENTICATION
// Paste your project values from:
// Supabase Dashboard → Project Settings → API
// Use the anon / public key only. Never use the service_role key here.
// ==========================================

const SUPABASE_URL = "https://acgmkrxsgrrlcfgveent.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_lLYEgrwMM272oK0-YZuY7Q_O8zRZQ7p";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Kept for a later user-specific localStorage step.
// Game data still uses the existing global keys (tasks, currentXP, etc.).
function getCurrentAuthUserId() {
    return supabaseClient.auth.getSession().then(({ data }) => {
        return data.session ? data.session.user.id : null;
    });
}

const authLoading = document.getElementById("auth-loading");
const authPanel = document.getElementById("auth-panel");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const authSwitchBtn = document.getElementById("auth-switch-btn");
const authSubtitle = document.getElementById("auth-subtitle");
const authError = document.getElementById("auth-error");
const authSuccess = document.getElementById("auth-success");
const logoutBtn = document.getElementById("logout-btn");

function clearAuthMessages() {
    authError.hidden = true;
    authSuccess.hidden = true;
    authError.textContent = "";
    authSuccess.textContent = "";
}

function showAuthError(message) {
    authSuccess.hidden = true;
    authError.hidden = false;
    authError.textContent = message;
}

function showAuthSuccess(message) {
    authError.hidden = true;
    authSuccess.hidden = false;
    authSuccess.textContent = message;
}

function showLifeRpg() {

    document.body.classList.add("is-authenticated");

    if (authLoading)
        authLoading.hidden = true;

    if (authPanel)
        authPanel.hidden = true;

    setTimeout(() => {

        if (typeof loadDailyTasks === "function") {
            loadDailyTasks();
        }

    }, 500);
}
function showAuthScreen() {
    document.body.classList.remove("is-authenticated");
    if (authLoading) authLoading.hidden = true;
    if (authPanel) authPanel.hidden = false;
    clearAuthMessages();
}

function showLoginView() {
    loginForm.hidden = false;
    registerForm.hidden = true;
    authSubtitle.textContent = "Login to continue your quest";
    authSwitchBtn.textContent = "Need an account? Register";
}

function showRegisterView() {
    loginForm.hidden = true;
    registerForm.hidden = false;
    authSubtitle.textContent = "Create an account to begin";
    authSwitchBtn.textContent = "Already have an account? Login";
}

authSwitchBtn.addEventListener("click", () => {
    clearAuthMessages();
    if (registerForm.hidden) {
        showRegisterView();
    } else {
        showLoginView();
    }
});

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearAuthMessages();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const loginBtn = document.getElementById("login-btn");

    loginBtn.disabled = true;

    const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
    });

    loginBtn.disabled = false;

    if (error) {
        showAuthError(error.message);
        return;
    }

    showAuthSuccess("Logged in.");
});

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearAuthMessages();

    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value;
    const registerBtn = document.getElementById("register-btn");

    registerBtn.disabled = true;

    const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: window.location.origin
        }
    });

    registerBtn.disabled = false;

    if (error) {
        showAuthError(error.message);
        return;
    }

    if (data.session) {
        showAuthSuccess("Account created. Entering LIFE RPG...");
        return;
    }

    showAuthSuccess("Account created. Check your email to confirm, then login.");
    showLoginView();
});

logoutBtn.addEventListener("click", async () => {
    // Signs out of Supabase only. Does not clear localStorage.
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
        console.error("Logout failed:", error.message);
        return;
    }
});

const supabaseKeysMissing =
    SUPABASE_URL === "YOUR_SUPABASE_URL" ||
    SUPABASE_ANON_KEY === "YOUR_SUPABASE_ANON_KEY";

if (supabaseKeysMissing) {
    showAuthScreen();
    showLoginView();
    showAuthError("Add your SUPABASE_URL and SUPABASE_ANON_KEY in script.js");
} else {
    supabaseClient.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_IN" || (event === "INITIAL_SESSION" && session)) {
            showLifeRpg();
            return;
        }

        if (event === "SIGNED_OUT" || (event === "INITIAL_SESSION" && !session)) {
            showAuthScreen();
            showLoginView();
        }
    });

    (async function checkInitialSession() {
        const { data, error } = await supabaseClient.auth.getSession();

        if (error) {
            console.error("Session check failed:", error.message);
            showAuthScreen();
            showLoginView();
            showAuthError(error.message);
            return;
        }

        if (data.session) {
            showLifeRpg();
        } else {
            showAuthScreen();
            showLoginView();
        }
    })();
}


var scroller = document.querySelector(".scroller");
var pageinfo = document.querySelector(".page-info");
var countscrollopening = 0;
scroller.addEventListener("click", function () {
    if (countscrollopening == 0) {
        gsap.to(pageinfo, {
            bottom: "0%"
        })
        countscrollopening = 1;
    }
    else if (countscrollopening == 1) {
        gsap.to(pageinfo, {
            bottom: "100%"
        })
        countscrollopening = 0;
    }

})

function updateCurrentTime() {
    const now = new Date();
    // e.g. 11:09:05 AM
    const timeString = now.toLocaleTimeString();
    document.getElementById('current-time').textContent = timeString;
}
updateCurrentTime();
setInterval(updateCurrentTime, 1000);
function updateCurrentDate() {
    const now = new Date();
    // e.g. 09 June 2024 (day month year)
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    const dateString = now.toLocaleDateString(undefined, options);
    document.getElementById('current-date').textContent = dateString;
}
updateCurrentDate();
// Check midnight to renew date
setInterval(updateCurrentDate, 60 * 1000); // check every 1 min



let modebtn = document.querySelectorAll(".mode  > div");
let pages = document.querySelectorAll(".page");
let task_list_area = document.querySelector(".task-list-area");
var taskIndex = null;
var taskindicator = document.querySelector(".task-indicator");
var mission = document.querySelector(".mission");
document.querySelectorAll(".cross").forEach((cross) => {

    cross.addEventListener("click", () => {
        cross.parentElement.style.display = "none";
        taskindicator.style.display ="flex";

    });

});

// var optiontop = document.querySelector(".option-top");
// var optionbottom = document.querySelector(".option-bottom");
// var optionshoes = document.querySelector(".option-shoes");
// optiontop.addEventListener("click",()=>{
// gsap.to(optiontop,{
//     height:"7vh",
//     duration:0.3
// })
// })
// var lsd = JSON.parse(localStorage.getItem("tasks"));
// console.log(lsd);

modebtn.forEach((btn) => {

    btn.addEventListener("click", () => {

        let target = btn.dataset.target;
        taskindicator.style.display ="none";


        pages.forEach((page) => {
            page.style.display = "none";
        });

        document.querySelector(`.${target}`).style.display = "flex";
        console.log(`.${target}`)
    });

});
// ==========================================
// TASK / MISSION SYSTEM
// ==========================================

let task_arr =
    JSON.parse(localStorage.getItem("tasks")) || [];

var todoform = document.querySelector(".todo-form");


// ==========================================
// COMPLETED MISSION COUNT
// ==========================================

let completedCount =
    Number(localStorage.getItem("completedCount")) || 0;


// ==========================================
// XP SYSTEM
// ==========================================

let currentXP =
    Number(localStorage.getItem("currentXP")) || 0;

const MAX_XP = 1000;
const XP_PER_TASK = 2;


// ==========================================
// UPDATE XP UI
// ==========================================

function updateXP() {

    const xpText = document.querySelector(".xp-count h6");
    const xpBar = document.querySelector(".xp-count");

    if (!xpText || !xpBar) return;

    // XP text
    xpText.textContent =
        `${currentXP}/${MAX_XP}`;

    // XP bar width
    xpBar.style.width =
        `${(currentXP / MAX_XP) * 100}%`;

    // Save XP
    localStorage.setItem(
        "currentXP",
        currentXP
    );
}


// ==========================================
// UPDATE TASK INDICATOR
// ==========================================

function updateTaskIndicator() {

    const completedElement =
        document.getElementById("completedmissioncount");

    const pendingElement =
        document.getElementById("pendingmissioncount");


    // Completed missions
    if (completedElement) {
        completedElement.textContent =
            completedCount;
    }


    // Pending missions
    if (pendingElement) {

        const pendingCount =
            task_arr.filter(
                task => !task.completed
            ).length;

        pendingElement.textContent =
            pendingCount;
    }
}


// ==========================================
// ADD / UPDATE TASK
// ==========================================

todoform.addEventListener("submit", (event) => {

    event.preventDefault();

    let task_name =
        event.target[0].value;


    let obj_add_task = {

        task_name: task_name,

        completed: false

    };


    // ======================================
    // UPDATE EXISTING TASK
    // ======================================

    if (taskIndex !== null) {

        // Purani completed state preserve karo
        obj_add_task.completed =
            task_arr[taskIndex].completed;

        task_arr[taskIndex] =
            obj_add_task;

        taskIndex = null;

    }


    // ======================================
    // NEW TASK
    // ======================================

    else {

        task_arr.push(
            obj_add_task
        );

    }


    // Save tasks
    localStorage.setItem(
        "tasks",
        JSON.stringify(task_arr)
    );


    // Reset form
    todoform.reset();


    // Update UI
    todo_ui();

    updateTaskIndicator();

    updateXP();

});


// ==========================================
// TASK UI
// ==========================================

var todo_ui = () => {

    task_list_area.innerHTML = "";


    task_arr.forEach((elem, index) => {

        task_list_area.innerHTML += `

            <div class="task-card">

                <div class="task-list-name-area">

                    <h3>
                        ${elem.task_name}
                    </h3>

                </div>


                <div class="task-list-detail-area">


                    <!-- COMPLETE -->

                    <div
                        onclick="completeTask(${index})"
                        class="completed"

                        style="
                            background-color:
                            ${
                                elem.completed

                                ? "rgba(4, 197, 4, 0.8)"

                                : "rgba(199, 199, 199, 0.411)"
                            };
                        "
                    >

                        <h3>

                            ${
                                elem.completed

                                ? "completed"

                                : "complete"
                            }

                        </h3>

                    </div>


                    <!-- UPDATE -->

                    <div
                        onclick="updatetask(${index})"
                        class="update"
                    >

                        <h3>
                            update
                        </h3>

                    </div>


                    <!-- REMOVE -->

                    <div
                        onclick="removetask(${index})"
                        class="remove"
                    >

                        <h3>
                            remove
                        </h3>

                    </div>


                </div>

            </div>

        `;

    });


    updateTaskIndicator();

};


// ==========================================
// COMPLETE TASK
// ==========================================

function completeTask(index) {

    // Already completed hai
    // toh XP dobara nahi milega

    if (task_arr[index].completed) {
        return;
    }


    // Mark completed

    task_arr[index].completed =
        true;


    // ======================================
    // COMPLETED MISSION +1
    // ======================================

    completedCount++;


    // ======================================
    // XP +2
    // ======================================

    currentXP += XP_PER_TASK;


    // Maximum XP cross na kare

    if (currentXP > MAX_XP) {

        currentXP =
            MAX_XP;

    }


    // ======================================
    // SAVE TASKS
    // ======================================

    localStorage.setItem(
        "tasks",
        JSON.stringify(task_arr)
    );


    // ======================================
    // SAVE COMPLETED COUNT
    // ======================================

    localStorage.setItem(
        "completedCount",
        completedCount
    );


    // ======================================
    // SAVE XP
    // ======================================

    localStorage.setItem(
        "currentXP",
        currentXP
    );


    // ======================================
    // UPDATE UI
    // ======================================

    todo_ui();

    updateTaskIndicator();

    updateXP();

}


// ==========================================
// UPDATE TASK
// ==========================================

var updatetask = (index) => {

    let tsk =
        task_arr[index];


    taskIndex =
        index;


    todoform[0].value =
        tsk.task_name;

};


// ==========================================
// REMOVE TASK
// ==========================================

let removetask = (index) => {

    // Task remove
    task_arr.splice(
        index,
        1
    );


    // Save tasks
    localStorage.setItem(
        "tasks",
        JSON.stringify(task_arr)
    );


    // Update UI
    todo_ui();

    updateTaskIndicator();

    updateXP();

};


// ==========================================
// INITIAL LOAD
// ==========================================

todo_ui();

updateTaskIndicator();

updateXP();

// const characterImages = document.querySelectorAll(".character-box img");

// const defaultCharacter = {
//     bottom: "./assets/vault/Male Dress Bottom/man bottom frame default.png",
//     shoes: "./assets/vault/Male Shoes/shoes frame default.png",
//     top: "./assets/vault/Male Dress Top/man top default frame.png",
//     face: "./assets/vault/Others/face frame default.png"
// };

// let savedCharacter = JSON.parse(localStorage.getItem("character"));

// if (!savedCharacter) {
//     localStorage.setItem("character", JSON.stringify(defaultCharacter));
//     savedCharacter = defaultCharacter;
// }

// characterImages[0].src = savedCharacter.bottom;
// characterImages[1].src = savedCharacter.shoes;
// characterImages[2].src = savedCharacter.top;
// characterImages[3].src = savedCharacter.face;






var vaultcollection = document.querySelectorAll(".vault-collection");
var collectionoption = document.querySelectorAll(".collection-option > div");

collectionoption.forEach((btn) => {

    btn.addEventListener("click", () => {

        // Sab buttons ko previous/default state mein lao
        collectionoption.forEach((otherBtn) => {
            gsap.to(otherBtn, {
                height: "4vh",
                duration: 0.3
            });
        });

        // Clicked button ko active state do
        gsap.to(btn, {
            height: "7vh",
            duration: 0.3
        });

        // Collection change
        let target = btn.dataset.target;

        vaultcollection.forEach((page) => {
            page.style.display = "none";
        });

        document.querySelector(`.${target}`).style.display = "flex";
    });

});


// ==========================================
// CHARACTER
// ==========================================

const characterImages = document.querySelectorAll(
    ".try-box img, .default-theme .character-box img"
);

const defaultCharacter = {
    bottom: "./assets/vault/Male Dress Bottom/man bottom frame default.png",
    shoes: "./assets/vault/Male Shoes/shoes frame default.png",
    top: "./assets/vault/Male Dress Top/man top default frame.png",
    face: "./assets/vault/Others/face frame default.png"
};

let character =
    JSON.parse(localStorage.getItem("character")) ||
    { ...defaultCharacter };


    function loadCharacter() {
        // Vault try-box
        document.querySelectorAll(".try-box img")[0].src = character.bottom;
        document.querySelectorAll(".try-box img")[1].src = character.shoes;
        document.querySelectorAll(".try-box img")[2].src = character.top;
        document.querySelectorAll(".try-box img")[3].src = character.face;
    
        // Main character-box
        document.querySelectorAll(".default-theme .character-box img")[0].src = character.bottom;
        document.querySelectorAll(".default-theme .character-box img")[1].src = character.shoes;
        document.querySelectorAll(".default-theme .character-box img")[2].src = character.top;
        document.querySelectorAll(".default-theme .character-box img")[3].src = character.face;
    }

function saveCharacter() {

    localStorage.setItem(
        "character",
        JSON.stringify(character)
    );

}


loadCharacter();


// ==========================================
// INVENTORY
// ==========================================

let inventory =
    JSON.parse(localStorage.getItem("inventory")) || {
        top: [],
        bottom: [],
        shoes: []
    };


function saveInventory() {

    localStorage.setItem(
        "inventory",
        JSON.stringify(inventory)
    );

}


// ==========================================
// VAULT ELEMENTS
// ==========================================

const topCollection =
    document.querySelector(".top-collection");

const bottomCollection =
    document.querySelector(".bottom-collection");

const shoesCollection =
    document.querySelector(".shoes-collection");


// ==========================================
// LOAD VAULT
// ==========================================

function loadVault() {

    loadCollection(
        topCollection,
        inventory.top,
        "top"
    );

    loadCollection(
        bottomCollection,
        inventory.bottom,
        "bottom"
    );

    loadCollection(
        shoesCollection,
        inventory.shoes,
        "shoes"
    );

}


// ==========================================
// LOAD EACH COLLECTION
// ==========================================

function loadCollection(collection, items, type) {

    const cards =
        collection.querySelectorAll(".collection-card");


    // Pehle existing cards ko empty karo
    cards.forEach((card) => {

        card.innerHTML = "";

        card.removeAttribute("data-id");
        card.removeAttribute("data-type");

        card.onclick = null;

    });


    // Purchased items ko cards me daalo
    items.forEach((item, index) => {

        if (!cards[index]) return;


        const card = cards[index];


        card.dataset.id = item.id;
        card.dataset.type = type;


        const img =
            document.createElement("img");

        img.src = item.src;
        img.alt = type;


        card.appendChild(img);


        // ==================================
        // EQUIP ITEM
        // ==================================

        card.onclick = () => {
            character[type] = item.src;
        
            saveCharacter();
            loadCharacter();
        
            console.log("Equipped:", type, item.id);
        };

    });

}


// ==========================================
// INITIAL VAULT LOAD
// ==========================================

loadVault();


// ==========================================
// COINS
// ==========================================

let coins = 100;

const savedCoins =
    localStorage.getItem("coins");

if (savedCoins !== null) {

    const parsedCoins =
        Number(savedCoins);

    if (!Number.isNaN(parsedCoins)) {
        coins = parsedCoins;
    }

}

const coinCountEl =
    document.querySelector(".coin-count");


function saveCoins() {

    localStorage.setItem(
        "coins",
        coins
    );

}


function updateCoinsUI() {

    if (coinCountEl) {
        coinCountEl.textContent = coins;
    }

    saveCoins();

}


function showStoreFeedback(card, message) {

    let feedback =
        card.querySelector(".store-feedback");

    if (!feedback) {

        feedback =
            document.createElement("h5");

        feedback.className =
            "store-feedback";

        card.appendChild(feedback);

    }

    feedback.textContent = message;
    feedback.style.display = "block";

    clearTimeout(feedback.hideTimer);

    feedback.hideTimer = setTimeout(() => {
        feedback.style.display = "none";
    }, 1600);

}


updateCoinsUI();

// ==========================================
// STORE BUY
// ==========================================

const storeCards =
    document.querySelectorAll(".store-card");


storeCards.forEach((card) => {

    const buyButton =
        card.querySelector(".buy");


    buyButton.addEventListener("click", () => {


        // -----------------------------
        // CARD DATA
        // -----------------------------

        const type =
            card.dataset.type;

        const id =
            card.dataset.id;


        const image =
            card.querySelector(
                ".product-img img"
            );


        const src =
            image.getAttribute("src");


        const priceText =
            card.querySelector(".price h5");

        const price =
            Number(
                priceText
                    ? priceText.textContent.trim()
                    : 0
            );


        // -----------------------------
        // CHECK DUPLICATE
        // -----------------------------

        const alreadyBought =
            inventory[type].some(
                (item) => item.id === id
            );


        if (alreadyBought) {

            console.log(
                "Already purchased:",
                id
            );

            return;

        }


        // -----------------------------
        // CHECK COINS
        // -----------------------------

        if (price > coins) {

            showStoreFeedback(
                card,
                "insufficient coin"
            );

            return;

        }


        coins -= price;

        updateCoinsUI();


        // -----------------------------
        // SAVE ITEM
        // -----------------------------

        inventory[type].push({

            id: id,

            src: src

        });


        // -----------------------------
        // SAVE LOCAL STORAGE
        // -----------------------------

        saveInventory();


        // -----------------------------
        // UPDATE VAULT
        // -----------------------------

        loadVault();


        console.log(
            "Bought:",
            type,
            id
        );

    });

});
// ==========================================
// DAILY TASK SYSTEM
// ==========================================

var DAILY_TASK_COUNT = 5;
var todaysDailyTasks = [];
var todaysDailyDate = "";


// ==========================================
// GET TODAY'S DATE
// ==========================================

function getTodayDate() {

    const now = new Date();

    return `${now.getFullYear()}-${String(
        now.getMonth() + 1
    ).padStart(2, "0")}-${String(
        now.getDate()
    ).padStart(2, "0")}`;
}


// ==========================================
// DATE SEED
// ==========================================

function getDateSeed(dateString) {

    let seed = 0;

    for (let i = 0; i < dateString.length; i++) {

        seed =
            (seed * 31 +
                dateString.charCodeAt(i)) >>> 0;
    }

    return seed;
}


// ==========================================
// SEEDED RANDOM
// ==========================================

function seededRandom(seed) {

    const x =
        Math.sin(seed) * 10000;

    return x - Math.floor(x);
}


// ==========================================
// SELECT EXACTLY 5 TASKS
// ==========================================

function selectDailyTasks(tasks, dateString) {

    const seed =
        getDateSeed(dateString);

    const shuffled =
        [...tasks];

    for (
        let i = shuffled.length - 1;
        i > 0;
        i--
    ) {

        const random =
            seededRandom(seed + i);

        const j =
            Math.floor(
                random * (i + 1)
            );

        [
            shuffled[i],
            shuffled[j]
        ] = [
            shuffled[j],
            shuffled[i]
        ];
    }

    // ALWAYS RETURN ONLY 5
    return shuffled.slice(0, 5);
}


// ==========================================
// LOAD DAILY TASKS
// ==========================================

async function loadDailyTasks() {

    const dailyTaskContainer =
        document.querySelector(
            "#daily-task-scroller"
        );

    if (!dailyTaskContainer) {

        console.log(
            "Daily task container not found."
        );

        return;
    }

    const today =
        getTodayDate();

    const {
        data,
        error
    } =
        await supabaseClient
            .from("daily_tasks")
            .select("id, task")
            .eq("active", true);

    if (error) {

        console.error(
            "Daily tasks error:",
            error.message
        );

        return;
    }

    if (!data || data.length < 5) {

        console.error(
            "At least 5 active daily tasks are required."
        );

        return;
    }

    todaysDailyTasks =
        selectDailyTasks(
            data,
            today
        );

    todaysDailyDate =
        today;

    renderDailyTasks();
}


// ==========================================
// RENDER DAILY TASKS
// ==========================================

function renderDailyTasks() {

    const dailyTaskContainer =
        document.querySelector(
            "#daily-task-scroller"
        );

    if (!dailyTaskContainer) {
        return;
    }

    dailyTaskContainer.innerHTML = "";

    todaysDailyTasks.forEach(
        (task) => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "daily-task-card";

            card.innerHTML = `
                <h4>${task.task}</h4>
            `;

            dailyTaskContainer.appendChild(
                card
            );
        }
    );
}


// ==========================================
// INITIAL LOAD
// ==========================================


    loadDailyTasks();


