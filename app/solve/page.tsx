import { Suspense } from "react";
import SolvePage from "./SolvePage";

export default function Page() {
  return (
    <Suspense fallback={ <div> Loading... </div> }>
      <SolvePage />
    </Suspense>
  );
}
