import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import styles from './Home.module.css';
import omikujiTube from '../assets/omikuji_tube.png';
import asanohaBg from '../assets/asanoha-bg.png'; // ⭐️麻の葉背景を読み込み

const Home = () => {
  const [mood, setMood] = useState('');
  const [weather, setWeather] = useState('');
  const [plan, setPlan] = useState('');
  const [note, setNote] = useState('');
  const [templates, setTemplates] = useState(null);
  const [result, setResult] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    fetch('/fortune_templates.json')
      .then(res => res.json())
      .then(data => setTemplates(data))
      .catch(err => console.error('テンプレ読み込み失敗:', err));
  }, []);

  const randomPick = (array) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  const launchConfettiByRank = (rank) => {
    if (rank.includes("大吉") || rank === "中吉") {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#e60033', '#ffffff'],
        scalar: 1.2,
      });
    } else if (rank === "凶" || rank === "大凶") {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#444444', '#888888'],
        scalar: 0.8,
      });
    } else {
      confetti({
        particleCount: 30,
        spread: 40,
        origin: { y: 0.6 },
        colors: ['#cccccc'],
        scalar: 0.7,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!templates) return;

    const fortune = randomPick(templates.fortune);
    const item = randomPick(templates.luckyItems);
    const action = randomPick(templates.luckyActions);
    const comment = randomPick(templates.comments[mood] || ["良い1日になりますように！"]);

    setResult({ fortune, item, action, comment });
    setIsFlipped(true);
    launchConfettiByRank(fortune.rank);
  };

  return (
    <div
      className={styles.container}
      style={{
        backgroundImage: 'url(/asanoha-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <h1 className={styles.title}>おみくじ日記メーカー</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label>気分：</label>
          <select value={mood} onChange={(e) => setMood(e.target.value)} required>
            <option value="">選択してください</option>
            <option value="最高">最高</option>
            <option value="まあまあ">まあまあ</option>
            <option value="イライラ">イライラ</option>
            <option value="不安">不安</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label>天気：</label>
          <select value={weather} onChange={(e) => setWeather(e.target.value)} required>
            <option value="">選択してください</option>
            <option value="晴れ">晴れ</option>
            <option value="曇り">曇り</option>
            <option value="雨">雨</option>
            <option value="雪">雪</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label>今日の予定：</label>
          <input
            type="text"
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            placeholder="例：神社へ初詣"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>一言メモ：</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="日記・感想など自由に"
          />
        </div>

        <button type="submit" className={styles.button}>診断する</button>
      </form>

      <div className={`${styles.flipCard} ${isFlipped ? styles.flipped : ''}`}>
        <div className={styles.flipInner}>
          {/* 表面：おみくじ筒 */}
          <div className={styles.cardFace}>
            <img
              src={omikujiTube}
              alt="おみくじ筒"
              className={styles.omikujiImage}
            />
          </div>

          {/* 裏面：診断結果 */}
          <div className={`${styles.cardFace} ${styles.cardBack}`}>
            {result && (
              <>
                <h2 className={styles.resultText}>🔮 診断結果</h2>
                <p className={styles.resultText}>
                  <strong className={styles.resultTextStrong}>運勢：</strong>
                  {result.fortune.rank} - {result.fortune.message}
                </p>
                <p className={styles.resultText}>
                  <strong className={styles.resultTextStrong}>ラッキーアイテム：</strong>
                  {result.item}
                </p>
                <p className={styles.resultText}>
                  <strong className={styles.resultTextStrong}>ラッキーアクション：</strong>
                  {result.action}
                </p>
                <p className={styles.resultText}>
                  <strong className={styles.resultTextStrong}>応援メッセージ：</strong>
                  {result.comment}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
