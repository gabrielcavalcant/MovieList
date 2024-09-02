"use client";
import axios from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  CoinsIcon,
  HeartIcon,
  HeartOff,
} from "lucide-react";
import useUpdateUrl from "@/lib/updateUrl";
import { useEffect, useState } from "react";
import Link from "next/link";

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
  const updateUrl = useUpdateUrl();
  const [items, setItems] = useState<Item[]>([]);

  const { data } = useQuery({
    queryKey: ["listagemFilmes", page],
    queryFn: async () => {
      const response = await axios.get(
        `/Movies?pageNumber=${page}&pageSize=25`
      );
      return response.data;
    },
  });

  useEffect(() => {
    if (data) {
      setItems(data.items || []);
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
        isFavorite: !item.isFavorite, // Alterna o valor do favorito
      });

      if (response.status === 200) {
        // Atualiza o estado dos items
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
      console.log("Desfavoritando item:", item);
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
  const onPageChange = (newPage: number) => {
    updateUrl(newPage.toString(), "page");
  };

  return (
    <main className="flex min-h-screen flex-col items-start justify-start ">
      <div className="flex flex-wrap gap-4">
        {items.length === 0 ? (
          <div>No movies found</div>
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
                {item.isFavorite ? (
                  <Button
                    variant="ghost"
                    className="flex gap-3"
                    onClick={() => {
                      unfavorite(item);
                    }}
                  >
                    <HeartOff />
                    Remover Favorito
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    className="flex gap-3"
                    onClick={() => {
                      favorite(item);
                    }}
                  >
                    <HeartIcon />
                    Favoritar
                  </Button>
                )}
              </CardFooter>
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
                    ? "bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground "
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
