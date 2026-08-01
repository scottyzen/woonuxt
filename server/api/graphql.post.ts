export default defineEventHandler(async (event) => {
  const gqlHost = process.env.GQL_HOST || 'http://localhost:4000/graphql';
  const gqlOrigin = process.env.APP_HOST || new URL(gqlHost).origin;
  const cookieDomain = getRequestURL(event).hostname;
  const sessionCookieOptions = cookieDomain.includes('.') ? { domain: cookieDomain, path: '/', sameSite: 'lax' as const } : { path: '/', sameSite: 'lax' as const };
  const requestBody = await readRawBody(event, false);

  if (!requestBody) {
    throw createError({ statusCode: 400, statusMessage: 'A GraphQL request body is required.' });
  }

  const authorization = getHeader(event, 'authorization');
  const requestSession = getHeader(event, 'woocommerce-session') || getCookie(event, 'woocommerce-session');
  const sessionHeader = requestSession ? (requestSession.startsWith('Session ') ? requestSession : `Session ${requestSession}`) : undefined;
  const upstreamResponse = await fetch(gqlHost, {
    method: 'POST',
    headers: {
      'Content-Type': getHeader(event, 'content-type') || 'application/json',
      Origin: gqlOrigin,
      ...(authorization ? { Authorization: authorization } : {}),
      ...(sessionHeader ? { 'woocommerce-session': sessionHeader } : {}),
    },
    body: requestBody.toString(),
  });

  const responseSession = upstreamResponse.headers.get('woocommerce-session');
  if (responseSession) {
    const sessionToken = responseSession.replace(/^Session\s+/i, '').trim();
    if (sessionToken) {
      setCookie(event, 'woocommerce-session', sessionToken, sessionCookieOptions);
      setHeader(event, 'woocommerce-session', `Session ${sessionToken}`);
    }
  }

  setResponseStatus(event, upstreamResponse.status);
  setHeader(event, 'content-type', upstreamResponse.headers.get('content-type') || 'application/json');

  return await upstreamResponse.text();
});