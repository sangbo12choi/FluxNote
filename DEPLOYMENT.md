# FluxNote 배포 가이드

이 문서는 FluxNote를 무료로 배포하는 여러 방법을 안내합니다.

## 🚀 추천 배포 방법 (쉬운 순서)

### 1. Vercel (가장 추천 ⭐)

**장점:**
- React 앱에 최적화
- GitHub 연동으로 자동 배포
- 무료 SSL 인증서
- 전 세계 CDN
- 커스텀 도메인 지원

**배포 방법:**

#### 방법 A: Vercel 웹사이트 사용
1. [vercel.com](https://vercel.com)에 가입 (GitHub 계정으로 로그인 권장)
2. "New Project" 클릭
3. GitHub 저장소 선택 또는 코드 업로드
4. 프로젝트 설정:
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. "Deploy" 클릭
6. 완료! 자동으로 URL 생성됨

#### 방법 B: Vercel CLI 사용
```bash
# Vercel CLI 설치
npm install -g vercel

# 프로젝트 디렉토리에서 실행
vercel

# 프로덕션 배포
vercel --prod
```

---

### 2. Netlify

**장점:**
- 사용하기 쉬움
- GitHub 연동
- 무료 SSL
- 폼 처리 기능 (향후 확장 가능)

**배포 방법:**

#### 방법 A: Netlify 웹사이트 사용
1. [netlify.com](https://netlify.com)에 가입
2. "Add new site" → "Import an existing project"
3. GitHub 저장소 선택
4. 빌드 설정:
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
5. "Deploy site" 클릭

#### 방법 B: Netlify CLI 사용
```bash
# Netlify CLI 설치
npm install -g netlify-cli

# 빌드
npm run build

# 배포
netlify deploy --prod
```

#### 방법 C: 드래그 앤 드롭
1. `npm run build` 실행
2. 생성된 `build` 폴더를 [app.netlify.com/drop](https://app.netlify.com/drop)에 드래그 앤 드롭

---

### 3. GitHub Pages

**장점:**
- GitHub와 완전 통합
- 완전 무료
- 커스텀 도메인 지원

**배포 방법:**

#### gh-pages 패키지 사용 (추천)
```bash
# gh-pages 설치
npm install --save-dev gh-pages

# package.json에 추가할 스크립트:
# "homepage": "https://YOUR_USERNAME.github.io/FluxNote",
# "predeploy": "npm run build",
# "deploy": "gh-pages -d build"

# 배포
npm run deploy
```

#### package.json 수정 필요:
```json
{
  "homepage": "https://YOUR_USERNAME.github.io/FluxNote",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

**주의사항:**
- GitHub Pages는 SPA(단일 페이지 앱) 라우팅을 위해 추가 설정 필요
- `public` 폴더에 `404.html` 파일 생성 필요 (아래 참고)

---

### 4. Firebase Hosting

**장점:**
- Google 인프라
- 빠른 속도
- 무료 SSL
- 다른 Firebase 서비스와 통합 가능

**배포 방법:**
```bash
# Firebase CLI 설치
npm install -g firebase-tools

# 로그인
firebase login

# 프로젝트 초기화
firebase init hosting

# 빌드 및 배포
npm run build
firebase deploy
```

---

### 5. Surge.sh

**장점:**
- 매우 간단함
- CLI만으로 배포 가능

**배포 방법:**
```bash
# Surge 설치
npm install -g surge

# 빌드
npm run build

# 배포 (처음만 이메일/비밀번호 입력)
cd build
surge
```

---

## 📋 배포 전 체크리스트

### 1. 프로덕션 빌드 테스트
```bash
npm run build
npm install -g serve
serve -s build
```
브라우저에서 `http://localhost:3000` 접속하여 정상 작동 확인

### 2. 환경 변수 확인
- 현재는 LocalStorage만 사용하므로 특별한 환경 변수 불필요

### 3. 빌드 최적화 확인
- `build` 폴더가 생성되는지 확인
- 파일 크기 확인 (과도하게 크면 최적화 필요)

---

## 🔧 SPA 라우팅 설정 (필요한 경우)

GitHub Pages나 일부 호스팅 서비스는 SPA 라우팅을 위해 추가 설정이 필요합니다.

### GitHub Pages용 404.html 생성
`public/404.html` 파일 생성:
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>FluxNote</title>
    <script>
      var path = window.location.pathname;
      if (path !== '/' && path !== '/index.html') {
        window.location.href = '/index.html' + path;
      }
    </script>
  </head>
  <body>
    <script>
      window.location.replace('/index.html');
    </script>
  </body>
</html>
```

### Netlify용 _redirects 파일
`public/_redirects` 파일 생성:
```
/*    /index.html   200
```

---

## 🌐 커스텀 도메인 연결

대부분의 호스팅 서비스에서 커스텀 도메인을 무료로 연결할 수 있습니다:

1. **도메인 구매** (예: Namecheap, GoDaddy, Google Domains)
2. 호스팅 서비스 대시보드에서 도메인 설정
3. DNS 레코드 설정 (A 레코드 또는 CNAME)
4. SSL 인증서 자동 발급 (보통 몇 분 소요)

---

## 📊 각 서비스 비교

| 서비스 | 난이도 | 속도 | 기능 | 추천도 |
|--------|--------|------|------|--------|
| **Vercel** | ⭐ 쉬움 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Netlify** | ⭐ 쉬움 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **GitHub Pages** | ⭐⭐ 보통 | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **Firebase** | ⭐⭐ 보통 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Surge** | ⭐ 쉬움 | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ |

---

## 🎯 빠른 시작 (Vercel 추천)

가장 빠르게 배포하려면:

1. GitHub에 코드 푸시
2. [vercel.com](https://vercel.com) 접속
3. GitHub로 로그인
4. 저장소 선택
5. "Deploy" 클릭
6. 완료! (약 2분 소요)

---

## 💡 팁

- **자동 배포**: GitHub에 푸시하면 자동으로 재배포됨 (Vercel, Netlify)
- **프리뷰 배포**: Pull Request마다 미리보기 URL 생성 (Vercel, Netlify)
- **환경 변수**: 필요시 호스팅 서비스 대시보드에서 설정 가능
- **성능 모니터링**: Vercel과 Netlify는 기본 분석 제공

---

## 🆘 문제 해결

### 빌드 실패
- `package.json`의 `build` 스크립트 확인
- 로컬에서 `npm run build` 테스트
- 빌드 로그 확인

### 404 에러 (SPA 라우팅)
- 위의 SPA 라우팅 설정 참고
- 호스팅 서비스의 리다이렉트 설정 확인

### 스타일이 적용되지 않음
- Tailwind CSS 빌드 확인
- `tailwind.config.js`의 `content` 경로 확인

---

**추천**: 처음 배포하시는 분은 **Vercel**을 추천합니다. 가장 쉽고 빠르며, React 앱에 최적화되어 있습니다!

