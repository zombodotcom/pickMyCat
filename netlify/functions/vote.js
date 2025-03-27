// netlify/functions/vote.js

// Global in-memory storage (non-persistent)
let votes = {};

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { id, delta } = JSON.parse(event.body);
        if (typeof id === 'undefined' || typeof delta !== 'number') {
            return { statusCode: 400, body: 'Invalid request' };
        }

        if (!votes[id]) {
            votes[id] = 0;
        }
        votes[id] += delta;

        return {
            statusCode: 200,
            body: JSON.stringify({ id, votes: votes[id] })
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};
