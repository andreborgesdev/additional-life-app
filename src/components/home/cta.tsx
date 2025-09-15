'use client';

import Link from 'next/link';
import {Button} from '@/src/components/ui/button';
import {Heart, Leaf, Recycle, Users} from 'lucide-react';
import {useTranslation} from 'react-i18next';
import {useSession} from '@/src/app/auth-provider';

export default function Cta() {
  const { t } = useTranslation('common');
  const { session } = useSession();

  return (
    <section className="py-16 bg-green-600 dark:bg-green-800">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">{t('home_cta.title')}</h2>
        <p className="text-green-100 max-w-2xl mx-auto mb-8">{t('home_cta.subtitle')}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
            <Leaf className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-green-700 dark:text-green-200 mb-2">
              {t('home_cta.eco_friendly_title')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{t('home_cta.eco_friendly_text')}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
            <Recycle className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-green-700 dark:text-green-200 mb-2">
              {t('home_cta.circular_economy_title')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t('home_cta.circular_economy_text')}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
            <Users className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-green-700 dark:text-green-200 mb-2">
              {t('home_cta.community_driven_title')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t('home_cta.community_driven_text')}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
            <Heart className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-green-700 dark:text-green-200 mb-2">
              {t('home_cta.generosity_title')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{t('home_cta.generosity_text')}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {session && (
            <Button
              asChild
              size="lg"
              className="bg-white text-green-700 hover:bg-green-50 rounded-full"
            >
              <Link href="/auth/register">{t('home_cta.sign_up_button')}</Link>
            </Button>
          )}

          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white hover:bg-green-700 rounded-full"
          >
            <Link href="/about">{t('home_cta.learn_more_button')}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
