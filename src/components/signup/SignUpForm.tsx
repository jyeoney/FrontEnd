'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [authCodeVerified, setAuthCodeVerified] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [nickName, setNickName] = useState('');
  const [nickNameAvailable, setNickNameAvailable] = useState(false);

  const [emailMessage, setEmailMessage] = useState('');
  const [emailMessageType, setEmailMessageType] = useState<
    'success' | 'error' | ''
  >('');
  const [nickNameMessage, setNickNameMessage] = useState('');
  const [nickNameMessageType, setNickNameMessageType] = useState<
    'success' | 'error' | ''
  >('');

  const [authCodeError, setAuthCodeError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordCheckError, setPasswordCheckError] = useState('');

  const router = useRouter();

  // 이메일 형식 확인
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  // 비밀번호 형식 확인
  const isValidPassword = (password: string) =>
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password,
    );

  // 이메일 중복 확인 및 인증번호 요청
  const handleAuthCodeSendClick = async () => {
    // 이메일 형식 확인
    if (!isValidEmail(email)) {
      setEmailMessage('이메일 형식으로 입력해주세요.');
      setEmailMessageType('error');
      return;
    }
    try {
      // 1. 이메일 중복 확인
      const emailCheckResponse = await axios.post(
        '/api/auth/chek-email',
        { email },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );
      if (emailCheckResponse.status === 200) {
        setEmailMessage('사용 가능한 이메일입니다.');
        setEmailMessageType('success');
      } else {
      }
      // 2. 인증번호 메일 발송
      const authCodeResponse = await axios.post('/api/auth/email-auth', {
        email,
      });
      if (authCodeResponse.status === 200) {
        setEmailSent(true);
        setEmailMessage('인증번호가 발송되었습니다.');
        setEmailMessageType('success');
      } else {
        setEmailMessage('인증번호 전송에 실패했습니다.');
        setEmailMessageType('error');
      }
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;
        const errorCode = data?.errorCode;

        if (status === 400 && errorCode === 'EMAIL_ALREADY_REGISTERED') {
          setEmailMessage('이미 사용 중인 이메일입니다.');
          setEmailMessageType('error');
        } else {
          setEmailMessage('잘못된 요청입니다. 다시 시도해주세요.');
          setEmailMessageType('error');
        }
      } else {
        setEmailMessage(
          '서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        );
        setEmailMessageType('error');
      }
    }
  };

  // 인증번호 확인
  const handleAuthCodeVerifyClick = async () => {
    try {
      const response = await axios.post('/api/auth/email-auth/code', {
        email,
        code: authCode,
      });
      if (response.status === 200) {
        alert('인증되었습니다!');
        setAuthCodeError('');
        setAuthCodeVerified(true);
      }
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;
        const errorCode = data?.errorCode;

        if (status === 400 && errorCode === 'EMAIL_VERIFICATION_FAILED') {
          setAuthCodeError('인증 코드가 만료되었습니다.');
        } else {
          setAuthCodeError('잘못된 요청입니다. 다시 시도해주세요.');
        }
      } else {
        setAuthCodeError(
          '서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        );
      }
    }
  };

  // 닉네임 중복 확인
  const handleNickNameAvailabilityCheckClick = async () => {
    if (!nickName.trim()) {
      setNickNameMessage('닉네임을 입력하세요.');
      setNickNameMessageType('error');
    }
    try {
      const response = await axios.post('/api/auth/check-nickname', {
        nickName,
      });
      if (response.status === 200) {
        setNickNameMessage('사용 가능한 닉네임입니다.');
        setNickNameMessageType('success');
      }
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;
        const errorCode = data?.errorCode;

        if (status === 400 && errorCode === 'NICKNAME_ALREADY_REGISTERED') {
          setNickNameMessage('이미 사용 중인 닉네임입니다.');
          setNickNameMessageType('error');
        } else {
          setNickNameMessage('잘못된 요청입니다. 다시 시도해주세요.');
          setNickNameMessageType('error');
        }
      } else {
        setNickNameMessage(
          '서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        );
        setNickNameMessageType('error');
      }
    }
  };

  // 비밀번호 형식 확인
  const handlePasswordValidate = (password: string) => {
    if (!isValidPassword(password)) {
      setPasswordError(
        '비밀번호는 최소 8자 이상이며, 하나 이상의 영문자, 숫자, 특수문자가 포함되어야 합니다.',
      );
    } else {
      setPasswordError('');
    }
  };

  // 비밀번호 확인
  const handlePasswordCheck = (value: string) => {
    setPasswordCheckError(
      value !== password ? '비밀번호가 일치하지 않습니다.' : '',
    );
  };

  // 회원가입 제출
  const handleSignUpSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setEmailMessage('유효한 이메일을 입력해 주세요.');
      setEmailMessageType('error');
      return;
    }

    if (!authCodeVerified) {
      setEmailMessage('이메일 인증을 완료해 주세요.');
      setEmailMessageType('error');
      return;
    }

    if (!nickName.trim()) {
      setNickNameMessage('닉네임을 입력해 주세요.');
      setNickNameMessageType('error');
    } else if (!nickNameAvailable) {
      setNickNameMessage('닉네임 중복 확인을 완료해 주세요.');
      setNickNameMessageType('error');
      return;
    }
    if (!isValidPassword(password)) {
      setPasswordError(
        '비밀번호는 최소 8자 이상이며, 하나 이상의 영문자, 숫자, 특수문자가 포함되어야 합니다.',
      );
    }

    if (password !== passwordCheck) {
      setPasswordCheckError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await axios.post(
        '/api/auth/sign-up',
        { email, password, nickName },
        { headers: { 'Content-Type': 'application/json' } },
      );
      if (response.status === 201) {
        alert('회원가입이 성공적으로 완료되었습니다!');
        router.push('/signin');
      } else {
        alert('회원가입 중 문제가 발생했습니다. 다시 시도해 주세요.');
      }
    } catch (error) {
      console.error('회원가입 요청 중 오류', error);
      alert('회원가입 요청 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 max-w-lg mx-auto">
      <form onSubmit={handleSignUpSubmit} className="w-full">
        {/* 이메일 입력 */}
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 font-semibold">
            이메일
          </label>
          <div className="flex items-center">
            <input
              id="email"
              type="email"
              value={email}
              placeholder="이메일을 입력해 주세요."
              onChange={e => {
                setEmail(e.target.value);
                setAuthCodeVerified(false); // 이메일 수정 시 인증 초기화
                setEmailMessage('');
                setEmailMessageType('');
              }}
              required
              className="flex-grow px-4 py-2 rounded border bg-white focus:outline-indigo-500"
            />
            <button
              type="button"
              onClick={handleAuthCodeSendClick}
              className={`ml-2 px-4 py-2 rounded ${
                isValidEmail(email)
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-400 text-white'
              }`}
            >
              {emailSent ? '재발송' : '인증번호 전송'}
            </button>
          </div>
          {emailMessage && (
            <p
              className={`mt-2 ${
                emailMessageType === 'success'
                  ? 'text-green-500'
                  : 'text-red-500'
              }`}
            >
              {emailMessage}
            </p>
          )}
        </div>

        {/* 인증번호 입력 */}
        {emailSent && (
          <div className="mb-4">
            <label htmlFor="authCode" className="block mb-2 font-semibold">
              인증 번호
            </label>
            <div className="flex items-center">
              <input
                id="authCode"
                type="text"
                value={authCode}
                onChange={e => setAuthCode(e.target.value)}
                required
                className="flex-grow px-4 py-2 rounded border bg-white focus:outline-indigo-500"
              />
              <button
                type="button"
                onClick={handleAuthCodeVerifyClick}
                disabled={authCodeVerified}
                className="ml-2 px-4 py-2 rounded bg-indigo-500 text-white"
              >
                {authCodeVerified ? '완료' : '확인'}
              </button>
            </div>
            {authCodeError && (
              <p className="text-red-500 mt-2">{authCodeError}</p>
            )}
          </div>
        )}

        {/* 닉네임 입력 */}
        <div className="mb-4">
          <label htmlFor="nickName" className="block mb-2 font-semibold">
            닉네임
          </label>
          <div className="flex items-center">
            <input
              id="nickName"
              type="text"
              value={nickName}
              onChange={e => {
                setNickName(e.target.value);
                setNickNameAvailable(false); // 닉네임 수정 시 중복 확인 초기화
                setNickNameMessage('');
                setNickNameMessageType('');
              }}
              placeholder="닉네임을 입력해 주세요."
              required
              className="flex-grow px-4 py-2 rounded border bg-white focus:outline-indigo-500"
            />
            <button
              type="button"
              onClick={handleNickNameAvailabilityCheckClick}
              disabled={nickNameAvailable}
              className="ml-2 px-4 py-2 rounded bg-indigo-500 text-white"
            >
              중복 확인
            </button>
          </div>
          {nickNameMessage && (
            <p
              className={`mt-2 ${
                nickNameMessageType === 'success'
                  ? 'text-green-500'
                  : 'text-red-500'
              }`}
            >
              {nickNameMessage}
            </p>
          )}
        </div>

        {/* 비밀번호 입력 */}
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2 font-semibold">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => {
              setPassword(e.target.value);
              handlePasswordValidate(e.target.value);
            }}
            placeholder="비밀번호를 입력해 주세요."
            required
            className="w-full px-4 py-2 rounded border bg-white focus:outline-indigo-500"
          />
          <p className="text-red-500 mt-2">{passwordError}</p>
        </div>

        {/* 비밀번호 확인 */}
        <div className="mb-6">
          <label htmlFor="passwordCheck" className="block mb-2 font-semibold">
            비밀번호 확인
          </label>
          <input
            id="passwordCheck"
            type="password"
            value={passwordCheck}
            onChange={e => {
              setPasswordCheck(e.target.value);
              handlePasswordCheck(e.target.value);
            }}
            placeholder="비밀번호를 한 번 더 입력해 주세요."
            required
            className="w-full px-4 py-2 rounded border bg-white focus:outline-indigo-500"
          />
          {passwordCheckError && (
            <p className="text-red-500 mt-2">{passwordCheckError}</p>
          )}
        </div>

        {/* 회원가입 버튼 */}
        <button
          type="submit"
          className="w-full bg-indigo-500 text-white px-4 py-2 rounded"
        >
          회원가입
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
