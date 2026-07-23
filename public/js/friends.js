import {
    sendFriendRequest,
    acceptFriendRequest,
    getFriendRequests,
    getFriends,
    sendMessage,
    getMessages,
    getMe
} from "./api.js";


let friendsInitialized = false;


export async function setupFriends() {

    if (friendsInitialized) {
        return;
    }

    friendsInitialized = true;


    let user;

    try {

        const result = await getMe();

        user = result.user;

    } catch {

        friendsInitialized = false;
        return;

    }


    const friendRequestForm =
        document.querySelector("#friend-request-form");

    const friendIdInput =
        document.querySelector("#friend-id");

    const friendRequestsList =
        document.querySelector("#friend-requests-list");

    const friendsList =
        document.querySelector("#friends-list");

    const messageForm =
        document.querySelector("#message-form");

    const messageInput =
        document.querySelector("#message-input");

    const messagesDiv =
        document.querySelector("#messages");

    const chatTitle =
        document.querySelector("#chat-title");


    let currentFriend = null;

    let conversationLoadId = 0;



    loadFriendRequests();

    loadFriends();



    friendRequestForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            try {

                await sendFriendRequest(
                    friendIdInput.value.trim()
                );


                alert(
                    "Friend request sent."
                );


                friendRequestForm.reset();


            } catch (error) {

                alert(error.message);

            }

        }
    );



    messageForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            if (!currentFriend) {
                return;
            }


            const message =
                messageInput.value.trim();


            if (!message) {
                return;
            }


            try {

                await sendMessage(
                    currentFriend.id,
                    message
                );


                messageInput.value = "";


                await loadConversation(
                    currentFriend
                );


            } catch (error) {

                alert(error.message);

            }

        }
    );



    async function loadFriendRequests() {

        try {

            const requests =
                await getFriendRequests();


            friendRequestsList.replaceChildren();


            if (requests.length === 0) {

                const li =
                    document.createElement("li");

                li.textContent =
                    "No pending requests.";

                friendRequestsList.appendChild(li);

                return;

            }



            for (const request of requests) {

                const li =
                    document.createElement("li");


                li.textContent =
                    `${request.sender.username} `;



                const button =
                    document.createElement("button");


                button.textContent =
                    "Accept";



                button.addEventListener(
                    "click",
                    async () => {

                        try {

                            await acceptFriendRequest(
                                request.id
                            );


                            await loadFriendRequests();

                            await loadFriends();


                        } catch (error) {

                            console.error(error);

                        }

                    }
                );


                li.appendChild(button);

                friendRequestsList.appendChild(li);

            }


        } catch (error) {

            console.error(error);

        }

    }



    async function loadFriends() {

        try {

            const friends =
                await getFriends();


            friendsList.replaceChildren();



            if (friends.length === 0) {

                const li =
                    document.createElement("li");


                li.textContent =
                    "No friends yet.";


                friendsList.appendChild(li);

                return;

            }



            for (const friend of friends) {

                const li =
                    document.createElement("li");


                const button =
                    document.createElement("button");


                button.textContent =
                    friend.username;



                button.addEventListener(
                    "click",
                    async () => {

                        currentFriend =
                            friend;


                        await loadConversation(
                            friend
                        );

                    }
                );


                li.appendChild(button);

                friendsList.appendChild(li);

            }


        } catch (error) {

            console.error(error);

        }

    }




    async function loadConversation(friend) {


        const thisLoad =
            ++conversationLoadId;



        chatTitle.textContent =
            friend.username;


        messagesDiv.replaceChildren();



        try {

            const messages =
                await getMessages(
                    friend.id
                );



            // Ignore old requests that finished late
            if (thisLoad !== conversationLoadId) {
                return;
            }



            for (const message of messages) {

                const p =
                    document.createElement("p");



                p.textContent =
                    message.sender_id === user.id
                        ? `You: ${message.ciphertext}`
                        : `${friend.username}: ${message.ciphertext}`;



                messagesDiv.appendChild(p);

            }


        } catch (error) {

            console.error(error);

        }

    }

}