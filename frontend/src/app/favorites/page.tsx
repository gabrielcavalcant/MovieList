"use client";

import axios from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeartOff, HeartIcon, ChevronRightIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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
  const { data, error, isLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const response = await axios.get("/Favorites");
      return response.data;
    },
    initialData: { items: [] },
  });

  // Atualiza o estado dos itens quando os dados são carregados
  useEffect(() => {
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
      const response = await axios.delete(`/Favorites/${itemId}`);
      if (response.status === 204) {
        setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
      } else {
        console.error("Erro ao desfavoritar:", response.status);
      }
      return response.data;
    },
  });

  return (
    <main className="flex min-h-screen flex-col items-start justify-start">
      <div className="flex flex-wrap gap-4">
        {isLoading ? (
          Array.from({ length: 25 }).map((_, index) => <Skeleton key={index} />)
        ) : items.length === 0 ? (
          <div className="w-[80vw] flex items-center justify-center pt-5">
            <div className="text-center">Nenhum filme favoritado</div>
          </div>
        ) : (
          items.map((item) => (
            <Card key={item.id} className="movie-item w-[300px]">
              <div className="cursor-pointer">
                <CardContent className="flex justify-center">
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
                  <div className="flex flex-col items-center gap-2">
                    <Button
                      variant="ghost"
                      className="flex gap-3"
                      onClick={() => {
                        item?.isFavorite
                          ? unfavorite(item.id)
                          : favorite(item.id);
                      }}
                    >
                      {item.isFavorite ? <HeartOff /> : <HeartIcon />}
                      {item.isFavorite ? "Remover Favorito" : "Favoritar"}
                    </Button>

                    {/* Botão Saiba mais */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          Saiba mais <ChevronRightIcon className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <div className="flex">
                          {/* Imagem do filme */}
                          {item.posterUrl && (
                            <div className="flex-shrink-0">
                              <Image
                                src={item.posterUrl}
                                alt={item.title}
                                width={200}
                                height={300}
                                className="movie-poster"
                              />
                            </div>
                          )}

                          {/* Informações do filme */}
                          <div className="flex-grow ml-4">
                            <DialogHeader>
                              <DialogTitle>{item.title}</DialogTitle>
                              <DialogDescription>
                                {item.overview}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col gap-2 mt-4">
                              <p>
                                Release Date:{" "}
                                {new Date(item.releaseDate).toLocaleDateString(
                                  "pt-BR",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </p>
                              <p>Rating: {item.rating}</p>
                              <Button
                                variant="ghost"
                                className="flex gap-3"
                                onClick={() => {
                                  item.isFavorite
                                    ? unfavorite(item.id)
                                    : favorite(item);
                                }}
                              >
                                {item.isFavorite ? <HeartOff /> : <HeartIcon />}
                                {item.isFavorite
                                  ? "Remover Favorito"
                                  : "Favoritar"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardFooter>
              </div>
            </Card>
          ))
        )}
      </div>
    </main>
  );
}
