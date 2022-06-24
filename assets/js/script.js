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
    let chatBar = document.querySelector(".chat-bar > div");
    const toUl = contactsTab.querySelector(".recipient [name='checkmark-sharp']");
    const to = toUl.parentNode.querySelector("p").innerText;
    const typeUl = contactsTab.querySelector(".is-reserved [name='checkmark-sharp']");
    const type = typeUl.parentNode.querySelector("p").innerText;

    if (to === user.name) {
        alert("Não é possível enviar mensages para si mesmo");
        return
    }

    let messageDetails = `Enviando para ${to}`

    if (type === "Reservadamente" && to !== "Todos") {
        messageDetails += " (reservadamente)"
    }

    chatBar.innerHTML = "";

    chatBar.innerHTML += `
        <input type="text" placeholder="Escreva aqui..." />
        <p>${messageDetails}</p>
    `

    document.querySelector(".chat-bar div input").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

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
    let name = document.querySelector(".entry-page input").value;
    user.name = name;
    const promiseName = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", user);
    promiseName.then(displayApp);
    promiseName.catch(nameFailed);

}

function displayApp (response) {
    document.querySelector(".entry-page").remove();
    setInterval(ping, 5000);
    const promiseMessages = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promiseMessages.then(getMessages);
    const promiseParticipants = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    promiseParticipants.then(getParticipants);
}

function nameFailed (response) {
    alert("Esse nome não é valido, por favor insira outro nome...");
    window.location.reload();
}

function getMessages (response) {
    renderMessages(response.data);
    setInterval(refreshMessages, 3000);
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
            `
        } else if (allMessages[i].type === 'message') {
            message = `
                <li>
                <p class="${allMessages[i].type}">
                    <span class="time">(${allMessages[i].time}) </span
                    ><span class="name">${allMessages[i].from}</span> para <span class="name">${allMessages[i].to} </span>${allMessages[i].text}
                </p>
                </li>
            `
        } else {
            if (allMessages[i].to === user.name || allMessages[i].from === user.name) {
                message = `
                    <li>
                    <p class="${allMessages[i].type}">
                        <span class="time">(${allMessages[i].time}) </span
                        ><span class="name">${allMessages[i].from}</span> reservadamente para <span class="name">${allMessages[i].to} </span>${allMessages[i].text}
                    </p>
                    </li>
                `
            } else {
                return
            }
        }
        chat.innerHTML += message;
    }
}

function getParticipants (response) {
    currentParticipants = response.data;
    renderParticipants(response.data);
    setInterval(refreshParticipants, 10000);
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
    let refreshedMessages = response.data;
    let newMessages = [];
    let lastMessageIndex = refreshedMessages.length - 1;
    let i = messagesDisplayed.length - 1;
    let isLastMessage = false;
    while (isLastMessage === false) {
        if (i === -1) {
            i = messagesDisplayed.length;
            lastMessageIndex --;
        }
        isLastMessage = checkLastMessageSent(
            refreshedMessages[lastMessageIndex],
            messagesDisplayed[i]
            );
        i --;
    }

    for (let i = lastMessageIndex + 1 ; i < refreshedMessages.length ; i ++) {
        newMessages.push(refreshedMessages[i]);
    }

    if (newMessages.length > 0) {
        renderMessages(newMessages);
        chat.lastElementChild.scrollIntoView();
    }
}

function checkLastMessageSent (message1, message2) {
    let message1JSON = JSON.stringify(message1);
    let message2JSON = JSON.stringify(message2);

    if (message1JSON === message2JSON) {
        return true
    } else {
        return false
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

    if (messageType === "private_message" && to === "Todos") {
        messageType = "message";
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

document.querySelector(".chat-bar div input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

function messageSentSuccessfully (response) {
    document.querySelector(".chat-bar input").value = "";
    refreshMessages();
}

function messageError (error) {
    // TODO: Develop error handling for sending messages
    console.log(error);
    alert("Erro ao enviar mensagem, tente novamente");
    window.location.reload()
}

document.querySelector(".entry-page input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        startApp();
    }
});