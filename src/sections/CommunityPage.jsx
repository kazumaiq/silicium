// SILICIUM — Network Nodes & Community (Martin Garrix Benchmark)
import React, { useState } from 'react'
import { ARTIST } from '../data/config'
import { useStore } from '../data/store'
import SectionHeader from '../components/SectionHeader'
import { useScrollReveal } from '../hooks/useScrollReveal'
import styles from './CommunityPage.module.css'

export default function CommunityPage() {
  const [message, setMessage] = useState({ name: '', text: '' })
  const [sent, setSent] = useState(false)
  const language = useStore((s) => s.language)

  const telegramRef = useScrollReveal({ threshold: 0.1 })
  const dispatchRef = useScrollReveal({ threshold: 0.1 })

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!message.text) return
    setSent(true)
  }

  const t = {
    RU: {
      category: 'УЗЛЫ СВЯЗИ',
      title: 'СООБЩЕСТВО',
      subtitle: 'Прямое подключение к закрытой сети вещания SILICIUM. Эксклюзивные дропы и прямая связь.',
      telegramTitle: 'TELEGRAM КАНАЛ',
      telegramDesc: 'Вступайте во внутренний круг. Эксклюзивные треки, сырые стемы, тяжёлый 808-дисторшн и закрытые релизы.',
      enterTelegram: 'ВОЙТИ В КАНАЛ TELEGRAM ↗',
      dispatchTitle: 'ПЕРЕДАТЬ СИГНАЛ',
      dispatchDesc: 'Прямая форма связи с архивом. Вопросы по коллаборациям, букингу и мастерингу.',
      namePlaceholder: 'ВАШЕ ИМЯ // ПОЗЫВНОЙ',
      msgPlaceholder: 'ТЕКСТ СИГНАЛА...',
      transmitBtn: 'ОТПРАВИТЬ СИГНАЛ',
      signalSent: '✓ СИГНАЛ УСПЕШНО ПРИНЯТ В АРХИВ',
    },
    EN: {
      category: 'NETWORK NODES',
      title: 'COMMUNITY',
      subtitle: 'Direct connection to the underground frequency network. Exclusive stem releases & transmission.',
      telegramTitle: 'TELEGRAM CHANNEL',
      telegramDesc: 'Join the inner circle. Exclusive raw stems, unreleased snippets, dark phonk drops, and direct transmissions.',
      enterTelegram: 'ENTER TELEGRAM CHANNEL ↗',
      dispatchTitle: 'TRANSMIT SIGNAL',
      dispatchDesc: 'Direct communication terminal for collaborations, booking requests, and inquiries.',
      namePlaceholder: 'NAME // CALLSIGN',
      msgPlaceholder: 'TRANSMISSION TEXT...',
      transmitBtn: 'TRANSMIT SIGNAL',
      signalSent: '✓ SIGNAL LOGGED INTO ARCHIVE',
    },
  }[language] || {
    category: 'NETWORK NODES',
    title: 'COMMUNITY',
    subtitle: 'Direct connection to the SILICIUM frequency network.',
    telegramTitle: 'TELEGRAM CHANNEL',
    telegramDesc: 'Join the inner circle.',
    enterTelegram: 'ENTER TELEGRAM ↗',
    dispatchTitle: 'TRANSMIT SIGNAL',
    dispatchDesc: 'Direct communication terminal.',
    namePlaceholder: 'NAME',
    msgPlaceholder: 'MESSAGE...',
    transmitBtn: 'TRANSMIT',
    signalSent: '✓ SIGNAL LOGGED',
  }

  return (
    <div className={styles.communityContainer}>
      <SectionHeader
        category={t.category}
        title={t.title}
        subtitle={t.subtitle}
        watermark="NETWORK"
      />

      <div className={styles.gridColumns}>
        {/* Monolithic Telegram Portal */}
        <div ref={telegramRef} className={styles.telegramColumn}>
          <div className={styles.portalInner}>
            <span className={styles.channelLabel}>PRIMARY BROADCAST VECTOR</span>
            <h3 className={styles.portalTitle}>{t.telegramTitle}</h3>
            <p className={styles.portalDesc}>{t.telegramDesc}</p>

            <a
              href={ARTIST.telegram}
              target="_blank"
              rel="noreferrer"
              className={styles.telegramActionBtn}
            >
              {t.enterTelegram}
            </a>

            <div className={styles.streamingNodesRow}>
              <a
                href={ARTIST.soundcloud}
                target="_blank"
                rel="noreferrer"
                className={styles.nodeLink}
              >
                <span>SOUNDCLOUD</span>
                <span className={styles.nodeArrow}>↗</span>
              </a>
              <a
                href={ARTIST.spotify}
                target="_blank"
                rel="noreferrer"
                className={styles.nodeLink}
              >
                <span>SPOTIFY</span>
                <span className={styles.nodeArrow}>↗</span>
              </a>
              <a
                href={ARTIST.vkGroup}
                target="_blank"
                rel="noreferrer"
                className={styles.nodeLink}
              >
                <span>VK COMMUNITY</span>
                <span className={styles.nodeArrow}>↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* Clean Transmission Dispatch Form */}
        <div ref={dispatchRef} className={styles.formColumn}>
          <div className={styles.formHeader}>
            <h3 className={styles.dispatchHeading}>{t.dispatchTitle}</h3>
            <p className={styles.dispatchSubtitle}>{t.dispatchDesc}</p>
          </div>

          {sent ? (
            <div className={styles.sentBox}>
              <span>{t.signalSent}</span>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className={styles.contactForm}>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  placeholder={t.namePlaceholder}
                  value={message.name}
                  onChange={(e) => setMessage({ ...message, name: e.target.value })}
                  className={styles.cleanInput}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <textarea
                  placeholder={t.msgPlaceholder}
                  value={message.text}
                  onChange={(e) => setMessage({ ...message, text: e.target.value })}
                  className={styles.cleanTextarea}
                  rows={4}
                  required
                />
              </div>

              <button type="submit" className={styles.sendButton}>
                <span>{t.transmitBtn}</span>
                <span className={styles.arrowIcon}>→</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
