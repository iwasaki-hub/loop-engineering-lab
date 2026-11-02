import { useEffect, useState } from 'react'
import { getServerHealth } from '../../api/system'

export default function ServerStatus() {
  const [status, setStatus] = useState('loading')
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    getServerHealth(controller.signal)
      .then(() => {
        if (!controller.signal.aborted) setStatus('online')
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus('offline')
      })
    return () => controller.abort()
  }, [attempt])
  function retry() {
    setStatus('loading')
    setAttempt((value) => value + 1)
  }
  return (
    <div className={`server-status ${status}`}>
      <span className="status-light" />
      <span role="status">
        {status === 'loading'
          ? 'APIの接続を確認中'
          : status === 'online'
            ? 'Express APIに接続済み'
            : 'APIに接続できません'}
      </span>
      {status === 'offline' && <button onClick={retry}>再確認</button>}
    </div>
  )
}
