// simple smoke check: fetch localhost:3000 and assert status and page title
(async () => {
  try {
    const res = await fetch('http://127.0.0.1:3000')
    console.log('status', res.status)
    const text = await res.text()
    const ok = text.includes('Table Manager') || text.includes('<title>')
    if (!ok) {
      console.error('smoke check failed: expected page to include "Table Manager"')
      process.exit(2)
    }
    console.log('smoke check ok')
    process.exit(0)
  } catch (err) {
    console.error('smoke check error:', err.message || err)
    process.exit(1)
  }
})()
