import { SignInButton } from '@clerk/clerk-react';

export function SplashScreen() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#0d1117] text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay"></div>
      <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-[40%] -right-[20%] w-[80%] h-[80%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="z-10 flex flex-col items-center text-center max-w-xl px-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="flex items-center justify-center w-20 h-20 bg-primary/10 rounded-[2rem] text-primary border border-primary/20 mb-8 shadow-2xl shadow-primary/20">
          <span className="material-symbols-outlined text-5xl">description</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60">
          Welcome to <span className="text-primary">MDX</span>
        </h1>
        
        <p className="text-[#8b949e] text-lg md:text-xl mb-10 leading-relaxed max-w-lg">
          The ultimate AI-powered README generator. Connect your GitHub account to securely select repositories, inject context, and deploy documentation directly.
        </p>

        <SignInButton mode="modal">
          <button className="h-14 px-8 bg-white hover:bg-gray-200 text-black rounded-full text-lg font-semibold flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
            <svg height="24" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="24" className="fill-current">
                <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
            </svg>
            Continue with GitHub
          </button>
        </SignInButton>

        <p className="mt-8 text-sm text-[#8b949e]/60 flex items-center gap-1.5 font-medium">
          <span className="material-symbols-outlined text-[16px]">lock</span>
          Secure authentication powered by Clerk
        </p>
      </div>
    </div>
  );
}
