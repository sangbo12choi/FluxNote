const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API 루트 경로
app.get('/api', (req, res) => {
  // Accept 헤더 확인하여 HTML 또는 JSON 응답 결정
  const acceptsHtml = req.headers.accept && req.headers.accept.includes('text/html');
  
  if (acceptsHtml) {
    // HTML 응답
    res.send(`
      <!DOCTYPE html>
      <html lang="ko">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FluxNote API Server</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            padding: 40px;
            max-width: 800px;
            width: 100%;
          }
          h1 {
            color: #667eea;
            margin-bottom: 10px;
            font-size: 2.5em;
          }
          .version {
            color: #666;
            margin-bottom: 30px;
            font-size: 1.1em;
          }
          .section {
            margin-bottom: 30px;
          }
          .section h2 {
            color: #333;
            margin-bottom: 15px;
            font-size: 1.5em;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
          }
          .endpoint {
            background: #f8f9fa;
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
          }
          .method {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 0.9em;
            margin-right: 10px;
          }
          .method.get { background: #28a745; color: white; }
          .method.post { background: #007bff; color: white; }
          .endpoint-path {
            font-family: 'Courier New', monospace;
            color: #333;
            font-size: 1.1em;
          }
          .status {
            text-align: center;
            padding: 20px;
            background: #d4edda;
            color: #155724;
            border-radius: 8px;
            margin-top: 20px;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>📝 FluxNote API Server</h1>
          <div class="version">Version 1.0.0</div>
          
          <div class="status">
            ✅ 서버가 정상적으로 실행 중입니다
          </div>
          
          <div class="section">
            <h2>🔗 API 엔드포인트</h2>
            
            <div class="endpoint">
              <span class="method get">GET</span>
              <span class="endpoint-path">/api/health</span>
              <p style="margin-top: 8px; color: #666;">서버 상태 확인</p>
            </div>
            
            <div class="endpoint">
              <span class="method post">POST</span>
              <span class="endpoint-path">/api/auth/signup</span>
              <p style="margin-top: 8px; color: #666;">회원가입</p>
              <p style="margin-top: 5px; font-size: 0.9em; color: #888;">
                Body: { "email": "string", "password": "string", "name": "string" }
              </p>
            </div>
            
            <div class="endpoint">
              <span class="method post">POST</span>
              <span class="endpoint-path">/api/auth/login</span>
              <p style="margin-top: 8px; color: #666;">로그인</p>
              <p style="margin-top: 5px; font-size: 0.9em; color: #888;">
                Body: { "email": "string", "password": "string" }
              </p>
            </div>
            
            <div class="endpoint">
              <span class="method get">GET</span>
              <span class="endpoint-path">/api/auth/me?userId={userId}</span>
              <p style="margin-top: 8px; color: #666;">사용자 정보 조회</p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #666;">
            <p>JSON 형식으로 응답을 받으려면:</p>
            <p style="margin-top: 5px; font-family: monospace; background: #f8f9fa; padding: 10px; border-radius: 5px;">
              Accept: application/json
            </p>
          </div>
        </div>
      </body>
      </html>
    `);
  } else {
    // JSON 응답
    res.json({
      message: 'FluxNote API Server',
      version: '1.0.0',
      status: 'running',
      endpoints: {
        health: 'GET /api/health',
        auth: {
          signup: 'POST /api/auth/signup',
          login: 'POST /api/auth/login',
          me: 'GET /api/auth/me?userId={userId}'
        }
      }
    });
  }
});

// 라우트
app.use('/api/auth', authRoutes);

// 헬스 체크
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'FluxNote API Server is running' });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`📡 API 엔드포인트: http://localhost:${PORT}/api`);
});

