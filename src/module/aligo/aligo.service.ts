import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import * as FormData from 'form-data';

@Injectable()
export class AligoService {
  private readonly apiUrl = 'https://apis.aligo.in/send/';
  private API_KEY: string;
  private USER_ID: string;
  // .env 파일 정보 읽기
  constructor(private readonly configService: ConfigService) {
    this.API_KEY = this.configService.get('ALIGO_API_KEY');
    this.USER_ID = this.configService.get('ALIGO_USER_ID');
  }

  // 문자 보내기(알리고 서비스 연결)
  async sendSMS({
    phoneNumber,
    msg,
    sender,
    type,
  }: {
    phoneNumber: string;
    msg: string;
    sender: string;
    type: string;
  }) {
    const formData = new FormData();
    formData.append('key', this.API_KEY);
    formData.append('user_id', this.USER_ID);
    formData.append('sender', sender);
    formData.append('receiver', phoneNumber);
    formData.append('msg', msg);
    formData.append('msg_type', type);

    try {
      const response = await axios.post(this.apiUrl, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error while serializing JSON:', error);
    }
  }
}
