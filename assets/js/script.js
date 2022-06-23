// let name = "Pedro";
let user = {
    name: "PedroMóChavãoPataty"
}
const contactsTab = document.querySelector(".contacts");
const chat = document.querySelector(".chat");
const participants = document.querySelector(".recipient");
let messagesDisplayed = [];
let currentParticipants;
let refreshedParticipants;

function showContacts () {
    contactsTab.classList.remove("display-none")
}

function hideContacts () {
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
    // TODO: Switch for prompt name input
    // name = prompt("Informe seu nome no chat:");
    // user.name = name;
    const promiseName = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", user);
    promiseName.then(displayApp);
    promiseName.catch(displayApp); // TODO: Trocar displayApp por nameFailed

}

function displayApp (response) {
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
    renderMessages(response.data);
}

function renderMessages (allMessages) {
    for (let i = 0 ; i < allMessages.length ; i ++) {
        messagesDisplayed.push(allMessages[i]);
        let message;
        if (allMessages[i].type === 'status') {
            message = `
                <li>
                <p class="${allMessages[i].type}">
                    <span class="time">(${allMessages[i].time}) </span
                    ><span class="name">${allMessages[i].from}</span> ${allMessages[i].text}
                </p>
                </li>
                <li>
            `
        } else if (allMessages[i].type === 'message') {
            message = `
                <li>
                <p class="${allMessages[i].type}">
                    <span class="time">(${allMessages[i].time}) </span
                    ><span class="name">${allMessages[i].from}</span> para <span class="name">${allMessages[i].to} </span>${allMessages[i].text}
                </p>
                </li>
                <li>
            `
        } else {
            message = `
                <li>
                <p class="${allMessages[i].type}">
                    <span class="time">(${allMessages[i].time}) </span
                    ><span class="name">${allMessages[i].from}</span> reservadamente para <span class="name">${allMessages[i].to} </span>${allMessages[i].text}
                </p>
                </li>
                <li>
            `
        }
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
    // TODO: Implement refresh messages functionality correctly
    let refreshedMessages = response.data;
    let newMessages = [];
    console.log(refreshedMessages);
    // for (let i = 0 ; i < refreshedMessages.length ; i ++) {
    //     for (let j = 0 ; j < messagesDisplayed.length ; j ++) {
    //         let comparison = compareMessage(refreshedMessages[i], messagesDisplayed[j]);
    //         if (comparison) {
    //             newMessages.push(comparison);
    //         }
    //     }
    // }
    // if (newMessages.length > 0) {
    //     console.log(newMessages);
    //     renderMessages(newMessages);
    //     chat.lastElementChild.scrollIntoView();
    // } else {
    //     console.log("sem mensagens novas");
    // }
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

function ping() {
    const promise = axios.post(
        "https://mock-api.driven.com.br/api/v6/uol/status",
        user
    )
    promise.catch(pingError);
}

function pingError (error) {
    alert("Conexão perdida, reinicie o chat.");
}

function sendMessage() {
    // TODO: Treat message before sending it and fix bugs
    const messageText = document.querySelector(".chat-bar input").value;
    if (!messageText) {
        return
    }
    const toUl = contactsTab.querySelector(".recipient [name='checkmark-sharp']");
    const to = toUl.parentNode.querySelector("p").innerText;
    const typeUl = contactsTab.querySelector(".is-reserved [name='checkmark-sharp']");
    const type = typeUl.parentNode.querySelector("p").innerText;

    let messageType;

    if (type === "Público") {
        messageType = "message";
    } else {
        messageType = "private_message";
    }

    const message = {
        from: user.name,
        to: to,
        text: messageText,
        type: messageType,
    };

    const promise = axios.post(
        "https://mock-api.driven.com.br/api/v6/uol/messages",
        message
    )
    promise.then(messageSentSuccessfully);
    promise.catch(messageError);
}

function messageSentSuccessfully (response) {
    console.log(response.status);
    refreshMessages();
}

function messageError (error) {
    // TODO: Develop error handling for sending messages
    console.log(error);
    alert("Erro ao enviar mensagem, tente novamente");
}

startApp();
// setInterval(refreshMessages, 3000);
setInterval(ping, 5000);
setInterval(refreshParticipants, 10000);