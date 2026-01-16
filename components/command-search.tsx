"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Search, Store as StoreIcon, Compass } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

type StoreItem = {
  id: string;
  name: string;
};

export function CommandSearch() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [stores, setStores] = React.useState<StoreItem[]>([]);
  const [loadingStores, setLoadingStores] = React.useState(false);

  const router = useRouter();
  const params = useParams();
  const storeId = params.storeId as string;

  const navItems = [
    { label: "Overview", href: `/${storeId}` },
    { label: "Settings", href: `/${storeId}/settings` },
  ];

  // Shortcut Cmd / Ctrl + K
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Fetch stores
  React.useEffect(() => {
    if (!open) return;

    const controller = new AbortController();
    const run = async () => {
      try {
        setLoadingStores(true);
        const res = await fetch(`/api/stores/search?q=${query}`, {
          signal: controller.signal,
        });
        const data = (await res.json()) as StoreItem[];
        setStores(data);
      } catch {
        setStores([]);
      } finally {
        setLoadingStores(false);
      }
    };

    const t = setTimeout(run, 200);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [query, open]);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <>
      {/* Trigger */}
      <Button
        variant="outline"
        className="hidden md:flex h-10 w-[280px] justify-start rounded-xl text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        Cari menu / toko…
        <span className="ml-auto text-xs">
          ⌘K
        </span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden p-0">
          <Command>
            <CommandInput
              placeholder="Ketik untuk mencari…"
              value={query}
              onValueChange={setQuery}
            />
            <CommandList>
              <CommandEmpty>
                {loadingStores ? "Memuat..." : "Tidak ada hasil."}
              </CommandEmpty>

              <CommandGroup heading="Navigation">
                {navItems.map((i) => (
                  <CommandItem key={i.href} onSelect={() => go(i.href)}>
                    <Compass className="mr-2 h-4 w-4" />
                    {i.label}
                  </CommandItem>
                ))}
              </CommandGroup>

              <CommandSeparator />

              <CommandGroup heading="Stores">
                {stores.map((s) => (
                  <CommandItem
                    key={s.id}
                    onSelect={() => go(`/${s.id}`)}
                  >
                    <StoreIcon className="mr-2 h-4 w-4" />
                    {s.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
