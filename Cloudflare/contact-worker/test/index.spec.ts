import { SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import '../src/index';

describe('Contact worker - security tests', () => {
	it('rejects requests with missing body', async () => {
		const response = await SELF.fetch('http://example.com', { method: 'POST', headers: {"Content-Type": "application/json"} });
		expect(response.status).toBe(403);
	});

	it('rejects requests with invalid JSON', async () => {
		const response = await SELF.fetch('http://example.com', {
			method: 'POST',
			headers: {"Content-Type": "application/json"},
			body: "{not:'json'}"
		});

		expect(response.status).toBe(403);
	});

	it('rejects unsupported HTTP methods (e.g. GET)', async () => {
		const response = await SELF.fetch('http://example.com', { method: 'GET' });
		expect(response.status).toBe(403);
	});

	it('rejects overly large payloads with forged content-length header', async () => {
		const bigPayload = JSON.stringify({ message: "x".repeat(20000) });
		const response = await SELF.fetch('http://example.com', {
			method: 'POST',
			body: bigPayload,
			headers: {"Content-Type": "application/json", "Content-Length": "20"}
		});

		expect(response.status).toBe(403);
	});

	// TODO: Check if SQL injection and XSS scriping attacks protection is required

	it('rejects requests without required fields', async () => {
		const response = await SELF.fetch('http://example.com', {
			method: 'POST',
			body: JSON.stringify({}),
			headers: {"Content-Type": "application/json", "Content-Length": "20"}
		});

		expect(response.status).toBe(403);
	});


	// TODO: Add rate limiting in future iterations

	// it('rate limits excessive requests from same IP', async () => {
	// 	const request = new IncomingRequest('http://example.com', {
	// 		method: 'POST',
	// 		body: JSON.stringify({ message: "spam" }),
	// 		headers: { "CF-Connecting-IP": "1.2.3.4" }
	// 	});
	// 	const ctx = createExecutionContext();

	// 	// Simulate multiple requests
	// 	for (let i = 0; i < 20; i++) {
	// 		await worker.fetch(request, env, ctx);
	// 	}

	// 	const response = await worker.fetch(request, env, ctx);

	// 	expect(response.status).toBe(429); // Too Many Requests
	// });
});
