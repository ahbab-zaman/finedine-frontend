const Loading = ({ message = "Preparing your menu experience..." }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-slate-100 to-pink-100">
      <div className="text-center">
        {/* Restaurant-themed header for immersion */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-800 mb-2 tracking-wide">
            FineDine
          </h1>
          <p className="text-sm text-gray-600 font-light">{message}</p>
        </div>

        {/* Custom restaurant spinner: Three animated "plates" orbiting a central fork/knife icon */}
        <div className="relative flex items-center justify-center">
          {/* Central icon: Fork and knife crossed */}
          <div className="relative z-10">
            <svg
              className="w-12 h-12 text-amber-600 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {/* Orbiting plates: Small circles representing plates, rotating smoothly */}
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="absolute w-4 h-4 bg-white rounded-full border-2 border-amber-400 shadow-lg"
              style={{
                animation: `orbit ${1.5 + index * 0.2}s linear infinite`,
                transform: `rotate(${index * 120}deg) translateX(40px)`,
              }}
            >
              {/* Subtle steam effect on each "plate" */}
              <div
                className="absolute inset-0 w-1 h-1 bg-amber-200 rounded-full opacity-75"
                style={{
                  top: "-2px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  animation: "steam 1s ease-in-out infinite alternate",
                  animationDelay: `${index * 0.1}s`,
                }}
              ></div>
            </div>
          ))}

          {/* Outer glow for elegance */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-200/20 to-rose-200/20 blur-xl animate-pulse"></div>
        </div>

        {/* Subtle progress hint */}
        <div className="mt-8 flex justify-center space-x-1">
          <div
            className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>

      {/* Custom CSS for animations - Add this to your global CSS or inline styles */}
      <style jsx>{`
        @keyframes orbit {
          from {
            transform: rotate(0deg) translateX(40px) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(40px) rotate(-360deg);
          }
        }
        @keyframes steam {
          from {
            opacity: 0.5;
            transform: translateX(-50%) translateY(0);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(-2px);
          }
        }
      `}</style>
    </div>
  );
};

export default Loading;
