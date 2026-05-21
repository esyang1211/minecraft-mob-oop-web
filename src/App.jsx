import { useEffect, useState } from "react";
import "./App.css";

class Mob {
  constructor(name, hp, damage, type, icon) {
    this.name = name;
    this.hp = hp;
    this.damage = damage;
    this.type = type;
    this.icon = icon;
  }

  attack(target) {
    return `${this.name} attacks ${target}.`;
  }

  introduce() {
    return `${this.name} | HP: ${this.hp} | Damage: ${this.damage}`;
  }
}

class PassiveMob extends Mob {
  attack(target) {
    return `${this.name} is passive, so it does not attack ${target}.`;
  }

  introduce() {
    return `${this.name} | HP: ${this.hp} | Damage: ${this.damage} | Type: Passive`;
  }
}

class NeutralMob extends Mob {
  constructor(name, hp, damage, type, icon) {
    super(name, hp, damage, type, icon);
    this.angry = false;
  }

  getAttacked() {
    this.angry = true;
    return `${this.name} has been attacked and is now angry!`;
  }

  attack(target, angry) {
    if (angry) {
      return `${this.name} attacks ${target} because it is angry! -${this.damage} HP`;
    }

    return `${this.name} is neutral, so it does not attack ${target} first.`;
  }

  introduce(angry) {
    const state = angry ? "Angry" : "Calm";
    return `${this.name} | HP: ${this.hp} | Damage: ${this.damage} | State: ${state}`;
  }
}

class HostileMob extends Mob {
  attack(target) {
    return `${this.name} attacks ${target}! -${this.damage} HP`;
  }

  introduce() {
    return `${this.name} | HP: ${this.hp} | Damage: ${this.damage} | Type: Hostile`;
  }
}

class BossMob extends Mob {
  attack(target) {
    return `${this.name} uses a powerful boss attack on ${target}! -${this.damage} HP`;
  }

  introduce() {
    return `${this.name} | HP: ${this.hp} | Damage: ${this.damage} | Type: Boss`;
  }
}

const player = {
  name: "Steve",
  hp: 20,
  type: "Player Object",
};

const mobs = [
  new PassiveMob("Pig", 10, 0, "PassiveMob", "/mob-icons/publicmob-iconspig.png"),
  new PassiveMob("Sheep", 8, 0, "PassiveMob", "/mob-icons/publicmob-iconssheep.png"),
  new PassiveMob("Cow", 10, 0, "PassiveMob", "/mob-icons/publicmob-iconscow.png"),
  new PassiveMob("Chicken", 4, 0, "PassiveMob", "/mob-icons/publicmob-iconschicken.png"),

  new NeutralMob("Spider", 16, 3, "NeutralMob", "/mob-icons/publicmob-iconsspider.png"),
  new NeutralMob("Wolf", 20, 4, "NeutralMob", "/mob-icons/publicmob-iconswolf.png"),
  new NeutralMob("Enderman", 40, 7, "NeutralMob", "/mob-icons/publicmob-iconsenderman.png"),
  new NeutralMob("Iron Golem", 100, 15, "NeutralMob", "/mob-icons/publicmob-iconsiron-golem.png"),

  new HostileMob("Zombie", 20, 3, "HostileMob", "/mob-icons/publicmob-iconszombie.png"),
  new HostileMob("Skeleton", 20, 4, "HostileMob", "/mob-icons/publicmob-iconsskeleton.png"),
  new HostileMob("Creeper", 20, 10, "HostileMob", "/mob-icons/publicmob-iconscreeper.png"),

  new BossMob("Ender Dragon", 200, 20, "BossMob", "/mob-icons/publicmob-iconsender-dragon.png"),
  new BossMob("Wither", 300, 25, "BossMob", "/mob-icons/publicmob-iconswither.png"),
];

const instanceShowcase = [
  new PassiveMob("Pig", 10, 0, "PassiveMob", "/mob-icons/publicmob-iconspig.png"),
  new NeutralMob("Spider", 16, 3, "NeutralMob", "/mob-icons/publicmob-iconsspider.png"),
  new HostileMob("Zombie", 20, 3, "HostileMob", "/mob-icons/publicmob-iconszombie.png"),
  new BossMob("Ender Dragon", 200, 20, "BossMob", "/mob-icons/publicmob-iconsender-dragon.png"),
];

