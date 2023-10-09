import Script from 'next/script'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Talk() {
  const router = useRouter()
  const { edit } = router.query
  useEffect(() => {
    setTimeout(() => {
      window.Discuss.init({
        el: '#Discuss-Comments-Admin',
        enable: true,
        // unpkg
        emotCDN: 'https://unpkg.com/discuss@1.2.3',
        serverURLs: 'https://discuss.miniwa.site',
      })
    }, 500)
  }, [])
  return (
    <>
      <Script type="text/javascript" src="/static/scripts/discuss.js" />
      <Script type="text/javascript" src="/static/scripts/discuss.admin.js" />
      <div className={edit ? 'discuss-edit' : 'discuss-view'}>
        <h3 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-4xl md:leading-14">
          分享
        </h3>
        <div id="Discuss-Comments-Admin"></div>
      </div>
    </>
  )
}
