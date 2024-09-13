import { BadRequestException, Injectable } from '@nestjs/common';
import { InsertUser, UpdateUser, UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
import { AligoService } from '../aligo/aligo.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    private repository: UserRepository,
    private aligoService: AligoService,
    private authService: AuthService,
  ) {}

  async createUser(data: InsertUser) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return await this.repository.insertUser({
      ...data,
      password: hashedPassword,
    });
  }

  async fetchUserById({ userId }: { userId: number }) {
    const user = await this.repository.findUser({ id: userId });
    if (!user) {
      throw new BadRequestException('There is no that user');
    }
    // 비밀번호 제외한 개인 회원 정보 return
    const { password, ...userInfo } = user;

    return userInfo;
  }

  async fetchUserByUserName({ userName }: { userName: string }) {
    return await this.repository.findUser({ userName });
  }

  async fetchManyUser({
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
    return await this.repository.findManyUser({
      where: { page },
      searchOption: { keyword },
      filter: { item, range },
    });
  }

  async modifyUser({ userId, data }: { userId: number; data: UpdateUser }) {
    await this.fetchUserById({ userId });

    // 비밀번호 파라미터가 왔을 경우에만 암호화 후 업데이트
    let hashedPassword = undefined;
    if (data.password) {
      hashedPassword = await bcrypt.hash(data.password, 10);
    }

    return await this.repository.updateUser({
      data: { ...data, password: hashedPassword },
      where: { id: userId },
    });
  }

  async removeUser({ userId }: { userId: number }) {
    await this.fetchUserById({ userId });

    return await this.repository.deleteUser({ id: userId });
  }

  async fetchUserName({ name, email }: { name: string; email: string }) {
    const user = await this.repository.findUser({ name, email });
    if (!user) {
      throw new BadRequestException('회원이 아닙니다 회원가입을 진행해주세요.');
    }

    return user.userName;
  }

  // 비밀번호 변경 페이지 주소 문자로 보내기
  async fetchPasswordURL({
    name,
    email,
    userName,
  }: {
    name: string;
    email: string;
    userName: string;
  }) {
    const user = await this.repository.findUser({ name, email, userName });
    if (!user) {
      throw new BadRequestException('회원이 아닙니다 회원가입을 진행해주세요.');
    }

    const token = await this.authService.generateToken({
      userId: user.id,
    });

    return await this.aligoService.sendSMS({
      phoneNumber: user.phoneNumber,
      msg: `https://app.macodi.co.kr/edit-password?token=${token}&type=user`,
      sender: '02-3456-7117',
      type: 'LMS',
    });
  }

  // 비밀번호 변경
  async modifyUserPassword({
    userId,
    password,
  }: {
    userId: number;
    password: string;
  }) {
    await this.fetchUserById({ userId });

    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.repository.updateUser({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  // 다시 보지 않기 체크
  async modifyUserIsClosed({
    userId,
    isClosed,
  }: {
    userId: number;
    isClosed: boolean;
  }) {
    return await this.repository.updateUser({
      where: { id: userId },
      data: { isClosed },
    });
  }
}
