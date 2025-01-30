import axios from "axios";

interface res {
  inputs: object;
  response: object;
}

export function aiRequest() {
  const query = async (url_path: string, prompt: string | undefined): Promise<res> => {
    if (prompt) {
      try {
        const result = await axios.get(url_path + '/deepseed/test?q=' + btoa(encodeURIComponent(prompt)), {headers: {'Content-Type': 'multipart/form-data'}});
        return result.data;
      } catch (e) {
        console.log(e)
      }
    }
    return {inputs: {}, response: {}};
  };

  return {
    query
  }
}
