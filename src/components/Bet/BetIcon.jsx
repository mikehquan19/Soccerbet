import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFutbol, faFlag, faTablet } from '@fortawesome/free-solid-svg-icons';

export default function BetIcon ({ type }) {
  if (type === "Goals") {
    return <FontAwesomeIcon icon={faFutbol} />
  } else if (type === "Corners") {
    return <FontAwesomeIcon icon={faFlag} />
  } else {
    return <FontAwesomeIcon icon={faTablet} />
  }
}