import { BadRequestException, Injectable } from '@nestjs/common';
import {
  InsertCompany,
  CompanyRepository,
  UpdateCompany,
} from './company.respository';
import * as bcrypt from 'bcrypt';
import { AligoService } from '../aligo/aligo.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class CompanyService {
  constructor(
    private repository: CompanyRepository,
    private aligoService: AligoService,
    private authService: AuthService,
  ) {}

  // 비밀번호 암호화 후 저장
  async createCompany(data: InsertCompany) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return await this.repository.insertCompany({
      ...data,
      password: hashedPassword,
    });
  }

  // companyId로 전문가 회원 찾기
  async fetchCompanyById({ companyId }: { companyId: number }) {
    const company = await this.repository.findCompany({ id: companyId });
    if (!company) {
      throw new BadRequestException('There is no that business');
    }

    // 비밀번호 제외한 정보 return
    const { password, ...companyInfo } = company;
    return companyInfo;
  }

  // userName으로 전문가 회원 찾기
  async fetchCompanyByUserName({ userName }: { userName: string }) {
    return await this.repository.findCompany({ userName });
  }

  // 전문가 회원 목록
  async fetchManyCompany({
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
    return await this.repository.findManyCompany({
      where: { page },
      searchOption: { keyword },
      filter: { item, range },
    });
  }

  // 특정 전문가 회원 정보 수정
  async modifyCompany({
    companyId,
    data,
  }: {
    companyId: number;
    data: UpdateCompany;
  }) {
    await this.fetchCompanyById({ companyId });

    // 비밀번호 파라미터 정보가 왔을 경우만 암호화 해서 DB에 저장
    let hashedPassword = undefined;
    if (data.password) {
      hashedPassword = await bcrypt.hash(data.password, 10);
    }

    return await this.repository.updateCompany({
      where: { id: companyId },
      data: { ...data, password: hashedPassword },
    });
  }

  // 특정 전문가 회원 상태(status) 변경
  async modifyCompanyStatus({
    companyId,
    status,
  }: {
    companyId: number;
    status: boolean;
  }) {
    const company = await this.fetchCompanyById({ companyId });

    // 활성 상태(status)를 true 변경 했을 경우 해당 전문가 회원에게 문자 보내기
    if (status === true) {
      const phoneNumber = company.managerNumber;
      const msg = `반갑습니다. ${company.managerName} 님의 전문가 가입이 승인되었어요. 부디 업무에 유용한 활용이 되길 바라며 Macodi 내에서 제품을 찾지 못할 시 아래 카카오 채널을 통해 문의하시면 저희 100개의 파트너사와 함께 즉각적으로 도움드릴게요.

http://pf.kakao.com/_xapljG

자주 활용해 주셔야 더 많은 마감재를 제공해 드릴 수 있답니다. 많은 애용 바랍니다. 감사합니다.^^*
-당신의 AI 마감재 코디네이터 Macodi-`;
      await this.aligoService.sendSMS({
        phoneNumber,
        msg,
        sender: '02-3456-7117',
        type: 'LMS',
      });
    }

    return await this.repository.updateCompany({
      where: { id: companyId },
      data: { status },
    });
  }

  // 특정 전문가 회원 삭제
  async removeCompany({ companyId }: { companyId: number }) {
    await this.fetchCompanyById({ companyId });

    return await this.repository.deleteCompany({ id: companyId });
  }

  // 담당자이름, 이메일로 찾아서 userName 반환(아이디 찾기)
  async fetchUserName({
    managerName,
    email,
  }: {
    managerName: string;
    email: string;
  }) {
    const company = await this.repository.findCompany({ managerName, email });
    if (!company) {
      throw new BadRequestException('회원이 아닙니다 회원가입을 진행해주세요.');
    }

    return company.userName;
  }

  // 비밀번호 변경 페이지로 이동
  async fetchPasswordURL({
    email,
    userName,
    managerName,
  }: {
    email: string;
    userName: string;
    managerName: string;
  }) {
    const company = await this.repository.findCompany({
      email,
      userName,
      managerName,
    });

    if (!company) {
      throw new BadRequestException('회원이 아닙니다 회원가입을 진행해주세요.');
    }

    const token = await this.authService.generateToken({
      companyId: company.id,
    });

    // 비밀번호를 찾는 해당 전문가 회원 토큰 생성 후 문자 보내기
    return await this.aligoService.sendSMS({
      phoneNumber: company.managerNumber,
      msg: `https://app.macodi.co.kr/edit-password?token=${token}&type=company`,
      sender: '02-3456-7117',
      type: 'LMS',
    });
  }

  // 특정 전문가 회원 비밀번호 변경
  async modifyCompanyPassword({
    companyId,
    password,
  }: {
    companyId: number;
    password: string;
  }) {
    await this.fetchCompanyById({ companyId });

    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.repository.updateCompany({
      where: { id: companyId },
      data: { password: hashedPassword },
    });
  }

  // 특정 전문가 회원 '다시보지않기' 확인
  async modifyCompanyIsClosed({
    companyId,
    isClosed,
  }: {
    companyId: number;
    isClosed: boolean;
  }) {
    return await this.repository.updateCompany({
      where: { id: companyId },
      data: { isClosed },
    });
  }
}
