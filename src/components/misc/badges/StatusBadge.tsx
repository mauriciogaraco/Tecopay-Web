import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { translateOrderState } from "../../../utils/translate";
import {
  faClose,
  faCheck,
  faHourglassStart,
  faReplyAll,
  faTicket,
  faUsd,
  faCancel,
} from "@fortawesome/free-solid-svg-icons";

function classNames(...classes: string[]) {
  return classes.filter(Boolean)?.join(" ") ?? " ";
}

const getColorStatus = (value: string | null) => {
  switch (value) {
    case "ACTIVE":
    case "COMPLETED":
    case "DELIVERED":
      return "bg-green-100 text-green-800";

    case "CLOSED":
      return "bg-gray-200 text-gray-800";

    case "REFUNDED":
    case "CANCELLED":
    case "INACTIVE":
      return "bg-red-200 text-red-800";

    default:
      return "bg-yellow-100 text-yellow-800";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return faCheck;

    case "CLOSED":
      return faClose;

    case "CANCELLED":
      return faCancel;

    case "IN_PROCESS":
    case "WAITING":
      return faHourglassStart;

    case "REFUNDED":
      return faReplyAll;

    case "PAYMENT_PENDING":
      return faTicket;

    case "BILLED":
      return faUsd;

    default:
      return faCheck;
  }
};

interface StatusBadge {
  status?: string;
}

export default function StatusBadge({ status }: StatusBadge) {
  if (!status) return <></>;
  return (
    <div
      className={classNames(
        getColorStatus(status),
        "inline-flex items-center flex-shrink-0 px-2.5 py-0.5 rounded-full text-sm  font-medium md:mt-2 lg:mt-0"
      )}
    >
      <FontAwesomeIcon
        icon={getStatusIcon(status)}
        className={classNames(getColorStatus(status), "mr-2 align-middle")}
      />
      {translateOrderState(status)}
    </div>
  );
}
