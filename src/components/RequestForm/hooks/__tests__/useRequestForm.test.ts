import { renderHook, act } from '@testing-library/react';
import { useRequestForm } from '../useRequestForm';
import { useForm } from 'react-hook-form';
import { RestRequest } from '@/types';
import { prettifyJson } from '@/utils/prettifyJson';

jest.mock('@/utils/prettifyJson');
const mockPrettifyJson = prettifyJson as jest.Mock;

describe('useRequestForm', () => {
  test('handlePrettify sets prettified body if prettifyJson returns value', () => {
    mockPrettifyJson.mockReturnValue('pretty');

    const { result: formResult } = renderHook(() =>
      useForm<RestRequest>({
        defaultValues: {
          method: 'POST',
          url: '',
          headers: [],
          body: 'raw',
          bodyType: 'json',
        },
      })
    );

    const { result } = renderHook(() => useRequestForm(formResult.current));

    act(() => {
      result.current.handlePrettify();
    });

    expect(formResult.current.getValues('body')).toBe('pretty');
  });

  test('handlePrettify does nothing if prettifyJson returns null', () => {
    mockPrettifyJson.mockReturnValue(null);

    const { result: formResult } = renderHook(() =>
      useForm<RestRequest>({
        defaultValues: {
          method: 'POST',
          url: '',
          headers: [],
          body: 'invalid',
          bodyType: 'json',
        },
      })
    );

    const setValueSpy = jest.spyOn(formResult.current, 'setValue');

    const { result } = renderHook(() => useRequestForm(formResult.current));

    act(() => {
      result.current.handlePrettify();
    });

    expect(setValueSpy).not.toHaveBeenCalled();
  });
});
