'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { InfoPost, PostResponse } from '@/types/post';
import { PostList } from '@/app/community/components/PostList';
import { useAuthStore } from '@/store/authStore';
import SearchForm from '@/app/community/components/SearchForm';
import MyInfoPostCard from '@/app/mypage/components/MyInfoPostCard';

export default function InfoList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isSignedIn } = useAuthStore();
  const page = Number(searchParams.get('page')) || 0;

  const { data: posts, isLoading } = useQuery<PostResponse<InfoPost>>({
    queryKey: ['info-posts', { page, title: searchParams.get('title') }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        size: '12',
      });

      const title = searchParams.get('title');
      if (title) {
        params.append('title', title);
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/info-posts`,
        { params },
      );
      return response.data;
    },
  });

  const handlePageChange = (newPage: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('page', newPage.toString());
    router.push(`?${newSearchParams.toString()}`);
  };

  const handleWrite = () => {
    router.push('/community/info/write');
  };

  return (
    <PostList<InfoPost>
      title="정보공유"
      posts={posts?.content || []}
      totalPages={posts?.totalPages || 0}
      currentPage={page}
      isLoading={isLoading}
      onPageChange={handlePageChange}
      onWrite={handleWrite}
      isSignedIn={isSignedIn}
      renderPostCard={post => <MyInfoPostCard key={post.id} post={post} />}
      searchForm={
        <SearchForm
          initialKeyword={searchParams.get('title') || ''}
          placeholder="정보공유 제목을 검색하세요"
        />
      }
    />
  );
}
