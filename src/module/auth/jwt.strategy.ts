import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Payload } from './type';
import { UserService } from '../user/user.service';
import { CompanyService } from '../company/company.service';
import { AdminService } from '../admin/admin.service';
import { StoreService } from '../store/store.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private companyService: CompanyService,
    private adminService: AdminService,
    private storeService: StoreService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  // 토큰 검증(payload)
  async validate(payload: Payload) {
    if (payload.userId) {
      await this.userService.fetchUserById({ userId: payload.userId });
    } else if (payload.companyId) {
      await this.companyService.fetchCompanyById({
        companyId: payload.companyId,
      });
    } else if (payload.storeId) {
      await this.storeService.fetchStoreById({ storeId: payload.storeId });
    } else {
      await this.adminService.fetchAdmin({ id: payload.adminId });
    }

    return {
      userId: payload.userId || null,
      companyId: payload.companyId || null,
      adminId: payload.adminId || null,
      storeId: payload.storeId || null,
    };
  }
}
