const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'fluxnote_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgresql',
});

async function initDatabase() {
  try {
    // 스키마 파일 읽기
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // 스키마 실행
    await pool.query(schema);
    console.log('✅ 데이터베이스 스키마가 성공적으로 생성되었습니다.');
    
    await pool.end();
  } catch (error) {
    console.error('❌ 데이터베이스 초기화 중 오류 발생:', error);
    process.exit(1);
  }
}

initDatabase();

