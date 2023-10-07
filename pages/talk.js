import 'gitalk/dist/gitalk.css'
import Gitalk from 'gitalk'
import { useEffect } from 'react'

export default function Talk() {
  useEffect(() => {
    const gitalk = new Gitalk({
      clientID: 'c19b0c665b26323d8bd2',
      clientSecret: '502fed637828504fb0bedb194dc37ceeb52d1962',
      repo: 'https://github.com/kospot/miniwa-blog.git',
      owner: 'kospot',
      admin: ['kospot'],
      id: location.pathname,
      distractionFreeMode: false,
    })
    gitalk.render('gitalk-container')
  }, [])
  return (
    <>
      <h3>常用工具</h3>
      <div id="gitalk-container"></div>
      <div>
        <div>
          <p className="text-2xl">文本1</p>
        </div>
      </div>
    </>
  )
}
