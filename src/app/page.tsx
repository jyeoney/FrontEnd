'use client';

import Modal from '@/components/common/Modal';
import { useState } from 'react';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <h1 className="text-4xl font-bold">DevOnOff</h1>
      <p className="text-xl">개발자 온오프라인 스터디 플랫폼</p>
      
      <div className="flex gap-4">
        <button onClick={handleOpenModal} className="btn btn-primary">
          모달 열기
        </button>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title="환영합니다!"
      >
        <p>DevOnOff에 오신 것을 환영합니다!</p>
        <p>개발자들과 함께 성장하는 공간입니다.</p>
      </Modal>
    </div>
  );
}