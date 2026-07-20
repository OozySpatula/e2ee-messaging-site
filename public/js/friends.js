import {
    sendFriendRequest,
    acceptFriendRequest,
    getFriendRequests,
    getFriends
} from "./api.js";


export function setupFriends(userId) {


    const friendRequestForm =
        document.querySelector("#friend-request-form");


    const friendIdInput =
        document.querySelector("#friend-id");


    const requestsList =
        document.querySelector("#friend-requests-list");


    const friendsList =
        document.querySelector("#friends-list");



    //
    // Send friend request
    //

    friendRequestForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const receiverId =
                friendIdInput.value.trim();


            if (!receiverId) {
                return;
            }


            try {

                await sendFriendRequest(
                    receiverId
                );


                friendIdInput.value = "";


                alert(
                    "Friend request sent."
                );


            } catch(error) {

                alert(
                    error.message
                );

            }

        }
    );



    //
    // Load incoming requests
    //

    async function loadRequests() {

        try {

            const requests =
                await getFriendRequests();


            // Safely clear list
            requestsList.replaceChildren();



            requests.forEach(request => {


                const li =
                    document.createElement("li");


                const name =
                    document.createElement("span");


                name.textContent =
                    request.sender.username;



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


                            loadRequests();

                            loadFriends();


                        } catch(error) {

                            alert(
                                error.message
                            );

                        }

                    }
                );



                li.append(
                    name,
                    button
                );


                requestsList.appendChild(
                    li
                );

            });


        } catch(error) {

            console.error(error);

        }

    }



    //
    // Load friends
    //

    async function loadFriends() {


        try {

            const friends =
                await getFriends();


            // Safely clear list
            friendsList.replaceChildren();



            if (friends.length === 0) {

                const li =
                    document.createElement("li");


                li.textContent =
                    "No friends yet.";


                friendsList.appendChild(
                    li
                );


                return;
            }



            friends.forEach(friend => {


                const li =
                    document.createElement("li");



                const button =
                    document.createElement("button");


                button.className =
                    "open-chat";


                button.textContent =
                    friend.username;



                button.dataset.userId =
                    friend.id;



                li.appendChild(
                    button
                );


                friendsList.appendChild(
                    li
                );


            });



        } catch(error) {

            console.error(error);

        }

    }



    //
    // Initial load
    //

    loadRequests();

    loadFriends();


}