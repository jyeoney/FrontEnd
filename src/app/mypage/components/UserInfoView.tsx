'use client';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';

const UserInfoView = () => {
  const { userInfo, setUserInfo } = useAuthStore(); // zustand에서 회원정보 가져오기
  const [nickname, setNickname] = useState(userInfo?.nickname || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [profileImageUrl, setProfileImageUrl] = useState(
    userInfo?.profileImageUrl || '/public/file.svg',
  );

  // const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     const imageUrl = URL.createObjectURL(file); // 임시 URL로 설정
  //     setProfileImageUrl(imageUrl);
  //     setUserInfo({ ...userInfo, profileImageUrl: imageUrl }); // 상태 업데이트
  //   }
  // };

  // const handleImageDelete = () => {
  //   setProfileImageUrl('');
  //   setUserInfo({ ...userInfo, profileImageUrl: '' }); // 상태에서 프로필 이미지 제거
  // };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-8 max-w-4xl mx-auto">
      <div className="flex flex-col items-center w-full md:w-1/3 border-r pr-4">
        <div className="relative">
          <img
            src={profileImageUrl || '/default-avatar.png'}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border"
          />
        </div>
        <div className="mt-4 flex flex-col gap-4 w-full">
          {profileImageUrl && (
            <button
              // onClick={handleImageDelete}
              className="btn btn-error w-full"
            >
              이미지 삭제
            </button>
          )}
          <label className="btn btn-primary w-full cursor-pointer">
            이미지 변경
            <input
              type="file"
              className="hidden"
              // onChange={handleProfileImageChange}
            />
          </label>
        </div>
      </div>

      <div className="flex flex-col w-full md:w-2/3 space-y-6">
        <form className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="font-medium text-lg">닉네임:</label>
            <input
              type="text"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              className="input input-bordered w-full"
            />
            <button type="submit" className="btn btn-primary">
              닉네임 수정
            </button>
          </div>

          <div className="flex items-center gap-4">
            <label className="font-medium text-lg">이메일:</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input input-bordered w-full"
            />
            <button type="button" className="btn btn-secondary">
              비밀번호 수정
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserInfoView;
