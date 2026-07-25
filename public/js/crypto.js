export async function generateKeyPair() {

    return await crypto.subtle.generateKey(
        {
            name: "X25519"
        },
        false,
        [
            "deriveBits"
        ]
    );

}


export async function exportPublicKey(publicKey) {

    const raw =
        await crypto.subtle.exportKey(
            "raw",
            publicKey
        );


    return btoa(
        String.fromCharCode(
            ...new Uint8Array(raw)
        )
    );

}