import axios from "axios";
import FormData from "form-data";

export function useRequest() {
  const upload = async (url_path: string, files: Array<File>): Promise<string[]> => {
    if (files) {
      // console.log('upload' + files);
      try {
        const formData = new FormData();
        for (const file of files) {
          formData.append('files', file);
        }
        const result = await axios.post(url_path + '/upload_image', formData, {headers: {'Content-Type': 'multipart/form-data'}});
        // console.log(result.data);
        return result.data;
      } catch (e) {
        console.log(e)
      }
    }
    return [''];
  };

  return {
    upload
  }
}
