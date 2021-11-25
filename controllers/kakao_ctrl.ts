import axios from 'axios';
import { kakao_config as sercetKey } from '../config/kakao_config';

export const getAddressInfo = async (address: string) => {
  const encodedAddress = encodeURIComponent(address);

  const response = await axios({
    method: 'GET',
    url: `https://dapi.kakao.com/v2/local/search/address.json?analyze_type=similar&query=${encodedAddress}`,
    headers: {
      Authorization: `KakaoAK ${sercetKey}`,
    },
  });

  if (response.data.documents.length === 0) {
    return '위치정보가 잘못되었습니다.';
  }

  const result = {
    lat: response.data.documents[0].address.x,
    lng: response.data.documents[0].address.y,
  };

  return result;
};
