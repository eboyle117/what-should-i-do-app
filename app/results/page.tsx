import dynamic from "next/dynamic";

const ResultsContent = dynamic(
  () => import("../../components/ResultsContent"),
  { ssr: false }
);

export default function ResultsPage() {
  return <ResultsContent />;
}