let name = "Pedro";
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
    const promiseMessages = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promiseMessages.then(getMessages);
    const promiseParticipants = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    promiseParticipants.then(getParticipants);

    // name = prompt("Informe seu nome no chat:");
    let user = {name: name};
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

function getMessages (request) {
    currentMessages = request.data;
    renderMessages(request.data);
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

function getParticipants (request) {
    currentParticipants = request.data;
    renderParticipants(request.data);
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

function compareMessages (request) {
    refreshedMessages = request.data;
    if (refreshedMessages !== currentMessages) {
        console.log("novas mensagens");
        let newMessages = refreshedMessages.filter(function(obj) {return currentMessages.indexOf(obj) == -1});
        console.log(newMessages);
        renderMessages(newMessages);
        currentMessages = refreshedMessages;
        // chat.lastElementChild.scrollIntoView();
    } else {
        console.log("sem mensagens novas");
    }
}

function refreshParticipants () {
    const promiseParticipants = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    promiseParticipants.then(compareParticipants);
}

function compareParticipants (request) {
    refreshedParticipants = request.data;
    if (JSON.stringify(refreshedParticipants) !== JSON.stringify(currentParticipants)) {
        let newParticipants = [];
        for (let i = 0 ; i < refreshedParticipants.length ; i ++) {
            newParticipants.push(request.data[i]);
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
// setInterval(refreshMessages, 10000);
setInterval(refreshParticipants, 3000);