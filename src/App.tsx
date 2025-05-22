import { useEffect, useState } from 'react'
import './App.css'

const phrases = ['Спокойной ночи', 'Я тебя', 'dynamic']

export default function App() {
  const [phase, setPhase] = useState<'clicker' | 'phrases' | 'heart'>('clicker')
  const [count, setCount] = useState(0)
  const [clickPower, setClickPower] = useState(1)
  const [isClicked, setIsClicked] = useState(false)

  const [upgrades, setUpgrades] = useState([
  { id: 1, title: '+1 к клику', cost: 10, value: 1 },
  { id: 2, title: '+5 к клику', cost: 50, value: 5 },
  { id: 3, title: '+10 к клику', cost: 100, value: 10 },
])


  const skins = [
    { id: 1, name: 'Сова', cost: 0, img: 'sova.png' },
    { id: 2, name: 'Burger', cost: 200, img: 'https://cdn-icons-png.flaticon.com/512/1046/1046784.png' },
    { id: 3, name: 'Калл', cost: 100000, img: 'govno.png' },
  ]

  const [ownedSkinIds, setOwnedSkinIds] = useState<number[]>([1])
  const [currentSkin, setCurrentSkin] = useState(skins[0].img)

  const [phraseIndex, setPhraseIndex] = useState(0)
  const [showPhrase, setShowPhrase] = useState(true)
  const [displayedText, setDisplayedText] = useState('')

  const handleClick = () => {
    setCount(prev => prev + clickPower)
    setIsClicked(true)
  };

  useEffect(() => {
    if (isClicked) {
      const timeout = setTimeout(() => setIsClicked(false), 200)
      return () => clearTimeout(timeout)
    }
  }, [isClicked])

  const buyUpgrade = (upgrade: typeof upgrades[0]) => {
  if (count >= upgrade.cost) {
    setCount(count - upgrade.cost)
    setClickPower(prev => prev + upgrade.value)

    setUpgrades((prevUpgrades) =>
      prevUpgrades.map((u) =>
        u.id === upgrade.id
          ? { ...u, cost: Math.floor(u.cost * 1.5) }  // увеличиваем стоимость на 50%
          : u
      )
    )
  }
}


  const buySkin = (skin: typeof skins[0]) => {
    if (ownedSkinIds.includes(skin.id)) {
      setCurrentSkin(skin.img)
    } else if (count >= skin.cost) {
      setCount(count - skin.cost)
      setOwnedSkinIds([...ownedSkinIds, skin.id])
      setCurrentSkin(skin.img)
    }
  }

  const handleFinish = () => {
    setPhase('phrases')
    setPhraseIndex(0)
    setShowPhrase(true)
  }

  useEffect(() => {
  if (phase !== 'phrases') return;

  if (phraseIndex >= phrases.length) {
    const heartTimeout = setTimeout(() => setPhase('heart'), 1500)
    return () => clearTimeout(heartTimeout)
  }

  if (showPhrase) {
    if (phrases[phraseIndex] === 'dynamic') {
      const baseWord = 'очень';
      const repeatCount = Math.max(count, 1); // минимум 1
      const words = Array(repeatCount).fill(baseWord).concat('сильно');

      const totalDuration = 5000; // всего 5 секунд
      const maxUpdates = 50; // максимум обновлений

      // Считаем размер группы слов, которые будем выводить за один шаг
      const groupSize = Math.ceil(words.length / maxUpdates);

      let currentIndex = 0;
      setDisplayedText(''); // сброс текста

      const interval = totalDuration / Math.ceil(words.length / groupSize);

      const intervalId = setInterval(() => {
        currentIndex += groupSize;
        const slice = words.slice(0, currentIndex);
        setDisplayedText(slice.join(' '));

        if (currentIndex >= words.length) {
          clearInterval(intervalId);
          setTimeout(() => setShowPhrase(false), 500);
        }
      }, interval);

      return () => clearInterval(intervalId);
    } else {
      setDisplayedText(phrases[phraseIndex]);
      const timeout = setTimeout(() => setShowPhrase(false), 500);
      return () => clearTimeout(timeout);
    }
  } else {
    const timeout = setTimeout(() => {
      setPhraseIndex(prev => prev + 1);
      setShowPhrase(true);
    }, 500);
    return () => clearTimeout(timeout);
  }
}, [phase, phraseIndex, showPhrase, count]);


  return (
    <div className="app-container">
      {phase === 'clicker' && (
        <div className="clicker-container">
          <p className="click-count">Кликов: {count}</p>
          <p className="click-power">Сила клика: {clickPower}</p>

          <img
      src={currentSkin}
      alt="Кнопка"
      onClick={handleClick}
      style={{ transform: isClicked ? 'scale(0.9)' : 'scale(1)', transition: 'transform 200ms ease' }}
      className={`click-button`} 
    />

          <div className="upgrades">
            <h2>Апгрейды</h2>
            {upgrades.map((upgrade) => (
              <button
                key={upgrade.id}
                onClick={() => buyUpgrade(upgrade)}
                disabled={count < upgrade.cost}
                className={`upgrade-btn ${count >= upgrade.cost ? 'active' : 'disabled'}`}
              >
                {upgrade.title} <br /> {upgrade.cost} кликов
              </button>
            ))}
          </div>

          <div className="skins">
            <h2>Скины</h2>
            <div className="skins-grid">
              {skins.map((skin) => (
                <button
                  key={skin.id}
                  onClick={() => buySkin(skin)}
                  className={`skin-btn ${currentSkin === skin.img ? 'selected' : ''} ${
                    ownedSkinIds.includes(skin.id)
                      ? 'owned'
                      : count >= skin.cost
                      ? 'buyable'
                      : 'not-available'
                  }`}
                  disabled={!ownedSkinIds.includes(skin.id) && count < skin.cost}
                >
                  <div className="skin-img-wrapper">
                    <img src={skin.img} alt={skin.name} className="skin-img" />
                  </div>
                  <span className="skin-label">
                    {skin.name}
                    <br />
                    {ownedSkinIds.includes(skin.id) ? '(Куплено)' : `${skin.cost} кликов`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button className="finish-btn" onClick={handleFinish}>
            Завершить
          </button>
        </div>
      )}

      {phase === 'phrases' && phraseIndex < phrases.length && (
        <div className={`phrase ${showPhrase ? '' : 'hidden'}`}>
          {phrases[phraseIndex] === 'dynamic' ? displayedText : phrases[phraseIndex]}
        </div>
      )}

      {phase === 'heart' && (
        <div className="heart">
          Люблю <br />❤️
        </div>
      )}
    </div>
  )
}
