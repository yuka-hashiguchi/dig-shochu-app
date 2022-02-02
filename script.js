'use strict';

hljs.initHighlightingOnLoad();

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
            rouletteBtn.style.background = "#706a53";
            rouletteBtn.innerHTML = "Start";
            clearInterval(timer);
            const result = target[Math.floor(Math.random() * target.length)];
            rouletteImg.src = `./img/${ result }.jpg`;
        } else {
            // press roulette start
            isRouletting = true;
            rouletteBtn.style.background = "#3b485f";
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
    const tableBody = document.createElement("tbody");
    satsumaShochu.map(shochu => {
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

        // Memo cell
        const memoCell = document.createElement("td");
        const memoText = document.createTextNode(shochu.rare);
        memoCell.appendChild(memoText);
        row.appendChild(memoCell);

        tableBody.appendChild(row);
    })
    table.appendChild(tableBody);
};
