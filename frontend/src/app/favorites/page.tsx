"use client";

import axios from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeartOff } from "lucide-react";
import { useState, useEffect } from "react";

type Item = {
  id: number;
  title: string;
  overview: string;
  rating: number;
  posterUrl: string;
  releaseDate: string;
  isFavorite: boolean;
};

export default function Favorites() {
  const [items, setItems] = useState<Item[]>([]);

  // Query para obter os itens favoritos
  const { data, error } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const response = await axios.get("/Favorites");
      console.log("Resposta da API:", response.data); // Log para verificar a resposta da API
      return response.data;
    },
    initialData: { items: [] },
  });

  // Atualiza o estado dos itens quando os dados são carregados
  useEffect(() => {
    console.log("Dados recebidos:", data); // Log para verificar os dados recebidos
    if (data && Array.isArray(data)) {
      setItems(data);
    } else if (data?.items && Array.isArray(data.items)) {
      setItems(data.items);
    } else {
      console.error("Formato inesperado dos dados:", data);
    }
  }, [data]);

  // Função de mutação para desfavoritar um item
  const { mutate: unfavorite } = useMutation({
    mutationFn: async (itemId: number) => {
      console.log("Removendo item com id:", itemId); // Log para depuração
      const response = await axios.delete(`/Favorites/${itemId}`);
      if (response.status === 204) {
        console.log("Item removido com sucesso"); // Log para depuração
        setItems((prevItems) =>
          prevItems.filter((item) => item.id !== itemId)
        );
      } else {
        console.error("Erro ao desfavoritar:", response.status);
      }
      return response.data;
    },
  });

  // Renderiza os filmes favoritos
  return (
    <main className="flex min-h-screen flex-col items-start justify-start">
      <div className="flex flex-wrap gap-4">
        {items.length === 0 ? (
          <div>No favorites found</div>
        ) : (
          items.map((item) => (
            <Card key={item.id} className="movie-item w-[300px]">
              <CardContent>
                {item.posterUrl && (
                  <Image
                    src={item.posterUrl}
                    alt={item.title}
                    width={200}
                    height={300}
                    className="movie-poster"
                  />
                )}
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <CardTitle className="break-before-all text-center">
                  {item.title}
                </CardTitle>
                
                <p>
                  {new Date(item.releaseDate).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p>Rating: {item.rating}</p>
                <Button
                  variant="ghost"
                  className="flex gap-3"
                  onClick={() => {
                    unfavorite(item.id);
                  }}
                >
                  <HeartOff />
                  Remover Favorito
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </main>
  );
}
