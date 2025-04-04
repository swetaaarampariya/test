export const validationMessages = {
    required: ({ field }: { field: string }) => `${field} is required`,
    maxLength: ({ field, count }: { field: string; count: number }) => `${field} maximum ${count} characters allowed`,
    minLength: ({ field, count }: { field: string; count: number }) => `${field} must be at least ${count} characters`,
    exactLength: ({ field, count }: { field: string; count: number }) => `${field} must be exactly ${count} characters`,
    invalid: ({ field }: { field: string }) => `Invalid ${field}`,
    positive: ({ field }: { field: string }) => `${field} must be a positive number`,
    custom: ({ field, message }: { field: string; message: string }) => `${field} ${message}`,
  };
  