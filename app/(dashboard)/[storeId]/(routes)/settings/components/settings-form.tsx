"use client";

import * as z from "zod";
import { useState } from "react";
import { Store } from "@prisma/client";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const formSchema = z.object({
  name: z.string().min(1, "Nama toko minimal 1 karakter"),
});

export const SettingsForm = ({ initialData }: { initialData: Store }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: initialData.name },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSaving(true);

      // TODO: panggil API PATCH update store
      console.log("update store", initialData.id, data);

      toast.success("Perubahan berhasil disimpan");
      form.reset({ name: data.name });
    } catch (e) {
      console.error(e);
      toast.error("Gagal menyimpan perubahan");
    } finally {
      setIsSaving(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsDeleting(true);

      // TODO: panggil API DELETE store
      console.log("delete store", initialData.id);

      toast.success("Toko berhasil dihapus");
    } catch (e) {
      console.error(e);
      toast.error("Gagal menghapus toko");
    } finally {
      setIsDeleting(false);
    }
  };

  const disabled = isSaving || isDeleting;

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Toko</FormLabel>
                  <FormControl>
                    <Input
                      className="h-10 rounded-xl"
                      placeholder="Contoh: Toko Sepatu"
                      disabled={disabled}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button type="submit" className="rounded-xl" disabled={disabled}>
              {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </Form>

      <Separator />

      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-destructive">Danger Zone</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Menghapus toko bersifat permanen dan tidak dapat dibatalkan.
            </p>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="rounded-xl"
                disabled={disabled}
              >
                <Trash className="mr-2 h-4 w-4" />
                {isDeleting ? "Menghapus..." : "Hapus Toko"}
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="rounded-xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus toko ini?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tindakan ini permanen. Semua data toko akan terhapus dan tidak
                  bisa dikembalikan.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>
                  Batal
                </AlertDialogCancel>
                <AlertDialogAction onClick={onDelete} disabled={isDeleting}>
                  Ya, Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};
