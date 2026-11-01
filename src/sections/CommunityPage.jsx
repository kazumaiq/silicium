// SILICIUM — Community & Network Node
import React, { useState } from 'react'
import { ARTIST } from '../data/config'
import styles from './CommunityPage.module.css'

export default function CommunityPage() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [message, setMessage] = useState({ name: '', text: '' })
  const [sent, setSent] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email) return
    setSubscribed(true)
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!message.text) return
    setSent(true)
  }

  return (
    <div className={styles.communityContainer}>
      <div className={styles.headerArea}>
        <span className={styles.metaLabel}>// 05 // OCCULT COMMUNION</span>
        <h1 className={styles.pageTitle}>COMMUNITY & NODES</h1>
        <p className={styles.subtitle}>
          Direct connection to the underground frequency network.
        </p>
      </div>

      <div className={styles.grid}>
        {/* Main Telegram Portal Card */}
        <div className={styles.telegramCard}>
          <div className={styles.telegramBadge}>PRIMARY BROADCAST VECTOR</div>
          <h2 className={styles.telegramTitle}>TELEGRAM CHANNEL</h2>
          <p className={styles.telegramDesc}>
            Join the inner circle. Exclusive raw stems, unreleased snippets, dark phonk drops, and esoteric transmissions.
          </p>

          <a
            href={ARTIST.telegram}
            target="_blank"
            rel="noreferrer"
            className={styles.telegramBtn}
          >
            <span>ENTER TELEGRAM ARCHIVE</span>
            <span className={styles.btnArrow}>↗</span>
          </a>

          <div className={styles.terminalOutput}>
            <code>&gt; CONNECT_NODE: t.me/silliciumphonk</code>
            <code>&gt; ENCRYPTION: ACTIVE</code>
            <code>&gt; SIGNAL_INTEGRITY: 100%</code>
          </div>
        </div>

        {/* Transmission Dispatch / Feedback Form */}
        <div className={styles.dispatchBox}>
          <div className={styles.boxHeader}>
            <span>TRANSMIT DISPATCH</span>
            <span className={styles.freqTag}>FREQ // 05.2</span>
          </div>

          {sent ? (
            <div className={styles.successBox}>
              <div className={styles.successIcon}>✓</div>
              <h3>TRANSMISSION ENCRYPTED & SENT</h3>
              <p>Your message has been deposited into the SILICIUM vault.</p>
              <button
                onClick={() => {
                  setSent(false)
                  setMessage({ name: '', text: '' })
                }}
                className={styles.resetBtn}
              >
                TRANSMIT ANOTHER
              </button>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>IDENTITY / CALLSIGN</label>
                <input
                  type="text"
                  placeholder="Anonymous Operator"
                  value={message.name}
                  onChange={(e) => setMessage({ ...message, name: e.target.value })}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>FREQUENCY MESSAGE</label>
                <textarea
                  rows="4"
                  placeholder="Enter your coordinates or message..."
                  value={message.text}
                  onChange={(e) => setMessage({ ...message, text: e.target.value })}
                  className={styles.textarea}
                  required
                />
              </div>

              <button type="submit" className={styles.submitBtn}>
                SEND TO ARCHIVE ↗
              </button>
            </form>
          )}
        </div>

        {/* Newsletter / Frequency Uplink */}
        <div className={styles.newsletterBox}>
          <div className={styles.boxHeader}>
            <span>DIRECT UPLINK</span>
            <span className={styles.freqTag}>SUBSCRIPTION</span>
          </div>

          <p className={styles.newsletterDesc}>
            Subscribe for immediate notices when new spatial artifacts or vinyl releases materialize.
          </p>

          {subscribed ? (
            <div className={styles.subscribedMsg}>
              SIGNAL LOCKED. YOU WILL RECEIVE OCCULT NOTIFICATIONS.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className={styles.subscribeForm}>
              <input
                type="email"
                placeholder="OPERATOR_EMAIL@VOID.NET"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.emailInput}
                required
              />
              <button type="submit" className={styles.subBtn}>
                LOCK IN
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
