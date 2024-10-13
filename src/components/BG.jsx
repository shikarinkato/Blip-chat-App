import React from "react";
import { faRocketchat, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { faComments } from "@fortawesome/free-regular-svg-icons";
import { faMessage } from "@fortawesome/free-regular-svg-icons";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import {
  faCommentSms,
  faComputerMouse,
  faQuoteLeft,
} from "@fortawesome/free-solid-svg-icons";
import { faTelegram } from "@fortawesome/free-brands-svg-icons";
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import { faInstagramSquare } from "@fortawesome/free-brands-svg-icons";
import { faSnapchat } from "@fortawesome/free-brands-svg-icons";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function BG() {
  return (
    <div className=" h-full w-2/3">
      {Array.from({ length: 30 }).map((item, idx) => (
        <div
          style={{ top: "-117px" }}
          className="normal-icons-bg-divs"
          key={idx}
        >
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
      ))}
    </div>
  );
}

export default React.memo(BG);
