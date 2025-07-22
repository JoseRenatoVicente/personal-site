import { GhostSettings } from '@lib/ghost'
import { getLang, get } from '@utils/use-lang'
import { LoaderIcon } from '@components/icons/LoaderIcon'
import { TranslationKey } from '@lib/i18n/getTranslation'

export const SubscribeForm = async ({ translation }: { translation: TranslationKey }) => {

  return (
    <form className="space-y-3" data-members-form="subscribe">
      <div>
        <input id="email" name="email" type="email" className="input w-full" data-members-email placeholder={translation(`subscribe.youremail`)} autoComplete="false" />
      </div>
      <button type="submit" className="btn btn-primary w-full py-1">
        {translation(`subscribe.submit`)}
      </button>
      <p className="text-xs text-muted-foreground">{translation(`subscribe.privacy`)}</p>
    </form>
  )
}
