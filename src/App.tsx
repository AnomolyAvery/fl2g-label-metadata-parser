import { lazy, Suspense } from "react";
import { FoodLionLogo } from "./components/fl-logo";
import { ThemeProvider } from "./components/theme-provider";
import { ThemeToggle } from "./components/theme-toggle";
import { Spinner } from "./components/ui/spinner";

const LabelParser = lazy(() => import("./label-parser"));

function App() {
  return (
    <div className="relative">
      <ThemeProvider>
        <div className="absolute top-0 right-0">
          <ThemeToggle />
        </div>
        <div className="max-w-6xl mx-auto container space-y-6 px-2 md:px-20 py-12">
          <div className="p-4 max-w-md mx-auto flex flex-col items-center">
            <FoodLionLogo />
            <h1 className="text-lg sm:text-2xl font-bold">FL2G Stagging Hub</h1>
          </div>
          <div className="max-w-md mx-auto space-y-8">
            <Suspense
              fallback={
                <div className="flex items-center gap-2 justify-center">
                  <Spinner size={"medium"} />
                  <p className="font-medium text-center">Loading...</p>
                </div>
              }
            >
              <LabelParser />
            </Suspense>
            <p className="text-sm text-muted-foreground">
              Powered by{" "}
              <a
                href="https://www.avery.gg"
                target="__blank"
                className="font-medium underline"
              >
                Avery Herring's
              </a>{" "}
              smarts, built with React and TypeScript. Enjoy! 🚀
            </p>
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}

export default App;
