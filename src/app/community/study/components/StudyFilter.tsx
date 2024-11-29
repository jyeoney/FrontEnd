'use client';

interface StudyFilterProps {
  selectedSubjects: string[];
  selectedStatus: string[];
  selectedDifficulty: string[];
  selectedDays: string[];
  onFilterChange: (
    type: 'subjects' | 'status' | 'difficulty' | 'days',
    value: string,
  ) => void;
}

const subjects = [
  '개념 학습',
  '프로젝트',
  '알고리즘',
  '코딩테스트',
  '챌린지',
  '자격증/시험',
  '취업/코테',
  '기타',
] as const;

const statuses = ['모집 중', '모집 완료', '진행 중', '종료'] as const;
const difficulties = ['상', '중', '하'] as const;
const days = ['월', '화', '수', '목', '금', '토', '일'] as const;

export function StudyFilter({
  selectedSubjects,
  selectedStatus,
  selectedDifficulty,
  selectedDays,
  onFilterChange,
}: StudyFilterProps) {
  return (
    <div className="mb-6 space-y-4 bg-base-200 p-4 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <h3 className="font-semibold mb-2">주제</h3>
          <div className="flex flex-wrap gap-2">
            {subjects.map(subject => (
              <button
                key={subject}
                onClick={() => onFilterChange('subjects', subject)}
                className={`btn btn-sm ${
                  selectedSubjects.includes(subject)
                    ? 'btn-primary'
                    : 'btn-outline'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">상태</h3>
          <div className="flex flex-wrap gap-2">
            {statuses.map(status => (
              <button
                key={status}
                onClick={() => onFilterChange('status', status)}
                className={`btn btn-sm ${
                  selectedStatus.includes(status)
                    ? 'btn-primary'
                    : 'btn-outline'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">난이도</h3>
          <div className="flex flex-wrap gap-2">
            {difficulties.map(difficulty => (
              <button
                key={difficulty}
                onClick={() => onFilterChange('difficulty', difficulty)}
                className={`btn btn-sm ${
                  selectedDifficulty.includes(difficulty)
                    ? 'btn-primary'
                    : 'btn-outline'
                }`}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">요일</h3>
          <div className="flex flex-wrap gap-2">
            {days.map(day => (
              <button
                key={day}
                onClick={() => onFilterChange('days', day)}
                className={`btn btn-sm ${
                  selectedDays.includes(day) ? 'btn-primary' : 'btn-outline'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
