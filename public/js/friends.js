import {
  sendFriendRequest,
  acceptFriendRequest,
  getFriendRequests,
  getFriends,
  sendMessage,
  getMessages,
  getMe,
  getFriendPublicKey,
} from "./api.js";
import {
  importPublicKey,
  deriveAESKey,
  deriveSharedSecret,
  encryptMessage,
  decryptMessage,
} from "./crypto.js";
import { getPrivateKey } from "./keyStore.js";

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

  const friendRequestForm = document.querySelector("#friend-request-form");

  const friendIdInput = document.querySelector("#friend-id");

  const friendRequestsList = document.querySelector("#friend-requests-list");

  const friendsList = document.querySelector("#friends-list");

  const messageForm = document.querySelector("#message-form");

  const messageInput = document.querySelector("#message-input");

  const messagesDiv = document.querySelector("#messages");

  const chatTitle = document.querySelector("#chat-title");

  let currentFriend = null;

  let conversationLoadId = 0;

  loadFriendRequests();

  loadFriends();

  friendRequestForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      await sendFriendRequest(friendIdInput.value.trim());

      alert("Friend request sent.");

      friendRequestForm.reset();
    } catch (error) {
      alert(error.message);
    }
  });

  messageForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!currentFriend) {
      return;
    }

    const message = messageInput.value.trim();

    if (!message) {
      return;
    }

    try {
      // Get friend's public key from server
      const friendPublicKeyBase64 = await getFriendPublicKey(currentFriend.id);

      // Convert base64 public key back into CryptoKey
      const friendPublicKey = await importPublicKey(
        friendPublicKeyBase64.publicKey,
      );

      // Load your private key from IndexedDB
      const privateKey = await getPrivateKey();

      // X25519 key agreement
      const sharedSecret = await deriveSharedSecret(
        privateKey,
        friendPublicKey,
      );

      // Turn shared secret into AES-GCM key
      const aesKey = await deriveAESKey(sharedSecret);

      // Encrypt message
      const encrypted = await encryptMessage(message, aesKey);

      // Send ciphertext only
      await sendMessage(currentFriend.id, encrypted.ciphertext, encrypted.iv);

      messageInput.value = "";

      await loadConversation(currentFriend);
    } catch (error) {
      alert(error.message);
    }
  });

  async function loadFriendRequests() {
    try {
      const requests = await getFriendRequests();

      friendRequestsList.replaceChildren();

      if (requests.length === 0) {
        const li = document.createElement("li");

        li.textContent = "No pending requests.";

        friendRequestsList.appendChild(li);

        return;
      }

      for (const request of requests) {
        const li = document.createElement("li");

        li.textContent = `${request.sender.username} `;

        const button = document.createElement("button");

        button.textContent = "Accept";

        button.addEventListener("click", async () => {
          try {
            await acceptFriendRequest(request.id);

            await loadFriendRequests();

            await loadFriends();
          } catch (error) {}
        });

        li.appendChild(button);

        friendRequestsList.appendChild(li);
      }
    } catch (error) {}
  }

  async function loadFriends() {
    try {
      const friends = await getFriends();

      friendsList.replaceChildren();

      if (friends.length === 0) {
        const li = document.createElement("li");

        li.textContent = "No friends yet.";

        friendsList.appendChild(li);

        return;
      }

      for (const friend of friends) {
        const li = document.createElement("li");

        const button = document.createElement("button");

        button.textContent = friend.username;

        button.addEventListener("click", async () => {
          currentFriend = friend;

          await loadConversation(friend);
        });

        li.appendChild(button);

        friendsList.appendChild(li);
      }
    } catch (error) {}
  }

  async function loadConversation(friend) {
    const thisLoad = ++conversationLoadId;

    chatTitle.textContent = friend.username;

    messagesDiv.replaceChildren();

    try {
      const messages = await getMessages(friend.id);

      const privateKey = await getPrivateKey();

      const friendPublicKeyBase64 = await getFriendPublicKey(friend.id);

      const friendPublicKey = await importPublicKey(
        friendPublicKeyBase64.publicKey,
      );

      const sharedSecret = await deriveSharedSecret(
        privateKey,
        friendPublicKey,
      );

      const aesKey = await deriveAESKey(sharedSecret);

      // Ignore old requests that finished late
      if (thisLoad !== conversationLoadId) {
        return;
      }

      for (const message of messages) {
        try {
          const plaintext = await decryptMessage(
            message.ciphertext,
            message.iv,
            aesKey,
          );

          const p = document.createElement("p");

          p.textContent =
            message.sender_id === user.id
              ? `You: ${plaintext}`
              : `${friend.username}: ${plaintext}`;

          messagesDiv.appendChild(p);

        } catch (error) {
          const p = document.createElement("p");

          p.textContent = "[Message could not be verified]";

          messagesDiv.appendChild(p);
        }
      }
    } catch (error) {}
  }
}
