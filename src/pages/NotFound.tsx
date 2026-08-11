import { useNavigate } from "react-router";
import { Home } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "#EFE9DC" }}
    >
      <div className="flex flex-col items-center text-center max-w-sm">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
          style={{ background: "#F6E9E7" }}
        >
          <span className="text-[28px]">?</span>
        </div>

        <h1
          className="text-[24px] font-semibold"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#10261F" }}
        >
          Page not found
        </h1>

        <p className="text-[14px] mt-2" style={{ color: "#8A8578" }}>
          Sorry, we couldn't find the page you're looking for.
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-8 px-6 py-3 rounded-xl font-semibold text-[13.5px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          style={{ background: "#10261F", color: "#FFFFFF" }}
        >
          <Home size={16} />
          Go home
        </button>
      </div>
    </div>
  );
}
