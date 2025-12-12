# FluxNote 서버 설정 가이드

## 필수 요구사항

- Node.js (v14 이상)
- PostgreSQL (v12 이상)

## 설치 및 실행

### 1. 데이터베이스 설정

PostgreSQL에 데이터베이스를 생성합니다:

```sql
CREATE DATABASE fluxnote_db;
```

### 2. 서버 의존성 설치

```bash
cd server
npm install
```

### 3. 환경 변수 설정

`server` 폴더에 `.env` 파일을 생성하고 다음 내용을 입력합니다:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fluxnote_db
DB_USER=postgres
DB_PASSWORD=postgresql
PORT=5000
```

### 4. 데이터베이스 스키마 초기화

```bash
node database/init.js
```

### 5. 서버 실행

```bash
# 개발 모드 (nodemon 사용)
npm run dev

# 프로덕션 모드
npm start
```

서버는 기본적으로 `http://localhost:5000`에서 실행됩니다.

## API 엔드포인트

### 회원가입
- **POST** `/api/auth/signup`
- Body: `{ email, password, name }`

### 로그인
- **POST** `/api/auth/login`
- Body: `{ email, password }`

### 사용자 정보 조회
- **GET** `/api/auth/me?userId={userId}`

### 헬스 체크
- **GET** `/api/health`

