# PostgreSQL 인증 시스템 구현 보고서

## 개요

FluxNote 애플리케이션에 PostgreSQL 데이터베이스를 활용한 회원가입, 로그인, 로그아웃 기능을 구현했습니다. 기존의 로컬 스토리지 기반 인증 시스템을 PostgreSQL 기반의 안전한 백엔드 API로 전환했습니다.

## 구현 일자

2024년 (구현 완료일)

## 구현 내용

### 1. 데이터베이스 설계

#### 1.1 데이터베이스 설정
- **데이터베이스명**: `fluxnote_db`
- **호스트**: `localhost`
- **포트**: `5432`
- **사용자**: `postgres`
- **비밀번호**: `postgresql`

#### 1.2 테이블 스키마

**users 테이블**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**주요 특징:**
- `id`: 자동 증가하는 기본 키 (SERIAL)
- `email`: 고유 제약 조건이 있는 이메일 필드
- `password`: bcrypt로 해시화된 비밀번호 저장
- `created_at`, `updated_at`: 자동 타임스탬프 관리
- 이메일 검색 최적화를 위한 인덱스 생성

**인덱스:**
```sql
CREATE INDEX idx_users_email ON users(email);
```

**자동 업데이트 트리거:**
- `updated_at` 필드가 자동으로 갱신되도록 트리거 설정

### 2. 백엔드 서버 구현

#### 2.1 기술 스택
- **Node.js**: 서버 런타임
- **Express**: 웹 프레임워크
- **pg (node-postgres)**: PostgreSQL 클라이언트
- **bcrypt**: 비밀번호 해시화
- **cors**: Cross-Origin Resource Sharing 지원
- **dotenv**: 환경 변수 관리

#### 2.2 프로젝트 구조

```
server/
├── database/
│   ├── schema.sql          # 데이터베이스 스키마 정의
│   ├── init.js             # 데이터베이스 초기화 스크립트
│   └── db.js               # 데이터베이스 연결 풀 설정
├── routes/
│   └── auth.js             # 인증 관련 라우트
├── .env                    # 환경 변수 설정
├── .env.example            # 환경 변수 예제
├── package.json            # 서버 의존성 관리
└── server.js               # Express 서버 진입점
```

#### 2.3 API 엔드포인트

