// SILICIUM — Community Section (Occult Communion & Network Nodes)
import React, { useState } from 'react'
import { ARTIST } from '../data/config'
import { useStore } from '../data/store'
import SectionHeader from '../components/SectionHeader'
import styles from './CommunityPage.module.css'

export default function CommunityPage() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [message, setMessage] = useState({ name: '', text: '' })
  const [sent, setSent] = useState(false)
  const language = useStore((s) => s.language)

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

  const t = {
    RU: {
      code: '// 05 //',
      tag: 'ТЕМНЫЙ УЗЕЛ СВЯЗИ',
      title: 'СООБЩЕСТВО',
      subtitle: 'Прямое подключение к подпольной сети вещания SILICIUM. Эксклюзивные дропы, неизданные стемы и закрытые частоты.',
      telegramVector: 'ОСНОВНОЙ ВЕКТОР ВЕЩАНИЯ',
      telegramTitle: 'TELEGRAM КАНАЛ',
      telegramDesc: 'Вступайте во внутренний круг. Эксклюзивные треки, сырые семплы, тяжелый 808-дисторшн и закрытые релизы.',
      enterTelegram: 'ВОЙТИ В АРХИВ TELEGRAM',
      vkTitle: 'VK СООБЩЕСТВО',
      vkDesc: 'Официальная группа и карточка артиста в экосистеме VK.',
      openVk: 'ОТКРЫТЬ VK',
      dispatchTitle: 'ПЕРЕДАТЬ ЧАСТОТНЫЙ СИГНАЛ',
      dispatchDesc: 'Прямая форма связи с архивом. Вопросы по коллаборациям, мастерингу и букингу.',
      namePlaceholder: 'ВАШЕ ИМЯ // ПОЗЫВНОЙ',
      msgPlaceholder: 'ТЕКСТ СИГНАЛА...',
      transmitBtn: 'ОТПРАВИТЬ СИГНАЛ',
      signalSent: '✓ СИГНАЛ УСПЕШНО ПРИНЯТ В АРХИВ',
      subscribeTitle: 'РАССЫЛКА НОВЫХ ЧАСТОТ',
      emailPlaceholder: 'ВАШ EMAIL...',
      subBtn: 'ПОДПИСАТЬСЯ',
      subSuccess: '✓ ТЕРМИНАЛ АВТОРИЗОВАН',
    },
    EN: {
      code: '// 05 //',
      tag: 'DARK NETWORK NODE',
      title: 'COMMUNITY',
      subtitle: 'Direct connection to the underground frequency network. Exclusive stem releases, raw snippets and classified drops.',
      telegramVector: 'PRIMARY BROADCAST VECTOR',
      telegramTitle: 'TELEGRAM CHANNEL',
      telegramDesc: 'Join the inner circle. Exclusive raw stems, unreleased snippets, dark phonk drops, and esoteric transmissions.',
      enterTelegram: 'ENTER TELEGRAM ARCHIVE',
      vkTitle: 'VK COMMUNITY',
      vkDesc: 'Official group and artist profile within the VK audio ecosystem.',
      openVk: 'OPEN VK NODE',
      dispatchTitle: 'TRANSMIT FREQUENCY SIGNAL',
      dispatchDesc: 'Direct communication terminal. Collaborations, inquiries, stems and booking requests.',
      namePlaceholder: 'NAME // CALLSIGN',
      msgPlaceholder: 'TRANSMISSION TEXT...',
      transmitBtn: 'TRANSMIT SIGNAL',
      signalSent: '✓ SIGNAL LOGGED INTO ARCHIVE',
      subscribeTitle: 'FREQUENCY DISPATCH SUBSCRIPTION',
      emailPlaceholder: 'ENTER EMAIL ADDRESS...',
      subBtn: 'AUTHORIZE',
      subSuccess: '✓ TERMINAL SUBSCRIBED',
    },
  }[language] || {
    code: '// 05 //',
    tag: 'DARK NETWORK NODE',
    title: 'COMMUNITY',
    subtitle: 'Direct connection to the underground frequency network.',
    telegramVector: 'PRIMARY BROADCAST VECTOR',
    telegramTitle: 'TELEGRAM CHANNEL',
    telegramDesc: 'Join the inner circle. Exclusive raw stems, unreleased snippets, dark phonk drops.',
    enterTelegram: 'ENTER TELEGRAM ARCHIVE',
    vkTitle: 'VK COMMUNITY',
    vkDesc: 'Official group and artist profile within the VK audio ecosystem.',
    openVk: 'OPEN VK NODE',
    dispatchTitle: 'TRANSMIT FREQUENCY SIGNAL',
    dispatchDesc: 'Direct communication terminal.',
    namePlaceholder: 'NAME // CALLSIGN',
    msgPlaceholder: 'TRANSMISSION TEXT...',
    transmitBtn: 'TRANSMIT SIGNAL',
    signalSent: '✓ SIGNAL LOGGED',
    subscribeTitle: 'FREQUENCY DISPATCH SUBSCRIPTION',
    emailPlaceholder: 'ENTER EMAIL ADDRESS...',
    subBtn: 'AUTHORIZE',
    subSuccess: '✓ TERMINAL SUBSCRIBED',
  }

  return (
    <div className={styles.communityContainer}>
      <SectionHeader
        code={t.code}
        tag={t.tag}
        title={t.title}
        subtitle={t.subtitle}
      />

      <div className={styles.grid}>
        {/* Main Telegram Portal Card */}
        <div className={styles.telegramCard}>
          <div className={styles.telegramBadge}>{t.telegramVector}</div>
          <h3 className={styles.telegramTitle}>{t.telegramTitle}</h3>
          <p className={styles.telegramDesc}>{t.telegramDesc}</p>

          <a
            href={ARTIST.telegram}
            target="_blank"
            rel="noreferrer"
            className={styles.telegramBtn}
          >
            <span>{t.enterTelegram}</span>
            <span className={styles.btnArrow}>↗</span>
          </a>

          <div className={styles.terminalOutput}>
            <code>&gt; CONNECT_NODE: t.me/silliciumphonk</code>
            <code>&gt; ENCRYPTION: ACTIVE</code>
            <code>&gt; SIGNAL_INTEGRITY: 100%</code>
          </div>
        </div>

        {/* Transmission Dispatch / Feedback Form */}
        <div className={styles.dispatchCard}>
          <h3 className={styles.dispatchTitle}>{t.dispatchTitle}</h3>
          <p className={styles.dispatchDesc}>{t.dispatchDesc}</p>

          {sent ? (
            <div className={styles.successBox}>
              <span>{t.signalSent}</span>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className={styles.form}>
              <input
                type="text"
                placeholder={t.namePlaceholder}
                value={message.name}
                onChange={(e) => setMessage({ ...message, name: e.target.value })}
                className={styles.inputField}
                required
              />
              <textarea
                placeholder={t.msgPlaceholder}
                value={message.text}
                onChange={(e) => setMessage({ ...message, text: e.target.value })}
                className={styles.textareaField}
                rows={3}
                required
              />
              <button type="submit" className={styles.submitBtn}>
                {t.transmitBtn} →
              </button>
            </form>
          )}

          {/* Secondary Hubs (VK & SoundCloud) */}
          <div className={styles.secondaryHubs}>
            <a
              href={ARTIST.vkGroup}
              target="_blank"
              rel="noreferrer"
              className={styles.subHubCard}
            >
              <div className={styles.subHubMeta}>
                <span className={styles.subHubName}>{t.vkTitle}</span>
                <span className={styles.subHubHandle}>@prod.sillicium</span>
              </div>
              <span className={styles.hubArrow}>↗</span>
            </a>

            <a
              href={ARTIST.soundcloud}
              target="_blank"
              rel="noreferrer"
              className={styles.subHubCard}
            >
              <div className={styles.subHubMeta}>
                <span className={styles.subHubName}>SOUNDCLOUD</span>
                <span className={styles.subHubHandle}>sillic1um</span>
              </div>
              <span className={styles.hubArrow}>↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
