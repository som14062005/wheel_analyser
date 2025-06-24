import { useNavigate } from "react-router-dom";
import cmrlLogo from "../assets/cmrl.png";
import wheelHealthImg from "../assets/wheel_health.jpg";
import alertIcon from "../assets/alert_icon.jpg";
import predictIcon from "../assets/predict_icon.jpg";
import aboutIcon from "../assets/about_icon.jpg";
import trainImg from "../assets/train.png";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      className="relative min-h-screen pt-[175px] pb-10 px-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('bg1.png')" }}
    >
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <div className="flex flex-col items-center py-4">
          <div className="flex items-center gap-4">
            <img src={cmrlLogo} alt="CMRL Logo" className="h-12" />
            <span className="text-3xl font-extrabold text-black">CMRL</span>
          </div>
          <div className="relative w-full h-[60px] my-2 overflow-hidden">
            <div className="absolute top-1/2 left-0 w-full h-[4px] bg-gray-800 transform -translate-y-1/2 z-0" />
            <img
              src={trainImg}
              alt="Train"
              className="absolute top-[-30px] left-0 h-[100px] z-10 animate-train"
            />
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="w-full text-center mb-6">
        <h2 className="text-2xl font-bold text-black">WHEEL ANALYSER</h2>
        <p className="italic text-gray-600">|| Where speed meets simplicity ||</p>
        <div className="h-1 bg-gray-300 mt-2 w-full"></div>
      </div>

      {/* Cards */}
      <main className="flex flex-col gap-6 items-center">

        {/* WHEEL HEALTH */}
<div
  onClick={() => navigate("/wheelhealth")}
  className="flex w-full max-w-[1300px] bg-[#97d5c6] rounded-2xl overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
  style={{ height: "200px" }}
>
  {/* IMAGE BLOCK with white background */}
  <div className="h-full w-[200px] bg-white rounded-l-2xl overflow-hidden">
    <img
      src={wheelHealthImg}
      alt="Wheel Health"
      className="h-full w-full object-contain"
    />
  </div>

  {/* TEXT BLOCK */}
  <div className="flex flex-col justify-center items-center text-center flex-1 px-4 text-black">
    <h3 className="text-2xl font-bold">WHEEL HEALTH</h3>
    <p>(Wheel parameter and status, visualized data)</p>
  </div>
</div>




        {/* ALERTS */}
<div
  onClick={() => navigate("/alerts")}
  className="flex w-full max-w-[1300px] bg-[#d9534f] rounded-2xl overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
  style={{ height: "200px" }}
>
  <div className="flex flex-col justify-center items-center text-center flex-1 px-4 text-white">
    <h3 className="text-2xl font-bold">ALERTS</h3>
    <p>(Auto alert on threshold breach, categorized alerts and notifications)</p>
  </div>

  {/* IMAGE: alert icon block */}
  <div className="h-full w-[200px] bg-white flex items-center justify-center rounded-r-2xl overflow-hidden">
    <img
      src={alertIcon}
      alt="Alerts"
      className="h-[100px] w-[100px] object-contain"
    />
  </div>
</div>


        {/* PREDICTION */}
        <div
          onClick={() => navigate("/prediction")}
          className="flex w-full max-w-[1300px] bg-[#5bc0de] rounded-2xl shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
          style={{ height: "200px" }}
        >
          <img
            src={predictIcon}
            alt="Prediction"
            className="h-full w-[200px] object-cover rounded-l-2xl"
          />
          <div className="flex flex-col justify-center items-center text-center flex-1 px-4 text-white">
            <h3 className="text-2xl font-bold">PREDICTION</h3>
            <p>(Predict future wheel issues using ML model)</p>
          </div>
        </div>

        {/* ABOUT */}
        <div
          onClick={() => navigate("/about")}
          className="flex w-full max-w-[1300px] bg-[#f0ad4e] rounded-2xl shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
          style={{ height: "200px" }}
        >
          <div className="flex flex-col justify-center items-center text-center flex-1 px-4 text-white">
            <h3 className="text-2xl font-bold">ABOUT</h3>
            <p>(Information about this tool and CMRL team)</p>
          </div>
          <img
            src={aboutIcon}
            alt="About"
            className="h-full w-[200px] object-cover rounded-r-2xl"
          />
        </div>

      </main>
    </div>
  );
}
