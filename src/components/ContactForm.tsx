import { useState } from 'react'

type FormState = 'idle' | 'loading' | 'success' | 'error'

export default function ContactForm() {
  const [state, setState] = useState<FormState>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget

    const honey = (form.querySelector<HTMLInputElement>('[name="_honey"]'))?.value
    if (honey) return

    setState('loading')

    const data = Object.fromEntries(new FormData(form))

    try {
      const res = await fetch('https://formsubmit.co/ajax/ronanr2003@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setState('success')
      setMessage("Message sent - I'll get back to you soon.")
      form.reset()
    } catch (err) {
      console.error('Contact form error:', err)
      setState('error')
      setMessage('Something went wrong. Please email me directly at ronanr2003@gmail.com.')
    } finally {
      setTimeout(() => {
        setState('idle')
        setMessage('')
      }, 6000)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* FormSubmit config */}
      <input type="hidden" name="_subject" value="New Portfolio Inquiry" />
      <input type="hidden" name="_captcha" value="true" />
      <input type="hidden" name="_blacklist" value="crypto, casino, bitcoin, forex, SEO, marketing, payout, promotion, backlink" />
      {/* Honeypot */}
      <input type="text" name="_honey" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

      <div>
        <label htmlFor="cf-name" className="block text-sm mb-2" style={{ color: 'var(--muted)' }}>
          Name
        </label>
        <input
          id="cf-name"
          type="text"
          name="name"
          required
          placeholder="Your name"
          className="input-field"
        />
      </div>

      <div>
        <label htmlFor="cf-email" className="block text-sm mb-2" style={{ color: 'var(--muted)' }}>
          Email
        </label>
        <input
          id="cf-email"
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className="input-field"
        />
      </div>

      <div>
        <label htmlFor="cf-type" className="block text-sm mb-2" style={{ color: 'var(--muted)' }}>
          Type
        </label>
        <select id="cf-type" name="type" className="input-field">
          <option>Freelance project</option>
          <option>Job opportunity</option>
          <option>Consultation</option>
          <option>Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="cf-message" className="block text-sm mb-2" style={{ color: 'var(--muted)' }}>
          Message
        </label>
        <textarea
          id="cf-message"
          name="message"
          required
          rows={5}
          placeholder="Tell me about your project or opportunity..."
          className="input-field"
          style={{ resize: 'vertical', minHeight: '130px' }}
        />
      </div>

      <button
        type="submit"
        disabled={state === 'loading'}
        className="btn-primary w-full"
        style={{ opacity: state === 'loading' ? 0.7 : 1, cursor: state === 'loading' ? 'wait' : 'pointer' }}
      >
        {state === 'loading' ? 'Sending...' : 'Send message'}
      </button>

      {message && (
        <p
          className="text-sm text-center py-3 px-4 rounded-xl"
          style={{
            background:
              state === 'success'
                ? 'rgba(52, 211, 153, 0.08)'
                : 'rgba(248, 113, 113, 0.08)',
            color: state === 'success' ? '#34d399' : '#f87171',
            border: `1px solid ${state === 'success' ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)'}`,
          }}
        >
          {message}
        </p>
      )}
    </form>
  )
}
