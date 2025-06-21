import { GhostSettings } from '@lib/ghost'
import { getLang, get } from '@utils/use-lang'
import { LoaderIcon } from '@components/icons/LoaderIcon'

export const SubscribeForm = ({ settings }: { settings: GhostSettings }) => {
  const text = get(getLang(settings.lang))

  return (
    <form className="space-y-3" data-members-form="subscribe">
      <div>
        <input id="email" name="email" type="email" className="input w-full" data-members-email placeholder={text(`YOUR_EMAIL`)} autoComplete="false" />
      </div>
      <button type="submit" className="btn btn-primary w-full py-1">
        {text(`SUBSCRIBE`)}
      </button>
      <p className="text-xs text-muted-foreground">Nunca compartilharemos seu e-mail. Você pode cancelar a qualquer momento.</p>
    </form>
  )
}
