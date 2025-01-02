interface Env {
  img_url: KVNamespace;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const {request, env,} = context;

  const url = new URL(request.url);
  const url_split = url.pathname.split("/");
  const path = url_split[url_split.length - 1];

  let res_data: ArrayBuffer | string;

  await env.img_url.delete(path)
    .then(res => {
      console.log(res);
      res_data = JSON.stringify(res);
    })
    .catch(e => console.log(e));

  return new Response(res_data,
    {
      headers: {'Content-Type': 'text/html',},
      status: 200
    });
};
