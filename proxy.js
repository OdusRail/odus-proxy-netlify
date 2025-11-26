const axios = require('axios'); // We will assume standard fetch or use built-in in Node 18+

exports.handler = async function(event, context) {
    const allowedOrigins = ["https://odus.lemone.online", "https://www.odus.lemone.online"];
    const headers = {
        'Access-Control-Allow-Origin': allowedOrigins.includes(event.headers.origin) ? event.headers.origin : allowedOrigins[0],
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    // URL is passed as ?url=...
    const targetUrl = event.queryStringParameters.url;
    
    if (!targetUrl) {
        return { statusCode: 400, body: "Usage: ?url=https://target.com" };
    }

    try {
        const response = await fetch(targetUrl, {
            method: event.httpMethod,
            headers: event.headers,
            body: event.body
        });

        const data = await response.text();

        return {
            statusCode: response.status,
            headers,
            body: data
        };
    } catch (error) {
        return { statusCode: 500, body: error.toString() };
    }
};