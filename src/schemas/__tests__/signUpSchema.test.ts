import { getSignUpSchema } from '../signUpSchema';
import { ZodError } from 'zod';
import type { TFunction } from 'i18next';

describe('getSignUpSchema', () => {
  const t = ((key: string) => {
    const messages: Record<string, string> = {
      'auth.validation.agreement': 'You must agree to the terms',
      'auth.validation.password.match': 'Passwords do not match',
      'auth.validation.email': 'Invalid email format',
      'auth.validation.password.min': 'Password must be at least 8 characters',
      'auth.validation.password.letter': 'Password must contain a letter',
      'auth.validation.password.digit': 'Password must contain a digit',
      'auth.validation.password.special':
        'Password must contain a special character',
    };
    return messages[key] || key;
  }) as unknown as TFunction;

  it('passes validation with valid data', () => {
    const schema = getSignUpSchema(t);
    const validData = {
      email: 'test@example.com',
      password: 'Password1!',
      confirmPassword: 'Password1!',
      agreement: true,
    };

    expect(() => schema.parse(validData)).not.toThrow();
  });

  it('fails if agreement is false', () => {
    const schema = getSignUpSchema(t);
    const invalidData = {
      email: 'test@example.com',
      password: 'Password1!',
      confirmPassword: 'Password1!',
      agreement: false,
    };

    try {
      schema.parse(invalidData);
    } catch (err) {
      if (err instanceof ZodError) {
        expect(err.errors[0].message).toBe('You must agree to the terms');
        expect(err.errors[0].path).toContain('agreement');
      } else {
        throw err;
      }
    }
  });

  it('fails if confirmPassword does not match password', () => {
    const schema = getSignUpSchema(t);
    const invalidData = {
      email: 'test@example.com',
      password: 'Password1!',
      confirmPassword: 'WrongPassword1!',
      agreement: true,
    };

    try {
      schema.parse(invalidData);
    } catch (err) {
      if (err instanceof ZodError) {
        expect(err.errors[0].message).toBe('Passwords do not match');
        expect(err.errors[0].path).toContain('confirmPassword');
      } else {
        throw err;
      }
    }
  });
});
