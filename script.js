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
let task_arr = JSON.parse(localStorage.getItem("tasks")) || [];

var todoform = document.querySelector(".todo-form");

var completedCount =
    Number(localStorage.getItem("completedCount")) || 0;


// ==============================
// COUNTER UPDATE
// ==============================

function updateTaskIndicator() {

    document.getElementById("completedmissioncount").textContent =
        completedCount;

    document.getElementById("pendingmissioncount").textContent =
        task_arr.filter(task => !task.completed).length;
}


// ==============================
// ADD / UPDATE TASK
// ==============================

todoform.addEventListener("submit", (event) => {

    event.preventDefault();

    let task_name = event.target[0].value;

    let obj_add_task = {
        task_name: task_name,
        completed: false
    };


    // UPDATE EXISTING TASK
    if (taskIndex !== null) {

        // purani completed state preserve karo
        obj_add_task.completed =
            task_arr[taskIndex].completed;

        task_arr[taskIndex] = obj_add_task;

        taskIndex = null;
    }


    // NEW TASK
    else {

        task_arr.push(obj_add_task);
    }


    localStorage.setItem(
        "tasks",
        JSON.stringify(task_arr)
    );

    todoform.reset();

    todo_ui();

    updateTaskIndicator();
});


// ==============================
// TASK UI
// ==============================

var todo_ui = () => {

    task_list_area.innerHTML = "";

    task_arr.forEach((elem, index) => {

        task_list_area.innerHTML += `
        
        <div class="task-card">

            <div class="task-list-name-area">
                <h3>${elem.task_name}</h3>
            </div>

            <div class="task-list-detail-area">

                <div 
                    onclick="completeTask(${index})"
                    class="completed"
                    style="
                        background-color: ${
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

                <div 
                    onclick="updatetask(${index})"
                    class="update"
                >
                    <h3>update</h3>
                </div>

                <div 
                    onclick="removetask(${index})"
                    class="remove"
                >
                    <h3>remove</h3>
                </div>

            </div>

        </div>

        `;
    });

    updateTaskIndicator();
};


// ==============================
// COMPLETE TASK
// ==============================

function completeTask(index) {

    // already completed hai toh kuch mat karo
    if (task_arr[index].completed) {
        return;
    }

    task_arr[index].completed = true;

    // completed +1
    completedCount++;

    // save tasks
    localStorage.setItem(
        "tasks",
        JSON.stringify(task_arr)
    );

    // save completed count
    localStorage.setItem(
        "completedCount",
        completedCount
    );

    todo_ui();

    updateTaskIndicator();
}


// ==============================
// UPDATE TASK
// ==============================

var updatetask = (index) => {

    let tsk = task_arr[index];

    taskIndex = index;

    todoform[0].value = tsk.task_name;
};


// ==============================
// REMOVE TASK
// ==============================

let removetask = (index) => {

    task_arr.splice(index, 1);

    localStorage.setItem(
        "tasks",
        JSON.stringify(task_arr)
    );

    todo_ui();

    updateTaskIndicator();
};

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

