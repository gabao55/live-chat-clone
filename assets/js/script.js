let name = "Pedro";
const contactsTab = document.querySelector(".contacts");
let messageBeingSent = {
        from: name,
        to: "all",
        message: null,
        type: null,
        time: null,
    };
const chat = document.querySelector(".chat");
const participants = document.querySelector(".recipient");

function startApp () {
    const promiseMessages = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promiseMessages.then(getMessages);
    const promiseParticipantes = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    promiseParticipantes.then(getParticipantes);

    // name = prompt("Informe seu nome no chat:");
    let user = {name: name};
}

function getMessages (request) {
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

function getParticipantes (request) {
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

function defineMessageParameters (message) {

}

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

startApp();