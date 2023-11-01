export type TabsAttr = {
  icon?: React.ReactNode;
  name: string;
  href: string;
  current: boolean;
};

interface TabNavProp {
  className?:string;
  tabs: TabsAttr[];
  action: Function;
  disabled?:boolean
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function TabNav({ tabs, action, disabled, className }: TabNavProp) {
  return (
    <div className={`mb-3 ${className ? className : ""}`}>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Selecccione
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 focus:border-orange-500 focus:ring-orange-500 "
          defaultValue={tabs?.find((tab) => tab.current)?.name}
          onChange={(value) => action(value)}
        >
          {tabs.map((tab) => (
            <option key={tab.name} value={tab.href}>
              {tab.name}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-orange-200">
          <nav className="inline-flex gap-1 w-full" >
            {tabs.map((tab) => (
              <span key={tab.name} className="inline-flex w-full">
                <p
                  onClick={() => {
                    if(!disabled) action(tab.href)
                  }}
                  className={classNames(
                    tab.current
                      ? "border-orange-500 text-gray-500"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-orange-300",
                    "py-4 text-center border-b-2 font-medium text-sm cursor-pointer flex justify-center items-center gap-2 flex-grow"
                  )}
                  aria-current={tab.current ? "page" : undefined}
                >
                  {tab?.icon && tab.icon}
                  {tab.name}
                </p>
              </span>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
