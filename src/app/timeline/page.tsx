export const metadata = {
  title: "行程时间轴",
};

export default function TimelinePage() {
  return (
    <div className="space-y-2">
      <h1 className="text-base font-semibold tracking-tight">行程时间轴</h1>
      <div className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">
        Step 5 将在这里渲染按天分组的垂直时间轴卡片。
      </div>
    </div>
  );
}

