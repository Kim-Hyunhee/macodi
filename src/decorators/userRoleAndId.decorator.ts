import { ExecutionContext, createParamDecorator } from '@nestjs/common';

// 토큰으로 사용자(개인, 전문가, 공급자, 관리자) 역할 및 Id 파악
export const UserRoleAndId = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (user.userId) {
      return { role: 'user', id: user.userId };
    } else if (user.companyId) {
      return { role: 'company', id: user.companyId };
    } else if (user.storeId) {
      return { role: 'store', id: user.storeId };
    }
    return { role: 'admin', id: user.adminId };
  },
);