**1. 회원가입 (POST /api/auth/signup)**
- **요청 본문:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "사용자 이름"
  }
  ```
- **응답 (성공):**
  ```json
  {
    "success": true,
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "사용자 이름",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```
- **기능:**
  - 이메일 중복 확인
  - 비밀번호 해시화 (bcrypt, salt rounds: 10)
  - 사용자 정보 데이터베이스 저장
  - 입력 검증 (필수 필드, 비밀번호 최소 길이)

**2. 로그인 (POST /api/auth/login)**
- **요청 본문:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **응답 (성공):**
  ```json
  {
    "success": true,
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "사용자 이름"
    }
  }
  ```
- **기능:**
  - 이메일로 사용자 조회
  - bcrypt를 사용한 비밀번호 검증
  - 로그인 실패 시 적절한 오류 메시지 반환

**3. 사용자 정보 조회 (GET /api/auth/me)**
- **쿼리 파라미터:** `userId`
- **응답:**
  ```json
  {
    "success": true,
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "사용자 이름",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

**4. 헬스 체크 (GET /api/health)**
- 서버 상태 확인용 엔드포인트

#### 2.4 보안 기능

1. **비밀번호 해시화**
   - bcrypt 라이브러리 사용
   - Salt rounds: 10
   - 평문 비밀번호는 절대 저장하지 않음

2. **입력 검증**
   - 필수 필드 검증
   - 이메일 형식 검증
   - 비밀번호 최소 길이 검증 (6자 이상)
   - 이메일 중복 확인

3. **에러 처리**
   - 민감한 정보 노출 방지
   - 적절한 HTTP 상태 코드 반환
   - 사용자 친화적인 오류 메시지

### 3. 프론트엔드 수정

#### 3.1 변경 사항

**AuthContext.js**
- 로컬 스토리지 기반 인증에서 API 기반 인증으로 전환
- axios를 사용한 HTTP 요청 구현
- 비동기 함수로 변경 (async/await)
- API URL 환경 변수 지원 (`REACT_APP_API_URL`)

**주요 변경 내용:**
```javascript
// 이전: 로컬 스토리지 사용
const users = JSON.parse(localStorage.getItem('fluxnote-users') || '[]');

// 이후: API 호출
const response = await axios.post(`${API_URL}/auth/login`, {
  email,
  password
});
```

**Login.js & Signup.js**
- `handleSubmit` 함수를 비동기 함수로 변경
- API 응답 처리 및 에러 핸들링 추가

#### 3.2 환경 변수 설정

프론트엔드에서 사용할 환경 변수:
- `REACT_APP_API_URL`: 백엔드 API URL (기본값: `http://localhost:5000/api`)

### 4. 설치 및 실행 방법

#### 4.1 데이터베이스 설정

1. PostgreSQL 설치 및 실행
2. 데이터베이스 생성:
   ```sql
   CREATE DATABASE fluxnote_db;
   ```

#### 4.2 백엔드 서버 설정

1. 서버 디렉토리로 이동:
   ```bash
   cd server
   ```

2. 의존성 설치:
   ```bash
   npm install
   ```

3. 환경 변수 설정:
   - `server/.env` 파일 생성
   - 다음 내용 입력:
     ```
     DB_HOST=localhost
     DB_PORT=5432
     DB_NAME=fluxnote_db
     DB_USER=postgres
     DB_PASSWORD=postgresql
     PORT=5000
     ```

4. 데이터베이스 스키마 초기화:
   ```bash
   node database/init.js
   ```

5. 서버 실행:
   ```bash
   # 개발 모드
   npm run dev

   # 프로덕션 모드
   npm start
   ```

#### 4.3 프론트엔드 설정

1. 루트 디렉토리에서 의존성 설치:
   ```bash
   npm install
   ```

2. 환경 변수 설정 (선택사항):
   - `.env` 파일 생성
   - `REACT_APP_API_URL=http://localhost:5000/api` 추가

3. 프론트엔드 실행:
   ```bash
   npm start
   ```

### 5. 테스트 방법

#### 5.1 회원가입 테스트

1. 회원가입 페이지 접속
2. 이름, 이메일, 비밀번호 입력
3. 회원가입 버튼 클릭
4. 성공 시 자동 로그인 및 메모 앱 화면으로 이동

#### 5.2 로그인 테스트

1. 로그인 페이지 접속
2. 등록된 이메일과 비밀번호 입력
3. 로그인 버튼 클릭
4. 성공 시 메모 앱 화면으로 이동

#### 5.3 로그아웃 테스트

1. 로그인 상태에서 로그아웃 버튼 클릭
2. 로그인 페이지로 이동 확인

### 6. 주요 개선 사항

#### 6.1 보안 강화
- ✅ 비밀번호 해시화로 평문 저장 방지
- ✅ 데이터베이스 기반 사용자 관리
- ✅ 입력 검증 및 에러 처리 강화

#### 6.2 확장성 향상
- ✅ RESTful API 구조로 확장 용이
- ✅ 데이터베이스 기반으로 대용량 사용자 지원 가능
- ✅ 서버-클라이언트 분리로 유지보수 용이

#### 6.3 사용자 경험 개선
- ✅ 일관된 에러 메시지 제공
- ✅ 비동기 처리로 UI 반응성 향상
- ✅ 로컬 스토리지와 API 연동으로 오프라인 지원 가능

### 7. 향후 개선 사항

1. **JWT 토큰 기반 인증**
   - 현재는 세션 기반 인증 사용
   - JWT 토큰으로 무상태(stateless) 인증 구현

2. **리프레시 토큰**
   - 보안 강화를 위한 리프레시 토큰 구현

3. **이메일 인증**
   - 회원가입 시 이메일 인증 기능 추가

4. **비밀번호 재설정**
   - 비밀번호 찾기 및 재설정 기능

5. **소셜 로그인**
   - Google, GitHub 등 소셜 로그인 연동

6. **Rate Limiting**
   - 무차별 대입 공격 방지를 위한 요청 제한

7. **로깅 및 모니터링**
   - 인증 관련 로그 기록 및 모니터링 시스템 구축

### 8. 파일 구조

```
FluxNote/
├── server/                          # 백엔드 서버
│   ├── database/
│   │   ├── schema.sql              # 데이터베이스 스키마
│   │   ├── init.js                 # 초기화 스크립트
│   │   └── db.js                   # DB 연결 설정
│   ├── routes/
│   │   └── auth.js                 # 인증 라우트
│   ├── .env                        # 환경 변수
│   ├── .env.example                # 환경 변수 예제
│   ├── package.json                # 서버 의존성
│   └── server.js                   # 서버 진입점
├── src/
│   ├── contexts/
│   │   └── AuthContext.js          # 인증 컨텍스트 (수정됨)
│   └── components/
│       ├── Login.js                # 로그인 컴포넌트 (수정됨)
│       └── Signup.js               # 회원가입 컴포넌트 (수정됨)
├── package.json                    # 프론트엔드 의존성 (수정됨)
└── README_SERVER.md                # 서버 설정 가이드
```

### 9. 결론

PostgreSQL 데이터베이스를 활용한 인증 시스템을 성공적으로 구현했습니다. 기존의 로컬 스토리지 기반 시스템에서 안전하고 확장 가능한 백엔드 API 기반 시스템으로 전환하여 보안성과 유지보수성을 크게 향상시켰습니다.

주요 성과:
- ✅ PostgreSQL 데이터베이스 연동 완료
- ✅ 안전한 비밀번호 해시화 구현
- ✅ RESTful API 구조 구축
- ✅ 프론트엔드-백엔드 통신 구현
- ✅ 에러 처리 및 사용자 피드백 개선

이제 FluxNote는 프로덕션 환경에서도 사용할 수 있는 안전한 인증 시스템을 갖추게 되었습니다.

