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

export async function importPublicKey(
    base64
) {

    const bytes =
        Uint8Array.from(
            atob(base64),
            c => c.charCodeAt(0)
        );


    return await crypto.subtle.importKey(

        "raw",

        bytes,

        {
            name: "X25519"
        },

        true,

        []

    );

}

export async function deriveSharedSecret(
    privateKey,
    publicKey
) {

    return await crypto.subtle.deriveBits(

        {
            name: "X25519",

            public:
                publicKey
        },

        privateKey,

        256

    );

}

export async function deriveAESKey(
    sharedSecret
) {


    const keyMaterial =
        await crypto.subtle.importKey(

            "raw",

            sharedSecret,

            "HKDF",

            false,

            [
                "deriveKey"
            ]

        );


    return await crypto.subtle.deriveKey(

        {
            name:"HKDF",

            hash:"SHA-256",

            salt:
                new Uint8Array(),

            info:
                new TextEncoder()
                    .encode(
                        "chat encryption"
                    )

        },


        keyMaterial,


        {
            name:"AES-GCM",

            length:256
        },


        false,


        [
            "encrypt",
            "decrypt"
        ]

    );

}

export async function deriveAESKey(
    sharedSecret
) {


    const keyMaterial =
        await crypto.subtle.importKey(

            "raw",

            sharedSecret,

            "HKDF",

            false,

            [
                "deriveKey"
            ]

        );


    return await crypto.subtle.deriveKey(

        {
            name:"HKDF",

            hash:"SHA-256",

            salt:
                new Uint8Array(),

            info:
                new TextEncoder()
                    .encode(
                        "chat encryption"
                    )

        },


        keyMaterial,


        {
            name:"AES-GCM",

            length:256
        },


        false,


        [
            "encrypt",
            "decrypt"
        ]

    );

}