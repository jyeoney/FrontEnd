'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { StudyPost, StudyResponse } from '@/types/post';
import { StudyFilter } from './components/StudyFilter';
import { StudyCard } from './components/StudyCard';
import { PostList } from '../components/PostList';

type FilterType = 'subjects' | 'status' | 'difficulty' | 'days';

export default function StudyListPage() {
  const [posts, setPosts] = useState<StudyResponse | null>(null);
  const [page, setPage] = useState(0);
  const [searchTitle, setSearchTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: '12',
        searchTitle,
      });

      selectedSubjects.forEach(subject => params.append('subjects[]', subject));
      selectedStatus.forEach(status => params.append('status[]', status));
      selectedDifficulty.forEach(difficulty =>
        params.append('difficulty[]', difficulty),
      );
      selectedDays.forEach(day => params.append('days[]', day));

      const response = await axios.get('/api/study-posts/search', { params });
      setPosts(response.data);
    } catch (error) {
      console.error('스터디 목록 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [
    page,
    searchTitle,
    selectedSubjects,
    selectedStatus,
    selectedDifficulty,
    selectedDays,
  ]);

  const handleFilterChange = (type: FilterType, value: string) => {
    const setters = {
      subjects: setSelectedSubjects,
      status: setSelectedStatus,
      difficulty: setSelectedDifficulty,
      days: setSelectedDays,
    };

    setters[type](prev =>
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value],
    );
    setPage(0);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">스터디 모집</h1>
        <Link href="/community/study/write" className="btn btn-primary">
          스터디 모집하기
        </Link>
      </div>
      <PostList<StudyPost>
        title=""
        posts={posts?.data || []}
        totalPages={posts?.total_pages || 0}
        currentPage={page}
        isLoading={isLoading}
        onPageChange={setPage}
        onSearch={setSearchTitle}
        renderPostCard={post => <StudyCard key={post.id} post={post} />}
        showFilters={true}
        filterComponent={
          <StudyFilter
            selectedSubjects={selectedSubjects}
            selectedStatus={selectedStatus}
            selectedDifficulty={selectedDifficulty}
            selectedDays={selectedDays}
            onFilterChange={handleFilterChange}
          />
        }
      />
    </div>
  );
}
