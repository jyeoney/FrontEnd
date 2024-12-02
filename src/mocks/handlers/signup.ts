import { rest } from 'msw';

export const signUpHandlers = [
  // 이메일 중복 확인
  rest.post('/api/auth/check-email', async (req, res, ctx) => {
    const { email } = await req.json();
    if (!email || !email.trim()) {
      return res(
        ctx.status(400),
        ctx.json({
          errorCode: 'INVALID_EMAIL',
          message: '이메일을 입력해 주세요.',
        }),
      );
    }

    if (email === 'test@example.com') {
      return res(
        ctx.status(400),
        ctx.json({
          errorCode: 'EMAIL_ALREADY_REGISTERED',
          message: '이미 사용 중인 이메일입니다.',
        }),
      );
    }
    return res(
      ctx.status(200),
      ctx.json({ message: '사용 가능한 이메일입니다.' }),
    );
  }),

  // 인증번호 메일 발송
  rest.post('/api/auth/email-auth', async (req, res, ctx) => {
    const { email } = await req.json();
    if (!email || !email.trim()) {
      return res(
        ctx.status(400),
        ctx.json({
          errorCode: 'INVALID_EMAIL',
          message: '이메일을 입력해주세요.',
        }),
      );
    }

    // 인증번호 임의로 생성
    const authCode = '123456';

    console.log(`이메일로 인증 코드 발송: ${authCode} (${email})`);

    return res(
      ctx.status(200),
      ctx.json({ message: '인증번호가 발송되었습니다.' }),
    );
  }),

  // 인증번호 확인
  rest.post('/api/auth/email-auth/code', async (req, res, ctx) => {
    const { email, code } = await req.json();
    if (!code) {
      return res(
        ctx.status(400),
        ctx.json({
          errorCode: 'INVALID_CODE',
          message: '인증 코드를 입력해주세요.',
        }),
      );
    }
    if (code !== '123456') {
      return res(
        ctx.status(400),
        ctx.json({
          errorCode: 'VALIDATION_FAILED',
          message: '인증 코드가 일치하지 않습니다.',
        }),
      );
    }
    return res(
      ctx.status(200),
      ctx.json({
        message: '인증되었습니다!',
      }),
    );
  }),

  // 닉네임 중복 확인
  rest.post('/api/auth/check-nickname', async (req, res, ctx) => {
    const { nickName } = await req.json();

    if (!nickName || !nickName.trim()) {
      return res(
        ctx.status(400),
        ctx.json({
          errorCode: 'INVALID_NICKNAME',
          message: '닉네임을 입력해주세요.',
        }),
      );
    }

    if (nickName === 'testNickName') {
      return res(
        ctx.status(400),
        ctx.json({
          errorCode: 'NICKNAME_ALREADY_REGISTERED',
          message: '이미 사용 중인 닉네임입니다.',
        }),
      );
    }

    return res(
      ctx.status(200),
      ctx.json({ message: '사용 가능한 닉네임입니다.' }),
    );
  }),

  // 회원가입 폼 제출
  rest.post('/api/auth/sign-up', async (req, res, ctx) => {
    const { email, password, nickName } = await req.json();

    if (!email || !email.trim()) {
      return res(
        ctx.status(400),
        ctx.json({
          errorCode: 'INVALID_EMAIL',
          message: '이메일을 입력하세요.',
        }),
      );
    }

    if (
      !password ||
      password.length < 8 ||
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)
    ) {
      return res(
        ctx.status(400),
        ctx.json({
          errorCode: 'INVALID_PASSWORD',
          message:
            '비밀번호는 최소 8자 이상이며, 하나 이상의 영문자, 숫자, 특수문자가 포함되어야 합니다.',
        }),
      );
    }

    if (!nickName || !nickName.trim()) {
      return res(
        ctx.status(400),
        ctx.json({
          errorCode: 'INVALID_NICKNAME',
          message: '닉네임을 입력하세요.',
        }),
      );
    }

    return res(
      ctx.status(201),
      ctx.json({ message: '회원가입이 성공적으로 완료되었습니다!' }),
    );
  }),
];
