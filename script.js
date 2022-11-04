let getData = [];

function addItem(event) {
    event.preventDefault();
    let text = document.getElementById("todo-input");
    db.collection("todo-items").add({
        text: text.value,
        status: "active"
    })
    text.value = ""
}

function getItems() {
    db.collection("todo-items").onSnapshot((snapshot) => {
        console.log(snapshot);
        let items = [];
        snapshot.docs.forEach((doc) => {
            items.push({
                id: doc.id,
                ...doc.data()
            })
        })
        // generateItems(items);
        getItemsBaseOnStatus(items)
        let itemsLeft = items.filter((item) => item.status !== "completed")   
        // console.log(itemsLeft)
        document.querySelector(".items-left").innerHTML = `${itemsLeft.length} items left`
    })
}

function generateItems(items) {
    console.log(items)
    getData = items;
    // document.querySelector(".items-left").innerHTML = `${items.length} items left`
    let itemsHTML = ""
    items.forEach((item) => {
        let dark = document.querySelector(".dark")
        if(dark.classList.contains("hidden")) {
            itemsHTML += `
            <div class="todo-item">
                <div class="check-and-text">
                    <div class="check">
                        <div data-id="${item.id}" class="check-mark ${item.status == "completed" ? "checked" : ""}">
                        <img src="./images/icon-check.svg" alt="icon-check">
                        </div>
                    </div>
                    <div class="todo-text ${item.status == "completed" ? "checked" : ""}">
                        ${item.text}
                    </div>
                </div>
                <div data-id="${item.id}" class="todo-delete hidden">
                    <img src="./images/icon-cross.svg" alt="cross">
                </div>
            </div>
            `
        } else {
            itemsHTML += `
            <div class="todo-item white">
                <div class="check-and-text">
                    <div class="check">
                        <div data-id="${item.id}" class="check-mark light-gray ${item.status == "completed" ? "checked" : ""}">
                        <img src="./images/icon-check.svg" alt="icon-check">
                        </div>
                    </div>
                    <div class="todo-text light-mode-text ${item.status == "completed" ? "checked-2" : ""}">
                        ${item.text}
                    </div>
                </div>
                <div data-id="${item.id}" class="todo-delete hidden">
                    <img src="./images/icon-cross.svg" alt="cross">
                </div>
            </div>
            `
        }
        // console.log('item', item)
       
    })

    document.querySelector(".todo-items").innerHTML = itemsHTML;
    createEventListeners();
    
}

function createEventListeners() {
    let todoCheckMarks = document.querySelectorAll(".todo-item .check-mark")
    let todoCrosses = document.querySelectorAll(".todo-item .todo-delete")
    

    todoCheckMarks.forEach((checkMark) => {
        checkMark.addEventListener("click", () => {
            markCompleted(checkMark.dataset.id);
        })
    })

    todoCrosses.forEach((todoCross) => {
        todoCross.addEventListener("click", () => {
            removeItem(todoCross.dataset.id);
            // console.log(itemToRemove)
        })
    })
}

function markCompleted(id) {
    let item = db.collection("todo-items").doc(id)
    item.get().then(function(doc) {
        if(doc.exists) {
            let status = doc.data().status;
            if(status == "active") {
                item.update({
                    status: "completed"
                })
                // getItems();
            } else if (status == "completed") {
                item.update({
                    status: "active"
                })
                // getItems();
            }
        }
    })
}

function removeItem(id) {
    let item = db.collection("todo-items").doc(id)
    item.get().then(function(doc) {
        if(doc.exists) {
            doc.ref.delete();
        }
    })
}