function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedMob, setSelectedMob] = useState(null);
  const [detailMob, setDetailMob] = useState(null);
  const [message, setMessage] = useState(
    "몹 카드를 클릭하면 오버라이딩된 attack() 메서드 결과가 출력됩니다."
  );
  const [angryMobs, setAngryMobs] = useState([]);
  const [filterType, setFilterType] = useState("All");

  const isAngry = (mobName) => angryMobs.includes(mobName);

  const getInheritancePath = (mob) => {
    if (!mob) return "";

    if (mob.type === "PassiveMob") {
      return "MobADT → Mob → PassiveMob";
    }

    if (mob.type === "NeutralMob") {
      return "MobADT → Mob → NeutralMob";
    }

    if (mob.type === "HostileMob") {
      return "MobADT → Mob → HostileMob";
    }

    if (mob.type === "BossMob") {
      return "MobADT → Mob → BossMob";
    }

    return "MobADT → Mob";
  };

  const getMobFeature = (mob) => {
    if (!mob) return "";

    if (mob.type === "PassiveMob") {
      return "비공격적 몹으로, attack()을 호출해도 플레이어를 공격하지 않습니다.";
    }

    if (mob.type === "NeutralMob") {
      return "중립적 몹으로, Calm 상태에서는 먼저 공격하지 않고 Steve가 공격하면 Angry 상태가 됩니다.";
    }

    if (mob.type === "HostileMob") {
      return "공격적 몹으로, attack() 호출 시 바로 플레이어를 공격합니다.";
    }

    if (mob.type === "BossMob") {
      return "보스 몹으로, 일반 몹보다 높은 체력과 강한 공격력을 가집니다.";
    }

    return "Mob 클래스의 기본 특징을 가집니다.";
  };

  const handleMobClick = (mob) => {
    setSelectedMob(mob);
    setDetailMob(mob);

    if (mob instanceof NeutralMob) {
      setMessage(mob.attack(player.name, isAngry(mob.name)));
    } else {
      setMessage(mob.attack(player.name));
    }
  };

  const handleSteveAttack = (event, mob) => {
    event.stopPropagation();

    if (!angryMobs.includes(mob.name)) {
      setAngryMobs([...angryMobs, mob.name]);
    }

    setSelectedMob(mob);
    setDetailMob(mob);
    setMessage(mob.getAttacked());
  };

  const handleCalmDown = () => {
    setAngryMobs([]);
    setSelectedMob(null);
    setDetailMob(null);
    setMessage("모든 NeutralMob의 angry 상태를 Calm으로 초기화했습니다.");
  };

  const getInstanceDetail = (mob) => {
    if (mob instanceof NeutralMob) {
      return mob.introduce(false);
    }

    return mob.introduce();
  };

  const filteredMobs =
    filterType === "All" ? mobs : mobs.filter((mob) => mob.type === filterType);

  const slides = [
    {
      title: "Minecraft",
      content: (
        <section className="cover-section">
          <img
            className="minecraft-logo"
            src="/minecraft-logo.png"
            alt="Minecraft logo"
          />

          <p className="cover-guide">
            버튼 또는 키보드 방향키로 슬라이드를 넘길 수 있습니다.
          </p>
        </section>
      ),
    },
    {
      title: "1. 상속 구조 시각화",
      content: (
        <section className="section slide-section">
          <h2>1. 상속 구조 시각화</h2>

          <p className="structure-note">
            아래 구조는 예시 PPT 형식에 맞춰{" "}
            <strong>ADT Class → Base Class → Instances</strong> 흐름으로
            표현했습니다.
          </p>

          <div className="uml-area">
            <div className="adt-box">
              <div className="box-badge adt-badge">ADT</div>
              <h3>MOB ADT CLASS</h3>
              <ul>
                <li>Abstract Property: name</li>
                <li>Abstract Property: hp</li>
                <li>Abstract Property: damage</li>
                <li>Abstract Method: attack(target)</li>
                <li>Abstract Method: introduce()</li>
              </ul>
            </div>

            <div className="inherit-arrow">△</div>

            <div className="base-box">
              <div className="box-badge class-badge">CLASS</div>
              <h3>MOB BASE CLASS (Implementation)</h3>
              <ul>
                <li>self.name</li>
                <li>self.hp</li>
                <li>self.damage</li>
                <li>attack(target) (implemented)</li>
                <li>introduce() (implemented)</li>
                <li>Subclasses: Passive / Neutral / Hostile / Boss</li>
              </ul>
            </div>

            <div className="instance-flow-area">
              <div className="instance-top-label">instance-of</div>

              <svg
                className="instance-arrow-svg"
                viewBox="0 0 1000 120"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <marker
                    id="arrow-passive"
                    markerWidth="10"
                    markerHeight="10"
                    refX="9"
                    refY="5"
                    orient="auto"
                    markerUnits="userSpaceOnUse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#15803d" />
                  </marker>

                  <marker
                    id="arrow-neutral"
                    markerWidth="10"
                    markerHeight="10"
                    refX="9"
                    refY="5"
                    orient="auto"
                    markerUnits="userSpaceOnUse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#a16207" />
                  </marker>

                  <marker
                    id="arrow-hostile"
                    markerWidth="10"
                    markerHeight="10"
                    refX="9"
                    refY="5"
                    orient="auto"
                    markerUnits="userSpaceOnUse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#b91c1c" />
                  </marker>

                  <marker
                    id="arrow-boss"
                    markerWidth="10"
                    markerHeight="10"
                    refX="9"
                    refY="5"
                    orient="auto"
                    markerUnits="userSpaceOnUse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#6d28d9" />
                  </marker>
                </defs>

                <path
                  className="branch-line trunk-line"
                  d="M 500 5 L 500 25"
                />

                <path
                  className="branch-line main-branch-line"
                  d="M 125 25 L 875 25"
                />

                <path
                  className="branch-line passive-line"
                  d="M 125 25 L 125 100"
                  markerEnd="url(#arrow-passive)"
                />

                <path
                  className="branch-line neutral-line"
                  d="M 375 25 L 375 100"
                  markerEnd="url(#arrow-neutral)"
                />

                <path
                  className="branch-line hostile-line"
                  d="M 625 25 L 625 100"
                  markerEnd="url(#arrow-hostile)"
                />

                <path
                  className="branch-line boss-line"
                  d="M 875 25 L 875 100"
                  markerEnd="url(#arrow-boss)"
                />
              </svg>

              <div className="instance-grid">
                {instanceShowcase.map((mob) => (
                  <div
                    key={mob.name}
                    className={`instance-card ${mob.type.toLowerCase()}`}
                  >
                    <div className="instance-circle">
                      <img className="mob-face-image" src={mob.icon} alt="" />
                    </div>

                    <div className="instance-self">self</div>
                    <h4>{mob.name}</h4>
                    <p className="instance-type">{mob.type}</p>
                    <p className="instance-detail">{getInstanceDetail(mob)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="player-side-note">
              <strong>Player Object:</strong> {player.name} / HP: {player.hp}
              <br />
              <span>
                Player는 Mob 상속 구조에 포함되지 않고, Mob들과 상호작용하는
                별도 객체입니다.
              </span>
            </div>
          </div>
        </section>
      ),
    },
    {
      title: "2. 다형성 인터랙션",
      content: (
        <section className="section slide-section">
          <h2>2. 다형성 인터랙션</h2>

          <p className="description">
            모든 몹 카드는 동일하게 attack() 메서드를 호출하지만, 실제 실행
            결과는 객체의 클래스와 상태에 따라 다르게 나타납니다.
          </p>

          <div className="player-status">
            <strong>Player Object:</strong> {player.name} / HP: {player.hp}
          </div>

          <div className="ux-panel">
            <div className="filter-box">
              <span className="filter-title">Mob Filter</span>

              <button
                className={filterType === "All" ? "filter-active" : ""}
                onClick={() => setFilterType("All")}
              >
                전체
              </button>

              <button
                className={filterType === "PassiveMob" ? "filter-active" : ""}
                onClick={() => setFilterType("PassiveMob")}
              >
                Passive
              </button>

              <button
                className={filterType === "NeutralMob" ? "filter-active" : ""}
                onClick={() => setFilterType("NeutralMob")}
              >
                Neutral
              </button>

              <button
                className={filterType === "HostileMob" ? "filter-active" : ""}
                onClick={() => setFilterType("HostileMob")}
              >
                Hostile
              </button>

              <button
                className={filterType === "BossMob" ? "filter-active" : ""}
                onClick={() => setFilterType("BossMob")}
              >
                Boss
              </button>
            </div>

            <button className="reset-button" onClick={handleCalmDown}>
              NeutralMob 상태 초기화
            </button>
          </div>

          <div className="selected-guide">
            {selectedMob ? (
              <>
                현재 선택된 객체: <strong>{selectedMob.name}</strong> /{" "}
                <strong>{selectedMob.type}</strong>
              </>
            ) : (
              "몹 카드를 클릭하면 선택한 객체가 강조 표시되고 상세 정보가 나타납니다."
            )}
          </div>

          <div className="mob-grid">
            {filteredMobs.map((mob) => (
              <div
                key={mob.name}
                className={`mob-card ${mob.type.toLowerCase()} ${
                  selectedMob && selectedMob.name === mob.name
                    ? "selected-card"
                    : ""
                }`}
                onClick={() => handleMobClick(mob)}
              >
                <div className="mob-icon">
                  <img className="mob-face-image" src={mob.icon} alt="" />
                </div>

                <h3>{mob.name}</h3>
                <p>{mob.type}</p>
                <span>HP: {mob.hp}</span>
                <span>Damage: {mob.damage}</span>

                {mob instanceof NeutralMob && (
                  <>
                    <span
                      className={
                        isAngry(mob.name) ? "state-angry" : "state-calm"
                      }
                    >
                      State: {isAngry(mob.name) ? "Angry" : "Calm"}
                    </span>

                    <button
                      className="steve-attack-button"
                      onClick={(event) => handleSteveAttack(event, mob)}
                    >
                      Steve가 공격하기
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>
      ),
    },
    {
      title: "3. 실행 결과",
      content: (
        <section className="result-section slide-section">
          <h2>3. 실행 결과</h2>

          {selectedMob && (
            <div className="result-mob-preview">
              <img className="result-mob-image" src={selectedMob.icon} alt="" />

              <p className="selected">
                선택한 몹: <strong>{selectedMob.name}</strong> / 클래스:{" "}
                <strong>{selectedMob.type}</strong>
              </p>
            </div>
          )}

          <div className="result-box">{message}</div>

          <div className="result-button-area">
            <button
              className="back-to-mobs-button"
              onClick={() => setCurrentSlide(2)}
            >
              다시 몹 선택하기
            </button>
          </div>

          <p className="result-help">
            이전 페이지에서 몹 카드를 클릭한 뒤 이 페이지로 오면 결과를 확인할
            수 있습니다.
          </p>
        </section>
      ),
    },
  ];

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (detailMob) {
        if (event.key === "Escape") {
          setDetailMob(null);
        }
        return;
      }

      if (event.key === "ArrowRight") {
        setCurrentSlide((prev) =>
          prev < slides.length - 1 ? prev + 1 : prev
        );
      }

      if (event.key === "ArrowLeft") {
        setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [detailMob, slides.length]);

  const goPrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  return (
    <div className="app">
      {currentSlide !== 0 && (
        <header className="header">
          <h1>Minecraft Mob OOP Visualizer</h1>
          <p>
            과제 1에서 구현한 Minecraft Mob OOP 구조를 웹 화면에 시각화하고, 각
            몹을 클릭하면 다형성에 의해 서로 다른 attack() 결과가 출력됩니다.
          </p>
        </header>
      )}

      <main className="slide-wrapper">{slides[currentSlide].content}</main>

      <div className="slide-progress">
        {slides.map((slide, index) => (
          <button
            key={slide.title}
            className={
              currentSlide === index
                ? "progress-dot active-dot"
                : "progress-dot"
            }
            onClick={() => setCurrentSlide(index)}
            aria-label={`${index + 1}번 슬라이드로 이동`}
          ></button>
        ))}
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`,
          }}
        ></div>
      </div>

      <div className="slide-controls">
        <button onClick={goPrev} disabled={currentSlide === 0}>
          ◀ 이전
        </button>

        <span>
          {currentSlide + 1} / {slides.length}
        </span>

        <button
          onClick={goNext}
          disabled={currentSlide === slides.length - 1}
        >
          다음 ▶
        </button>
      </div>

      <p className="keyboard-guide">키보드 ← → 방향키로도 이동할 수 있습니다.</p>

      {detailMob && (
        <div className="modal-backdrop" onClick={() => setDetailMob(null)}>
          <div className="mob-modal" onClick={(event) => event.stopPropagation()}>
            <button
              className="modal-close-button"
              onClick={() => setDetailMob(null)}
            >
              ×
            </button>

            <div className={`modal-icon-box ${detailMob.type.toLowerCase()}`}>
              <img className="modal-mob-image" src={detailMob.icon} alt="" />
            </div>

            <h2>{detailMob.name}</h2>
            <p className="modal-type">{detailMob.type}</p>

            <div className="modal-info-grid">
              <div>
                <span>HP</span>
                <strong>{detailMob.hp}</strong>
              </div>

              <div>
                <span>Damage</span>
                <strong>{detailMob.damage}</strong>
              </div>

              <div>
                <span>Target</span>
                <strong>{player.name}</strong>
              </div>

              <div>
                <span>State</span>
                <strong>
                  {detailMob instanceof NeutralMob
                    ? isAngry(detailMob.name)
                      ? "Angry"
                      : "Calm"
                    : "-"}
                </strong>
              </div>
            </div>

            <div className="modal-description">
              <p>
                <strong>상속 관계:</strong> {getInheritancePath(detailMob)}
              </p>

              <p>
                <strong>특징:</strong> {getMobFeature(detailMob)}
              </p>

              <p>
                <strong>실행 결과:</strong>{" "}
                {detailMob instanceof NeutralMob
                  ? detailMob.attack(player.name, isAngry(detailMob.name))
                  : detailMob.attack(player.name)}
              </p>
            </div>

            <div className="modal-button-row">
              <button
                className="modal-result-button"
                onClick={() => {
                  setDetailMob(null);
                  setCurrentSlide(3);
                }}
              >
                실행 결과 보러가기
              </button>

              <button
                className="modal-cancel-button"
                onClick={() => setDetailMob(null)}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;