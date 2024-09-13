import { Injectable, BadRequestException } from '@nestjs/common';
import { InsertStore, StoreRepository, UpdateStore } from './store.repository';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import { AligoService } from '../aligo/aligo.service';

@Injectable()
export class StoreService {
  constructor(
    private repository: StoreRepository,
    private authService: AuthService,
    private aligoService: AligoService,
  ) {}

  // 비밀번호 암호화 후 저장
  async createStore(data: InsertStore) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return await this.repository.insertStore({
      ...data,
      password: hashedPassword,
    });
  }

  async fetchStoreById({ storeId }: { storeId: number }) {
    const store = await this.repository.findStore({ id: storeId });
    if (!store) {
      throw new BadRequestException('There is no that store');
    }

    // 비밀번호 제외한 공급자 정보 return
    const { password, ...storeInfo } = store;
    const totalProduct = store.products.length;

    return { ...storeInfo, totalProduct };
  }

  async fetchStore({
    userName,
    managerName,
    email,
    companyName,
  }: {
    userName?: string;
    managerName?: string;
    email?: string;
    companyName?: string;
  }) {
    return await this.repository.findStore({
      userName,
      managerName,
      email,
      companyName,
    });
  }

  // 공급자 목록
  async fetchManyStore({
    page,
    keyword,
    item,
    range,
  }: {
    page: number;
    keyword?: string;
    item?: string;
    range?: string;
  }) {
    return await this.repository.findManyStore({
      where: { page },
      searchOption: { keyword },
      filter: { item, range },
    });
  }

  async modifyStore({ storeId, data }: { storeId: number; data: UpdateStore }) {
    await this.fetchStoreById({ storeId });

    // 비밀번호 파라미터가 있을 때만 암호화 후 업데이트
    let hashedPassword = undefined;
    if (data.password) {
      hashedPassword = await bcrypt.hash(data.password, 10);
    }

    return await this.repository.updateStore({
      data: { ...data, password: hashedPassword },
      where: { id: storeId },
    });
  }

  // 공급자 활성상태(status) 수정
  async modifyStoreStatus({
    storeId,
    status,
  }: {
    storeId: number;
    status: boolean;
  }) {
    await this.fetchStoreById({ storeId });

    return await this.repository.updateStore({
      where: { id: storeId },
      data: { status },
    });
  }

  async removeStore({ storeId }: { storeId: number }) {
    await this.fetchStoreById({ storeId });

    return await this.repository.deleteStore({ id: storeId });
  }

  // 비밀번호 변경 페이지 주소 문자로 보내기
  async fetchPasswordURL({
    companyName,
    email,
    userName,
  }: {
    companyName: string;
    email: string;
    userName: string;
  }) {
    const store = await this.fetchStore({ companyName, email, userName });
    if (!store) {
      throw new BadRequestException('회원이 아닙니다 회원가입을 진행해주세요.');
    }

    const token = await this.authService.generateToken({
      storeId: store.id,
    });

    return await this.aligoService.sendSMS({
      phoneNumber: store.managerNumber,
      msg: `https://company.macodi.co.kr/edit-password?token=${token}&type=store`,
      sender: '02-3456-7117',
      type: 'LMS',
    });
  }
}
