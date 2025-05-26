import { GhostSettings } from '@lib/ghost'
import { getLang, get } from '@utils/use-lang'
import { SubscribeForm } from '@components/SubscribeForm'

export const Subscribe = ({ settings }: { settings: GhostSettings }) => {
  const text = get(getLang(settings.lang))
  const title = text(`SITE_TITLE`, settings.title)

  return (
    <section className="bg-card border rounded-lg p-6">
      <h3 className="text-lg font-bold mb-2">
        {text(`SUBSCRIBE_TO`)} {title}
      </h3>
      <p className="text-sm text-muted-foreground mb-4">{text(`SUBSCRIBE_SECTION`)}</p>
      <SubscribeForm {...{ settings }} />
    </section>
  )
}
