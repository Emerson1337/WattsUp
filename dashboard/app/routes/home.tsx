import type { Route } from "./+types/home";
import { Dashboard } from "@/dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "WattsUp - Dashboard" },
    { name: "descrição", content: "Monitore o seu consumo elétrico!" },
  ];
}

export default function Home() {
  return <Dashboard />;
}
