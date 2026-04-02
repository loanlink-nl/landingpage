export default defineEventHandler((event) => {
	const host = getHeader(event, "host");

	if (!host || host !== "www.loanlink.nl") {
		return;
	}

	const requestUrl = getRequestURL(event);
	requestUrl.host = "loanlink.nl";

	return sendRedirect(event, requestUrl.toString(), 301);
});
