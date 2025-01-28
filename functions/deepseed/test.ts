
export const onRequest: PagesFunction = async (context) => {
  const {
    request,
    env,
    params,
  } = context;
  console.log(typeof request, typeof env, typeof params);

  const res_data: object[] = [];
  let question;
  new URL(request.url).searchParams.forEach((value, key) => {
    if (key === 'q') {
      question = {prompt: atob(value)};
    }
  })
  const response = await env.AI.run('@cf/meta/llama-3-8b-instruct', question);
  res_data.push({inputs: question, response});
  res_data.push({url:request.url});

  return new Response(JSON.stringify(res_data),
    {
      headers: {'Content-Type': 'text/html'},
      status: 200,
    });
};

