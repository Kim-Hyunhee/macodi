import axios from 'axios';

// AI 모듈 주소
const instance = axios.create({
  baseURL: 'http://ai-module-server.snl.ecs.local',
});

// 비슷한 이미지 정보 배열
export const getSimilarProduct = async ({
  file,
  k,
  rgb_ratio,
}: {
  file: string;
  k: number;
  rgb_ratio: number;
}) => {
  const img = file.replace(/^data:image\/[a-z]+;base64,/, '');

  try {
    const { data } = await instance.post('/v1/products:scan', {
      image: img,
      k,
      rgb_ratio,
    });

    return data;
  } catch (error) {
    console.error('오류:', error);

    return error;
  }
};
