'use client';

import { debounce } from 'lodash';
import { useCallback } from 'react';
import { BasePost } from '@/types/post';
interface PostListProps<T extends BasePost> {
  title: string;
  posts: T[];
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onSearch: (query: string) => void;
  renderPostCard: (post: T) => React.ReactNode;
  showFilters?: boolean;
  filterComponent?: React.ReactNode;
  onWrite?: () => void;
  isSignedIn?: boolean;
}

export function PostList<T extends BasePost>({
  title,
  posts,
  totalPages,
  currentPage,
  isLoading,
  onPageChange,
  onSearch,
  renderPostCard,
  showFilters = false,
  filterComponent,
  onWrite,
  isSignedIn,
}: PostListProps<T>) {
  const handleSearchInput = useCallback(
    debounce((value: string) => {
      if (value.length >= 2 || value.length === 0) {
        onSearch(value);
      }
    }, 500),
    [onSearch],
  );

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        {onWrite && isSignedIn && (
          <button onClick={onWrite} className="btn btn-primary">
            글쓰기
          </button>
        )}
      </div>

      <div className="mb-6">
        <form
          className="flex gap-2 justify-end"
          onSubmit={e => e.preventDefault()}
        >
          <input
            type="text"
            onChange={e => handleSearchInput(e.target.value)}
            placeholder="검색..."
            className="input input-bordered w-full max-w-xs"
          />
          <button type="submit" className="btn btn-primary">
            검색
          </button>
        </form>
      </div>

      {/* 필터 영역 */}
      {showFilters && filterComponent}

      {/* 게시물 목록 */}
      {isLoading ? (
        <div className="flex justify-center items-center h-60">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {posts.map(post => renderPostCard(post))}
          </div>

          {/* 페이지네이션 */}
          <div className="flex justify-center mt-8">
            <div className="join">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  className={`join-item btn ${currentPage === i ? 'btn-active' : ''}`}
                  onClick={() => onPageChange(i)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
