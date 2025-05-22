import { useState, useEffect } from 'react'


type Upgrade = {
  id: number
  title: string
  cost: number
  value: number
}

type Skin = {
  id: number
  name: string
  cost: number
  img: string
}

function App() {
  const [count, setCount] = useState(0)
  const [clickPower, setClickPower] = useState(1)
  const [upgrades, setUpgrades] = useState<Upgrade[]>([
    { id: 1, title: '+1 к клику', cost: 10, value: 1 },
    { id: 2, title: '+5 к клику', cost: 50, value: 5 },
    { id: 3, title: '+10 к клику', cost: 100, value: 10 },
  ])

  const [skins] = useState<Skin[]>([
    {
      id: 1,
      name: 'Сова ',
      cost: 0,
      img: 'sova.png',
    },
    {
      id: 2,
      name: 'Burger',
      cost: 200,
      img: 'https://cdn-icons-png.flaticon.com/512/1046/1046784.png',
    },
    {
      id: 3,
      name: 'Калл',
      cost: 100000,
      img: 'govno.png',
    },
  ])


const [isClicked, setIsClicked] = useState(false)

  const handleClick = () => {
    setCount(count + clickPower)
    setIsClicked(true)
  }

   useEffect(() => {
    if (isClicked) {
      const timeout = setTimeout(() => setIsClicked(false), 200)
      return () => clearTimeout(timeout)
    }
  }, [isClicked])


  const [currentSkin, setCurrentSkin] = useState(skins[0].img)
  const [ownedSkinIds, setOwnedSkinIds] = useState<number[]>([1])

  const buyUpgrade = (upgrade: Upgrade) => {
    if (count >= upgrade.cost) {
      setCount(count - upgrade.cost)
      setClickPower(clickPower + upgrade.value)
      setUpgrades((prev) =>
        prev.map((u) =>
          u.id === upgrade.id
            ? { ...u, cost: Math.ceil(u.cost * 1.5) }
            : u
        )
      )
    }
  }

  const buySkin = (skin: Skin) => {
    if (ownedSkinIds.includes(skin.id)) {
      setCurrentSkin(skin.img)
    } else if (count >= skin.cost) {
      setCount(count - skin.cost)
      setOwnedSkinIds([...ownedSkinIds, skin.id])
      setCurrentSkin(skin.img)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold mb-6 text-center">Кликер</h1>

      {/* Картинка-кнопка с анимацией */}
      <img
  src={currentSkin}
  alt="Кнопка"
  onClick={handleClick}
  style={{
    transform: isClicked ? 'scale(0.9)' : 'scale(1)',
    transition: 'transform 200ms ease',
  }}
  className="w-32 h-32 cursor-pointer" width={200} height={200}
/>


      {/* Счётчик */}
      <p className="mt-4 text-2xl">Кликов: {count}</p>
      <p className="mt-1 text-lg text-gray-400">Сила клика: {clickPower}</p>

      {/* Апгрейды */}
      <div className="mt-8 w-full max-w-xs">
        <h2 className="text-xl font-semibold mb-4 text-center">Апгрейды</h2>
        <div className="space-y-3">
          {upgrades.map((upgrade) => (
            <button
              key={upgrade.id}
              onClick={() => buyUpgrade(upgrade)}
              disabled={count < upgrade.cost}
              className={`w-full py-2 px-4 rounded-xl font-medium transition ${
                count >= upgrade.cost
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-700 cursor-not-allowed'
              }`}
            >
              {upgrade.title} <br /> {upgrade.cost} кликов
            </button>
          ))}
        </div>
      </div>

      {/* Скины */}
      <div className="mt-10 w-full max-w-xs">
        <h2 className="text-xl font-semibold mb-4 text-center">Скины</h2>
        <div className="grid grid-cols-3 gap-4">
          {skins.map((skin) => (
            <button
              key={skin.id}
              onClick={() => buySkin(skin)}
              className={`flex flex-col items-center border rounded-xl p-2 transition ${
                currentSkin === skin.img
                  ? 'border-blue-500'
                  : 'border-gray-700'
              } ${
                ownedSkinIds.includes(skin.id)
                  ? 'bg-gray-800 hover:bg-gray-700'
                  : count >= skin.cost
                    ? 'bg-yellow-600 hover:bg-yellow-700'
                    : 'bg-gray-700 cursor-not-allowed'
              }`}
              disabled={!ownedSkinIds.includes(skin.id) && count < skin.cost}
            >
              <div className="w-32 h-32 overflow-hidden flex items-center justify-center bg-gray-900 rounded">
  <img src={skin.img} className="max-w-full max-h-full object-contain" width={100} height={100}/>
</div>



              <span className="text-sm text-center">
                {skin.name}
                <br />
                {ownedSkinIds.includes(skin.id)
                  ? '(Куплено)'
                  : `${skin.cost} кликов`}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
