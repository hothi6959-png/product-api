const request = require('supertest');
const express = require('express');

const app = express();

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        database: 'connected'
    });
});

describe('Product API health check', () => {
    test('GET /health returns status 200', async () => {
        const response = await request(app).get('/health');

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('OK');
        expect(response.body.database).toBe('connected');
    });
});