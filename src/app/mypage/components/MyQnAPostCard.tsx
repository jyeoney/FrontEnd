'use client';

import { BasePost } from '@/types/post';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

interface MyPostCardProps {
  post: BasePost;
}

const MyQnAPostCard = ({ post }: MyPostCardProps) => {
  const router = useRouter();

  const formatDate = (date: string) => {
    return dayjs(date).format('YYYY-MM-DD HH:mm');
  };

  return (
    <div
      className="card bg-base-100 shadow-xl cursor-pointer"
      onClick={() => router.push(`/community/qna/${post.id}`)}
    >
      <figure className="px-4 pt-4">
        <img
          // src={post?.thumbnailImgUrl || '/default-study-thumbnail.png'}
          src="/default-study-thumbnail.png"
          alt={post.title}
          className="rounded-xl h-48 w-full object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-lg">{post.title}</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>정보 공유</span>
          </div>
          <div className="flex justify-between">
            <span>내용:</span>
            <span>{post.content}</span>
          </div>
          <div className="flex justify-between">
            <span>작성일:</span>
            <span>{formatDate(post.createdAt)}</span>
          </div>
          <div className="flex justify-between">
            <span>수정일:</span>
            <span>{formatDate(post.updatedAt)}</span>
          </div>
        </div>
      </div>
      <div className="card-actions justify-end mt-4">
        <button className="btn btn-primary btn-sm">상세보기</button>
      </div>
    </div>
  );
};

export default MyQnAPostCard;
