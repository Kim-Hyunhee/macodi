<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

## DB Table

```
model Admin(관리자) {
  id                   Int                   @id @default(autoincrement())  : PK
  userName             String                @unique                        : 로그인 시 사용하는 아이디
  password             String                                               : 비밀번호(암호화)
  name                 String                                               : 이름
  createdAt            DateTime              @default(now())                : 생성 시간
  updatedAt            DateTime              @default(now()) @updatedAt     : 업데이트 시간
}

model Job(업종) {
  id                   Int                   @id @default(autoincrement())
  name                 String                                               : 업종 이름
  createdAt            DateTime              @default(now())                : 생성 시간
  updatedAt            DateTime              @default(now()) @updatedAt     : 업데이트 시간
}

model User(개인 회원) {
  id                   Int                   @id @default(autoincrement())
  userName             String                @unique                        : 로그인 시 사용하는 아이디
  password             String                                               : 비밀번호(암호화)
  name                 String                                               : 이름
  phoneNumber          String                                               : 연락처
  email                String                                               : 이메일 주소
  companyName          String?                                              : 회사 이름
  address              String?                                              : 주소
  status               Boolean               @default(true)                 : 상태
  isAgree              Boolean               @default(false)                : 약관 동의
  job                  String                                               : 업종
  isClosed             Boolean               @default(false)                : 다시 보지 않기 체크
  createdAt            DateTime              @default(now())                : 가입일(생성일)
  updatedAt            DateTime              @default(now()) @updatedAt     : 업데이트 시간

  projects             Project[]
}

model Company(전문가 회원) {
  id                   Int                   @id @default(autoincrement())
  userName             String                @unique                        : 로그인 시 사용하는 아이디
  password             String                                               : 비밀번호(암호화)
  name                 String                                               : 기업명
  contactNumber        String                                               : 연락처
  email                String                                               : 이메일
  managerName          String                                               : 담당자
  managerNumber        String                                               : 담당자 연락처
  site                 String?                                              : 기업 사이트
  license              String                                               : 사업자 등록증 or 명함 S3 주소
  isAgree              Boolean               @default(false)                : 약관 동의
  address              String                                               : 주소
  status               Boolean               @default(false)                : 상태(활성)
  job                  String                                               : 업종
  isClosed             Boolean               @default(false)                : 다시 보지 않기 체크
  createdAt            DateTime              @default(now())                : 가입일(생성일)
  updatedAt            DateTime              @default(now()) @updatedAt     : 업데이트 시간

  projects             Project[]
  inquiries            Inquiry[]
}

model Store(공급자) {
  id                   Int                   @id @default(autoincrement())
  userName             String                @unique                        : 로그인 시 사용하는 아이디
  password             String                                               : 비밀번호(암호화)
  email                String                                               : 이메일
  managerNumber        String                                               : 담당자 연락처(휴대폰 번호)
  contactNumber        String?                                              : 연락처(회사 연락처)
  companyName          String                                               : 기업명
  managerName          String                                               : 담당자
  owner                String                                               : 대표명
  address              String                                               : 회사 주소
  factoryAddress       String?                                              : 공장 주소
  storageAddress       String?                                              : 창고 주소
  companySite          String?                                              : 홈페이지
  license              String?                                              : 사업자 등록증
  status               Boolean               @default(true)                 : 상태(활성)
  createdAt            DateTime              @default(now())                : 생성일
  updatedAt            DateTime              @default(now()) @updatedAt     : 업데이트 시간

  products             Product[]
}

model Category(구분) {
  id                   Int                   @id @default(autoincrement())
  name                 String                                               : 구분명
  createdAt            DateTime              @default(now())
  updatedAt            DateTime              @default(now()) @updatedAt

  products             Product[]
}

model Location(사용 위치) {
  id                   Int                   @id @default(autoincrement())
  name                 String                                               : 위치명
  createdAt            DateTime              @default(now())
  updatedAt            DateTime              @default(now()) @updatedAt

  products             Product[]
}

model Purpose(용도) {
  id                   Int                   @id @default(autoincrement())
  name                 String                                               : 용도명
  createdAt            DateTime              @default(now())
  updatedAt            DateTime              @default(now()) @updatedAt

  products             Product[]
}

model Product(제품) {
  id                   Int                   @id @default(autoincrement())
  storeId              Int                                                  : 공급자 Id
  categoryId           Int                                                  : 구분 Id
  subCategory          String                                               : 종류명
  image                String                                               : 이미지 S3 주소
  name                 String                                               : 제품명
  code                 String                                               : 제품 코드(랜덤)
  manufacturer         String                                               : 제조사
  origin               String                                               : 원산지
  country              String                                               : 나라명
  price                Int                                                  : 가격
  isShowPrice          Boolean               @default(true)                 : 가격 활성 상태
  isShow               Boolean               @default(true)                 : 제품 활성 상태
  glossiness           String                                               : 광택도
  locationId           Int?                                                 : 사용 위치 Id
  purposeId            Int?                                                 : 용도 Id
  feature              String?                                              : 특징
  url                  String?               @db.Text                       : 제품 주소
  status               Boolean               @default(true)                 : 활성 상태
  applyProject         Int                   @default(0)                    : 샘플 적용 수
  sampleInquiry        Int                   @default(0)                    : 샘플 문의 수
  download             Int                   @default(0)                    : 샘플 다운로드 수
  createdAt            DateTime              @default(now())
  updatedAt            DateTime              @default(now()) @updatedAt

  category             Category              @relation(fields: [categoryId], references: [id])
  location             Location?             @relation(fields: [locationId], references: [id])
  purpose              Purpose?              @relation(fields: [purposeId], references: [id])
  store                Store                 @relation(fields: [storeId], references: [id], onDelete: Cascade)
  options              ProductOption[]
}

model Project(프로젝트) {
  id                   Int                   @id @default(autoincrement())
  name                 String                                               : 프로젝트명
  userId               Int?                                                 : 개인 회원 Id
  companyId            Int?                                                 : 전문가 회원 Id
  createdAt            DateTime              @default(now())
  updatedAt            DateTime              @default(now()) @updatedAt

  user                 User?                 @relation(fields: [userId], references: [id], onDelete: Cascade)
  company              Company?              @relation(fields: [companyId], references: [id], onDelete: Cascade)
  scenes               Scene[]
  inquiries            Inquiry[]
}

model Scene(씬) {
  id                   Int                   @id @default(autoincrement())
  title                String                                               : 씬명
  projectId            Int                                                  : 프로젝트 Id
  image                String                                               : 이미지 S3 주소
  position             Int?                                                 : 씬 순서
  createdAt            DateTime              @default(now())
  updatedAt            DateTime              @default(now()) @updatedAt

  project              Project               @relation(fields: [projectId], references: [id], onDelete: Cascade)
  pins                 Pin[]
}

model Pin(샘플 적용된 제품) {
  id                   Int                   @id @default(autoincrement())
  sceneId              Int                                                  : 씬 Id
  xCoordinate          String                                               : X축
  yCoordinate          String                                               : Y축
  productOptionId      Int                                                  : 상품 옵션 Id
  squareMeasure        Int?                                                 : 면적
  createdAt            DateTime              @default(now())
  updatedAt            DateTime              @default(now()) @updatedAt

  scene                Scene                 @relation(fields: [sceneId], references: [id], onDelete: Cascade)
  productOption        ProductOption         @relation(fields: [productOptionId], references: [id], onDelete: Cascade)
  inquiryPins          InquiryPin[]
}

model Inquiry(샘플 문의) {
  id                   Int                   @id @default(autoincrement())
  projectId            Int                                                  : 프로젝트 Id
  receiver             String                                               : 받으시는 분
  address              String                                               : 배송지 주소
  contactNumber        String                                               : 연락처
  companyId            Int                                                  : 전문가 회원 Id
  inquiryNumber        String                                               : 샘플 문의 내역 번호(랜덤 생성)
  createdAt            DateTime              @default(now())
  updatedAt            DateTime              @default(now()) @updatedAt

  company              Company               @relation(fields: [companyId],references: [id], onDelete: Cascade)
  project              Project               @relation(fields: [projectId], references: [id], onDelete: Cascade)
  inquiryPins          InquiryPin[]
}

model InquiryPin(샘플 문의, 샘플 적용된 제품 '다:다' 테이블) {
  id                   Int                   @id @default(autoincrement())
  pinId                Int                                                  : 샘플 적용된 제품 Id
  inquiryId            Int                                                  : 샘플 문의 Id
  isCompleted          Boolean               @default(false)                : 상담 완료 상태
  createdAt            DateTime              @default(now())
  updatedAt            DateTime              @default(now()) @updatedAt

  pin                  Pin                   @relation(fields: [pinId], references: [id], onDelete: Cascade)
  inquiry              Inquiry               @relation(fields: [inquiryId],references: [id], onDelete: Cascade)
}

model ProductOption(제품 옵션) {
  id                   Int                   @id @default(autoincrement())
  size                 String                                               : 제품 사이즈
  price                Int                                                  : 제품 가격
  productId            Int                                                  : 제품 Id
  createdAt            DateTime              @default(now())
  updatedAt            DateTime              @default(now()) @updatedAt

  product              Product               @relation(fields: [productId], references: [id], onDelete: Cascade)
  pins                 Pin[]
}

```
