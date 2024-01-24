const myCheckbox = document.getElementById("myCheckbox");
const visBtn = document.getElementById("visBtn");
const masterCardBtn = document.getElementById("masterCardBtn");
const paypalBtn = document.getElementById("paypalBtn");
const mySubmit = document.getElementById("mySubmit");
const subResult = document.getElementById("subResult");
const payResult = document.getElementById("payResult");

mySubmit.onclick = function(){
    if(myCheckbox.checked){
        subResult.textContent = `You are Subscribed`;
    }
    else{
        subResult.textContent = `You are NOT a subscribed`;
    }

    if(visBtn.checked){
        payResult.textContent = `You are Subscribed in VISA`;
    }
    else if(paypalBtn.checked){
        payResult.textContent = `You are Subscribed in PAYPAL`;
    }
    else if(masterCardBtn.checked){
        payResult.textContent = `You are Subscribed in MASTERCARD`;
    }
    else{
        payResult.textContent = `You are must be subscribe`;
    }
}