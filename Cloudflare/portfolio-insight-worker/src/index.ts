import { GoogleGenAI } from '@google/genai';

export default {
	async fetch(request: Request, env, ctx): Promise<Response> {
		const MAX_TOTAL_BYTES = 5000; // adjust as safe max payload size

		if (env.GEMINI_API_KEY === undefined || env.GEMINI_API_KEY === "") {
			return new Response("Worker is under maintainence", { status: 500 });
		}

		try {
			console.log("Incoming request: ", request.method, request.url, request.headers);

			if (request.method !== "POST") {
				console.warn("Rejected non-post request");
				return new Response("Forbidden", { status: 403 });
			}

			const contentType = request.headers.get("content-type") || "";
			if (!contentType.includes("application/json")) {
				return new Response("Content-Type must be application/json", { status: 403 });
			}

			const contentLengthHeader = request.headers.get("content-length");
			if (contentLengthHeader && Number(contentLengthHeader) > MAX_TOTAL_BYTES) {
				return new Response("Forbidden", { status: 403 });
			}

			let data: Prompt;
			try {
				data = await request.json<Prompt>();
				console.trace(data.prompt);
			} catch (error) {
				console.error(error);
				return new Response("Forbidden", { status: 403 });
			}

			const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

			const response = await ai.models.generateContent({
				model: 'gemini-2.0-flash-001',
				contents: data.prompt
			});

			return new Response(JSON.stringify(response), { status: 200, headers: { 'Content-Type': 'application/json' } });

		} catch (err: any) {
			console.error(err);
			return new Response(`Failed to deliver your message`, { status: 500 });
		}
	},
} satisfies ExportedHandler<Env>;

export interface Prompt {
	prompt: string;
}

export interface Env {
	GEMINI_API_KEY: string;
}