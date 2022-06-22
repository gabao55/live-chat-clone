let name = "Pedro";
const contactsTab = document.querySelector(".contacts");
let messageBeingSent = {
        sender: name,
        recipient: "all",
        message: null,
        isReserved: false,
    }

function startApp () {
    // name = prompt("Informe seu nome no chat:");
    let user = {name: name};

    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(getMessages);
}

function getMessages (resposta) {
    console.log(resposta.data);
}

function getMessages (request) {
    console.log(request.data);
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