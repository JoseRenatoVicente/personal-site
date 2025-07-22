import { GhostSettings } from '@lib/ghost'
import { getLang, get } from '@utils/use-lang'
import { SubscribeForm } from '@components/SubscribeForm'
import { TranslationKey } from '@lib/i18n/getTranslation';
import { Locale } from '@appConfig';

export const Subscribe = async ({ translation }: { translation: TranslationKey }) => {

  return (
    <section className="rounded-lg border bg-card p-6">
      <h3 className="mb-2 text-lg font-bold">
       {translation('subscribe.title')}
      </h3>
      <p className="mb-4 text-sm text-muted-foreground">{translation('subscribe.description')}</p>
      <SubscribeForm {...{ translation }} />
    </section>
  )
}