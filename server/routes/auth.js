const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../database/db');

// 회원가입
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // 입력 검증
    if (!email || !password || !name) {
      return res.status(400).json({ 
        success: false, 
        error: '모든 필드를 입력해주세요.' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        error: '비밀번호는 최소 6자 이상이어야 합니다.' 
      });
    }

    // 이메일 중복 확인
    const emailCheck = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ 
        success: false, 
        error: '이미 사용 중인 이메일입니다.' 
      });
    }

    // 비밀번호 해시화
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 사용자 생성
    const result = await pool.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name, created_at',
      [email, hashedPassword, name]
    );

    const user = result.rows[0];

    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('회원가입 오류:', error);
    res.status(500).json({ 
      success: false, 
      error: '서버 오류가 발생했습니다.' 
    });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 입력 검증
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: '이메일과 비밀번호를 입력해주세요.' 
      });
    }

    // 사용자 조회
    const result = await pool.query(
      'SELECT id, email, password, name FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        error: '이메일 또는 비밀번호가 올바르지 않습니다.' 
      });
    }

    const user = result.rows[0];

    // 비밀번호 확인
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ 
        success: false, 
        error: '이메일 또는 비밀번호가 올바르지 않습니다.' 
      });
    }

    // 로그인 성공
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('로그인 오류:', error);
    res.status(500).json({ 
      success: false, 
      error: '서버 오류가 발생했습니다.' 
    });
  }
});

// 사용자 정보 조회
router.get('/me', async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        error: '사용자 ID가 필요합니다.' 
      });
    }

    const result = await pool.query(
      'SELECT id, email, name, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: '사용자를 찾을 수 없습니다.' 
      });
    }

    const user = result.rows[0];

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('사용자 정보 조회 오류:', error);
    res.status(500).json({ 
      success: false, 
      error: '서버 오류가 발생했습니다.' 
    });
  }
});

module.exports = router;

