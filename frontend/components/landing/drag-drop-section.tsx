import React from "react";

// Note: For actual line animations (paths), you would typically use a library
// like 'react-flow-renderer', 'react-d3-graph', or draw SVG paths dynamically
// with JavaScript based on node positions. The SVG paths here are illustrative
// and their positions are hardcoded for demonstration within a static component.

export function DragDropSection() {
  return (
    <section className="relative overflow-hidden bg-black py-24 sm:py-32">
      {/* Background radial gradient - Now strictly dark/grayscale, no color */}
      {/* These provide very subtle depth without introducing any color */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gray-900/10 blur-3xl"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gray-900/10 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left side - Dynamic Code/Flow Visualization (The Canvas Frame) */}
          {/* This outer frame is a very dark gray, subtly lifted from the pure black background */}
          <div className="w-full lg:w-7/12 xl:w-8/12 relative group">
            <div className="bg-gradient-to-br from-[#121212]/90 to-[#0A0A0A]/90 rounded-2xl p-3 border border-[#222222] shadow-2xl transition-all duration-500 ease-in-out group-hover:scale-[1.01] group-hover:shadow-gray-700/20">
              {/* This inner div is the "Interactive Canvas Background" - Now pure black */}
              <div className="relative w-full h-[400px] lg:h-[550px] bg-black rounded-xl shadow-inner shadow-black/20 overflow-hidden">
                {/* Subtle grid pattern for the canvas - Dark gray dots on black */}
                <div
                  className="absolute inset-0 bg-[length:20px_20px] opacity-10"
                  style={{
                    backgroundImage:
                      "radial-gradient(#181818 1px, transparent 1px)",
                  }}
                ></div>

                {/* Automation Nodes - Dark gray backgrounds, consistent blue accents */}

                {/* API Connector Node */}
                <div className="absolute top-[20%] left-[10%] z-20 transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg">
                  <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-gradient-to-br from-[#1C1C1C] to-[#141414] rounded-xl border border-blue-500/50 text-white shadow-md overflow-hidden relative group cursor-grab min-w-[120px]">
                    {/* Connection Handle (Left) - Uses the consistent blue accent */}
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-600 border-2 border-blue-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {/* Connection Handle (Right) - Uses the consistent blue accent */}
                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-600 border-2 border-blue-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    {/* Icon - White stroke for high contrast */}
                    <svg
                      className="h-8 w-8 text-white mb-2 stroke-current stroke-[1.5px]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7.5 7.5l-1.5 5.25m5.25-5.25h6.75m-7.5 0-1.5 5.25M6 15h2.25m-1.5 0L7.5 18m0 0 1.125 1.125c1.25.825 2.916.825 4.166 0l1.125-1.125m-9-4.5h5.25M7.5 7.5v9"
                      />
                    </svg>
                    <span className="text-sm sm:text-base font-medium text-gray-100">
                      API Connector
                    </span>
                    {/* Solid accent bar - Uses the consistent blue accent */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600"></div>
                  </div>
                </div>

                {/* LLM Process Node */}
                <div className="absolute top-[50%] left-[30%] z-20 transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg">
                  <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-gradient-to-br from-[#1C1C1C] to-[#141414] rounded-xl border border-blue-500/50 text-white shadow-md overflow-hidden relative group cursor-grab min-w-[120px]">
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-600 border-2 border-blue-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-600 border-2 border-blue-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    {/* Icon - White stroke for high contrast */}
                    <svg
                      className="h-8 w-8 text-white mb-2 stroke-current stroke-[1.5px]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM10.5 7.56c-.195-.127-.465-.21-.75-.21-.285 0-.555.084-.75.21-.6.39-.99 1.05-.99 1.89s.39 1.5.99 1.89c.195.127.465.21.75.21.285 0 .555-.084.75-.21.6-.39.99-1.05.99-1.89s-.39-1.5-.99-1.89Z"
                      />
                    </svg>
                    <span className="text-sm sm:text-base font-medium text-gray-100">
                      LLM Processor
                    </span>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600"></div>
                  </div>
                </div>

                {/* Chat Interface Node */}
                <div className="absolute top-[30%] left-[55%] z-20 transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg">
                  <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-gradient-to-br from-[#1C1C1C] to-[#141414] rounded-xl border border-blue-500/50 text-white shadow-md overflow-hidden relative group cursor-grab min-w-[120px]">
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-600 border-2 border-blue-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-600 border-2 border-blue-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    {/* Icon - White stroke for high contrast */}
                    <svg
                      className="h-8 w-8 text-white mb-2 stroke-current stroke-[1.5px]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.142-4.667 7.5-10.5 7.5S0 16.142 0 12c0-4.142 4.667-7.5 10.5-7.5S21 7.858 21 12Z"
                      />
                    </svg>
                    <span className="text-sm sm:text-base font-medium text-gray-100">
                      Chat Interface
                    </span>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600"></div>
                  </div>
                </div>

                {/* AI Agent Node */}
                <div className="absolute top-[65%] left-[75%] z-20 transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg">
                  <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-gradient-to-br from-[#1C1C1C] to-[#141414] rounded-xl border border-blue-500/50 text-white shadow-md overflow-hidden relative group cursor-grab min-w-[120px]">
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-600 border-2 border-blue-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-600 border-2 border-blue-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    {/* Icon - White stroke for high contrast */}
                    <svg
                      className="h-8 w-8 text-white mb-2 stroke-current stroke-[1.5px]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.47-1.693 3.183A8.974 8.974 0 0 1 12 21a8.974 8.974 0 0 1-7.307-3.817C3.63 14.47 3 13.268 3 12c0-1.268.63-2.47 1.693-3.183A8.974 8.974 0 0 1 12 3a8.974 8.974 0 0 1 7.307 3.817C20.37 9.53 21 10.732 21 12Z"
                      />
                    </svg>
                    <span className="text-sm sm:text-base font-medium text-gray-100">
                      AI Agent
                    </span>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600"></div>
                  </div>
                </div>

                {/* Database Node (New addition for variety) */}
                <div className="absolute top-[45%] right-[10%] z-20 transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg">
                  <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-gradient-to-br from-[#1C1C1C] to-[#141414] rounded-xl border border-blue-500/50 text-white shadow-md overflow-hidden relative group cursor-grab min-w-[120px]">
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-600 border-2 border-blue-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-600 border-2 border-blue-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    {/* Icon - White stroke for high contrast */}
                    <svg
                      className="h-8 w-8 text-white mb-2 stroke-current stroke-[1.5px]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v.375m-16.5-.375v.375m16.5 0A8.25 8.25 0 0 0 12 3.75a8.25 8.25 0 0 0-8.25 2.625M12 21.75a8.25 8.25 0 0 0 8.25-2.625M12 21.75a8.25 8.25 0 0 1-8.25-2.625m8.25 2.625v-1.5m-4.5-6H9.75m3-6h.008v.008H12.75v-.008ZM.375 0h.008v.008h-.008V9.75ZM12 12.75h.008v.008H12v-.008ZM12 18.75h.008v.008H12v-.008Z"
                      />
                    </svg>
                    <span className="text-sm sm:text-base font-medium text-gray-100">
                      Database
                    </span>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600"></div>
                  </div>
                </div>

                {/* SVG for drawing connection lines - White dashes on black */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                  <defs>
                    <marker
                      id="arrowhead"
                      viewBox="0 0 10 10"
                      refX="8"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto"
                    >
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#FFFFFF" />{" "}
                      {/* White arrowhead */}
                    </marker>
                  </defs>
                  {/* API Connector to LLM Processor */}
                  <path
                    d="M 230 200 C 300 200, 300 350, 480 350"
                    fill="none"
                    stroke="#FFFFFF" // White stroke for visibility on black
                    strokeDasharray="4 4" // Dashed lines
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                    className="path-animation"
                  />
                  {/* LLM Processor to Chat Interface */}
                  <path
                    d="M 600 350 C 650 350, 650 280, 780 280"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeDasharray="4 4"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                    className="path-animation delay-1"
                  />
                  {/* Chat Interface to AI Agent */}
                  <path
                    d="M 860 280 C 900 280, 900 500, 1050 500"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeDasharray="4 4"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                    className="path-animation delay-2"
                  />
                  {/* AI Agent to Database (example new flow) */}
                  <path
                    d="M 1050 550 C 1100 550, 1100 400, 1200 400"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeDasharray="4 4"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                    className="path-animation delay-3"
                  />
                </svg>
              </div>
            </div>

            {/* Subtle animated overlay/glow - Now grayscale */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none bg-gray-500/5 transition-opacity duration-700 ease-in-out opacity-0 group-hover:opacity-100"></div>
          </div>

          {/* Right side - Text content */}
          <div className="w-full lg:w-5/12 xl:w-4/12 space-y-8 text-center lg:text-left">
            {/* Headline is now pure white, no gradient to maintain minimalist color */}
            <h2 className="text-6xl sm:text-7xl font-extrabold text-white leading-tight tracking-tight">
              Drag. Drop. Deploy.
            </h2>

            <p className="text-xl text-gray-300 leading-relaxed max-w-xl lg:max-w-none mx-auto">
              Transform complex AI integrations into seamless visual workflows.
              InnoFlow empowers you to innovate faster, without the boilerplate.
            </p>

            {/* Feature list - Icons now consistent gray/white */}
            <div className="space-y-6">
              {/* Feature 1 */}
              <div className="flex items-start gap-4">
                {/* Feature icon background is now dark gray, matching the overall theme */}
                <div className="flex-shrink-0 p-2 rounded-full bg-gray-800 shadow-md">
                  <svg
                    className="h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 4.178 2.25M12 12l-8.25 4.5m8.25-4.5L12 9.75m0 0 8.25-4.5M12 12V2.25M12 12h8.25M12 12l-8.25 4.5m8.25-4.5L12 14.25m0 0 8.25 4.5m0 0L12 21.75m0-9v9.75"
                    />
                  </svg>
                </div>
                <p className="text-lg text-gray-200">
                  <span className="font-semibold text-white">
                    Intuitive Visual Flow Builder
                  </span>{" "}
                  – Design sophisticated AI workflows with a powerful,
                  drag-and-drop interface.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-4">
                {/* Feature icon background is now dark gray, matching the overall theme */}
                <div className="flex-shrink-0 p-2 rounded-full bg-gray-800 shadow-md">
                  <svg
                    className="h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.5 7.5l-1.5 5.25m5.25-5.25h6.75m-7.5 0-1.5 5.25M6 15h2.25m-1.5 0L7.5 18m0 0 1.125 1.125c1.25.825 2.916.825 4.166 0l1.125-1.125m-9-4.5h5.25M7.5 7.5v9"
                    />
                  </svg>
                </div>
                <p className="text-lg text-gray-200">
                  <span className="font-semibold text-white">
                    Intelligent Component Orchestration
                  </span>{" "}
                  – Seamlessly connect APIs, LLMs, and databases to build
                  dynamic applications.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start gap-4">
                {/* Feature icon background is now dark gray, matching the overall theme */}
                <div className="flex-shrink-0 p-2 rounded-full bg-gray-800 shadow-md">
                  <svg
                    className="h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.47-1.693 3.183A8.974 8.974 0 0 1 12 21a8.974 8.974 0 0 1-7.307-3.817C3.63 14.47 3 13.268 3 12c0-1.268.63-2.47 1.693-3.183A8.974 8.974 0 0 1 12 3a8.974 8.974 0 0 1 7.307 3.817C20.37 9.53 21 10.732 21 12Z"
                    />
                  </svg>
                </div>
                <p className="text-lg text-gray-200">
                  <span className="font-semibold text-white">
                    Instant Production Deployment
                  </span>{" "}
                  – Go from concept to live AI application with a single, secure
                  click.
                </p>
              </div>
            </div>

            {/* Call to action - Now uses a consistent blue accent */}
            <div className="pt-8">
              <a
                href="#get-started" // Link to your actual "Get Started" section
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-black"
              >
                Start Building Your AI Workflow
                <svg
                  className="ml-3 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Styles for the custom scrollbar and path animation (can be in a global CSS file) */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #4b5563; /* Tailwind gray-600 */
          border-radius: 3px;
        }

        @keyframes dash {
          to {
            stroke-dashoffset: 0;
          }
        }

        .path-animation {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: dash 5s linear forwards infinite; /* Adjust duration and iteration as needed */
          opacity: 0.8; /* Slightly more visible lines */
        }

        /* Staggered animation delays for paths */
        .path-animation.delay-1 {
          animation-delay: 0.5s;
        }
        .path-animation.delay-2 {
          animation-delay: 1s;
        }
        .path-animation.delay-3 {
          animation-delay: 1.5s;
        }
      `}</style>
    </section>
  );
}