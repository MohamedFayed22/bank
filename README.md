# Bank API

Backend API مبنية بـ `Node.js` و`TypeScript` و`Express` و`MongoDB`.

## Install

```bash
npm install
```

## Environment

المشروع يستخدم ملفين:

- `.env.development`
- `.env.production`

القيم المستخدمة داخل المشروع:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/bank
SALT_ROUNDS=10
SECRET_KEY=your_secret_key
```

## Run

### Development

```bash
npm run start:dev
```

### Production

```bash
npm run start:prod
```

هذه الأوامر تشغل:

- TypeScript watch
- Node.js watch على ملفات `dist`

## Base URL

افتراضيًا:

```text
http://localhost:3000
```

## Main Routes

- `GET /`
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/profile`
- `GET /accounts/me`
- `POST /transaction/deposit`
- `POST /transaction/withdraw`
- `POST /transaction/transfer`
- `GET /transaction/my`
- `GET /transaction/my/summary`
- `GET /transaction/:id`

## Auth Header

الـ routes المحمية تحتاج:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

