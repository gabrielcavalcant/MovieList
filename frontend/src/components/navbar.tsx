"use client";
import React from "react";
import { Button } from "./ui/button";
import { CoinsIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/ui/mode-toggle"; // Certifique-se de importar o ModeToggle corretamente

export default function Navbar() {
  const pathname = usePathname();
  
  return (
    <header className="flex items-center h-16 px-4 border-b shrink-0 md:px-6 bg-background">
      <Link
        href="#"
        className="flex items-center gap-2 text-lg font-semibold sm:text-base mr-4"
      >
        <CoinsIcon className="w-6 h-6" />
      </Link>
      <nav className="hidden font-medium sm:flex flex-row items-center gap-5 text-sm lg:gap-6">
        <Link
          href="/"
          className={pathname === "/" ? "font-bold" : "text-muted-foreground"}
        >
          Filmes
        </Link>
        <Link
          href="/favorites"
          className={
            pathname === "/favorites" ? "font-bold" : "text-muted-foreground"
          }
        >
          Favoritos
        </Link>
      </nav>
      <div className="flex items-center ml-auto gap-4"> {/* Adiciona ml-auto para empurrar o conteúdo para a direita */}
        <ModeToggle /> {/* Alinhado à direita */}
        <Button variant="ghost" size="icon" className="rounded-full">
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </div>
    </header>
  );
}
