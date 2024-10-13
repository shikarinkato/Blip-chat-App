import {
  faDiscord,
  faInstagramSquare,
  faRocketchat,
  faSnapchat,
  faTelegram,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import {
  faComment,
  faComments,
  faImage,
  faMessage,
} from "@fortawesome/free-regular-svg-icons";
import {
  faArrowUpFromBracket,
  faCommentSms,
  faComputerMouse,
  faQuoteLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

function MovingBG() {
  return (
    <div className="icons-background ">
      {Array.from({ length: 30 }).map((item, idx) => {
        return (
          <div className="icons-bg-divs" key={idx}>
            <div>
              <FontAwesomeIcon icon={faRocketchat} />
              <FontAwesomeIcon icon={faDiscord} />
              <FontAwesomeIcon icon={faComment} />
              <FontAwesomeIcon icon={faMessage} />
              <FontAwesomeIcon icon={faWhatsapp} />
              <FontAwesomeIcon icon={faImage} />
              <FontAwesomeIcon icon={faTelegram} />
              <FontAwesomeIcon icon={faArrowUpFromBracket} />
              <FontAwesomeIcon icon={faCommentSms} />
              <FontAwesomeIcon icon={faInstagramSquare} />
              <FontAwesomeIcon icon={faQuoteLeft} />
              <FontAwesomeIcon icon={faComputerMouse} />
              <FontAwesomeIcon icon={faComments} />
              <FontAwesomeIcon icon={faSnapchat} />
              <FontAwesomeIcon icon={faImage} />
              <FontAwesomeIcon icon={faCommentSms} />
              <FontAwesomeIcon icon={faTelegram} />
              <FontAwesomeIcon icon={faRocketchat} />
              <FontAwesomeIcon icon={faInstagramSquare} />
              <FontAwesomeIcon icon={faQuoteLeft} />
              <FontAwesomeIcon icon={faComputerMouse} />
              <FontAwesomeIcon icon={faComment} />
              <FontAwesomeIcon icon={faMessage} />
              <FontAwesomeIcon icon={faWhatsapp} />
              <FontAwesomeIcon icon={faDiscord} />
              <FontAwesomeIcon icon={faComment} />
              <FontAwesomeIcon icon={faMessage} />
              <FontAwesomeIcon icon={faWhatsapp} />
              <FontAwesomeIcon icon={faImage} />
              <FontAwesomeIcon icon={faTelegram} />
              <FontAwesomeIcon icon={faArrowUpFromBracket} />
              <FontAwesomeIcon icon={faCommentSms} />
              <FontAwesomeIcon icon={faInstagramSquare} />
              <FontAwesomeIcon icon={faQuoteLeft} />
              <FontAwesomeIcon icon={faImage} />
              <FontAwesomeIcon icon={faTelegram} />
              <FontAwesomeIcon icon={faArrowUpFromBracket} />
              <FontAwesomeIcon icon={faCommentSms} />
              <FontAwesomeIcon icon={faInstagramSquare} />
              <FontAwesomeIcon icon={faQuoteLeft} />
              <FontAwesomeIcon icon={faComputerMouse} />
              <FontAwesomeIcon icon={faComments} />
              <FontAwesomeIcon icon={faSnapchat} />
              <FontAwesomeIcon icon={faImage} />
              <FontAwesomeIcon icon={faCommentSms} />
              <FontAwesomeIcon icon={faTelegram} />
              <FontAwesomeIcon icon={faRocketchat} />
              <FontAwesomeIcon icon={faInstagramSquare} />
              <FontAwesomeIcon icon={faQuoteLeft} />
              <FontAwesomeIcon icon={faComputerMouse} />
              <FontAwesomeIcon icon={faComment} />
              <FontAwesomeIcon icon={faMessage} />
              <FontAwesomeIcon icon={faWhatsapp} />
              <FontAwesomeIcon icon={faDiscord} />
              <FontAwesomeIcon icon={faComment} />
              <FontAwesomeIcon icon={faMessage} />
              <FontAwesomeIcon icon={faWhatsapp} />
              <FontAwesomeIcon icon={faComment} />
              <FontAwesomeIcon icon={faMessage} />
              <FontAwesomeIcon icon={faWhatsapp} />
              <FontAwesomeIcon icon={faImage} />
              <FontAwesomeIcon icon={faTelegram} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MovingBG;
