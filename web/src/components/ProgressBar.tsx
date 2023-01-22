import * as Progress from "@radix-ui/react-progress";

interface iProgressBarProps {
  progress: number;
}

export function ProgressBar({ progress }: iProgressBarProps) {
  return (
    <Progress.Root className="h-3 rounded-xl bg-zinc-700 w-full mt-4">
      <Progress.Indicator
        className="h-3 rounded-xl bg-violet-700"
        style={{ width: `${progress}%` }}
      />
    </Progress.Root>
  );
}
