'use client';

import {
  SUBJECT_OPTIONS,
  DIFFICULTY_OPTIONS,
  STATUS_OPTIONS,
  DAY_KOREAN,
} from '@/types/study';

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
            {Object.entries(SUBJECT_OPTIONS).map(([key, value]) => (
              <button
                key={key}
                onClick={() => onFilterChange('subjects', key)}
                className={`btn btn-sm ${
                  selectedSubjects.includes(key) ? 'btn-primary' : 'btn-outline'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">상태</h3>
          <div className="flex flex-wrap gap-2">
            {Object.values(STATUS_OPTIONS).map(status => (
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
            {Object.values(DIFFICULTY_OPTIONS).map(difficulty => (
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
            {Object.values(DAY_KOREAN).map(day => (
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
