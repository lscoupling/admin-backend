import express from 'express'; 
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool, { initDatabase } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 中間件
app.use(cors());
app.use(express.json());

// 健康檢查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '後端服務運行中' });
});

// 註冊 API
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 驗證輸入
    if (!name || !email || !password) {
      return res.status(400).json({ error: '請填寫所有必填欄位' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: '密碼至少需要 6 個字符' });
    }

    // 檢查用戶是否已存在
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: '該電子郵件已被註冊' });
    }

    // 加密密碼
    const hashedPassword = await bcrypt.hash(password, 10);

    // 生成隨機頭像
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`;

    // 插入新用戶
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role, avatar) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, 'user', avatar]
    );

    // 生成 JWT token
    const token = jwt.sign(
      { id: result.insertId, email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: '註冊成功',
      user: {
        id: result.insertId.toString(),
        name,
        email,
        role: 'user',
        avatar
      },
      token
    });
  } catch (error) {
    console.error('註冊錯誤:', error);
    res.status(500).json({ error: '註冊失敗，請稍後再試' });
  }
});

// 登入 API
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 驗證輸入
    if (!email || !password) {
      return res.status(400).json({ error: '請填寫電子郵件和密碼' });
    }

    // 查找用戶
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: '電子郵件或密碼錯誤' });
    }

    const user = users[0];

    // 驗證密碼
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: '電子郵件或密碼錯誤' });
    }

    // 生成 JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: '登入成功',
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      },
      token
    });
  } catch (error) {
    console.error('登入錯誤:', error);
    res.status(500).json({ error: '登入失敗，請稍後再試' });
  }
});

// 獲取用戶資料 API（需要驗證）
app.get('/api/auth/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: '未提供認證 token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [users] = await pool.query(
      'SELECT id, name, email, role, avatar FROM users WHERE id = ?',
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: '用戶不存在' });
    }

    const user = users[0];
    res.json({
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    });
  } catch (error) {
    console.error('驗證錯誤:', error);
    res.status(401).json({ error: 'token 無效或已過期' });
  }
});

// 中間件：驗證 JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: '未提供認證 token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const [users] = await pool.query(
      'SELECT id, name, email, role, avatar FROM users WHERE id = ?',
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: '用戶不存在' });
    }

    req.user = users[0];
    next();
  } catch (error) {
    return res.status(401).json({ error: 'token 無效或已過期' });
  }
};

// 中間件：檢查是否為管理員
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: '權限不足，需要管理員權限' });
  }
  next();
};

// 獲取所有用戶列表（需要管理員權限）
app.get('/api/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, role, avatar, created_at FROM users ORDER BY created_at DESC'
    );

    res.json({
      users: users.map(user => ({
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.created_at
      }))
    });
  } catch (error) {
    console.error('獲取用戶列表錯誤:', error);
    res.status(500).json({ error: '獲取用戶列表失敗' });
  }
});

// 刪除用戶（需要管理員權限）
app.delete('/api/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    // 防止管理員刪除自己
    if (userId == req.user.id) {
      return res.status(400).json({ error: '不能刪除自己的帳號' });
    }

    // 檢查用戶是否存在
    const [users] = await pool.query(
      'SELECT id FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: '用戶不存在' });
    }

    // 刪除用戶
    await pool.query('DELETE FROM users WHERE id = ?', [userId]);

    res.json({ message: '用戶已成功刪除' });
  } catch (error) {
    console.error('刪除用戶錯誤:', error);
    res.status(500).json({ error: '刪除用戶失敗' });
  }
});

// 更新用戶角色（需要管理員權限）
app.patch('/api/users/:id/role', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: '無效的角色' });
    }

    // 檢查用戶是否存在
    const [users] = await pool.query(
      'SELECT id FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: '用戶不存在' });
    }

    // 更新角色
    await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, userId]);

    res.json({ message: '用戶角色已更新' });
  } catch (error) {
    console.error('更新角色錯誤:', error);
    res.status(500).json({ error: '更新角色失敗' });
  }
});

// 啟動服務器
async function startServer() {
  try {
    // 初始化數據庫
    await initDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 後端服務器運行在 http://localhost:${PORT}`);
      console.log(`📊 API 端點: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ 服務器啟動失敗:', error);
    process.exit(1);
  }
}

startServer();
