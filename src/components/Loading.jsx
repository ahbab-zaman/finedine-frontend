const Loading = () => {
  return (
    <div
      role="button"
      aria-label="animation"
      tabIndex={0}
      className="w-[400px] h-[400px] overflow-hidden mx-auto outline-none"
    >
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 1000"
        width="1000"
        height="1000"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
        style={{ transform: "translate3d(0px, 0px, 0px)" }}
      >
        <defs>
          <clipPath id="__lottie_element_2">
            <rect width="1000" height="1000" x="0" y="0"></rect>
          </clipPath>
        </defs>
        <g clipPath="url(#__lottie_element_2)">
          <g style={{ display: "none" }}>
            <g>
              <path
                strokeLinecap="butt"
                strokeLinejoin="miter"
                fillOpacity="0"
                strokeMiterlimit="4"
              ></path>
            </g>
          </g>
          <g style={{ display: "none" }}>
            <g>
              <path></path>
            </g>
          </g>
          <g style={{ display: "none" }}>
            <g>
              <path></path>
            </g>
          </g>
          <g style={{ display: "none" }}>
            <g>
              <path></path>
            </g>
          </g>
          <g style={{ display: "none" }}>
            <g>
              <path></path>
            </g>
          </g>
          <g style={{ display: "none" }}>
            <g>
              <path></path>
            </g>
          </g>
          <g
            transform="matrix(0.9200000166893005,0,0,0.9200000166893005,501,505)"
            opacity="1"
            style={{ display: "block" }}
          >
            <g
              opacity="1"
              transform="matrix(0.9823000431060791,0,0,0.9823000431060791,-1,-5)"
            >
              <path
                strokeLinecap="butt"
                strokeLinejoin="miter"
                fillOpacity="0"
                strokeMiterlimit="4"
                stroke="rgb(209,211,212)"
                strokeOpacity="1"
                strokeWidth="35"
                d=" M0,-126 C69.53939819335938,-126 126,-69.53939819335938 126,0 C126,69.53939819335938 69.53939819335938,126 0,126 C-69.53939819335938,126 -126,69.53939819335938 -126,0 C-126,-69.53939819335938 -69.53939819335938,-126 0,-126z"
              />
            </g>
          </g>
          <g
            transform="matrix(1,0,0,1,501,505)"
            opacity="1"
            style={{ display: "block" }}
          >
            <g
              opacity="1"
              transform="matrix(0.7300000190734863,0,0,0.7300000190734863,-1,-5)"
            >
              <path
                fill="rgb(209,211,212)"
                fillOpacity="1"
                d=" M0,-126 C69.53939819335938,-126 126,-69.53939819335938 126,0 C126,69.53939819335938 69.53939819335938,126 0,126 C-69.53939819335938,126 -126,69.53939819335938 -126,0 C-126,-69.53939819335938 -69.53939819335938,-126 0,-126z"
              />
            </g>
          </g>
          {/* Wrapper for inner balls (white dots) to enable circular orbiting animation */}
          <g
            className="origin-center"
            style={{
              animation: "spin 3s linear infinite",
              transformOrigin: "50% 50%",
            }}
          >
            <g
              transform="matrix(1,0,0,1,569.7109985351562,567.0650024414062)"
              opacity="1"
              style={{ display: "block" }}
            >
              <g
                opacity="1"
                transform="matrix(0.3499999940395355,0,0,0.3499999940395355,0.25,-64.75)"
              >
                <path
                  fill="rgb(255,255,255)"
                  fillOpacity="1"
                  d=" M0,-15.25 C8.416475296020508,-15.25 15.25,-8.416475296020508 15.25,0 C15.25,8.416475296020508 8.416475296020508,15.25 0,15.25 C-8.416475296020508,15.25 -15.25,8.416475296020508 -15.25,0 C-15.25,-8.416475296020508 -8.416475296020508,-15.25 0,-15.25z"
                />
              </g>
            </g>
            <g
              transform="matrix(1,0,0,1,559.0789794921875,537.197021484375)"
              opacity="1"
              style={{ display: "block" }}
            >
              <g opacity="1" transform="matrix(0.5,0,0,0.5,0.25,-64.75)">
                <path
                  fill="rgb(255,255,255)"
                  fillOpacity="1"
                  d=" M0,-15.25 C8.416475296020508,-15.25 15.25,-8.416475296020508 15.25,0 C15.25,8.416475296020508 8.416475296020508,15.25 0,15.25 C-8.416475296020508,15.25 -15.25,8.416475296020508 -15.25,0 C-15.25,-8.416475296020508 -8.416475296020508,-15.25 0,-15.25z"
                />
              </g>
            </g>
            <g
              transform="matrix(1,0,0,1,538.2440185546875,512.85302734375)"
              opacity="1"
              style={{ display: "block" }}
            >
              <g
                opacity="1"
                transform="matrix(0.699999988079071,0,0,0.699999988079071,0.25,-64.75)"
              >
                <path
                  fill="rgb(255,255,255)"
                  fillOpacity="1"
                  d=" M0,-15.25 C8.416475296020508,-15.25 15.25,-8.416475296020508 15.25,0 C15.25,8.416475296020508 8.416475296020508,15.25 0,15.25 C-8.416475296020508,15.25 -15.25,8.416475296020508 -15.25,0 C-15.25,-8.416475296020508 -8.416475296020508,-15.25 0,-15.25z"
                />
              </g>
            </g>
            <g
              transform="matrix(0.8999999761581421,0,0,0.8999999761581421,499.7749938964844,493.6600036621094)"
              opacity="1"
              style={{ display: "block" }}
            >
              <g opacity="1" transform="matrix(1,0,0,1,0.25,-64.75)">
                <path
                  fill="rgb(255,255,255)"
                  fillOpacity="1"
                  d=" M0,-15.25 C8.416475296020508,-15.25 15.25,-8.416475296020508 15.25,0 C15.25,8.416475296020508 8.416475296020508,15.25 0,15.25 C-8.416475296020508,15.25 -15.25,8.416475296020508 -15.25,0 C-15.25,-8.416475296020508 -8.416475296020508,-15.25 0,-15.25z"
                />
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default Loading;
