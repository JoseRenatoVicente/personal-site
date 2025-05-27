import { GhostSettings } from '@lib/ghost'
import { getLang, get } from '@utils/use-lang'
import { SubscribeForm } from '@components/SubscribeForm'

export const Subscribe = ({ settings }: { settings: GhostSettings }) => {
  const text = get(getLang(settings.lang))
  const title = text(`SITE_TITLE`, settings.title)

  return (
    <section className="rounded-lg border bg-card p-6">
      <h3 className="mb-2 text-lg font-bold">
        {text(`SUBSCRIBE_TO`)} {title}
      </h3>
      <p className="mb-4 text-sm text-muted-foreground">{text(`SUBSCRIBE_SECTION`)}</p>
      <SubscribeForm {...{ settings }} />
    </section>
  )
}
