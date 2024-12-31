export const onRequest: PagesFunction = async (context) => {
  const {
    request,
    env,
    params,
    data,
  } = context;
  console.log(request, env, params, data)
  // if (!request.headers.has('Authorization')) {
  //   return new Response('Unauthorized', {
  //     status: 401,
  //     headers: {'WWW-Authenticate': 'Basic realm="Secure Area", charset="UTF-8'}
  //   });
  // }

  return new Response('success', {headers: {'Cache-Control': 'private, max-age=600', 'Expires': ''}});
};
