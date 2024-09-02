using Microsoft.AspNetCore.Mvc;
using backend.Services;
using System.Threading.Tasks;
using System.Linq;
using System;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MoviesController : ControllerBase
    {
        private readonly MovieService _movieService;

        public MoviesController(MovieService movieService)
        {
            _movieService = movieService;
        }

        [HttpGet("")]
        public async Task<IActionResult> GetAllMovies(int pageNumber = 1, int pageSize = 10)
        {
            // Recupera todos os filmes do serviço
            var allMovies = await _movieService.GetAllMoviesAsync();

            // Calcula o total de itens e a quantidade total de páginas
            var totalItems = allMovies.Count();
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            // Aplica a paginação nos filmes
            var paginatedMovies = allMovies
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();

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


        [HttpGet("popular")]
        public async Task<IActionResult> GetPopularMovies()
        {
            var movies = await _movieService.GetPopularMoviesAsync();
            return Ok(movies);
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchMovies(string title)
        {
            var movies = await _movieService.SearchMoviesByTitleAsync(title);
            return Ok(movies);
        }
    }
}
