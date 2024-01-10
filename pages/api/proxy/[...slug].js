import httpProxy from 'http-proxy'

const proxy = httpProxy.createProxyServer()

export const config = {
  api: {
    bodyParser: false,
  },
}

export default (req, res) => {
  return new Promise((resolve, reject) => {
    try {
      console.log(req.url)
      req.url = req.url.replace('/api/proxy/', '/')
      const urlData = req.url.split('/')
      urlData.shift()
      const host = urlData.shift()
      if (!host) {
        return reject('not success')
      }
      if (!host.includes('.')) {
        return reject('not success')
      }
      req.url = '/' + urlData.join('/')
      proxy.web(req, res, { target: 'https://' + host, changeOrigin: true }, (err) => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    } catch (error) {
      return reject('not Found')
    }
  })
}
