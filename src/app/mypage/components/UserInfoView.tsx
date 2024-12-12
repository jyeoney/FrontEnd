'use client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import axios from 'axios';
import CustomConfirm from '@/components/common/Confirm';
import CustomAlert from '@/components/common/Alert';
import { useRouter } from 'next/navigation';

const UserInfoView = () => {
  const { userInfo, setUserInfo, resetStore } = useAuthStore();
  const [nickname, setNickname] = useState(userInfo?.nickname || '');
  const [profileImageUrl, setProfileImageUrl] = useState(
    userInfo?.profileImageUrl || '/default-profile-image.png',
  );
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [onConfirmCallback, setOnConfirmCallback] = useState<() => void>(
    () => () => {},
  );

  const router = useRouter();

  useEffect(() => {
    if (userInfo) {
      setNickname(userInfo?.nickname || '');
      setProfileImageUrl(
        userInfo?.profileImageUrl || '/default-profile-image.png',
      );
    }
  }, [userInfo]);

  const handleImageDeleteButtonClick = async () => {
    setConfirmMessage('프로필 이미지를 삭제하시겠습니까?');
    setOnConfirmCallback(() => async () => {
      try {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_ROUTE_URL}/users/${userInfo?.id}/profile-image`,
          {
            headers: { 'Content-Type': 'application/json' },
          },
        );

        if (response.status === 200 && response.data) {
          const updatedUserInfo = response.data;
          setUserInfo(updatedUserInfo);
          setProfileImageUrl(
            updatedUserInfo.profileImageUrl || '/default-profile-image.png',
          );
          setSelectedImage(null);
          setAlertMessage('프로필 이미지가 삭제되었습니다.');
          setShowAlert(true);
        }
      } catch (error: any) {
        if (error.response) {
          const { status, data } = error.response;
          console.log('error:' + error.response);
          const message =
            data?.errorMessage ||
            '오류가 발생했습니다. 잠시 후 다시 시도해주세요.';

          if (status === 404) {
            setAlertMessage(message);
            setShowAlert(true);
          } else {
            setAlertMessage(
              '프로필 이미지를 삭제하지 못했습니다. 잠시 후 다시 시도해주세요.',
            );
            setShowAlert(true);
          }
        } else {
          setAlertMessage(
            '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          );
          setShowAlert(true);
        }
      } finally {
        setShowConfirm(false);
      }
    });
    setShowConfirm(true);
  };
  const handleImageChangeConfirmButtonClick = async () => {
    if (!selectedImage) {
      setAlertMessage('이미지를 선택해주세요.');
      setShowAlert(true);
      return;
    }
    setConfirmMessage('프로필 이미지를 변경하시겠습니까?');
    setOnConfirmCallback(() => async () => {
      try {
        const formData = new FormData();

        if (selectedImage) {
          formData.append('profileImage', selectedImage);
          console.log('FormData:', formData);
        }

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_ROUTE_URL}/users/${userInfo?.id}/profile-image`,

          formData,

          {
            headers: { 'Content-Type': 'multipart/form-data' },
          },
        );

        if (response.status === 200 && response.data.profileImageUrl) {
          const updatedUserInfo = response.data;
          setUserInfo(updatedUserInfo);
          setProfileImageUrl(
            updatedUserInfo.profileImageUrl || '/default-profile-image.png',
          );
          setSelectedImage(null);
          setAlertMessage('프로필 이미지가 변경되었습니다.');
          console.log(`response: ${response.data}`);
          setShowAlert(true);
        }
      } catch (error: any) {
        console.error('Error occurred:', error);
        if (error.response) {
          const { status, data } = error.response;
          console.log(`error: ${error.response.data}`);
          const message =
            data?.errorMessage ||
            '오류가 발생했습니다. 잠시 후 다시 시도해주세요.';

          if (status === 404) {
            setAlertMessage(message);
            setShowAlert(true);
          } else {
            setAlertMessage(
              '프로필 이미지를 변경하지 못했습니다. 잠시 후 다시 시도해주세요.',
            );
            setShowAlert(true);
          }
        } else {
          setAlertMessage(
            '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          );
          setShowAlert(true);
        }
      } finally {
        setShowConfirm(false);
      }
    });
    setShowConfirm(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageChangeCancelButtonClick = () => {
    setSelectedImage(null);
    setProfileImageUrl(
      userInfo?.profileImageUrl || '/default-profile-image.png',
    );
  };

  const handleWithdrawalButtonClick = () => {
    setConfirmMessage(
      '회원 탈퇴를 진행하시겠습니까? 탈퇴 시 회원 정보 및 모든 데이터가 삭제되며 복구할 수 없습니다.',
    );
    setOnConfirmCallback(() => async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_ROUTE_URL}/auth/withdrawal`,
          {
            headers: { 'Content-Type': 'application/json' },
          },
        );

        if (response.status === 200) {
          const updatedUserInfo = response.data;
          resetStore();
          router.push('/');
          setAlertMessage(
            '회원 탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.',
          );
          setShowAlert(true);
        }
      } catch (error: any) {
        if (error.response) {
          const { status, data } = error.response;
          console.log('error:' + error.response);
          const message =
            data?.errorMessage ||
            '오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
          if (status === 400) {
            setAlertMessage('잘못된 요청입니다.');
          } else if (status === 404) {
            setAlertMessage('사용자를 찾을 수 없습니다.');
          } else {
            setAlertMessage(
              '서버에 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
            );
          }
        } else {
          setAlertMessage(
            '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          );
        }
        setShowAlert(true);
      } finally {
        setShowConfirm(false);
      }
    });
    setShowConfirm(true);
  };

  const handleNicknameButtonClick = async () => {
    setConfirmMessage('닉네임을 변경하시겠습니까?');
    setOnConfirmCallback(() => async () => {
      try {
        if (!nickname || nickname.trim().length === 0) {
          setAlertMessage('닉네임을 입력해주세요.');
          return;
        }

        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_ROUTE_URL}/users/${userInfo?.id}`,
          { nickname },
          {
            headers: { 'Content-Type': 'application/json' },
          },
        );

        if (response.status === 200 && response.data) {
          const updatedUserInfo = response.data;
          setUserInfo(updatedUserInfo);
          setAlertMessage('닉네임이 변경되었습니다.');
          setShowAlert(true);
        }
      } catch (error: any) {
        if (error.response) {
          const { status, data } = error.response;
          const errorCode = data?.errorCode;
          const message =
            data?.errorMessage ||
            '오류가 발생했습니다. 잠시 후 다시 시도해주세요.';

          if (status === 404) {
            setAlertMessage(message);
            setShowAlert(true);
          } else if (
            status === 400 &&
            errorCode === 'NICKNAME_ALREADY_REGISTERED'
          ) {
            setAlertMessage('이미 사용 중인 닉네임입니다.');
            setShowAlert(true);
          } else {
            setAlertMessage('닉네임 변경에 실패했습니다. 다시 시도해주세요.');
            setShowAlert(true);
          }
        } else {
          setAlertMessage(
            '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          );
          setShowAlert(true);
        }
      } finally {
        setShowConfirm(false);
      }
    });
    setShowConfirm(true);
  };

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
              onClick={handleImageDeleteButtonClick}
              className="btn btn-secondary w-full"
            >
              이미지 삭제
            </button>
          )}

          {!selectedImage && (
            <label className="btn btn-primary w-full cursor-pointer">
              이미지 변경
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/png, image/jpeg"
              />
            </label>
          )}

          {selectedImage && (
            <div className="flex gap-2 mt-2 w-full justify-between">
              <button
                onClick={handleImageChangeCancelButtonClick}
                className="btn btn-accent w-1/2"
              >
                취소
              </button>
              <button
                onClick={handleImageChangeConfirmButtonClick}
                className="btn btn-primary w-1/2"
              >
                완료
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col w-full md:w-2/3 space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* 공통 라벨 스타일 추가 */}
            <label className="font-medium text-lg w-32 md:w-1/3 text-right">
              닉네임
            </label>
            <input
              type="text"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              className="input input-bordered w-full"
            />
            <button
              onClick={handleNicknameButtonClick}
              className="btn btn-primary w-full md:w-auto"
            >
              닉네임 변경
            </button>
            <button className="btn btn-secondary w-full md:w-auto">
              비밀번호 변경
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* 동일한 라벨 너비로 정렬 */}
            <label className="font-medium text-lg w-32 md:w-1/3 text-right">
              이메일
            </label>
            <div className="input input-bordered w-full cursor-not-allowed bg-gray-100 flex items-center justify-center">
              {userInfo?.email}
            </div>
            <button
              className="btn btn-accent w-full md:w-auto"
              onClick={handleWithdrawalButtonClick}
            >
              회원 탈퇴
            </button>
          </div>
        </div>
      </div>
      {showConfirm && (
        <CustomConfirm
          message={confirmMessage}
          onConfirm={onConfirmCallback}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      {showAlert && (
        <CustomAlert
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
};

export default UserInfoView;
