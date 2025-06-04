import { currentUser } from '@clerk/nextjs/server';
import { getTranslations } from 'next-intl/server';
import { Sponsors } from './Sponsors';

export const Hello = async () => {
  const t = await getTranslations('Dashboard');
  const user = await currentUser();

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Welcome!</h2>
        <p>
          {`👋 `}
          {t('hello_message', { email: user?.primaryEmailAddress?.emailAddress ?? '' })}
        </p>
        <p>
          {t.rich('alternative_message', {
            url: () => (
              <a
                className="btn btn-primary"
                href="https://nextjs-boilerplate.com/pro-saas-starter-kit"
              >
                Next.js Boilerplate SaaS
              </a>
            ),
          })}
        </p>
        <div className="card-actions justify-end">
          <Sponsors />
        </div>
      </div>
    </div>
  );
};
