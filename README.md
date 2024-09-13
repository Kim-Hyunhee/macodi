# **마코디**  
> **사용자가 제공한 이미지를 기반으로 인공지능 모듈을 활용하여 관련된 마감재 상품을 검색하는 솔루션을 개발하는 프로젝트**

---

## **목차**
1. [실행 환경](#1-실행-환경)  
   1-1. [로컬 실행](#1-1-로컬-실행)  
   1-2. [환경 변수](#1-2-환경-변수)  
2. [기술 스택](#2-기술-스택)  
3. [디렉토리 구조](#3-디렉토리-구조)  
4. [기능 구현](#4-기능-구현)  
   4-1. [회원가입](#4-1-회원가입)   
   4-2. [로그인](#4-2-로그인)   
   4-3. [아이디/비밀번호 찾기](#4-3-아이디/비밀번호-찾기)
   4-4. [프로젝트 CRUD](#4-4-프로젝트-CRUD)
   4-5. [인테리어 공간(Scene) CRUD](#4-5-인테리어-공간(Scene)-CRUD)
   4-6. [마감재 선택(핀) CRUD](#4-6-마감재-선택(핀)-CRUD)
   4-7. [마감재 주문서 작성](#4-7-마감재-주문서-작성)   
   4-8. [마감재 CRUD](#4-8-마감재-CRUD)
   4-9. [관리자 기능](#4-9-관리자-기능)  

---

## **1. 실행 환경**
### **1-2. 환경 변수**  
- 아래 항목들이 `.env` 파일에 반드시 존재해야 합니다:
  - `DATABASE_URL`: 데이터베이스 연결 URL
  - `JWT_SECRET_KEY`: JWT 토큰 서명에 사용될 비밀 키

---

### 기술 스택
<img src="https://img.shields.io/badge/TypeScript-version 5-3178C6">&nbsp;
<img src="https://img.shields.io/badge/Nest.js-version 10-E0234E">&nbsp;
<img src="https://img.shields.io/badge/TypeORM-version 0.3-fcad03">&nbsp;
<img src="https://img.shields.io/badge/MySQL-version 8-00758F">&nbsp;
<img src="https://img.shields.io/badge/Prisma-4.0-2D3748">&nbsp;

</br>

---

## 디렉토리 구조

<details>
<summary><strong>디렉토리 구조</strong></summary>
<div markdown="1">
 
```bash
─prisma
├─src
│  ├─decorators
│  ├─helper
│  └─module
│      ├─admin
│      ├─aligo
│      ├─auth
│      ├─category
│      ├─company
│      ├─inquiry
│      ├─job
│      ├─location
│      ├─partnership
│      ├─pin
│      ├─prisma
│      ├─product
│      ├─product-option
│      ├─project
│      ├─purpose
│      ├─scene
│      ├─store
│      ├─upload
│      └─user
└─test
```
</div>
</details>

</br>

## 기능구현
### **4-1. 회원가입** 
* 회원 가입 시 개인 회원/ 기업 회원/ 공급자로 나누어 가입을 진행합니다.
* 회원 가입이 완료 시 문자 발송 => 승인 후 이용 가능

### **4-2. 로그인**
* userName, password가 맞으면 JWT를 생성합니다.

### **4-3. 아이디/비밀번호 찾기**
* 회원 가입 시 작성한 매니저 이름, 이메일을 통해 아이디를 찾을 수 있습니다.
* 아이디, 이름, 이메일을 정확히 입력하면 문자로 비밀번호를 변경할 수 있는 주소를 받을 수 있습니다. 

### **4-4. 프로젝트 CRUD**
* 로그인 후 프로젝트 작성, 수정, 삭제 기능 구현

### **4-5. 인테리어 공간(Scene) CRUD**
* 회원이 인테리어 공감 등록, 수정, 삭제 기능 구현
* 씬은 인테리어 공간 이미지를 업로드합니다.

### **4-6. 마감재 선택(핀) CRUD**
* 회원이 씬에서 검색 후 마감재를 선택 등록, 삭제 기능 구현
* 핀(마감재) 엑셀 다운로드 기능 구현

### **4-7. 마감재 주문서 작성**
* 기업 회원이 등록한 pin들을 공급자에게 주문서를 작성하여 보낼 수 있습니다.
* 공급자에게 문자 발송

### **4-8. 마감재 CRUD**
* 마감재 등록, 수정, 삭제 기능 구현
* 엑셀 업로드 구현

### **4-9. 관리자 기능**
* 관리자 로그인 기능 (JWT 토큰 발급)
* 회원 프로젝트 목록

 ---
 
 ## **Swagger 문서**
API 명세는 Swagger를 통해 확인할 수 있습니다. 아래 링크를 클릭하여 Swagger 문서로 이동하세요.

[Swagger 문서 보러 가기](https://github.com/user-attachments/assets/b5d3491c-08ad-400a-9767-2611ffd14721)

---
