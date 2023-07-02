const ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 14;
const STRONG_ATTACK_VALUE = 17;
const HEAL_VALUE = 20;

const MODE_ATTACK = "ATTACK";
const MODE_STRONG_ATTACK = "STRONG_ATTACK";

const LOG_EVENT_PLAYER_ATTACK = "Player Attack";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "Player Strong Attack";
const LOG_EVENT_PLAYER_HEAL = "Player Heal";
const LOG_EVENT_MONSTER_ATTACK = "Monster Attack";
const LOG_EVENT_GAME_OVER = "GAME OVER";

function getMaxLifeValue() {
  const enteredValue = prompt("Maximum Life for The Player & Monster.", "100");

  const parsedValue = parseInt(enteredValue);
  if (isNaN(parsedValue) || parsedValue <= 0) {
    throw { message: "Invalid User Input, NOT A NUMBER" };
  }
  return parsedValue;
}

let chosenMaxLife;

try {
  chosenMaxLife = getMaxLifeValue();
} catch (error) {
  console.log(error);
  chosenMaxLife = 100;
  alert("You entered something wrong. Default Value is set to 100!");
}

adjustHealthBars(chosenMaxLife);

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

let battleLog = []; // empty array for passing the logEntry...

function writeToLog(ev, val, monsterHealth, playerHealth) {
  let logEntry = {
    event: ev,
    value: val,
    finalMonsterHealth: monsterHealth,
    finalPlayerHealth: playerHealth,
  };

  switch (ev) {
    case LOG_EVENT_PLAYER_ATTACK:
      logEntry.target = "Monster";
      break;

    case LOG_EVENT_PLAYER_STRONG_ATTACK:
      logEntry = {
        event: ev,
        value: val,
        target: "MONSTER",
        finalmonsterhealth: monsterHealth,
        finalplayerhealth: playerHealth,
      };
      break;

    case LOG_EVENT_MONSTER_ATTACK:
      logEntry = {
        event: ev,
        value: val,
        target: "PLAYER",
        finalmonsterhealth: monsterHealth,
        finalplayerhealth: playerHealth,
      };
      break;

    case LOG_EVENT_PLAYER_HEAL:
      logEntry = {
        event: ev,
        value: val,
        target: "PLAYER",
        finalmonsterhealth: monsterHealth,
        finalplayerhealth: playerHealth,
      };
      break;

    case LOG_EVENT_GAME_OVER:
      logEntry = {
        event: ev,
        value: val,
        finalmonsterhealth: monsterHealth,
        finalplayerhealth: playerHealth,
      };
      break;

    default:
      logEntry = {};
  }
  battleLog.push(logEntry);

  /*
  if (ev === LOG_EVENT_PLAYER_ATTACK) {
    logEntry = {
      event: ev,
      value: val,
      target: "MONSTER",
      finalmonsterhealth: monsterHealth,
      finalplayerhealth: playerHealth,
    };
  } else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK) {
    logEntry = {
      event: ev,
      value: val,
      target: "MONSTER",
      finalmonsterhealth: monsterHealth,
      finalplayerhealth: playerHealth,
    };
  } else if (ev === LOG_EVENT_PLAYER_HEAL) {
    logEntry = {
      event: ev,
      value: val,
      target: "PLAYER",
      finalmonsterhealth: monsterHealth,
      finalplayerhealth: playerHealth,
    };
  } else if (ev === LOG_EVENT_MONSTER_ATTACK) {
    logEntry = {
      event: ev,
      value: val,
      target: "PLAYER",
      finalmonsterhealth: monsterHealth,
      finalplayerhealth: playerHealth,
    };
  } else if (ev === LOG_EVENT_GAME_OVER) {
    logEntry = {
      event: ev,
      value: val,
      finalmonsterhealth: monsterHealth,
      finalplayerhealth: playerHealth,
    };
  }
*/
}

function reset() {
  currentMonsterHealth = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}

function endRound() {
  initialPlayerHealth = currentPlayerHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;
  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );

  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    setPlayerHealth(initialPlayerHealth);
    alert("You would be dead but Bonus Life saved you.");
  }

  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert("You Won!");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "PLAYER WON",
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert("You lost!");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "MONSTER WON",
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
    alert("It is a Draw!");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "MATCH DRAW",
      currentMonsterHealth,
      currentPlayerHealth
    );
  }

  if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
    reset();
  }
}

function healPlayerHandler() {
  let healValue;
  if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
    alert("You can't heal more than your max initial health.");
    healValue = chosenMaxLife - currentPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;
  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound();
}

function attackMonster(mode) {
  const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
  const logEvent =
    mode === MODE_ATTACK
      ? LOG_EVENT_PLAYER_ATTACK
      : LOG_EVENT_PLAYER_STRONG_ATTACK;

  //   if (mode === MODE_ATTACK) {
  //     maxDamage = ATTACK_VALUE;
  //     logEvent = LOG_EVENT_PLAYER_ATTACK;
  //   } else if (mode === MODE_STRONG_ATTACK) {
  //     maxDamage = STRONG_ATTACK_VALUE;
  //     logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
  //   }
  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage;
  writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);
  endRound();
}

function attackHandler() {
  attackMonster(MODE_ATTACK);
}

function strongAttackHandler() {
  attackMonster(MODE_STRONG_ATTACK);
}

function printLogHandler() {
  for (let i = 0; i < 3; i++) {
    console.log("--------------");
  }

  /*
  let j = 0;
  do {
    console.log(j);
    j++;
  } while (j < 3);
  
  let j = 0;

  while (j < 3) {
    console.log("-----------");
    j++;
  }
  */

  /*
  for (let i = 20; i > 0; ) {
    i--;
    console.log(i);
  }
  for (let i = 0; i < battleLog.length; i++) {
    console.log(battleLog[i]);
  }
  */
  let i = 0;
  for (const logEntry of battleLog) {
    // console.log(logEntry);
    console.log(`#${i}`);
    for (const key in logEntry) {
      // console.log(key);
      // console.log(logEntry[key]);

      console.log(`${key} => ${logEntry[key]}`);
    }

    i++;
    console.log(i);
  }
  console.log(battleLog);
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);
