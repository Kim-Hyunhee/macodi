import { Injectable } from '@nestjs/common';
import { AligoService } from '../aligo/aligo.service';

@Injectable()
export class PartnershipService {
  constructor(private aligoService: AligoService) {}

  // 제휴 신청 시 문자 보내기
  async createPartnership({
    name,
    position,
    companyName,
    email,
    phoneNumber,
  }: {
    name: string;
    position: string;
    companyName: string;
    email: string;
    phoneNumber: string;
  }) {
    return await this.aligoService.sendSMS({
      phoneNumber: '01093191508',
      msg: `${companyName}의 ${name}${position}님이 제휴 신청을 했습니다. 이메일 주소는 ${email}이고, 
      연락처는 ${phoneNumber}입니다.`,
      sender: '01093191508',
      type: 'SMS',
    });
  }
}
