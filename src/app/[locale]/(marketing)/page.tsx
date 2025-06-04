import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/libs/i18nNavigation';

type IIndexProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: IIndexProps) {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'Index',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function Index(props: IIndexProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'Index',
  });

  return (
    <>
      {/* <p>
        {`Follow `}
        <a
          className="text-blue-700 hover:border-b-2 hover:border-blue-700"
          href="https://twitter.com/ixartz"
          target="_blank"
          rel="noreferrer noopener"
        >
          @Ixartz on Twitter
        </a>
        {` for updates and more information about the boilerplate.`}
      </p> */}
      <h2 className="mt-5 text-2xl font-bold">
        {t('meta_title')}
      </h2>
      <p className="text-base">

        {' '}
        <span role="img" aria-label="zap">
          🚨
          {t('meta_description')}
          🚨
        </span>
      </p>
      <div className="mt-6 text-center">
        <Link
          href="/sign-in"
          className="inline-block rounded bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-md hover:bg-blue-700 transition-colors"
        >
          {t('get_started_button')}
        </Link>
      </div>
    </>
  );
};