function getItemsBaseOnStatus(items) {
    let allBtn = document.querySelector(".all-btn");
    let activeBtn = document.querySelector(".active-btn");
    let completedBtn = document.querySelector(".completed-btn");
    let clearCompletedBtn = document.querySelector(".clear-completed-btn");
    let removeItemBtn = document.querySelector(".todo-delete");

    let allBtnMobile = document.querySelector(".all-btn-mobile");
    let activeBtnMobile = document.querySelector(".active-btn-mobile");
    let completedBtnMobile = document.querySelector(".completed-btn-mobile");
    
    let filteredItems = items;

    //filtering items

    allBtn.addEventListener('click', () => {
        allBtn.classList.add("active")
        activeBtn.classList.remove("active")
        completedBtn.classList.remove("active")

        filteredItems = items.filter((item) => item.status)
        generateItems(filteredItems)
    })

    activeBtn.addEventListener('click', () => {
        allBtn.classList.remove("active")
        activeBtn.classList.add("active")
        completedBtn.classList.remove("active")

        filteredItems = items.filter((item) => item.status === "active")
        generateItems(filteredItems)
    })

    completedBtn.addEventListener('click', () => {
        allBtn.classList.remove("active")
        activeBtn.classList.remove("active")
        completedBtn.classList.add("active")

        filteredItems = items.filter((item) => item.status === "completed")
        generateItems(filteredItems)
    })


    //Mobile filtering

    allBtnMobile.addEventListener('click', () => {
        allBtnMobile.classList.add("active")
        activeBtnMobile.classList.remove("active")
        completedBtnMobile.classList.remove("active")

        filteredItems = items.filter((item) => item.status)
        console.log('allBtnMobile', allBtnMobile)
        generateItems(filteredItems)
    })

    activeBtnMobile.addEventListener('click', () => {
        allBtnMobile.classList.remove("active")
        activeBtnMobile.classList.add("active")
        completedBtnMobile.classList.remove("active")

        filteredItems = items.filter((item) => item.status === "active")
        generateItems(filteredItems)
    })

    completedBtnMobile.addEventListener('click', () => {
        allBtnMobile.classList.remove("active")
        activeBtnMobile.classList.remove("active")
        completedBtnMobile.classList.add("active")

        filteredItems = items.filter((item) => item.status === "completed")
        generateItems(filteredItems)
    })


    //clear completed items

    clearCompletedBtn.addEventListener('click', () => {
        
        var completedItems = db.collection('todo-items').where('status','==','completed');
        completedItems.get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                doc.ref.delete();
            });
        });
        
        generateItems(filteredItems)
    })

    //Refreshing items after marking as completed

    if(allBtn.classList.contains("active")) {
        filteredItems = items.filter((item) => item.status)
        generateItems(filteredItems)
    } else if(activeBtn.classList.contains("active")) {
        filteredItems = items.filter((item) => item.status === "active")
        generateItems(filteredItems) 
    } else if (completedBtn.classList.contains("active")) {
        filteredItems = items.filter((item) => item.status === "completed")
        generateItems(filteredItems) 
    }
    
    //Refreshing items after marking as completed in mobile

    if(allBtnMobile.classList.contains("active")) {
        filteredItems = items.filter((item) => item.status)
        generateItems(filteredItems)
    } else if(activeBtnMobile.classList.contains("active")) {
        filteredItems = items.filter((item) => item.status === "active")
        generateItems(filteredItems) 
    } else if (completedBtnMobile.classList.contains("active")) {
        filteredItems = items.filter((item) => item.status === "completed")
        generateItems(filteredItems) 
    }
    
}

function lightMode(theme) {
    
    let light = document.querySelector(".light")
    let dark = document.querySelector(".dark")
    let darkImg = document.querySelector(".dark-img")
    let lightImg = document.querySelector(".light-img")

    darkImg.classList.add('hidden')
    light.classList.add('hidden')
    dark.classList.remove('hidden')
    lightImg.classList.remove('hidden')


    document.querySelectorAll(".check-mark").forEach((item) => {
        item.classList.add("light-gray")
    })
    document.querySelector("input").classList.add("gray-placeholder")
    document.querySelector("body").classList.add("white-without-border")
    document.querySelector(".new-todo").classList.add("white")
    document.querySelector(".todo-items-wrapper").classList.add("white")
    document.querySelectorAll(".todo-item").forEach((item) => {
        item.classList.add("white")
    })
    

    document.querySelectorAll(".todo-text").forEach((item) => {
        item.classList.add("light-mode-text")
        if(item.classList.contains("completed")){
            item.classList.add("checked-2")
        }
    })

    document.querySelector(".todo-items-info").classList.add("gray")
    document.querySelector(".items-status").classList.add("darker-gray")
    console.log('dataTheme', dark.dataset.theme)

    document.querySelector(".items-status-mobile").classList.remove("dark-mode-background")
    document.querySelector(".items-status-mobile").classList.add("white-without-border")



    generateItems(getData)
}

function darkMode(theme) {
    
    let light = document.querySelector(".light")
    let dark = document.querySelector(".dark")
    let darkImg = document.querySelector(".dark-img")
    let lightImg = document.querySelector(".light-img")

    darkImg.classList.remove('hidden')
    light.classList.remove('hidden')
    dark.classList.add('hidden')
    lightImg.classList.add('hidden')


    document.querySelectorAll(".check-mark").forEach((item) => {
        item.classList.remove("light-gray")
    })
    document.querySelector("input").classList.remove("gray-placeholder")
    document.querySelector("body").classList.remove("white-without-border")
    document.querySelector(".new-todo").classList.remove("white")
    document.querySelector(".todo-items-wrapper").classList.remove("white")
    document.querySelectorAll(".todo-item").forEach((item) => {
        item.classList.remove("white")
    })

    document.querySelectorAll(".todo-text").forEach((item) => {
        item.classList.remove("light-mode-text")
    })

    document.querySelector(".todo-items-info").classList.remove("gray")
    document.querySelector(".items-status").classList.remove("darker-gray")
    document.querySelector(".items-status-mobile").classList.remove("white-without-border")
    document.querySelector(".items-status-mobile").classList.add("dark-mode-background")
    
    console.log('dataTheme', light.dataset.theme)
    generateItems(getData)
}

//drag and drop

var dragBox = document.querySelector(".todo-items")
new Sortable(dragBox, {
    animation: 400
})


getItems();