import UnderConstruction from "@/components/UnderConstruction";

export default function NotFound() {
  return (
    <div className="flex h-[calc(100vh-96px)] w-full bg-slate-50 items-center justify-center">
      <UnderConstruction title="Error 404 - Página no encontrada" />
    </div>
  );
}
