import multer from 'multer';
import nextConnect from 'next-connect';
import FormData from 'form-data';
import axios from 'axios';

const upload = multer({
  storage: multer.memoryStorage(),
});

const apiRoute = nextConnect();

apiRoute.use(upload.single('file'));

apiRoute.post(async (req, res) => {
  const formData = new FormData();
  const { title, content, startAddress, startLat, startLng, endAddress, endLat, endLng, waypoints } = req.body;

  formData.append('title', title);
  formData.append('content', content);
  formData.append('startAddress', startAddress);
  formData.append('startLat', startLat);
  formData.append('startLng', startLng);
  formData.append('endAddress', endAddress);
  formData.append('endLat', endLat);
  formData.append('endLng', endLng);
  formData.append('waypoints', waypoints);

  if (req.file) {
    formData.append('file', req.file.buffer, req.file.originalname);
  }

  try {
    const response = await axios.post('구미당', formData, {//api 나오면 수정
      headers: {
        ...formData.getHeaders(),
      },
    });

    if (response.status === 200) {
      res.status(200).json(response.data);
    } else {
      res.status(response.status).json(response.data);
    }
  } catch (error) {
    res.status(500).json({ message: '서버 오류', error: error.message });
  }
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false,
  },
};
