// document.getElementById("myh1").textContent = "Hello";
// document.getElementById("myp1").textContent = "I like JavaScript";

// let username;
// username = window.prompt("What is your name?")
// print(username);

const decrease = document.getElementById("decBtn");
const reset = document.getElementById("reBtn");
const increase = document.getElementById("incBtn");
const countLable = document.getElementById("countLable");
let count = 0;

increase.onclick = function(){
    count++;
    countLable.textContent = count;
}

reset.onclick = function(){
    count = 0;
    countLable.textContent = count;
}

decrease.onclick = function(){
    count--;
    countLable.textContent = count;
}