import axios from "axios";

export function aiRequest() {
  const query = async (url_path: string, prompt: string | undefined): Promise<string[]> => {
    if (prompt) {
      try {
        const result = await axios.post(url_path + '/upload_image', prompt, {headers: {'Content-Type': 'multipart/form-data'}});
        return result.data;
      } catch (e) {
        console.log(e)
      }
    }
    return [''];
  };

  return {
    query
  }
}
