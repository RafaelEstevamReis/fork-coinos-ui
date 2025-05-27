import { auth, fd, post } from "$lib/utils";
import { fail } from "@sveltejs/kit";

type Error = {
	message: string;
};

export default async ({ cookies, request }) => {
	const form = await fd(request);

	if (form.tab === "account") {
		form.notify = form.notify === "on";
		form.push = form.push === "on";
		form.nip5 = form.nip5 === "on";
		form.prompt = form.prompt === "on";
		form.autowithdraw = form.autowithdraw === "on";
	}

	try {
		const { user } = await post("/user", form, auth(cookies));

		if (user.language) cookies.set("lang", user.language, { path: "/" });

		return { user, success: true };
	} catch (e) {
		const { message } = e as Error;
		return fail(400, { message });
	}
};
