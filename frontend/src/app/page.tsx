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
  const [searchTerm, setSearchTerm] = useState(query);

  // Query for fetching movies based on search term and pagination
  const { data, error, isFetching } = useQuery({
    queryKey: ["listagemFilmes", page, searchTerm],
    queryFn: async () => {
      try {
        const response = await axios.get(
          searchTerm
            ? `/Movies/search?title=${searchTerm}&pageNumber=${page}&pageSize=25`
            : `/Movies?pageNumber=${page}&pageSize=25`
        );
        return response.data;
      } catch (error) {
        console.error("API request failed:", error);
        throw error;
      }
    },
  });

  // Update items state when data changes
  useEffect(() => {
    if (data) {
      setItems(data.items || []);
    }
  }, [data]);

  // Handle favorite and unfavorite actions
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

  // Declare onPageChange before useEffect
  const onPageChange = useCallback(
    (newPage: number) => {
      updateUrl(newPage.toString(), "page");
    },
    [updateUrl]
  );

  useEffect(() => {
    updateUrl(searchTerm, "query");
    onPageChange(1); // Reset to the first page
  }, [searchTerm, updateUrl, onPageChange]);

  const handleSearch = () => {
    setSearchTerm(searchTerm.trim()); // Trim any whitespace from the search term
  };

  return (
    <main className="flex min-h-screen flex-col items-start justify-start">
      <div className="flex w-full justify-between mb-4">
        <Input
          type="text"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>

      {isFetching && <div>Loading...</div>}
      {error && <div>Error loading movies.</div>}

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
