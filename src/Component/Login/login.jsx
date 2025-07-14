import React, { useState } from "react";
import Logo from "../../assets/img/gnslogo.png";
import LoginBoy from "../../assets/img/loginimg.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { userLogin } from "../../api/auth.jsx";
import { useAuth } from "../../Context/AuthContext.jsx";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // <-- new
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");


  const handleLogin = async () => {

    setErrorMsg("");

    try {
      let loginInfo = {
        email: email,
        password: password
      }
      const loginRes = await userLogin(loginInfo)
      if (loginRes) {
        console.log("Login,,,", loginRes);
        login(loginRes?.data?.token);
        navigate("/admin");
      } else {
        console.log("Please Try Again");

      } 
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#2E7ED4] to-[#1B4F8A] min-h-screen w-full flex justify-center items-center">
      <div className="w-[1110px] bg-[#ffffff] rounded-[30px] flex md:flex-row flex-col-reverse h-auto md:h-[600px] mx-4 xl:mx-0">
        <div className="w-full md:w-[50%] p-5 lg:p-10 flex flex-col justify-center">
          <img className="mx-auto" src={Logo} alt="Login logo" />
          <div className="mt-4">
            <label className="block text-[#484848] font-medium text-[14px] mb-[8px]">Email*</label>
            <input
              type="email"
              placeholder="Enter Email"
              className="w-full border border-[#E0E0E0] rounded-[6px] px-3 py-2 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mt-4">
            <label className="block text-[#484848] font-medium text-[14px] mb-[8px]">Password*</label>
            <input
              type="password"
              placeholder="Enter Password"
              className="w-full border border-[#E0E0E0] rounded-[6px] px-3 py-2 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <label className="flex mt-4 items-center gap-2">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="appearance-none w-[16px] h-[16px] border border-[#B3B3B3] rounded-[4px] relative 
                checked:bg-[#20BF55] checked:border-[#20BF55]
                checked:after:content-['✓'] checked:after:text-white 
                checked:after:text-[12px] checked:after:font-bold 
                checked:after:absolute checked:after:top-[0px] checked:after:left-[3px]"
            />
            Remember Password
          </label>

          {errorMsg && (
            <p className="text-red-500 text-sm mt-2">{errorMsg}</p>
          )}

          <button
            type="button"
            onClick={handleLogin}
            className="bg-[#2E7ED4] mt-4 rounded-[10px] py-2 px-6 text-white cursor-pointer"
          >
            Login
          </button>

          <div className="or-blk mt-4 text-[16px] text-body text-center">or</div>

          <div className="mt-4 md:mt-8 text-center">
            <button
              type="button"
              // onClick={googleLogin}
              className="cursor-pointer text-base flex items-center font-medium w-full justify-center text-[#1f1f1f] border border-[#C1D5F6] px-4 py-2 rounded-full"
            >
              <svg
                className="mr-2"
                width="19"
                height="18"
                viewBox="0 0 19 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18.14 9.20468C18.14 8.5665 18.0827 7.95286 17.9764 7.36377H9.5V10.8451H14.3436C14.135 11.9701 13.5009 12.9233 12.5477 13.5615V15.8197H15.4564C17.1582 14.2529 18.14 11.9456 18.14 9.20468Z"
                  fill="#4285F4"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.5 18C11.93 18 13.9673 17.1941 15.4564 15.8195L12.5477 13.5613C11.7418 14.1013 10.7109 14.4204 9.5 14.4204C7.15591 14.4204 5.17182 12.8372 4.46409 10.71H1.45728V13.0418C2.93818 15.9831 5.98182 18 9.5 18Z"
                  fill="#34A853"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.46409 10.7098C4.28409 10.1698 4.18182 9.59301 4.18182 8.99983C4.18182 8.40664 4.28409 7.82983 4.46409 7.28983V4.95801H1.45727C0.847727 6.17301 0.5 7.54755 0.5 8.99983C0.5 10.4521 0.847727 11.8266 1.45727 13.0416L4.46409 10.7098Z"
                  fill="#FBBC05"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.5 3.57955C10.8214 3.57955 12.0077 4.03364 12.9405 4.92545L15.5218 2.34409C13.9632 0.891818 11.9259 0 9.5 0C5.98182 0 2.93818 2.01682 1.45728 4.95818L4.46409 7.29C5.17182 5.16273 7.15591 3.57955 9.5 3.57955Z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </button>
          </div>
        </div>

        <div className="w-full md:w-[50%] bg-[#E9F3FF] p-5 lg:p-10 rounded-tl-[30px] md:rounded-tl-[0] rounded-tr-[30px] md:rounded-tr-[30px] md:rounded-br-[30px] flex items-center justify-center">
          <img className="w-full" src={LoginBoy} alt="Secure login illustration" />
        </div>
      </div>
    </div>
  );
};

export default Login;
