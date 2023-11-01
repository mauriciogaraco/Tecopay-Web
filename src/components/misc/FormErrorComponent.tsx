import { ExclamationCircleIcon } from "@heroicons/react/20/solid";

interface ErrorProps{
    message:string;
  }

const ErrorComponent = ({message}:ErrorProps) => {
    return (
      <>
        <div className="pointer-events-none absolute inset-y-0 right-0 sm:bottom-5 flex items-center pr-1">
          <ExclamationCircleIcon
            className="h-5 w-5 text-red-500"
            aria-hidden="true"
          />
        </div>
        <p className="mt-2 text-sm text-red-600" id="email-error">
          {message}
        </p>
      </>
    );
  };

export default ErrorComponent