// AbortSignal.timeout 需要 Chrome 103+ / Safari 16。老浏览器上直接调用会抛
// TypeError，被 fetch 外层的 catch 吞掉后只会显示一句「网络出错」，错得不明不白。
// 这里退回 AbortController + setTimeout，行为一致。
export function timeoutSignal(ms) {
  if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') {
    return AbortSignal.timeout(ms)
  }
  const controller = new AbortController()
  setTimeout(() => controller.abort(), ms)
  return controller.signal
}
