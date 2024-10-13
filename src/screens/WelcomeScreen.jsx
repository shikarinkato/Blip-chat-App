import React, { lazy, Suspense } from "react";
import Loader from "../components/Loader";

const WelcomeScreen = () => {
  const Header = lazy(() => import("../components/Header"));
  return (
    <div className="w-full relative z-[999] bg-[#1F1F22] hidden sm:flex">
      <Suspense fallback={<Loader />}>
        <Header />
      </Suspense>
    </div>
  );
};

export default WelcomeScreen;
