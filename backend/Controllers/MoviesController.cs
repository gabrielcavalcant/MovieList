using Microsoft.AspNetCore.Mvc;
using backend.Services;
using System.Threading.Tasks;

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

        [HttpGet("search")]
        public async Task<IActionResult> SearchMovies(string title)
        {
            var movies = await _movieService.SearchMoviesByTitleAsync(title);
            return Ok(movies);
        }
    }
}
