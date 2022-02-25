const CARD_STATUS = {
    NOT_STARTED: 0,
    PENDING: 1,
    DONE: 2,
    SUSPENDED: 3
}

const data = [
    {
        "list_name": "list Name",
        "cards": [
            {
                "card_name": "Card Name 1",
                "card_description": "Card Description",
                "card_status": "Pending",
                "create_at": new Date().toString(),
                "updated_at": new Date().toString()
            },
            {
                "card_name": "Card Name 2",
                "card_description": "Card Description",
                "card_status": "Pending",
                "create_at": new Date().toString(),
                "updated_at": new Date().toString()
            }
        ]
    },
    {
        "list_name": "list Name",
        "cards": [
            {
                "card_name": "Card Name 2 1",
                "card_description": "Card Description",
                "card_status": "Pending",
                "create_at": new Date().toString(),
                "updated_at": new Date().toString()
            },
            {
                "card_name": "Card Name 2 2",
                "card_description": "Card Description",
                "card_status": "Pending",
                "create_at": new Date().toString(),
                "updated_at": new Date().toString()
            },
            {
                "card_name": "Card Name 2 3",
                "card_description": "Card Description",
                "card_status": "Pending",
                "create_at": new Date().toString(),
                "updated_at": new Date().toString()
            },
            {
                "card_name": "Card Name 2 4",
                "card_description": "Card Description",
                "card_status": "Pending",
                "create_at": new Date().toString(),
                "updated_at": new Date().toString()
            },
        ]
    },
    {
        "list_name": "list Name",
        "cards": []
    }
]
window.onload = () => {
    // localStorage.setItem('todo-list', JSON.stringify(data));
    const workspaceElement = document.getElementById("workspace");
    renderTodoList(getLocalStorage(), workspaceElement)
}

const renderTodoList = (data, workspaceElement) => {
    data.map((list, listIdx) => {
        const listElement = document.createElement("div");
        listElement.className = "module";
        listElement.setAttribute("draggable", "true");
        listElement.setAttribute("id", "module");
        workspaceElement.appendChild(listElement);

        const listHeaderElement = document.createElement("div");
        listHeaderElement.className = "module-header";
        listHeaderElement.setAttribute("id", "module-header");
        listElement.appendChild(listHeaderElement);

        const listNameElement = document.createElement("div");
        listNameElement.className = "module-name";
        listNameElement.setAttribute("id", "module-name");
        listNameElement.setAttribute("contenteditable", "true");
        listNameElement.innerText = list?.list_name;
        listNameElement.addEventListener('input', (event) => onListTitleChange(event, listIdx));
        listHeaderElement.appendChild(listNameElement);

        const listButtonElement = document.createElement("button");
        listButtonElement.className = "module-button";
        listButtonElement.setAttribute("id", "module-button");
        listButtonElement.innerHTML = "&#9776;";
        listHeaderElement.appendChild(listButtonElement);

        const cardContainerElement = document.createElement("div");
        cardContainerElement.className = "card-container";
        cardContainerElement.ondragover = (event) => handleOnDragOver(event);
        cardContainerElement.setAttribute("id", "card-container");
        listElement.appendChild(cardContainerElement)

        renderCard(list.cards, cardContainerElement)

        const footerElement = document.createElement("div");
        footerElement.className = "footer";
        footerElement.setAttribute("id", "footer");
        listElement.appendChild(footerElement)

        const addCardPanelElement = document.createElement("div");
        addCardPanelElement.className = "add-card hide";
        addCardPanelElement.setAttribute("id", "add-card");
        footerElement.appendChild(addCardPanelElement);

        const placeholderElement = document.createElement("span");
        placeholderElement.className = "add-card-placeholder show";
        placeholderElement.setAttribute("id", "add-card-placeholder");
        placeholderElement.innerHTML = "&#10010; &nbsp;Add a card";
        footerElement.appendChild(placeholderElement);

        const addCardInputElement = document.createElement("input");
        addCardInputElement.className = "card-title";
        addCardInputElement.setAttribute("id", "card-title");
        addCardInputElement.placeholder = "add card...";
        addCardInputElement.type = "text";
        addCardPanelElement.appendChild(addCardInputElement)
        footerElement.onclick = () => showAddCardFooter(addCardPanelElement, placeholderElement, addCardInputElement);

        const addCardButtonContainerElement = document.createElement("div");
        addCardButtonContainerElement.className = "btn-container";
        addCardButtonContainerElement.setAttribute("id", "btn-container");
        addCardPanelElement.appendChild(addCardButtonContainerElement);


        const addCardButtonElement = document.createElement("button");
        addCardButtonElement.className = "add-card-btn";
        addCardButtonElement.setAttribute("id", "add-card-btn");
        addCardButtonElement.innerHTML = "&#10010;&nbsp;Add Card";
        addCardButtonElement.disabled = isDisabled(addCardInputElement);
        addCardButtonElement.onclick = () => onAddCardClick(listIdx, addCardInputElement.value, addCardPanelElement);
        addCardButtonContainerElement.appendChild(addCardButtonElement)

        const addCardCloseButtonElement = document.createElement("button");
        addCardCloseButtonElement.setAttribute("id", "add-card-close");
        addCardCloseButtonElement.innerHTML = "&#10005;";
        addCardCloseButtonElement.onclick = () => hideAddCardFooter(addCardPanelElement, placeholderElement)
        addCardButtonContainerElement.appendChild(addCardCloseButtonElement)


    })
}

