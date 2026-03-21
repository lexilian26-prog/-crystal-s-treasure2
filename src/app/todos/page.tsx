export const metadata = {
  title: "待办清单",
};

export default function TodosPage() {
  return (
    <div className="space-y-2">
      <h1 className="text-base font-semibold tracking-tight">待办清单</h1>
      <div className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">
        Step 4 将在这里加入 Tabs（公共/个人）、进度条与 Sheet 表单。
      </div>
    </div>
  );
}

