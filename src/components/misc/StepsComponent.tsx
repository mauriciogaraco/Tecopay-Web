/**Se Trabaja con los índices del arreglo de títulos, por tanto el estado current tiene que comnzar con 0 */

import { CheckIcon } from '@heroicons/react/24/solid'


interface ComponentInterface{
    titles:string[],
    current:number,
}

export default function StepsComponent({titles, current}:ComponentInterface) {


  return (
    <nav aria-label="Progress">
      <ol role="list" className="divide-y divide-gray-300 rounded-md border border-gray-300 md:flex md:divide-y-0 mb-2">
        {titles.map((step, stepIdx) => (
          <li key={stepIdx} className="relative md:flex md:flex-1">
            {current > stepIdx ? (
              <div  className="group flex w-full items-center">
                <span className="flex items-center px-6 py-4 text-sm font-medium">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-700 group-hover:bg-indigo-800">
                    <CheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </span>
                  <span className="ml-4 text-sm font-medium text-gray-900">{step}</span>
                </span>
              </div>
            ) : current === stepIdx ? (
              <div className="flex items-center px-6 py-4 text-sm font-medium" aria-current="step">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-indigo-700">
                  <span className="text-indigo-700">{`${stepIdx + 1}`}</span>
                </span>
                <span className="ml-4 text-sm font-medium text-indigo-700">{step}</span>
              </div>
            ) : (
              <div className="group flex items-center">
                <span className="flex items-center px-6 py-4 text-sm font-medium">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 group-hover:border-gray-400">
                    <span className="text-gray-500 group-hover:text-gray-900">{`${stepIdx + 1}`}</span>
                  </span>
                  <span className="ml-4 text-sm font-medium text-gray-500 group-hover:text-gray-900">{step}</span>
                </span>
              </div>
            )}

            {stepIdx !== titles.length - 1 ? (
              <>
                {/* Arrow separator for lg screens and up */}
                <div className="absolute top-0 right-0 hidden h-full w-5 md:block" aria-hidden="true">
                  <svg
                    className="h-full w-full text-gray-300"
                    viewBox="0 0 22 80"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 -2L20 40L0 82"
                      vectorEffect="non-scaling-stroke"
                      stroke="currentcolor"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  )
}
