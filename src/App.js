import { useEffect, useRef, useState } from "react";
import "./App.css";
import SingleCard from "./components/SingleCard/SingleCard";

//current problem: cards updates asynchronosly and not in time to check the win or lose state, fix it.

const cardImages = [
  { src: "/img/helmet-1.png", matched: false },
  { src: "/img/potion-1.png", matched: false },
  { src: "/img/ring-1.png", matched: false },
  { src: "/img/scroll-1.png", matched: false },
  { src: "/img/shield-1.png", matched: false },
  { src: "/img/sword-1.png", matched: false },
];

let actionExecuted = false;

function App() {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [timer, setTimer] = useState("00:00:00");
  const [time, setTime] = useState(30);

  //ref to keep track of JS interval
  const Ref = useRef(null);

  //compare choices
  useEffect(() => {
    const compareChoices = () => {
      if (
        choiceOne &&
        choiceTwo &&
        choiceOne.src === choiceTwo.src &&
        choiceOne.id !== choiceTwo.id
      ) {
        // Check if both choices are not null and have the same src but different ids
        // Create new array and change property of selected cards to matched
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    };

    const bothHaveValues = choiceOne && choiceTwo;

    if (bothHaveValues) {
      setDisabled(true);
      compareChoices();
    }
  }, [choiceOne, choiceTwo]);

  //automatically start game
  // useEffect(() => {
  //   shuffleCards();
  // }, []);

  //shuffle cards
  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    setTurns(0);
    resetTimer();
    console.log(cards);
  };

  //handle a choice
  const handleChoice = (card) => {
    if (!disabled && !card.matched) {
      // Only allow flipping if not disabled and card not already matched
      choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
    }
  };

  //reset choices & increase turn
  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prevTurns) => prevTurns + 1);
    setDisabled(false);
  };

  //get remaining time
  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 / 60 / 60) % 24);
    return {
      total,
      hours,
      minutes,
      seconds,
    };
  };

  //start timer function
  const startTimer = (e) => {
    let { total, hours, minutes, seconds } = getTimeRemaining(e);
    if (total >= 0) {
      // update the timer
      // check if less than 10 then we need to
      // add '0' at the beginning of the variable
      setTimer(
        (hours > 9 ? hours : "0" + hours) +
          ":" +
          (minutes > 9 ? minutes : "0" + minutes) +
          ":" +
          (seconds > 9 ? seconds : "0" + seconds)
      );
    } else {
      // Timer has ended, execute action only once
      if (!actionExecuted) {
        actionExecuted = true;
        // Check if all cards have been matched
        const allMatched = cards.every((card) => card.matched);

        console.log(allMatched);
      }
    }
  };

  //clear timer function
  const clearTimer = (e) => {
    // If you adjust it you should also need to
    // adjust the Endtime formula we are about
    // to code next
    setTimer("00:00:10");

    // If you try to remove this line the
    // updating of timer Variable will be
    // after 1000ms or 1sec
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    Ref.current = id;
  };

  //countdown
  const getDeadTime = () => {
    let deadline = new Date();

    // This is where you need to adjust if
    // you entend to add more time
    deadline.setSeconds(deadline.getSeconds() + time);
    return deadline;
  };

  // Another way to call the clearTimer() to start
  // the countdown is via action event from the
  // button first we create function to be called
  // by the button
  const resetTimer = () => {
    clearTimer(getDeadTime());
    actionExecuted = false;
  };

  return (
    <div className="App">
      <h1>Magic Match</h1>
      <h1>Timer: {timer}</h1>
      <button onClick={shuffleCards}>New Game</button>

      <div className="card-grid">
        {cards.map((card) => (
          <SingleCard
            card={card}
            key={card.id}
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
            disabled={disabled}
          />
        ))}
      </div>
      <p>Turns: {turns}</p>
    </div>
  );
}

export default App;