const renderCard = (cards, cardContainerElement) => {

    cards?.map((card, cardIdx) => {
        const cardElement = document.createElement("div");
        cardElement.className = "card";
        cardElement.setAttribute("id", "card");
        cardElement.setAttribute("draggable", "true");
        cardElement.ondragstart = (event) => handleOnDragStart(event);
        cardElement.ondragend = (event) => handleOnDragEnd(event);

        const cardHeaderElement = document.createElement("div");
        cardHeaderElement.className = "card-header";
        cardHeaderElement.setAttribute("id", "card");
        cardElement.appendChild(cardHeaderElement);

        const cardStatusElement = document.createElement("div");
        cardStatusElement.className = "card-status-not-started";
        cardStatusElement.innerText = "Pending";
        cardStatusElement.setAttribute("id", "card-status");
        cardStatusElement.setAttribute("data-id", "card-status");
        cardHeaderElement.appendChild(cardStatusElement);

        const cardActions = document.createElement("div");
        cardActions.className = "card-actions";
        const deleteCardElement = document.createElement("button");
        deleteCardElement.setAttribute("id", "delete-card");
        deleteCardElement.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd"
            d="M17 5V4C17 2.89543 16.1046 2 15 2H9C7.89543 2 7 2.89543 7 4V5H4C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H5V18C5 19.6569 6.34315 21 8 21H16C17.6569 21 19 19.6569 19 18V7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H17ZM15 4H9V5H15V4ZM17 7H7V18C7 18.5523 7.44772 19 8 19H16C16.5523 19 17 18.5523 17 18V7Z"
            fill="currentColor" />
        <path d="M9 9H11V17H9V9Z" fill="currentColor" />
        <path d="M13 9H15V17H13V9Z" fill="currentColor" />
    </svg>`

        cardActions.appendChild(deleteCardElement);

        const editCardElement = document.createElement("button");
        editCardElement.setAttribute("id", "delete-card");
        editCardElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
        <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
      </svg>`
        cardActions.appendChild(editCardElement);
        cardHeaderElement.appendChild(cardActions);

        const cardNameElement = document.createElement("div");
        cardNameElement.className = "card-name";
        cardNameElement.innerHTML = card.card_name;
        cardNameElement.setAttribute("id", "card-name");
        // cardNameElement.setAttribute("contenteditable", "true");
        cardElement.appendChild(cardNameElement);


        const cardDescriptionElement = document.createElement("div");
        cardDescriptionElement.className = "card-description";
        cardDescriptionElement.setAttribute("id", "card-description");
        // cardDescriptionElement.setAttribute("contenteditable", "true");
        cardDescriptionElement.innerHTML = card.card_description;
        cardElement.appendChild(cardDescriptionElement);
        cardContainerElement.appendChild(cardElement);
    })

}

const handleOnDragStart = (event) => {
    event.target.classList.add("dragging")
}

const handleOnDragEnd = (event) => {
    event.target.classList.remove("dragging")
}

const handleOnDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const afterElement = getDragAfterElement(event.target, event.clientY);
    const draggableElement = document.querySelector(".dragging");
    if (afterElement == null) {
        event.target.appendChild(draggableElement);
    }
    else {
        event.target.insertBefore(draggableElement, afterElement);
    }
}

