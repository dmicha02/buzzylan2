'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { CounterValidation } from '@/validations/CounterValidation';

export const CounterForm = () => {
  const t = useTranslations('CounterForm');
  const form = useForm({
    resolver: zodResolver(CounterValidation),
    defaultValues: {
      increment: 0,
    },
  });
  const router = useRouter();

  const handleIncrement = form.handleSubmit(async (data) => {
    await fetch(`/api/counter`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    form.reset();
    router.refresh();
  });

  return (
    <form onSubmit={handleIncrement} className="form-control w-full max-w-xs">
      <p>{t('presentation')}</p>
      <div className="mt-4">
        <label className="label" htmlFor="increment">
          <span className="label-text">{t('label_increment')}</span>
        </label>
        <input
          id="increment"
          type="number"
          className="input input-bordered w-full max-w-xs"
          {...form.register('increment')}
        />

        {form.formState.errors.increment?.message && (
          <div className="label">
            <span className="label-text-alt text-error">
              {form.formState.errors.increment?.message}
            </span>
          </div>
        )}
      </div>

      <div className="mt-6">
        <button
          className="btn btn-primary"
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          {t('button_increment')}
        </button>
      </div>
    </form>
  );
};
