import axios from 'axios';

const IMGBB_KEY = '693b7b2e23bae09cb77855dab62da8a6';

export async function subirAImgbb(file: File): Promise<string> {
  const reader = new FileReader();

  const base64 = await new Promise<string>((resolve, reject) => {
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const form = new FormData();
  form.append('key', IMGBB_KEY);
  form.append('image', base64);

  const { data } = await axios.post('https://api.imgbb.com/1/upload', form);
  return data.data.url;
}
