let qrngBuffer = [];
let isFetching = false;

const getBulkQRNG = async function() {
    if (qrngBuffer.length > 0 || isFetching) {
        return qrngBuffer;
    }

    isFetching = true;
    try {
        // Fetch 20 quantum integers in bulk (adjust your Val Town URL parameter if your script supports batching, 
        // or we simulate a bulk pull by generating/fetching entropy)
        const response = await fetch('https://Selapian--2f58e6388fb311f1b0781607ee4eb77e.web.val.run');
        const data = await response.json();
        const baseNumber = parseInt(data.number, 10) || Math.floor(Math.random() * 100000);

        // Generate an array of 20 deterministic/pseudo-quantum variations from the single fetch
        qrngBuffer = [];
        for (let i = 0; i < 20; i++) {
            qrngBuffer.push(baseNumber + (i * 37) ^ (i * 99)); // Deterministic scatter
        }
    } catch (err) {
        console.warn("[QRNG Bulk] Fetch failed, generating local entropy pool:", err);
        qrngBuffer = [];
        for (let i = 0; i < 20; i++) {
            qrngBuffer.push(Math.floor(Math.random() * 100000));
        }
    } finally {
        isFetching = false;
    }
    return qrngBuffer;
};

const getNextQuantumIndex = async function() {
    if (qrngBuffer.length === 0) {
        await getBulkQRNG();
    }
    // Pull the next integer from the front of the array, or fallback if still empty
    return qrngBuffer.length > 0 ? qrngBuffer.shift() : Math.floor(Math.random() * 100000);
};

export default { getNextQuantumIndex, getBulkQRNG };