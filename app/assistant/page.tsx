import AssistantChat from "@/components/ai/AssistantChat";

export default function AssistantPage() {
  return (
    <main className="min-h-screen py-12 px-4">
      <h1 className="text-center text-3xl font-bold mb-8">🤖 Trợ lý ảo HomeAway</h1>
      <AssistantChat />
    </main>
  );
}
