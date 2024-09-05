"use client";

import axios from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeartOff, HeartIcon, ChevronRightIcon, ShareIcon } from "lucide-react";
import { useState, useEffect, FormEvent } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Link from "next/link";

type Item = {
  id: number;
  title: string;
  overview: string;
  rating: number;
  posterUrl: string;
  releaseDate: string;
  isFavorite: boolean;
};

type FavoriteItems = {
  favoriteMovies?: Item[];
  id: number;
  name: string;
};

export default function FavoritesList({
  params,
}: {
  params: { list_id: string };
}) {
  const [items, setItems] = useState<Item[]>([]);
  const listId = params.list_id;

  // Query para obter os itens favoritos
  const { data, error, isLoading } = useQuery({
    queryKey: ["favoritesList", listId],
    queryFn: async () => {
      const response = await axios.get(`/Lists/${listId}`);
      return response.data as FavoriteItems;
    },
    enabled: !!listId,
  });

  // Atualiza o estado dos itens quando os dados são carregados
  useEffect(() => {
    console.log("dados: " + data);
    setItems(data?.favoriteMovies || []);
  }, [data]);

  return (
    <main className="flex min-h-screen flex-col items-start justify-start">
      <h1 className="p-4 text-4xl font-medium">{data?.name}</h1>
      <div className="flex flex-wrap gap-4">
        {isLoading ? (
          Array.from({ length: 25 }).map((_, index) => <Skeleton key={index} />)
        ) : items?.length === 0 ? (
          <div className="w-[80vw] flex items-center justify-center pt-5">
            <div className="text-center">Nenhum filme favoritado</div>
          </div>
        ) : (
          items?.map((item) => {
            return (
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
                                  {new Date(
                                    item.releaseDate
                                  ).toLocaleDateString("pt-BR", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </p>
                                <p>Rating: {item.rating}</p>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardFooter>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </main>
  );
}

const ShareDialog = () => {
  const [input, setInput] = useState("");
  const [listId, setListId] = useState<number | null>(null); // Estado para armazenar o id da lista

  const {
    mutate: shareList,
    data: shareData,
    isSuccess,
    reset,
  } = useMutation({
    mutationKey: ["shareList"],
    mutationFn: async (title: string) => {
      const response = await axios.post("/Lists", {
        name: title,
      });
      return response.data;
    },
    onSuccess: (data) => {
      // Armazena o id da lista quando a requisição for bem-sucedida
      setListId(data.id);
    },
  });

  const handleAddList = (e: React.FormEvent) => {
    e.preventDefault();
    shareList(input); // Chama a função de compartilhamento com o input
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setListId(null);
          reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="flex gap-2">
          <ShareIcon />
          Compartilhar favoritos
        </Button>
      </DialogTrigger>
      <DialogContent>
        {!shareData && (
          <form onSubmit={handleAddList} className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>Dê um nome para sua lista:</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Digite aqui"
              id="name"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button type="submit">Gerar link de compartilhamento</Button>
          </form>
        )}
        {listId && (
          <div className=" flex flex-col items-center justify-center">
            <h1>Compartilhado com sucesso!</h1>
            <div className="flex gap-2">
              <Link href={`/favorites/${listId}`}>
                <Button className="mt-4">Ver lista de favoritos</Button>
              </Link>
              <Button
                variant="outline"
                className="mt-4"
                onClick={async () => {
                  await navigator.clipboard.writeText(
                    `${window.location.origin}/favorites/${listId}`
                  );
                }}
              >
                Copiar Link
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
