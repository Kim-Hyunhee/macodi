import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User, Company, Admin, Store } from '@prisma/client';
import { Payload } from './type';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  // 개인 회원 비밀번호 확인
  async checkUserPassword({
    user,
    password,
  }: {
    user: User;
    password: string;
  }) {
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new BadRequestException('PW 오류입니다. 다시 시도해주세요.');
    }

    return isValid;
  }

  // 전문가 회원 비밀번호 확인
  async checkCompanyPassword({
    company,
    password,
  }: {
    company: Company;
    password: string;
  }) {
    const isValid = await bcrypt.compare(password, company.password);
    if (!isValid) {
      throw new BadRequestException('PW 오류입니다. 다시 시도해주세요.');
    }

    return isValid;
  }

  // 관리자 비밀번호 확인
  async checkAdminPassword({
    admin,
    password,
  }: {
    admin: Admin;
    password: string;
  }) {
    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      throw new BadRequestException('PW 오류입니다. 다시 시도해주세요.');
    }

    return isValid;
  }

  // 공급자 비밀번호 확인
  async checkStorePassword({
    store,
    password,
  }: {
    store: Store;
    password: string;
  }) {
    const isValid = await bcrypt.compare(password, store.password);
    if (!isValid) {
      throw new BadRequestException('PW 오류입니다. 다시 시도해주세요.');
    }

    return isValid;
  }

  // 토큰 생성
  async generateToken({
    userId,
    companyId,
    adminId,
    storeId,
  }: {
    userId?: number;
    companyId?: number;
    adminId?: number;
    storeId?: number;
  }) {
    const payload: Payload = {
      userId,
      companyId,
      adminId,
      storeId,
    };

    return this.jwtService.sign(payload);
  }
}
