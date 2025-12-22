"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { DniRegistrationSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { registerDniParticipant } from "@/actions/dni-registration";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const DniRegistrationForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof DniRegistrationSchema>>({
    resolver: zodResolver(DniRegistrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      gender: undefined,
      category: "PROFESSIONNEL",
    },
  });

  const onSubmit = (values: z.infer<typeof DniRegistrationSchema>) => {
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("firstName", values.firstName);
    formData.append("lastName", values.lastName);
    if (values.email && values.email.trim() !== "") {
      formData.append("email", values.email);
    }
    formData.append("phone", values.phone);
    if (values.gender) {
      formData.append("gender", values.gender);
    }
    formData.append("category", values.category);

    startTransition(() => {
      registerDniParticipant({ error: "", success: "" }, formData).then(
        (data) => {
          if (data.error) {
            setError(data.error);
            if (data.errors) {
              // Afficher les erreurs de validation
              Object.keys(data.errors).forEach((key) => {
                form.setError(key as any, { message: data.errors![key] });
              });
            }
          } else if (data.success && data.data) {
            setSuccess(data.success);
            // Rediriger vers la page du ticket après 2 secondes
            setTimeout(() => {
              router.push(`/dni/ticket/${data.data.participant.id}`);
            }, 2000);
          }
        }
      );
    });
  };

  return (
    <div className="w-full">
      <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Prénom <span style={{ color: "#F13D06" }}>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Ali"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nom <span style={{ color: "#F13D06" }}>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Boubacar"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="ali.boubacar@example.com"
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Téléphone <span style={{ color: "#F13D06" }}>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="+227 99 12 22 22"
                        type="tel"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sexe</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez votre sexe" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MASCULIN">Masculin</SelectItem>
                        <SelectItem value="FEMININ">Féminin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Statut <span style={{ color: "#F13D06" }}>*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez votre statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PROFESSIONNEL">Professionnel</SelectItem>
                        <SelectItem value="ETUDIANT">Étudiant</SelectItem>
                        <SelectItem value="CHOMAGE">Au chômage</SelectItem>
                        <SelectItem value="RETRAITE">Retraité</SelectItem>
                        <SelectItem value="ENTREPRENEUR">Entrepreneur</SelectItem>
                        <SelectItem value="AUTRE">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button disabled={isPending} type="submit" className="w-full">
              {isPending ? "Inscription en cours..." : "S'inscrire"}
            </Button>
          </form>
        </Form>
    </div>
  );
};

