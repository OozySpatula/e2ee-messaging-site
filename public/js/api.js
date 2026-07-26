async function request(endpoint, options = {}) {
  const response = await fetch(`/api${endpoint}`, {
    credentials: "include",

    ...options,

    headers: {
      ...(options.body && {
        "Content-Type": "application/json",
      }),

      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }

  return data;
}

export function register(username, password, publicKey) {
  return request("/auth", {
    method: "POST",

    body: JSON.stringify({
      action: "register",

      username,

      password,

      publicKey,
    }),
  });
}

export function login(username, password) {
  return request("/auth", {
    method: "POST",

    body: JSON.stringify({
      action: "login",
      username,
      password,
    }),
  });
}

export function logout() {
  return request("/auth", {
    method: "POST",

    body: JSON.stringify({
      action: "logout",
    }),
  });
}

export function sendFriendRequest(receiverId) {
  return request("/friends", {
    method: "POST",

    body: JSON.stringify({
      action: "request",
      receiverId,
    }),
  });
}

export function acceptFriendRequest(requestId) {
  return request("/friends", {
    method: "POST",

    body: JSON.stringify({
      action: "accept",
      requestId,
    }),
  });
}

export function getFriendRequests() {
  return request("/friends?action=requests");
}

export function getFriends() {
  return request("/friends?action=friends");
}

export function getMe() {
  return request("/me");
}

export function sendMessage(receiverId, ciphertext, iv) {
  return request("/messages", {
    method: "POST",

    body: JSON.stringify({
      action: "send",

      receiverId,

      ciphertext,

      iv,
    }),
  });
}

export function getMessages(friendId) {
  return request(`/messages?action=list&friendId=${friendId}`);
}

export function getFriendPublicKey(friendId) {
  return request(`/friends?action=publicKey&id=${friendId}`);
}
