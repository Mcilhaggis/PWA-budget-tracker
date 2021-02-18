//define db in a variable
let db;

//Create a new db request for the budget database
const request = indexedDB.open("budgetDB", 1);

request.onupgradeneeded = (event) => {
    const db = event.target.result;
    //Object store for pending items, autoincrememting version number
    db.createObjectStore("pending", { autoIncrement: true })
};

request.onsuccess = (event) => {
    db = event.target.result;
    if (navigator.onLine) {
        checkDatabase();
    }
};

request.onerror = (event) => {
    console.log(event)
}

//Saving the record 
function saveRecord(record) {
    //Creating a transaction for the db with read write access
    const transaction = db.transaction(["pending"], "readwrite")
    const pendingStore = transaction.objectStore("pending");
    pendingStore.add(record);
}

//Check the database
function checkDatabase() {
    //Creating a transaction for the db with read write access
    const transaction = db.transaction(["pending", "readwrite"])
    const pendingStore = transaction.objectStore("pending");
    //Return all of the records on the pending database
    const getRecords = pendingStore.getAll();


    getRecords.onsuccess = function () {
        if (getAll.results.length > 0) {
            fetch("/api/transaction/bulk", {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then(() => {
                    //if db check was successful, access the pending object store and clear
                    const transaction = db.transaction(["pending", "readwrite"])
                    const pendingStore = transaction.objectStore("pending");
                    pendingStore.clear()
                })
        }
    }
};

//Listener for the app coming back online
window.addEventListener("online", checkDatabase);