import { ValidationError } from '../middleware/error.js';

export function validateIssue(data, isUpdate = false) {
  const errors = [];

  if (!isUpdate && !data.title) {
    errors.push('Title is required');
  }

  if (data.title !== undefined) {
    if (typeof data.title !== 'string') {
      errors.push('Title must be a string');
    } else if (data.title.length === 0) {
      errors.push('Title cannot be empty');
    } else if (data.title.length > 200) {
      errors.push('Title must be 200 characters or less');
    }
  }

  if (data.description !== undefined && data.description !== null) {
    if (typeof data.description !== 'string') {
      errors.push('Description must be a string');
    }
  }

  if (data.status !== undefined) {
    const validStatuses = ['not_started', 'in_progress', 'done'];
    if (!validStatuses.includes(data.status)) {
      errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
    }
  }

  if (data.priority !== undefined) {
    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(data.priority)) {
      errors.push(`Priority must be one of: ${validPriorities.join(', ')}`);
    }
  }

  if (data.tag_ids !== undefined && data.tag_ids !== null) {
    if (!Array.isArray(data.tag_ids)) {
      errors.push('tag_ids must be an array');
    } else if (!data.tag_ids.every(id => typeof id === 'number' && Number.isInteger(id))) {
      errors.push('tag_ids must be an array of integers');
    }
  }

  if (errors.length > 0) {
    throw new ValidationError(errors.join('; '));
  }
}

export function validateTag(data) {
  const errors = [];

  if (!data.name) {
    errors.push('Name is required');
  } else if (typeof data.name !== 'string') {
    errors.push('Name must be a string');
  } else if (data.name.length === 0) {
    errors.push('Name cannot be empty');
  } else if (data.name.length > 50) {
    errors.push('Name must be 50 characters or less');
  }

  if (!data.color) {
    errors.push('Color is required');
  } else if (typeof data.color !== 'string') {
    errors.push('Color must be a string');
  } else if (!/^#[0-9a-fA-F]{6}$/.test(data.color)) {
    errors.push('Color must be a valid hex color (e.g., #ef4444)');
  }

  if (errors.length > 0) {
    throw new ValidationError(errors.join('; '));
  }
}

export function validatePagination(query) {
  const page = parseInt(query.page) || 1;
  const limit = Math.min(parseInt(query.limit) || 10, 100);

  if (page < 1) {
    throw new ValidationError('Page must be greater than 0');
  }

  if (limit < 1) {
    throw new ValidationError('Limit must be greater than 0');
  }

  return { page, limit, offset: (page - 1) * limit };
}
