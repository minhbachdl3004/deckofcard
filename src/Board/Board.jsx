import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../Card/Card";
import "./style.scss";

const Board = () => {
  const [cards, setCards] = useState([]);
  const [newId, setNewId] = useState("");
  const [deckCards, setDeckCards] = useState(52);
  const [totalPoints, setTotalPoints] = useState(0);
  const [flipCard, setFlipCard] = useState(false);

  useEffect(() => {
    let config = {
      method: "get",
      url: `https://deckofcardsapi.com/api/deck/new/draw/?count=3`,
    };

    const getCardData = async () => {
      try {
        const response = await axios(config);
        setNewId(response.data?.deck_id);
      } catch (error) {
        console.log(error);
      }
    };
    getCardData();
  }, []);

  const handleDrawCard = () => {
    const getRemainingCardData = async () => {
      let config = {
        method: "get",
        url: `https://deckofcardsapi.com/api/deck/${newId}/draw/?count=3`,
      };
      try {
        const response = await axios(config);
        setCards(response.data?.cards);
        setDeckCards(response?.data?.remaining);
        setFlipCard(false);
        setTotalPoints(0);
      } catch (error) {
        console.log(error);
      }
    };
    getRemainingCardData();
  };

  const getTotalPoints = () => {
    let total = cards.reduce((acc, obj) => {
      if (
        obj.value === "KING" ||
        obj.value === "QUEEN" ||
        obj.value === "JACK"
      ) {
        obj.value = 10;
      } else if (obj.value === "ACE") {
        obj.value = 1;
      }
      return acc + Number(obj.value);
    }, 0);
    setTotalPoints(total);
  };

  const handleShuffleCard = () => {
    let config = {
      method: "get",
      url: `https://deckofcardsapi.com/api/deck/${newId}/shuffle/`,
    };

    const shuffleDeckCard = async () => {
      try {
        const response = await axios(config);
        setDeckCards(response?.data?.remaining);
        setFlipCard(false);
        setTotalPoints(0);
      } catch (error) {
        console.log(error);
      }
    };
    shuffleDeckCard();
  };

  const handleFlipCard = () => {
    if (cards.length > 0) {
      setFlipCard(!flipCard);
    }
  };

  const handleReset = () => {
    setCards([]);
    setFlipCard(false);
    handleShuffleCard();
  };

  return (
    <div className="board-container">
      <div className="user-info">
        <div className="user-info-card">
          {cards.length > 0 ? (
            cards.map((card) => (
              <Card key={card?.code} img={card.image} flip={flipCard} />
            ))
          ) : (
            <Card flip={flipCard} />
          )}
        </div>
        <div className="user-info-detail">
          <div className="user-info-coins">Coins: 5000</div>
          <div className="user-info-name">Henry</div>
          <div className="user-info-total-point">
            <span className="user-info-point">
              Point of 3 cards: {totalPoints}
            </span>
          </div>
        </div>
      </div>
      <div className="deck-card-remaining">
        <div className="deck-card-remaining-content">
          <div className="deck-card-total-container">
            <span className="deck-card-total">Deck Cards {deckCards}</span>
          </div>
        </div>
      </div>
      <div className="functional-btns-container">
        <button onClick={handleShuffleCard} className="btn shuffle-btn">
          Shuffle
        </button>
        <button
          onClick={() => {
            handleDrawCard();
          }}
          className="btn draw-btn"
        >
          Draw
        </button>
        <button
          onClick={() => {
            getTotalPoints();
            handleFlipCard();
          }}
          className="btn reveal-btn"
        >
          Reveal
        </button>
        <button onClick={() => handleReset()} className="btn reset-btn">
          Reset
        </button>
      </div>
    </div>
  );
};

export default Board;
