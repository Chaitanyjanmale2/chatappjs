// Initialize Firebase with your configuration keys
const firebaseConfig = {
    apiKey: "AIzaSyCZobx7MwiREfIA-dx5qUCAYJ3jczvb8BE",
    authDomain: "chat-d0431.firebaseapp.com",
    projectId: "chat-d0431",
    storageBucket: "chat-d0431.appspot.com",
    messagingSenderId: "54880306455",
    appId: "1:54880306455:web:07fd3eb2ca00440f7ee352",
    measurementId: "G-HRRWR8GNLX"
};
firebase.initializeApp(firebaseConfig);

const database = firebase.database();

// Function to generate or retrieve the user ID from local storage
function getUserId() {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
        return storedUserId;
    } else {
        const newUserId = generateUserId();
        localStorage.setItem("userId", newUserId);
        return newUserId;
    }
}

// Function to send a message
function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value;

    if (message.trim() !== '') {
        const userId = getUserId();
        database.ref('messages').push({
            text: message,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            userId: userId
        });
        messageInput.value = '';
    }
}

// Function to generate a unique user ID (You can replace this with your own method)
function generateUserId() {
    return Math.random().toString(36).substr(2, 9);
}

// Function to display messages
function displayMessage(message) {
    const chatBox = document.getElementById('chat-box');

    // Create a new card for each message
    const card = document.createElement('div');
    card.classList.add('card');

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    // Create a new span element to wrap the message text
    const messageSpan = document.createElement('span');

    // Add appropriate class to the message content based on the sender
    if (message.userId === getUserId()) {
        messageSpan.textContent =  message.text;
        messageSpan.classList.add("alert", "alert-primary","pad"); // Use Bootstrap classes
        cardBody.classList.add("text-end"); // Float the message to the right
    } else {
        messageSpan.textContent = message.text;
        messageSpan.classList.add("alert", "alert-secondary","pad"); // Use Bootstrap classes
        cardBody.classList.add("text-start"); // Float the message to the left
    }

    // Add the 'no-border' class to remove the border from the card body
    card.classList.add("no-border");

    // Append the messageSpan to the cardBody
    cardBody.appendChild(messageSpan);

    card.appendChild(cardBody);
    chatBox.appendChild(card);
}

// ... (Rest of the code)






// Listen for new messages in the Firebase database
database.ref('messages').on('child_added', snapshot => {
    const message = snapshot.val();
    displayMessage(message);
});