const getDragAfterElement = (container, y) => {
    const draggableElements = [...container.querySelectorAll(".module:not(.dragging)")];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return {
                offset: offset, element: child
            };
        }
        else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element
}

const showAddCardFooter = (addCardPanelElement, placeholderElement, addCardInputElement) => {
    addCardPanelElement.className = "add-card show";
    placeholderElement.className = "add-card-placeholder hide";
    addCardInputElement.focus()
}

const hideAddCardFooter = (addCardPanelElement, placeholderElement) => {
    addCardPanelElement.className = "add-card hide";
    placeholderElement.className = "add-card-placeholder show";
}

const onAddCardClick = (listIdx, title, addCardPanelElement) => {
    console.log(listIdx);
    data[listIdx].cards.push({
        "card_name": title,
        "card_description": "Card Description",
        "card_status": "Pending",
        "create_at": new Date().toString(),
        "updated_at": new Date().toString()
    });

    localStorage.setItem('todo-list', JSON.stringify(data));

    const modules = document.querySelectorAll("#module");

    const cardElement = document.createElement("div");
    cardElement.className = "card";
    cardElement.setAttribute("id", "card");
    cardElement.setAttribute("draggable", "true");
    cardElement.ondragstart = (event) => handleOnDragStart(event);
    cardElement.ondragend = (event) => handleOnDragEnd(event);

    const cardHeaderElement = document.createElement("div");
    cardHeaderElement.className = "card-header";
    cardHeaderElement.setAttribute("id", "card");
    cardElement.appendChild(cardHeaderElement);

    const cardStatusElement = document.createElement("div");
    cardStatusElement.className = "card-status-not-started";
    cardStatusElement.innerText = "Pending";
    cardStatusElement.setAttribute("id", "card-status");
    cardStatusElement.setAttribute("data-id", "card-status");
    cardHeaderElement.appendChild(cardStatusElement);

    const cardActions = document.createElement("div");
    cardActions.className = "card-actions";
    const deleteCardElement = document.createElement("button");
    deleteCardElement.setAttribute("id", "delete-card");
    deleteCardElement.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd"
            d="M17 5V4C17 2.89543 16.1046 2 15 2H9C7.89543 2 7 2.89543 7 4V5H4C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H5V18C5 19.6569 6.34315 21 8 21H16C17.6569 21 19 19.6569 19 18V7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H17ZM15 4H9V5H15V4ZM17 7H7V18C7 18.5523 7.44772 19 8 19H16C16.5523 19 17 18.5523 17 18V7Z"
            fill="currentColor" />
        <path d="M9 9H11V17H9V9Z" fill="currentColor" />
        <path d="M13 9H15V17H13V9Z" fill="currentColor" />
    </svg>`

    cardActions.appendChild(deleteCardElement);

    const editCardElement = document.createElement("button");
    editCardElement.setAttribute("id", "delete-card");
    editCardElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
        <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
      </svg>`
    cardActions.appendChild(editCardElement);
    cardHeaderElement.appendChild(cardActions);

    const cardNameElement = document.createElement("div");
    cardNameElement.className = "card-name";
    cardNameElement.innerHTML = title;
    cardNameElement.setAttribute("id", "card-name");
    // cardNameElement.setAttribute("contenteditable", "true");
    cardElement.appendChild(cardNameElement);


    const cardDescriptionElement = document.createElement("div");
    cardDescriptionElement.className = "card-description";
    cardDescriptionElement.setAttribute("id", "card-description");
    // cardDescriptionElement.setAttribute("contenteditable", "true");
    cardDescriptionElement.innerHTML = "card description";
    cardElement.appendChild(cardDescriptionElement);

    modules[listIdx].appendChild(cardElement);
    addCardPanelElement.className = "add-card hide";
};

const isDisabled = (addCardInputElement) => {
    console.log(addCardInputElement.value)
    return false;
}
// Icons
// https://icons.getbootstrap.com/

const getLocalStorage = () => {
    return JSON.parse(localStorage.getItem('todo-list')) ? JSON.parse(localStorage.getItem('todo-list')) : [];
}

const onListTitleChange = (event, listIdx) => {
    console.log(event.target.innerText)
    let data = getLocalStorage();
    data[listIdx].list_name = event.target.innerText;
    localStorage.setItem('todo-list', JSON.stringify(data));
}