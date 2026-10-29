import { createFileRoute } from "@tanstack/react-router";
import { AdventureApp } from "@/components/adventure/adventure";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <AdventureApp />;
}
