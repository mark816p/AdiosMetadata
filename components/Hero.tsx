import Typography from "./Typography";

const Hero = () => {
  return (
    <section className="text-center">
      <Typography variant="hero" as={"h1"} className="text-transparent bg-clip-text bg-linear-to-r from-pink-400 to-purple-400 drop-shadow-sm font-extrabold pb-4">
        Adios Metadata
      </Typography>
      <Typography variant="body" weight={500} className="text-indigo-200 mt-2 text-lg">
        This app removes hidden metadata directly in your browser or offline on your device, so your files stay completely private.
      </Typography>
    </section>
  );
};

export default Hero;
