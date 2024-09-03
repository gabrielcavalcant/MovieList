"use client";
import axios from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, HeartIcon, HeartOff } from "lucide-react";
import useUpdateUrl from "@/lib/updateUrl";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
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
  posterPath: any;
  posterUrl: string;
  releaseDate: string;
  isFavorite: boolean;
};

export default function Home() {
  const pageParams = useSearchParams();
  const page = parseInt(pageParams.get("page") || "1", 10);
  const query = pageParams.get("query") || "";
  const updateUrl = useUpdateUrl();
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState(query || "");

  const { data, error, isFetching } = useQuery({
    queryKey: ["listagemFilmes", page, query],
    queryFn: async () => {
      try {
        setItems([]);
        const response = await axios.get(
          query
            ? `/Movies/search?title=${query}&pageNumber=${page}&pageSize=25`
            : `/Movies?pageNumber=${page}&pageSize=25`
        );
        console.log(data);
        return response.data;
      } catch (error) {
        console.error("API request failed:", error);
        throw error;
      }
    },
  });

  useEffect(() => {
    if (data) {
      setItems(data.items || []);
    } else {
      setItems([]); // Limpa os itens se não houver dados
    }
  }, [data]);

  const { mutate: favorite } = useMutation({
    mutationFn: async (item: Item) => {
      const response = await axios.post("/Favorites", {
        id: item.id,
        movieId: item.id,
        title: item.title,
        rating: item.rating,
        posterUrl: item.posterUrl,
        overview: item.overview,
        releaseDate: item.releaseDate,
        isFavorite: !item.isFavorite,
      });

      if (response.status === 200) {
        setItems((prevItems) =>
          prevItems.map((prevItem) =>
            prevItem.id === item.id
              ? { ...prevItem, isFavorite: true }
              : prevItem
          )
        );
      }

      return response.data;
    },
  });

  const { mutate: unfavorite } = useMutation({
    mutationKey: ["Desfavoritar"],
    mutationFn: async (item: Item) => {
      const response = await axios.delete(`/Favorites/${item.id}`);

      if (response.status === 204) {
        setItems((prevItems) =>
          prevItems.map((prevItem) =>
            prevItem.id === item.id
              ? { ...prevItem, isFavorite: false }
              : prevItem
          )
        );
      } else {
        console.error("Erro ao desfavoritar:", response.statusText);
      }

      return response.data;
    },
  });

  const onPageChange = useCallback(
    (newPage: number) => {
      updateUrl(newPage.toString(), "page");
    },
    [updateUrl]
  );

  const handleSearch = (searchValue: string) => {
    updateUrl(searchValue, "query");
  };

  useEffect(() => {
    console.log(items);
  }, [items]);

  return (
    <main className="flex min-h-screen flex-col items-start justify-start">
      <div className="flex w-fit justify-between mb-4 p-2 gap-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(search);
          }}
          className="flex gap-2"
        >
          <Input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button type="submit">Search</Button>
        </form>
        <Button
          variant="ghost"
          onClick={() => {
            handleSearch("");
            setSearch("");
          }}
        >
          X
        </Button>
      </div>

      {error && <div>Error loading movies.</div>}

      <div className="flex flex-wrap gap-4">
        {isFetching ? (
          Array.from({ length: 25 }).map((_, index) => (
            <Card key={index} className="movie-item w-[300px]">
              <CardContent>
                <Skeleton className="h-[300px] w-[200px]" />
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-8 w-full" />
              </CardFooter>
            </Card>
          ))
        ) : items.length === 0 ? (
          <div className="p-4 flex w-screen items-center justify-center">
            No movies found.
          </div>
        ) : (
          items.map((item) => (
            <Card key={item.id} className="movie-item w-[300px]">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="cursor-pointer">
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
                          item.isFavorite ? unfavorite(item) : favorite(item);
                        }}
                      >
                        {item.isFavorite ? <HeartOff /> : <HeartIcon />}
                        {item.isFavorite ? "Remover Favorito" : "Favoritar"}
                      </Button>
                    </CardFooter>
                  </div>
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
                        <DialogDescription>{item.overview}</DialogDescription>
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
                            item.isFavorite ? unfavorite(item) : favorite(item);
                          }}
                        >
                          {item.isFavorite ? <HeartOff /> : <HeartIcon />}
                          {item.isFavorite ? "Remover Favorito" : "Favoritar"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </Card>
          ))
        )}
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                onPageChange(page - 1);
              }}
            >
              <ChevronLeft />
            </Button>
          </PaginationItem>
          {Array.from({ length: data?.totalPages || 1 }, (_, index) => (
            <PaginationItem key={index} className="hover:bg-transparent">
              <PaginationLink
                className={
                  page === index + 1
                    ? "bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground"
                    : ""
                }
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(index + 1);
                }}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                onPageChange(page + 1);
              }}
            >
              <ChevronRight />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </main>
  );
}
