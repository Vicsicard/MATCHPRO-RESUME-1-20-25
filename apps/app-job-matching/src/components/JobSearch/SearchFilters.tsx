import React from 'react';
import { JobSearchFilters } from '../../types';

interface SearchFiltersProps {
  filters: JobSearchFilters;
  onFilterChange: (filters: JobSearchFilters) => void;
}

export function SearchFilters({ filters, onFilterChange }: SearchFiltersProps) {
  const employmentTypes = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'];
  const remoteTypes = ['REMOTE', 'HYBRID', 'ON_SITE'];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    let newValue: any = value;

    if (type === 'number') {
      newValue = value ? parseInt(value) : undefined;
    }

    onFilterChange({
      ...filters,
      [name]: newValue,
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4">
      <h3 className="font-medium text-gray-900">Filters</h3>

      {/* Search Query */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Keywords
        </label>
        <input
          type="text"
          name="query"
          value={filters.query || ''}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Job title, skills, or keywords"
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <input
          type="text"
          name="location"
          value={filters.location || ''}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="City, state, or remote"
        />
      </div>

      {/* Employment Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Employment Type
        </label>
        <select
          name="employmentType"
          value={filters.employmentType?.[0] || ''}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          {employmentTypes.map((type) => (
            <option key={type} value={type}>
              {type.replace('_', ' ').toLowerCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Remote Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Remote Type
        </label>
        <select
          name="remoteType"
          value={filters.remoteType?.[0] || ''}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          {remoteTypes.map((type) => (
            <option key={type} value={type}>
              {type.replace('_', ' ').toLowerCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Salary Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Minimum Salary
        </label>
        <input
          type="number"
          name="minSalary"
          value={filters.minSalary || ''}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter minimum salary"
        />
      </div>

      {/* Posted Within */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Posted Within
        </label>
        <select
          name="postedWithin"
          value={filters.postedWithin || ''}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Any Time</option>
          <option value="1">24 Hours</option>
          <option value="7">7 Days</option>
          <option value="14">14 Days</option>
          <option value="30">30 Days</option>
        </select>
      </div>
    </div>
  );
}
