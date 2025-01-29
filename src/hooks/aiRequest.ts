import axios from "axios";

export function aiRequest() {
  const query = async (url_path: string, prompt: string | undefined): Promise<string[]> => {
    if (prompt) {
      try {
        const result = await axios.get(url_path + '/deepseed/test?q=' + atob(prompt), {headers: {'Content-Type': 'multipart/form-data'}});
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
