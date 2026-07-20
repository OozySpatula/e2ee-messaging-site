async function request(endpoint, options = {}) {

    const response = await fetch(`/api${endpoint}`, {

        headers: {
            "Content-Type": "application/json"
        },

        credentials: "include",

        ...options

    });


    const data = await response.json();


    if (!response.ok) {

        throw new Error(
            data.message || "API request failed"
        );

    }


    return data;

}



export function register(username, password) {

    return request("/auth", {

        method: "POST",

        body: JSON.stringify({

            action: "register",
            username,
            password

        })

    });

}



export function login(username, password) {

    return request("/auth", {

        method: "POST",

        body: JSON.stringify({

            action: "login",
            username,
            password

        })

    });

}

export function sendFriendRequest(
    senderId,
    receiverId
) {

    return request("/friends", {

        method: "POST",

        body: JSON.stringify({

            action: "request",

            senderId,

            receiverId

        })

    });

}

export function acceptFriendRequest(
    requestId
) {

    return request("/friends", {

        method: "POST",

        body: JSON.stringify({

            action: "accept",

            requestId

        })

    });

}

export function getFriendRequests(
    userId
) {

    return request(
        `/friends?action=requests&userId=${userId}`
    );

}

export function getFriends(
    userId
) {

    return request(
        `/friends?action=friends&userId=${userId}`
    );

}