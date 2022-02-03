'use strict';
// utilities
/**
 * @param {Array<object>} arrayOfObj
 * @param {string|number} sortKey
 */
function bubbleSortObj(arrayOfObj, sortKey) {
    for (let i = 0; i < arrayOfObj.length - 1; i++) {
        for (let j = 0; j < arrayOfObj.length - 1 - i; j++) {
            if (arrayOfObj[j][sortKey] > arrayOfObj[j + 1][sortKey]) {
                const tmp = arrayOfObj[j + 1];
                arrayOfObj[j + 1] = arrayOfObj[j];
                arrayOfObj[j] = tmp;
            }
        }
    }
    return arrayOfObj;
}

// wait until all the DOM are loaded
window.onload = () => {
    // menu control
    const tabs = document.getElementsByClassName("tab");
    const rouletteImg = document.getElementById("roulette-img");
    for (const tab of tabs) {
        tab.addEventListener("click", function () {
            // control is-active class of tab-menu
            document.querySelector(".is-active").classList.remove("is-active");
            this.classList.add("is-active");
            // control is-show class of tab-contents
            document.querySelector(".is-show").classList.remove("is-show");
            document.getElementsByClassName("content")[parseInt(this.id, 10)].classList.add("is-show");
            rouletteImg.src = "./img/satsumashochu-logo.jpg";
        });
    }

    // roulette control
    let isRouletting = false;
    const rouletteBtn = document.getElementById("roulette-btn");
    let target;
    let timer;
    rouletteBtn.addEventListener("click", function() {
        if (isRouletting) {
            // press roulette stop
            isRouletting = false;
            rouletteBtn.style.background = "#3b485f";
            rouletteBtn.innerHTML = "Start";
            clearInterval(timer);
            const result = target[Math.floor(Math.random() * target.length)];
            rouletteImg.src = `./img/${ result }.jpg`;
        } else {
            // press roulette start
            isRouletting = true;
            rouletteBtn.style.background = "#706a53";
            rouletteBtn.innerHTML = "Stop";
            const threshold = document.getElementById("rare-selector").value;
            target = satsumaShochu.filter(shochu => shochu.stock > 0)
                .filter(shochu => shochu.rare >= threshold)
                .map(shochu => shochu.name);
            if (target.length === 0) {
                isRouletting = false;
                rouletteBtn.style.background = "#706a53";
                rouletteBtn.innerHTML = "Start";
                console.log("No matching shochu...let's buy some!");
                return;
            }
            timer = setInterval(() => {
                const shochuName = target[Math.floor(Math.random() * target.length)];
                rouletteImg.src = `./img/${ shochuName }.jpg`;
            }, 0.2);
        }
    })

    // DB control
    const table = document.getElementById("database");
    const tableBody = document.getElementById("table-body");
    function createTableElem(shochu) {
        const row = document.createElement("tr");
        // Image cell
        const imgCell = document.createElement("td");
        const imgElem = document.createElement("img");
        imgElem.src = `./img/${ shochu.name }.jpg`;
        imgCell.appendChild(imgElem);
        row.appendChild(imgCell);

        // Name cell
        const nameCell = document.createElement("td");
        const nameText = document.createTextNode(shochu.nameJp);
        nameCell.appendChild(nameText);
        row.appendChild(nameCell);

        // Rare cell
        const rareCell = document.createElement("td");
        let star = "";
        for (let i = 0; i < shochu.rare; i++) {
            star += "☆";
        }
        const rareText = document.createTextNode(star);
        rareCell.appendChild(rareText);
        row.appendChild(rareCell);

        tableBody.appendChild(row);
    };
    // default table
    satsumaShochu.map(createTableElem);
    table.appendChild(tableBody);

    // sorting control
    let nameAscendingOrder = false;
    const nameSortBtn = document.getElementById("name-sort-btn");
    nameSortBtn.addEventListener("click", () => {
        if (nameAscendingOrder) {
            nameAscendingOrder = false;
            nameSortBtn.innerHTML = "▼";
            tableBody.innerHTML = "";
            bubbleSortObj(satsumaShochu, "name").reverse().map(createTableElem);
        } else {
            nameAscendingOrder = true;
            nameSortBtn.innerHTML = "▲";
            tableBody.innerHTML = "";
            bubbleSortObj(satsumaShochu, "name").map(createTableElem);
        }
    });

    let rareAscendingOrder = false;
    const rareSortBtn = document.getElementById("rare-sort-btn");
    rareSortBtn.addEventListener("click", () => {
        if (rareAscendingOrder) {
            rareAscendingOrder = false;
            rareSortBtn.innerHTML = "▼";
            tableBody.innerHTML = "";
            bubbleSortObj(satsumaShochu, "rare").reverse().map(createTableElem);
        } else {
            rareAscendingOrder = true;
            rareSortBtn.innerHTML = "▲";
            tableBody.innerHTML = "";
            bubbleSortObj(satsumaShochu, "rare").map(createTableElem);
        }
    });
};
