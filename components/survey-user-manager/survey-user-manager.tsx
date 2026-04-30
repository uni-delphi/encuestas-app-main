"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import {
  X,
  Search,
  Loader2,
  UserPlus,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  assignUserToSurvey,
  removeUserFromSurvey,
  searchUsers,
} from "@/lib/actions";
import { Survey, User } from "@/generated/prisma";

type UserBasic = {
  id: string;
  name: string | null;
  lastName: string | null;
  email: string;
};

type SurveyUserManagerProps = {
  surveyId: number;
  assignedUsers: UserBasic[];
};

function getInitials(
  name: string | null,
  lastName: string | null,
  email: string,
) {
  if (name && lastName) return `${name[0]}${lastName[0]}`.toUpperCase();
  if (name) return name.slice(0, 2).toUpperCase();
  return email.slice(0, 2).toUpperCase();
}

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-800",
  "bg-green-100 text-green-800",
  "bg-purple-100 text-purple-800",
  "bg-amber-100 text-amber-800",
  "bg-pink-100 text-pink-800",
];

function avatarColor(id: string) {
  const sum = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

const PAGE_SIZE = 5;

export function SurveyUserManager({
  surveyId,
  assignedUsers: initial,
}: SurveyUserManagerProps) {
  const [assigned, setAssigned] = useState<UserBasic[]>(initial);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserBasic[]>([]);
  const [searching, setSearching] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [page, setPage] = useState(0);
  const [assignedPage, setAssignedPage] = useState(0);

  // Resetear página cuando cambia la lista (ej: al quitar un usuario)
  useEffect(() => {
    const newTotal = Math.ceil(assigned.length / PAGE_SIZE);
    if (assignedPage >= newTotal && assignedPage > 0) {
      setAssignedPage((p) => p - 1);
    }
  }, [assigned.length]);

  const totalAssignedPages = Math.ceil(assigned.length / PAGE_SIZE);
  const pageAssigned = assigned.slice(
    assignedPage * PAGE_SIZE,
    (assignedPage + 1) * PAGE_SIZE,
  );

  // Resetear página al cambiar query
  useEffect(() => {
    setPage(0);
  }, [query]);

  // Debounced search — ahora sin límite de take, paginamos en cliente
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const found = await searchUsers(query);
        setResults(found.filter((u) => !assigned.some((a) => a.id === u.id)));
      } finally {
        setSearching(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [query, assigned]);

  const totalPages = Math.ceil(results.length / PAGE_SIZE);
  const pageResults = results.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleAssign = useCallback(
    (user: UserBasic) => {
      startTransition(async () => {
        await assignUserToSurvey(surveyId, user.id);
        setAssigned((prev) => [...prev, user]);
        setResults((prev) => {
          const next = prev.filter((u) => u.id !== user.id);
          // Si la página actual queda vacía al asignar, retroceder una
          const newTotal = Math.ceil(next.length / PAGE_SIZE);
          if (page >= newTotal && page > 0) setPage((p) => p - 1);
          return next;
        });
        setQuery("");
      });
    },
    [surveyId, page],
  );

  const handleRemove = useCallback(
    (userId: string) => {
      startTransition(async () => {
        await removeUserFromSurvey(surveyId, userId);
        setAssigned((prev) => prev.filter((u) => u.id !== userId));
      });
    },
    [surveyId],
  );

  return (
    <div className="rounded-lg border bg-card p-4 space-y-4">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Usuarios asignados
      </p>

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre o email…"
          className="pl-8 h-8 text-sm"
        />
        {searching && (
          <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Search results dropdown */}
      {results.length > 0 && (
        <div className="border rounded-md text-sm">
          <div className="divide-y max-h-[210px] overflow-y-auto">
            {pageResults.map((user) => (
              <button
                key={user.id}
                onClick={() => handleAssign(user)}
                disabled={isPending}
                className="w-full flex items-center justify-between px-3 py-2 hover:bg-muted transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium shrink-0 ${avatarColor(user.id)}`}
                  >
                    {getInitials(user.name, user.lastName, user.email)}
                  </span>
                  <div>
                    <p className="font-medium leading-tight">
                      {user.name} {user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <UserPlus className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              </button>
            ))}
          </div>

          {/* Footer de paginación — solo si hay más de una página */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-3 py-1.5 border-t bg-muted/30">
              <span className="text-xs text-muted-foreground">
                {page * PAGE_SIZE + 1}–
                {Math.min((page + 1) * PAGE_SIZE, results.length)} de{" "}
                {results.length}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 0}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <span className="text-xs text-muted-foreground w-12 text-center">
                  {page + 1} / {totalPages}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages - 1}
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Assigned users list */}
      {assigned.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-2">
          Sin usuarios asignados
        </p>
      ) : (
        <div className="border rounded-md text-sm">
          <div className="px-3 py-1.5 border-b">
            <p className="text-xs text-muted-foreground">
              Asignados ({assigned.length})
            </p>
          </div>

          <div className="divide-y">
            {pageAssigned.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${avatarColor(user.id)}`}
                  >
                    {getInitials(user.name, user.lastName, user.email)}
                  </span>
                  <div>
                    <p className="font-medium leading-tight">
                      {user.name} {user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-destructive"
                  onClick={() => handleRemove(user.id)}
                  disabled={isPending}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>

          {totalAssignedPages > 1 && (
            <div className="flex items-center justify-between px-3 py-1.5 border-t bg-muted/30">
              <span className="text-xs text-muted-foreground">
                {assignedPage * PAGE_SIZE + 1}–
                {Math.min((assignedPage + 1) * PAGE_SIZE, assigned.length)} de{" "}
                {assigned.length}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setAssignedPage((p) => p - 1)}
                  disabled={assignedPage === 0}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <span className="text-xs text-muted-foreground w-12 text-center">
                  {assignedPage + 1} / {totalAssignedPages}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setAssignedPage((p) => p + 1)}
                  disabled={assignedPage >= totalAssignedPages - 1}
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
