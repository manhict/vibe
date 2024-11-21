import { Slider } from "../ui/slider";

export function VolumeControl({
  volume,
  setVolume,
}: {
  volume: any;
  setVolume: any;
}) {
  return (
    <Slider
      aria-label="volume"
      min={0}
      max={1}
      step={0.02}
      value={[volume]}
      onValueChange={(e) => setVolume(e[0], true)}
    />
  );
}

export default VolumeControl;
