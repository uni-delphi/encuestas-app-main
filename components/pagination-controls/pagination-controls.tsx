// components/pagination-controls.tsx
"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export function PaginationControls({
  page,
  pageCount,
}: {
  page: number;
  pageCount: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function goTo(newPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  }

  if (pageCount <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-4">
      <Button
        variant="outline"
        disabled={page === 0}
        onClick={() => goTo(page - 1)}
      >
        Anterior
      </Button>
      <span className="text-sm text-muted-foreground">
        Página {page + 1} de {pageCount}
      </span>
      <Button
        variant="outline"
        disabled={page >= pageCount - 1}
        onClick={() => goTo(page + 1)}
      >
        Siguiente
      </Button>
    </div>
  );
}