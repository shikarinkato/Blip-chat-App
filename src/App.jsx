import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import ChatBox from "./components/ChatBox";
import Loader from "./components/Loader";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import AuthScreens from "./screens/AuthScreens";
import Home from "./screens/Home";
import LoginAndSignup from "./screens/LoginAndSignup";

const App = () => {
  const WelcomeScreen = lazy(() => import("./screens/WelcomeScreen"));

  // useEffect(() => {
  //   function handleMessage(newMessage) {
  //     setMessage((prev) => [...prev, newMessage]);
  //   }
  // }, []);

  // console.log("App component rendered");
  return (
    <div style={{ color: "black", fontSize: "20px" }}>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route
            index
            element={
              <Suspense fallback={<Loader />}>
                <WelcomeScreen />
              </Suspense>
            }
          />
          <Route path="user/:userId" element={<ChatBox />} />
        </Route>
        <Route
          path="/auth"
          element={
            <Suspense fallback={<Loader />}>
              <AuthScreens />
            </Suspense>
          }
        >
          <Route
            index
            path="login"
            element={<LoginAndSignup Children={Login} />}
          />
          <Route path="signup" element={<LoginAndSignup Children={SignUp} />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
