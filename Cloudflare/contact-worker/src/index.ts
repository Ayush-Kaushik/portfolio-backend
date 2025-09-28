/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
export default {
	async fetch(request: Request, env, _): Promise<Response> {
		const MAX_TOTAL_BYTES = 5000; // adjust as safe max payload size
		const MAX_MESSAGE_LENGTH = 4000; // Slack limit

		try {
			console.log("Incoming request: ", request.method, request.url, request.headers);

			if (request.method === "OPTIONS") {
				return new Response(null, {
					headers: {
						"Access-Control-Allow-Origin": env.ACCESS_CONTROL_ALLOW_ORIGIN, // Or restrict to specific domain
						"Access-Control-Allow-Methods": env.ACCESS_CONTROL_ALLOW_METHODS,
						"Access-Control-Allow-Headers": env.ACCESS_CONTROL_ALLOW_HEADERS
					}
				});
			}

			if (request.method !== "POST" && request.method !== "OPTIONS") {
				console.warn("Rejected non-post request");
				return new Response("Forbidden", { status: 403 });
			}

			const contentType = request.headers.get("content-type") || "";
			if (!contentType.includes("application/json")) {
				console.error("Invalid content-type:", contentType);
				return new Response("Forbidden", { status: 400 });
			}

			const contentLengthHeader = request.headers.get("content-length");
			if (contentLengthHeader && Number(contentLengthHeader) > MAX_TOTAL_BYTES) {
				console.error("Payload too large:", contentLengthHeader);
				return new Response("Forbidden", { status: 403 });
			}

			let data: User;
			try {
				data = await request.json<User>();
				console.trace(data.name, data.email, data.message);

			} catch (error) {
				console.error(error);
				return new Response("Forbidden", { status: 403 });
			}

			if (data.name === undefined || data.message === undefined) {
				console.warn("Received empty message");
				return new Response("Forbidden", { status: 403 });
			}

			if (data === undefined || data.message.length > MAX_MESSAGE_LENGTH) {
				console.error(`Message length exceeds defined slack message length ${MAX_MESSAGE_LENGTH}`);
				return new Response("Forbidden", { status: 403 });
			}

			const name = data.name ?? "Unknown user";
			const message = data.message ?? "No message provided";
			const email = data.email ?? "No email provided";

			const payload = {
				text: `📩 Message from *${name} ${email}*:  ${message}`,
			};

			const slackResponse = await fetch(env.SLACK_WEBHOOK_URL, {
				method: "POST",
				headers: {
					"Access-Control-Allow-Origin": env.ACCESS_CONTROL_ALLOW_ORIGIN,
					"Access-Control-Allow-Methods": env.ACCESS_CONTROL_ALLOW_METHODS,
					"Access-Control-Allow-Headers": env.ACCESS_CONTROL_ALLOW_HEADERS
				},
				body: JSON.stringify(payload),
			});

			if (!slackResponse.ok) {
				console.error("Slack error:", slackResponse.status, slackResponse.statusText);

				return new Response(`Failed to deliver your message`, {
					status: 500
				});
			}

			console.log("Message sent to Slack successfully ✅");
			return new Response("Message delivered ✅", { status: 200 });

		} catch (err: any) {
			console.error(err);
			return new Response(`Failed to deliver your message`, { status: 500 });
		}
	},
} satisfies ExportedHandler<Env>;

export interface User {
	name: string;
	email?: string;
	message: string;
}

export interface Env {
	SLACK_WEBHOOK_URL: string;
	ACCESS_CONTROL_ALLOW_ORIGIN: string;
	ACCESS_CONTROL_ALLOW_METHODS: string;
	ACCESS_CONTROL_ALLOW_HEADERS: string;
}