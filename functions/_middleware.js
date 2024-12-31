export async function onRequest(context) {
  const {
    request,
    env,
  } = context;
  try {
    console.log(env)
    if (!request.headers.has('Authorization')) {
      return new Response('Unauthorized', {
        status: 401,
        headers: {'WWW-Authenticate': 'Basic realm="Secure Area", charset="UTF-8'}
      });
    }
    return await context.next();
  } catch (err) {
    return new Response(`${err.message}\n${err.stack}`, {status: 500});
  }
}
