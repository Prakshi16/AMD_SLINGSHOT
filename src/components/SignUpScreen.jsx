import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';

export default function SignUpScreen() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [showLogin, setShowLogin] = useState(false);
  const [loginName, setLoginName] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const saved = localStorage.getItem('nourishme_profile');
    if (saved) {
      const profile = JSON.parse(saved);
      if (profile.name && profile.name.toLowerCase() === loginName.toLowerCase()) {
        setUser(profile);
        navigate('/home');
        return;
      }
    }
    alert('No profile found with that name. Please sign up first!');
  };

  return (
    <main className="gradient-bg min-h-screen flex flex-col items-center justify-between px-container-margin py-xxl overflow-hidden relative">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-container/30 rounded-full blur-[80px]"></div>
        <div className="absolute top-1/2 -left-32 w-80 h-80 bg-tertiary-container/20 rounded-full blur-[100px]"></div>
      </div>

      {/* Logo */}
      <div className="flex flex-col items-center text-center mt-xl z-10">
        <div className="relative mb-lg">
          <h1 className="font-h1 text-[40px] text-primary tracking-tight">
            NourishMe 🌿
          </h1>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-white/20 blur-xl rounded-full"></div>
        </div>
        <p className="font-body-lg text-primary/80 max-w-[280px]">
          Your personalized health companion.
        </p>
      </div>

      {/* Illustration */}
      <div className="w-full max-w-[320px] aspect-square relative z-10 flex items-center justify-center">
        <div className="w-full h-full rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl flex items-center justify-center">
          <img
            alt="Healthy bowl"
            className="w-4/5 h-4/5 object-cover rounded-lg shadow-lg rotate-3"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDg78pwQQoI0eEZUQL59XquLjqX6uzZVliPwnNSNt_XwJi63oBpFsLl5qu8F4GbsgUGwmNrtf8uulTTnDFNBEQLMRXcLMzg0joa1VIY8fGQyhI9nDZ1T0vN0scoViM_btpglwlKAqHJm-rn0kqNtaWFTebHhi9j1LjwCkPjzqDEfBQ3Kdrj3pEX0fO1sB8EBXJsHzKwfIPvQmmLN6Sw3quMPMoQr-xuKzyq47qz-biiynxL20ol-xfU1xqzBCTmPtuymXMn0IbJ8A"
          />
          <div className="absolute -top-4 -right-4 bg-secondary-container text-on-secondary-container px-sm py-xs rounded-full font-label-sm shadow-md border border-white/30">
            Vegan ✨
          </div>
          <div className="absolute bottom-12 -left-6 bg-tertiary-container text-on-tertiary-container px-sm py-xs rounded-full font-label-sm shadow-md border border-white/30 -rotate-12">
            High Protein 💪
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="w-full max-w-[340px] flex flex-col gap-md z-10 mb-xl">
        {showLogin ? (
          <form onSubmit={handleLogin} className="space-y-md">
            <input
              type="text"
              value={loginName}
              onChange={(e) => setLoginName(e.target.value)}
              placeholder="Enter your name"
              className="w-full py-md px-lg bg-white/80 border-2 border-primary-container rounded-full font-label-md text-center focus:ring-2 focus:ring-primary focus:outline-none"
              required
            />
            <button
              type="submit"
              className="w-full py-md px-lg bg-primary text-on-primary font-label-md rounded-full shadow-[0_12px_24px_rgba(94,90,125,0.25)] hover:opacity-90 active:scale-95 transition-all"
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => setShowLogin(false)}
              className="w-full py-md px-lg bg-transparent text-outline font-label-sm rounded-full hover:text-primary transition-colors"
            >
              ← Back
            </button>
          </form>
        ) : (
          <>
            <button
              onClick={() => navigate('/onboarding/step1')}
              className="w-full py-md px-lg bg-primary text-on-primary font-label-md rounded-full shadow-[0_12px_24px_rgba(94,90,125,0.25)] hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-sm"
            >
              Sign Up
            </button>
            <button
              onClick={() => setShowLogin(true)}
              className="w-full py-md px-lg bg-transparent border-2 border-secondary text-secondary font-label-md rounded-full hover:bg-secondary/5 active:scale-95 transition-all flex items-center justify-center gap-sm"
            >
              Log In
            </button>
            <div className="mt-lg flex flex-col items-center gap-md">
              <div className="flex items-center gap-sm w-full">
                <div className="h-[1px] bg-primary/10 flex-grow"></div>
                <span className="text-label-sm text-primary/40">or continue with</span>
                <div className="h-[1px] bg-primary/10 flex-grow"></div>
              </div>
              <div className="flex gap-lg">
                <button className="w-12 h-12 rounded-full bg-white/40 border border-white/50 flex items-center justify-center hover:bg-white/60 transition-colors shadow-sm">
                  <img alt="Google" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPyZqyYjVOnzBiucgJ3ScxWS1M7_lc_PnEfZ2-ZicqyvA9VuDcakIDTWhSXrQRaEvft8Cg90YKH9XmSiu1V7_AX1xKG47W0Aos-4leadbIQTgQvi6w1fPUcc-6baK9m6sUaO5sN4GUV9tKokcuBF4slRJNZ1gNbeDxx56fGA-tIKo81JAdWThyJIBNW7K-GFLG-HPQUBSnQfMsTE-_R3vwvvQrBU8EaZICnd-4Zg3wrQ61mUv0AmaOAm4i_wzn73XfoyAI-CyClw" />
                </button>
                <button className="w-12 h-12 rounded-full bg-white/40 border border-white/50 flex items-center justify-center hover:bg-white/60 transition-colors shadow-sm">
                  <img alt="Apple" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBO4zxh6LRn3xin5h6ZkNef66f44hbJIjNegFhhxIDxPcg4KtipHr4gKSPKs7uf6S-N06a2GBX_3oNNH9GQcH4CQjwyeip5a4OqdWaU367Yhqa1pnT3D2GOXXys2SA-g1MaqPK2OgiwxCEv4JBzJiRLx9P5DrBXpbinm9sj2Kp2aQabddYCP4gJsiwyRbRkDvcZzXaYocW1zR507pUpUz9n7tl4MBbfHDQWtWTa8ra9iHXCfCnfEOhHHaHcVThY7n1tJaUZu_hePg" />
                </button>
              </div>
              <a className="mt-md font-label-sm text-outline hover:text-primary transition-colors cursor-pointer">
                Continue as Guest
              </a>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
