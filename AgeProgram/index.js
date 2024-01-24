const myText = document.getElementById("myText");
const mySubmit = document.getElementById("mySubmit");
const resultElement = document.getElementById("resultElement");
let age;

mySubmit.onclick = function(){
    console.log("Start the Operation...")
    age = myText.value;
    age = Number(age);
    if(age >= 100){
        resultElement.textContent = `You are TOO OLD enter this site`;
    }
    else if(age == 0){
        resultElement.textContent = `You can't enter. You were just born.`;
    }
    else if(age >= 18){
        resultElement.textContent = `You are old enough to enter this site`;
    }
    else if(age < 0){
        resultElement.textContent = `Your age can't below 0`;
    }
    else{
        resultElement.textContent = `Your must be 18+ to enter this site`;
    }
}

