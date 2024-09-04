using Microsoft.AspNetCore.Mvc;
using backend.Services;
using System.Threading.Tasks;
using System.Linq;
using System;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.Data;
using System.Collections.Generic;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MoviesController : ControllerBase
    {
        private readonly MovieService _movieService;
        private readonly ApplicationDbContext _context; //favorite Service parece

        public MoviesController(MovieService movieService, ApplicationDbContext context)
        {
            _movieService = movieService;
            _context = context;
        }

        [HttpGet("")]
        public async Task<IActionResult> GetAllMovies(int pageNumber = 1, int pageSize = 10)
        {
            // Recupera todos os filmes do serviço
            var allMovies = await _movieService.GetAllMoviesAsync();
            var favorites = _context.Favorites.ToList();


            // Calcula o total de itens e a quantidade total de páginas
            var totalItems = allMovies.Count();
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            // Aplica a paginação nos filmes
            var paginatedMovies = allMovies
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            // Itera sobre os filmes paginados e verifica se são favoritos
            foreach (var movie in paginatedMovies)
            {
                if (favorites.Any(fav => fav.MovieId == movie.Id)) // Supondo que 'favorites' tenha uma propriedade 'MovieId'
                {
                    movie.IsFavorite = true;
                }
            }

            // Cria a resposta com informações de paginação e filmes paginados
            var response = new
            {
                TotalItems = totalItems,
                TotalPages = totalPages,
                CurrentPage = pageNumber,
                PageSize = pageSize,
                Items = paginatedMovies
            };

            return Ok(response);
        }



        [HttpGet("search")]
        public async Task<IActionResult> SearchMovies(string title, int pageNumber = 1, int pageSize = 10)
        {
            // Recupera todos os filmes que correspondem ao título do serviço
            var allMovies = await _movieService.SearchMoviesByTitleAsync(title);
            var favorites = _context.Favorites.ToList();

            // Calcula o total de itens e a quantidade total de páginas
            var totalItems = allMovies.Count();
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            // Aplica a paginação nos filmes
            var paginatedMovies = allMovies
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            // Itera sobre os filmes paginados e verifica se são favoritos
            foreach (var movie in paginatedMovies)
            {
                if (favorites.Any(fav => fav.MovieId == movie.Id)) // Supondo que 'favorites' tenha uma propriedade 'MovieId'
                {
                    movie.IsFavorite = true;
                }
            }

            // Cria a resposta com informações de paginação e filmes paginados
            var response = new
            {
                TotalItems = totalItems,
                TotalPages = totalPages,
                CurrentPage = pageNumber,
                PageSize = pageSize,
                Items = paginatedMovies
            };

            return Ok(response);
        }

    }
}
