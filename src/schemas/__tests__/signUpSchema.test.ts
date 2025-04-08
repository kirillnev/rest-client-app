import { signUpSchema } from '../signUpSchema';
import { ZodError } from 'zod';

describe('signUpSchema', () => {
  it('passes validation with valid data', () => {
    const validData = {
      email: 'test@example.com',
      password: 'Password1!',
      confirmPassword: 'Password1!',
      agreement: true,
    };

    expect(() => signUpSchema.parse(validData)).not.toThrow();
  });

  it('fails if agreement is false', () => {
    const invalidData = {
      email: 'test@example.com',
      password: 'Password1!',
      confirmPassword: 'Password1!',
      agreement: false,
    };

    try {
      signUpSchema.parse(invalidData);
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
    const invalidData = {
      email: 'test@example.com',
      password: 'Password1!',
      confirmPassword: 'WrongPassword1!',
      agreement: true,
    };

    try {
      signUpSchema.parse(invalidData);
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
