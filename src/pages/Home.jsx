import React, { useState, useEffect } from 'react';
import styles from './Home.module.css';
import omikujiTube from '../assets/omikuji_tube.png';

const Home = () => {
  const [formData, setFormData] = useState({
    mood: '',
    weather: '',
    plan: '',
    note: '',
  });

  const [fortuneData, setFortuneData] = useState(null);
  const [result, setResult] = useState(null);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    fetch('/fortune_templates.json')
      .then((res) => res.json())
      .then((data) => setFortuneData(data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fortuneData) return;

    const randomFromArray = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const fortune = randomFromArray(fortuneData.fortune);
    const luckyItem = randomFromArray(fortuneData.luckyItems);
    const luckyAction = randomFromArray(fortuneData.luckyActions);
    const moodComment = randomFromArray(fortuneData.comments[formData.mood] || []);

    setResult({
      fortune,
      luckyItem,
      luckyAction,
      moodComment,
    });

    setFlipped(true);
  };

  const handleBack = () => {
    setFlipped(false);
    setFormData({
      mood: '',
      weather: '',
      plan: '',
      note: '',
    });
    setResult(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <h1 className={styles.title}>おみくじ日記メーカー</h1>

        <div className={`${styles.flipContainer} ${flipped ? styles.flipped : ''}`}>
          {/* 背景のおみくじ画像 */}
          <img
            src={omikujiTube}
            alt="おみくじ筒"
            className={styles.omikujiBackground}
          />

          <div className={styles.flipper}>
            {/* 表面：フォーム */}
            <div className={styles.front}>
              <form className={styles.form} onSubmit={handleSubmit}>
                <label>
                  気分：
                  <select name="mood" value={formData.mood} onChange={handleChange}>
                    <option value="">選択してください</option>
                    <option value="最高">最高</option>
                    <option value="まあまあ">まあまあ</option>
                    <option value="イライラ">イライラ</option>
                    <option value="不安">不安</option>
                  </select>
                </label>
                <label>
                  天気：
                  <select name="weather" value={formData.weather} onChange={handleChange}>
                    <option value="">選択してください</option>
                    <option value="晴れ">晴れ</option>
                    <option value="曇り">曇り</option>
                    <option value="雨">雨</option>
                    <option value="雪">雪</option>
                  </select>
                </label>
                <label>
                  今日の予定：
                  <input
                    type="text"
                    name="plan"
                    value={formData.plan}
                    onChange={handleChange}
                    placeholder="例：神社へ初詣"
                  />
                </label>
                <label>
                  一言メモ：
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="日記・感想など自由に"
                  />
                </label>
                <button type="submit" disabled={!fortuneData}>診断する</button>
              </form>
            </div>

            {/* 裏面：診断結果 */}
            <div className={styles.back}>
              {result && (
                <div className={styles.resultCard}>
                  <h2>診断結果</h2>
                  <p><strong>今日の運勢：</strong>{result.fortune.rank} - {result.fortune.message}</p>
                  <p><strong>ラッキーアイテム：</strong>{result.luckyItem}</p>
                  <p><strong>ラッキーアクション：</strong>{result.luckyAction}</p>
                  <p><strong>ひとことアドバイス：</strong>{result.moodComment}</p>
                  <button onClick={handleBack}>もう一度診断</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
