import axios, {AxiosResponse} from "axios";

interface Env {
  img_url: KVNamespace;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const {request, env,} = context;
  // get file path json
  const url = new URL(request.url);
  const url_split = url.pathname.split(".")[0].split("/");
  const path = url_split[url_split.length - 1];
  const get_path_url = `https://api.telegram.org/bot${env['TG_Bot_Token']}/getFile?file_id=${path}`;
  let file_path_data: object;
  let file_path: string;
  await axios.get(get_path_url, {responseType: "json"}).then(
    (res: AxiosResponse) => {
      console.log('res.data', res.data.length);
      file_path_data = res.data;
      file_path = res.data.result.file_path;
    }).catch(() => {
    file_path = 'fail get file path';
  });

  // get file
  const file_url = `https://api.telegram.org/file/bot${env['TG_Bot_Token']}/${file_path}`;
  console.log('file_path', file_url)

  let res_data: ArrayBuffer | string;
  let res_data_headers: HeadersInit;
  await axios.get(file_url, {responseType: 'arraybuffer'})
    .then(res => {
        res_data_headers = {
          'Content-Type': '*',
          'Content-Disposition': 'inline',
        }
        res_data = res.data
      }
    ).catch((e) => {
      res_data_headers = {
        'Content-Type': 'text/html',
      }
      res_data = e.toString() + '/' + path + '/' + JSON.stringify(file_path_data) + '/';
    });

  return new Response(res_data,
    {
      headers: res_data_headers,
      status: 200
    });
};
