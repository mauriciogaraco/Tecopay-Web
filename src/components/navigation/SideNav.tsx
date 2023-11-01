import { ArrowRightIcon } from "@heroicons/react/24/solid";

export type TabsAttr = {
  icon?: React.ReactNode;
  name: string;
  href: string;
  current: boolean;
};

interface TabNavProp {
  className?: string;
  tabs: TabsAttr[];
  action: Function;
  disabled?: boolean;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function SideNav({ tabs, action, disabled, className }: TabNavProp) {
  return (
    <div className={`${className && className}`}>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Selecccione
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 focus:border-slate-500 focus:ring-slate-500 "
          value={tabs?.find((tab) => tab.current)?.href}
          onChange={(e) => action(e.target.value)}
        >
          {tabs.map((tab, idx) => (
            <option key={idx} value={tab.href}>
              {tab.name}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="pt-1">
          <nav className="flex flex-col gap-1">
            {tabs.map((tab, idx) => (
              <div className="inline-flex w-full flex-shrink-0" key={idx}>                
                <div
                  key={tab.name}
                  className={`inline-flex w-full flex-shrink-0 gap-2 border-y ${tab.current ? "border-slate-600 shadow-md" : "border-slate-400"} rounded-r-md`}
                  onClick={() => {
                    if (!disabled) action(tab.href);
                  }}
                >
                  <span className={`w-0.5 ${tab.current ? "bg-slate-700": ""} pr-2`}></span>
                  <p
                    className={classNames(
                      tab.current
                        ? "text-slate-700"
                        : "text-slate-500 hover:text-slate-600",
                      "py-2 font-medium text-sm cursor-pointer flex items-center gap-2 flex-grow"
                    )}
                    aria-current={tab.current ? "page" : undefined}
                  >
                    {tab?.icon && tab.icon}
                    {tab.name}
                  </p>
                </div>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
