# Bank API

Backend API مبنية بـ `Node.js` و`TypeScript` و`Express` و`MongoDB`.

## Requirements

- `Node.js` 18+ يفضل
- `npm`
- `MongoDB` شغال محليًا أو رابط MongoDB صالح

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

لو لم تضف القيم، المشروع لديه قيم افتراضية داخل [src/config/config.service.ts](/media/mohamed/52af8f1a-f97a-4dde-b07d-1e4c29c04528/learn/bank/src/config/config.service.ts).

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

