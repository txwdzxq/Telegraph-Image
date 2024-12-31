export async function onRequest(context) {
  const {
    request,
    env,
  } = context;
  try {
    console.log(env)
    if(request.pathname.startsWith('/user_login_request')) {
      return context.next();
    }

    if (request.headers.has('Authorization')) {
      const {user, pass} = basicAuthentication(context.request);

      if (context.env['BASIC_USER'] !== user || context.env['BASIC_PASS'] !== pass) {
        return UnauthorizedException('Invalid credentials.');
      } else {
        return context.next();
      }

    }
    return new Response('Unauthorized', {
      status: 401,
      headers: {'WWW-Authenticate': 'Basic realm="Secure Area", charset="UTF-8'}
    });
  } catch (err) {
    return new Response(`${err.message}\n${err.stack}`, {status: 500});
  }
}

function basicAuthentication(request) {
  const Authorization = request.headers.get('Authorization');
  const [scheme, encoded] = Authorization.split(' ');

  // The Authorization header must start with Basic, followed by a space.
  if (!encoded || scheme !== 'Basic') {
    throw new BadRequestException('Malformed authorization header.');
  }

  // Decodes the base64 value and performs unicode normalization.
  // @see https://datatracker.ietf.org/doc/html/rfc7613#section-3.3.2 (and #section-4.2.2)
  // @see https://dev.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
  const buffer = new Uint8Array(atob(encoded).split('').map(c => c.charCodeAt(0)));
  // const buffer = Uint8Array.from(atob(encoded), c => c.charCodeAt(0));
  const decoded = new TextDecoder().decode(buffer).normalize();

  // The username & password are split by the first colon.
  //=> example: "username:password"
  const index = decoded.indexOf(':');

  // The user & password are split by the first colon and MUST NOT contain control characters.
  // @see https://tools.ietf.org/html/rfc5234#appendix-B.1 (=> "CTL = %x00-1F / %x7F")
  if (index === -1 || /[\0-\x1F\x7F]/.test(decoded)) {
    throw new BadRequestException('Invalid authorization value.');
  }

  return {
    user: decoded.substring(0, index),
    pass: decoded.substring(index + 1),
  };
}

function UnauthorizedException(reason) {
  return new Response(reason, {
    status: 401,
    statusText: 'Unauthorized',
    headers: {
      'Content-Type': 'text/plain;charset=UTF-8',
      // Disables caching by default.
      'Cache-Control': 'no-store',
      // Returns the "Content-Length" header for HTTP HEAD requests.
      'Content-Length': reason.length,
    },
  });
}

function BadRequestException(reason) {
  return new Response(reason, {
    status: 400,
    statusText: 'Bad Request',
    headers: {
      'Content-Type': 'text/plain;charset=UTF-8',
      // Disables caching by default.
      'Cache-Control': 'no-store',
      // Returns the "Content-Length" header for HTTP HEAD requests.
      'Content-Length': reason.length,
    },
  });
}
