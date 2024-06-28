import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

const form = new FormData();
form.append('file', fs.createReadStream('../build/temp.c'));

axios.post('http://localhost:3000/uploads', form, {
  headers: {
    ...form.getHeaders()
  }
})
.then(response => {
  console.log('上传成功:', response.data);
})
.catch(error => {
  console.error('上传失败:', error);
});



