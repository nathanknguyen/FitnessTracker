let db;
let workoutVersion;
// Create a new db request for a "workout" database.
const request = indexedDB.open("workout", workoutVersion || 21);
request.onupgradeneeded = function (e) {
  console.log("Upgrade needed in IndexDB");
  const { oldVersion } = e;
  const newVersion = e.newVersion || db.version;
  console.log(`DB Updated from version ${oldVersion} to ${newVersion}`);
  db = e.target.result;
  if (db.objectStoreNames.length === 0) {
    db.createObjectStore("workoutStore", { autoIncrement: true });
  }
};
request.onerror = function (e) {
  console.log(`Woops! ${e.target.errorCode}`);
};
function checkDatabase() {
  console.log("check db invoked");
  // Open a transaction on your workoutStore db
  let transaction = db.transaction(["workoutStore"], "readwrite");
  // access your workoutStore object
  const store = transaction.objectStore("workoutStore");
  // Get all records from store and set to a variable
  const getAll = store.getAll();
  // If the request was successful
  getAll.onsuccess = function () {
    // If there are items in the store, we need to bulk add them when we are back online
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((res) => {
          // If our returned response is not empty
          if (res.length !== 0) {
            // Open another transaction to workoutStore with the ability to read and write
            transaction = db.transaction(["workoutStore"], "readwrite");
            // Assign the current store to a variable
            const currentStore = transaction.objectStore("workoutStore");
            // Clear existing entries because our bulk add was successful
            currentStore.clear();
            console.log("Clearing store :broom:");
          }
        });
    }
  };
}
request.onsuccess = function (e) {
  console.log("success");
  db = e.target.result;
  // Check if app is online before reading from db
  if (navigator.onLine) {
    console.log("Backend online! :file_cabinet:");
    checkDatabase();
  }
};
const saveRecord = (record) => {
  console.log("Save record invoked");
  // Create a transaction on the workoutStore db with readwrite access
  const transaction = db.transaction(["workoutStore"], "readwrite");
  // Access your workoutStore object store
  const store = transaction.objectStore("workoutStore");
  // Add record to your store with add method.
  store.add(record);
};
// Listen for app coming back online
window.addEventListener("online", checkDatabase);