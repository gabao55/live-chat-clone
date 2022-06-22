// let name = "Pedro";
const contactsTab = document.querySelector(".contacts");
let messageBeingSent = {
        from: name,
        to: "Todos",
        text: null,
        type: null,
    };
const chat = document.querySelector(".chat");
const participants = document.querySelector(".recipient");
let currentMessages;
let refreshedMessages;
let currentParticipants;
let refreshedParticipants;

function showContacts () {
    contactsTab.classList.remove("display-none")
}

function hideContacts () {
    const recipientUl = contactsTab.querySelector(".recipient [name='checkmark-sharp']");
    const recipient = recipientUl.parentNode.querySelector("p").innerText;
    const isReservedUl = contactsTab.querySelector(".is-reserved [name='checkmark-sharp']");
    const isReserved = isReservedUl.parentNode.querySelector("p").innerText;

    messageBeingSent.recipient = recipient;

    if (isReserved === "Público") {
        messageBeingSent.isReserved = false;
    } else {
        messageBeingSent.isReserved = true;
    }

    contactsTab.classList.add("display-none")
}

function selectItem (element) {
    cleanSelectedItems(element);
    element.innerHTML += `<ion-icon name="checkmark-sharp"></ion-icon>`
}

function cleanSelectedItems (element) {
    const parent = element.parentNode;
    if (parent.querySelector("[name='checkmark-sharp']")) {
        parent.querySelector("[name='checkmark-sharp']").remove();
    }
}

function startApp () {
    name = prompt("Informe seu nome no chat:");
    let user = {name: name};
    const promiseName = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", user);
    promiseName.then(displayApp);
    promiseName.catch(nameFailed);

}

function displayApp (response) {
    console.log(response);
    const promiseMessages = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promiseMessages.then(getMessages);
    const promiseParticipants = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    promiseParticipants.then(getParticipants);
}

function nameFailed (response) {
    alert("Esse nome não é valido, por favor insira outro nome...");
    window.location.reload();
}

// Function for testing scroll
// function testScroll () {
//     const message = `
//             <li>
//             <p class="status">
//                 <span class="time">(a) </span
//                 ><span class="name">a </span> a
//             </p>
//             </li>
//             <li>
//         `
//         chat.innerHTML += message;
//         chat.innerHTML += message;
//         chat.innerHTML += message;
//         chat.innerHTML += message;
//         chat.innerHTML += message;
//     chat.lastElementChild.scrollIntoView();
// }

function getMessages (response) {
    currentMessages = response.data;
    renderMessages(response.data);
}

function renderMessages (allMessages) {
    for (let i = 0 ; i < allMessages.length ; i ++) {
        const message = `
            <li>
            <p class="${allMessages[i].type}">
                <span class="time">(${allMessages[i].time}) </span
                ><span class="name">${allMessages[i].from} </span> ${allMessages[i].text}
            </p>
            </li>
            <li>
        `
        chat.innerHTML += message;
    }
}

function getParticipants (response) {
    currentParticipants = response.data;
    renderParticipants(response.data);
}

function renderParticipants (allParticipants) {
    for (let i = 0 ; i < allParticipants.length ; i ++) {
        const participant = `
            <li class="option" onclick="selectItem(this);">
                <div class="option-details">
                <ion-icon name="person-circle"></ion-icon>
                <p>${allParticipants[i].name}</p>
                </div>
            </li>
      `

      participants.innerHTML += participant;
    }
}

function refreshMessages () {
    const promiseMessages = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promiseMessages.then(compareMessages);
}

function compareMessages (response) {
    refreshedMessages = response.data;
    let newMessages = [];
    if (JSON.stringify(refreshedMessages) !== JSON.stringify(currentMessages)) {
        for (let i = 0 ; i < refreshedMessages.length ; i ++) {
            let comparison = compareMessage(refreshedMessages[i], currentMessages[i]);
            if (comparison) {
                newMessages.push(comparison);
            }
        }
        // TODO: Refresh shows old messages, fix it
        console.log(newMessages);
        renderMessages(newMessages);
        currentMessages = refreshedMessages;
        chat.lastElementChild.scrollIntoView();
    } else {
        console.log("sem mensagens novas");
    }
}

function compareMessage (message1, message2) {
    let message1JSON = JSON.stringify(message1);
    let message2JSON = JSON.stringify(message2);

    if (message1JSON !== message2JSON) {
        return message1
    } else {
        return null
    }
}

function refreshParticipants () {
    const promiseParticipants = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    promiseParticipants.then(compareParticipants);
}

function compareParticipants (response) {
    refreshedParticipants = response.data;
    if (JSON.stringify(refreshedParticipants) !== JSON.stringify(currentParticipants)) {
        let newParticipants = [];
        for (let i = 0 ; i < refreshedParticipants.length ; i ++) {
            newParticipants.push(response.data[i]);
        }
        participants.innerHTML = `
            <li class="option" onclick="selectItem(this);">
                <div class="option-details">
                    <ion-icon name="people"></ion-icon>
                    <p>Todos</p>
                </div>
                <ion-icon name="checkmark-sharp"></ion-icon>
            </li>
        `
        renderParticipants(newParticipants);
        currentParticipants = refreshedParticipants;
        participants.lastElementChild.scrollIntoView();
    }
}

startApp();
// setInterval(refreshMessages, 3000);
setInterval(refreshParticipants, 10000);