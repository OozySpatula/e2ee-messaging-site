import {

    sendFriendRequest,

    acceptFriendRequest,

    getFriendRequests,

    getFriends,

    sendMessage,

    getMessages,

    getMe

} from "./api.js";


export async function setupFriends() {

    let user;

    try {

        const result =
            await getMe();

        user =
            result.user;

    } catch {

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

                //
                // Replace with encrypted text later.
                //

                await sendMessage(

                    currentFriend.id,

                    message

                );


                messageInput.value = "";

                loadConversation(
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

            friendRequestsList.innerHTML = "";


            if (requests.length === 0) {

                friendRequestsList.innerHTML =
                    "<li>No pending requests.</li>";

                return;

            }


            for (const request of requests) {

                const li =
                    document.createElement("li");

                li.textContent =
                    request.sender.username + " ";


                const button =
                    document.createElement("button");

                button.textContent =
                    "Accept";


                button.addEventListener(
                    "click",
                    async () => {

                        await acceptFriendRequest(
                            request.id
                        );

                        loadFriendRequests();

                        loadFriends();

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

            friendsList.innerHTML = "";


            if (friends.length === 0) {

                friendsList.innerHTML =
                    "<li>No friends yet.</li>";

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
                    () => {

                        currentFriend =
                            friend;

                        loadConversation(
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

        chatTitle.textContent =
            friend.username;

        messagesDiv.innerHTML = "";


        try {

            const messages =
                await getMessages(
                    friend.id
                );


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