let name;
let contactsTab = document.querySelector(".contacts");
let messageBeingSent = {
        sender: name,
        recipient: "all",
        message: null,
        isReserved: false,
    }

function startApp () {
    name = prompt("Informe seu nome no chat:");
}

function showContacts () {
    contactsTab.classList.remove("display-none")
}

function hideContacts () {
    let recipientUl = contactsTab.querySelector(".recipient [name='checkmark-sharp']");
    let recipient = recipientUl.parentNode.querySelector("p").innerText;
    let isReservedUl = contactsTab.querySelector(".is-reserved [name='checkmark-sharp']");
    let isReserved = isReservedUl.parentNode.querySelector("p").innerText;

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
    let parent = element.parentNode;
    if (parent.querySelector("[name='checkmark-sharp']")) {
        parent.querySelector("[name='checkmark-sharp']").remove();
    }
}

startApp();