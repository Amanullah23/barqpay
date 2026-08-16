export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div
        className="animate-float-a absolute rounded-full"
        style={{
          top: "-10%",
          left: "-5%",
          width: 420,
          height: 420,
          backgroundColor: "rgba(76, 217, 232, 0.45)",
          filter: "blur(90px)",
        }}
      />
      <div
        className="animate-float-b absolute rounded-full"
        style={{
          top: "20%",
          right: "-10%",
          width: 380,
          height: 380,
          backgroundColor: "rgba(139, 92, 246, 0.5)",
          filter: "blur(90px)",
        }}
      />
      <div
        className="animate-float-c absolute rounded-full"
        style={{
          bottom: "-15%",
          left: "20%",
          width: 440,
          height: 440,
          backgroundColor: "rgba(232, 76, 158, 0.4)",
          filter: "blur(95px)",
        }}
      />
    </div>
  );
}
