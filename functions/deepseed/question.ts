import {Ai} from '@cloudflare/ai/dist/sdk.js'

export interface Env {
  AI: Ai;
}

interface parameters {
  prompt?: string;
  raw?: boolean;
  messages?: message[];
}

interface message {
  role?: string;
  content?: string;
}


export const onRequest: PagesFunction<Env> = async (context) => {
  const {
    request,
    env,
    params,
  } = context;
  console.log(typeof request, typeof env, typeof params);

  const res_data: object[] = [];
  let question: parameters;
  new URL(request.url).searchParams.forEach((value, key) => {
    if (key === 'q') {
      question = {
        messages: [{ role: "user", content: "Who is Cloudflare on github?" }],
        prompt: decodeURIComponent(atob(value)),
        raw: false,
      };
    }
  })
  const response = await env.AI.run('@cf/deepseek-ai/deepseek-r1-distill-qwen-32b', question);
  res_data.push({inputs: question, response: response});
  // res_data.push({url:request.url});

  return new Response(JSON.stringify(res_data),
    {
      headers: {'Content-Type': 'text/html'},
      status: 200,
    });
};

