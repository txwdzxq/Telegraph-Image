import axios from "axios";
import FormData from "form-data";

export function useRequest() {
  const upload = async (files: Array<File>):Promise<string> => {
    if (files) {
      console.log('upload' + files);
      try {
        const formData = new FormData();
        for (const file of files) {
          formData.append('files', file);
        }
        const result = await axios.post('https://image.unrose.com/upload_image', formData, {headers: {...formData.getHeaders()}});
        console.log(result);
        return JSON.stringify(result.data);
      } catch (e) {
        console.log(e)
      }
    }
    return '';
  };

  return {
    upload
  }
}
